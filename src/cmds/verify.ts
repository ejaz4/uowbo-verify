import { CacheType, Client, Interaction, REST, Routes } from "discord.js";
import { Command } from "../const/commands";

const CommandMeta = {
    name: "verify",
    description: "Verify it's you by linking your server profile to your University of Westminster account."
}

const CommandHandler = async (i: Interaction<CacheType>, c: Client) => {
    if (!i.isChatInputCommand()) return;
    // if (!i.user) return;
    const userID = i.user.id;

    const member = await i.guild?.members.fetch(userID)

    member?.roles.add(process.env.ROLE_ID);

    await i.reply("Role added!")
}

const PingCommand: Command = {
    meta: CommandMeta,
    handler: CommandHandler
}

export default PingCommand