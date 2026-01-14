import { Telegraf } from "telegraf";
import fs from "fs";
import dotenv from "dotenv";

const info = fs.readFileSync("./src/info.txt", "utf-8");
dotenv.config();

const run = () => {
    if (!process?.env?.TOKEN)
        throw new Error("Please, set telegram token");
    if (!info)
        throw new Error("Please, set info for message");

    const bot = new Telegraf(process.env.TOKEN);
    const memory = new Map;

    const onChecker = (ctx: any, retry=0) => {
        try {
            if (retry > 2)
                return;
            
            if (!ctx?.message?.is_automatic_forward)
                return;

            // Clear oldest cache
            for (const [ key, value ] of memory.entries()) {
                if ((value - Date.now()) <= 0)
                    memory.delete(key);
            }

            const memory_key = ctx.message.media_group_id || ctx.message.message_id;

            if (memory.has(memory_key))
                return;

            ctx.replyWithPhoto({
                source: "./src/banner.png"
            }, {
                reply_to_message_id: ctx.message.message_id,
                caption: info
            });

            memory.set(
                memory_key,
                Date.now() + Number(process.env.CLEAR_TIMEOUT || 15000)
            );
        }
        catch(err) { onChecker(ctx, retry + 1); }
    }

    bot.on("message", (ctx: any) => onChecker(ctx));

    bot.launch();

    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

run();