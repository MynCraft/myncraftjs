import EventEmitter from "events";
import TypedEventEmitter from "typed-emitter";
import { Bot, BotEvents, BotOptions, createBot, Plugin } from "mineflayer";
import { Client as MClient } from "minecraft-protocol";
import { Logger } from "@myncraftjs/logger";
import colorChat from "@myncraftjs/colorchat";
import spawncommands from "@myncraftjs/spawncommands";
import defaultEventsSetup from "../utils/defaultEventsSetup"
declare module "minecraft-protocol" {
    interface Socket {
        _host: string;
    }

}
declare module "mineflayer" {
    interface BotEvents {
        "logger:log": (...texts: any[]) => void;
        "logger:warn": (...texts: any[]) => void;
        "logger:error": (...texts: any[]) => void;
    }
    interface BotOptions {
        logger?: boolean;
        logEvent?: boolean
    }
}
export class Client extends (EventEmitter as new () => TypedEventEmitter<BotEvents>) {
    _client: MClient;
    private bot: Bot;
    logger: Logger;
    options: BotOptions;
    plugins: Array<Plugin> = [];
    private _persistentListeners: {
        type: "on" | "once";
        event: keyof BotEvents;
        listener: (...args: any[]) => void;
    }[] = [];
    constructor(opt: BotOptions) {
        super();
        opt.hideErrors ??= true;
        this.options = opt
        this.bot = createBot(opt);
        this._client = this.bot._client;
        this.loadPlugins([colorChat, spawncommands])
        this.logger = new Logger({ header: opt.username || "Bot" });
        if (!(opt.logger) && typeof opt.logger === "boolean") {
            this.logger.error = () => { };
            this.logger.log = () => { };
            this.logger.warn = () => { };
        }
        if (opt.logEvent) {
            const error = this.logger.error
            const log = this.logger.log
            const warn = this.logger.warn
            this.logger.error = (...texts: any[]) => {
                this.emit("logger:error", texts);
                error(texts);
            };
            this.logger.log = (...texts: any[]) => {
                this.emit("logger:log", texts);
                log(texts);
            };
            this.logger.error = (...texts: any[]) => {
                this.emit("logger:error", texts);
                error(texts);
            };

        }
        console.clear();
        defaultEventsSetup(this);
        this.bot.on("resourcePack", () => {
            this.bot.acceptResourcePack()
        })
    }
    restart() {
        this.bot.end();
        this._client.end();
        this.bot = createBot(this.options);
        this._client = this.bot._client;
        this.loadPlugins(this.plugins)
        console.clear();
        this.bot.on("resourcePack", () => {
            this.bot.acceptResourcePack()
        })
        this._bindPersistentListeners()
    }
    getBot() {
        return this.bot
    }
    private _bindPersistentListeners() {
        for (const { type, event, listener } of this._persistentListeners) {
            if (type === "on") {
                this.bot.on(event, listener as any);
            } else {
                this.bot.once(event, listener as any);
            }
        }
    }
    on<E extends keyof BotEvents>(event: E, listener: BotEvents[E]): this {
        this._persistentListeners.push({ type: "on", event, listener });
        super.on(event, listener);
        this.bot.on(event, listener);
        return this;
    }

    once<E extends keyof BotEvents>(event: E, listener: BotEvents[E]): this {
        this._persistentListeners.push({ type: "once", event, listener });
        super.once(event, listener);
        this.bot.once(event, listener);
        return this;
    }

    loadPlugin(plugin: Plugin): void {
        if (!this.plugins.includes(plugin))
            this.plugins.push(plugin);
        this.bot.loadPlugin(plugin);
    }
    loadPlugins(plugins: Plugin[]): void {
        plugins.forEach(plugin => this.bot.loadPlugin(plugin));
    }
    chat(message: string): void {
        if (message.startsWith('/')) {
            this.bot.chat(message);
        } else {
            if (message.includes("\n"))
                message.split("\n").forEach(m => {
                    console.log("Chat message:", m);
                    this.bot.chat(m);
                });
            else this.bot.chat(message);
        }
    }

    lookAt(username: string) {
        const player = this.bot.players[username];
        if (player && player.entity) {
            this.bot.lookAt(player.entity.position);
        }
    }

}