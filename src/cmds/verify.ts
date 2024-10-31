import { CacheType, Client, Interaction, REST, Routes } from "discord.js";
import { Command } from "../const/commands";
import { api } from "../libs/api";

const CommandMeta = {
    name: "verify",
    description: "Verify it's you by linking your server profile to your University of Westminster account."
}

type GenerateResponse = {
    handover: string;
}

const CommandHandler = async (i: Interaction<CacheType>, c: Client) => {
    if (!i.isChatInputCommand()) return;
    // if (!i.user) return;
    const userID = i.user.id;

    await i.reply({ content: "Please wait, this can take up to 15 seconds...", ephemeral: true});
    // console.log(i.user.avatarURL)
    const generate = (await api("/api/generate", { id: userID, name: i.user.username, avatar: i.user.avatarURL() })) as GenerateResponse;

    await i.editReply({ content: `${process.env.API_HOST}/verify/${generate.handover}` })
}

const PingCommand: Command = {
    meta: CommandMeta,
    handler: CommandHandler
}

export default PingCommand