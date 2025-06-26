import { Bot } from "mineflayer";
import { Item } from "prismarine-item";

export default (bot: Bot) => {
    const items = bot.inventory.items();
    const itemsMap = new Map<number, Item | null>;
    if (bot.registry.isNewerOrEqualTo("1.9") && bot.inventory.slots[45]) {
        items.push(bot.inventory.slots[45]);
        bot.inventory.slots.forEach((v, i) => {
            itemsMap.set(i, v);
        })
    }
    else return {};

    return { raw: items, string: items.map((item) => `${item.name} x ${item.count}`), itemsMap };
};
