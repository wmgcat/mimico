import { Context, Telegraf } from "telegraf";
import fs from "fs";
import dotenv from "dotenv";
import { Message, Update } from "telegraf/types";

const info = fs.readFileSync("./src/info.txt", "utf-8");
dotenv.config();

const run = () => {
	if (!process?.env?.TOKEN)
		throw new Error("Please, set telegram token");
  if (!info)
    throw new Error("Please, set info for message");

	const bot = new Telegraf(process.env.TOKEN!);

  const memory = new Map;

  const onChecker = (ctx: Context<Update>, retry: number=0): boolean => {
		try {
			if (retry > 2)
				return false;

			console.log(ctx?.message);

			const msg = ctx?.message as Message & {
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

      ctx.replyWithPhoto({
				source: "./src/banner.png"
			}, {
				reply_to_message_id: msg?.message_id,
				caption: info
      });

      memory.set(
				memory_key,
        Date.now() + Number(process.env.CLEAR_TIMEOUT || 15000)
      );

			return true;
    }
    catch(err) {
			console.error(err);
			onChecker(ctx, retry + 1);
			return false;
		}
  }

  bot.on("message", (ctx: Context) => onChecker?.(ctx));
  bot.launch();
	bot.catch((error, ctx) => {
		console.error("Update error:", {
			updateId: ctx.update.update_id,
			error
		});
	});

  process.once("SIGINT", () => bot.stop("SIGINT"));
	process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

run();
