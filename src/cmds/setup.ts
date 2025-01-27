import { ActionRowBuilder, BaseInteraction, ButtonBuilder, ButtonStyle, CacheType, Client, Interaction, REST, Routes } from "discord.js";
import { Command } from "../const/commands";
import { json } from "stream/consumers";

const CommandMeta = {
    name: "setup",
    description: "Begin setting up your server with uowbo!"
}

const CommandHandler = async (i: Interaction<CacheType>, c: Client) => {
    if (!i.isChatInputCommand()) return;
    if (!i.guild) return await i.reply("This command can only be used in a server.");

    const ownerId = i.guild.ownerId;

    if (ownerId !== i.user.id) return await i.reply({
        content: "Only the server owner can use this command.",
        ephemeral: true
    });

    await i.reply({content: "", ephemeral: true });
}

const Command: Command = {
    meta: CommandMeta,
    handler: CommandHandler
}

export default Command