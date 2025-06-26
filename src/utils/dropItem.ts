import { Bot } from "mineflayer";

export default (bot: Bot, slot: number, count: number) => {
    bot.toss(slot, null, count)

};
