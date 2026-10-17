import { Context, Telegraf } from "telegraf";
import fs from "fs";
import dotenv from "dotenv";
import { message } from "telegraf/filters";
import { Message, Update } from "telegraf/types";

const info = fs.readFileSync("./src/info.txt", "utf-8");
dotenv.config();

const run = () => {
	if (!process?.env?.TOKEN)
		throw new Error("Please, set telegram token");
  if (!info)
    throw new Error("Please, set info for message");

  const bot = new Telegraf(process.env.TOKEN);
  const memory = new Map;

  const onChecker = async (ctx: Context<Update>, retry: number=0): Promise<boolean> => {
		try {
			if (retry > 2)
				return false;

			if (!ctx?.message)
				return false;

			const msg = ctx.message as Message & {
				is_automatic_forward?: boolean;
				media_group_id?: string;
			};
      if (!msg?.is_automatic_forward)
				return false;

      // Clear oldest cache
      for (const [ key, value ] of memory.entries()) {
				if ((value - Date.now()) <= 0)
					memory.delete(key);
      }

      const memory_key = msg?.media_group_id || msg?.message_id;
      if (memory.has(memory_key))
				return false;

      await ctx.replyWithPhoto({
				source: "./src/banner.png"
			}, {
				reply_parameters: {
					message_id: msg?.message_id
				},
				caption: info
      });

      memory.set(
				memory_key,
        Date.now() + Number(process.env.CLEAR_TIMEOUT || 15000)
      );

			return true;
    }
    catch {
			await onChecker(ctx, retry + 1);
			return false;
		}
  }

  bot.on(message("text"), (ctx: Context) => onChecker?.(ctx));
  bot.launch();

  process.once("SIGINT", () => bot.stop("SIGINT"));
	process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

run();
