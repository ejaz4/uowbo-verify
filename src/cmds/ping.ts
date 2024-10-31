import { BaseInteraction, CacheType, Client, Interaction, REST, Routes } from "discord.js";
import { Command } from "../const/commands";


const CommandMeta = {
    name: "ping",
    description: "Test the application"
}

const CommandHandler = async (i: Interaction<CacheType>, c: Client) => {
    if (!i.isChatInputCommand()) return;

    i.reply("Pong!")
}

const PingCommand: Command = {
    meta: CommandMeta,
    handler: CommandHandler
}

export default PingCommand