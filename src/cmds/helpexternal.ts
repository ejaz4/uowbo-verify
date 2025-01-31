import { CacheType, Client, Interaction, REST, Routes } from "discord.js";
import { Command } from "../const/commands";
import { api } from "../libs/api";

const CommandMeta = {
  name: "helpexternal",
  description: "Help someone claim their external status.",
};

type GenerateResponse = {
  handover: string;
};

const CommandHandler = async (i: Interaction<CacheType>, c: Client) => {
  if (!i.isChatInputCommand()) return;
  // if (!i.user) return;
  const userID = i.user.id;

  await i.reply({
    content: "Please wait, this can take up to 15 seconds...",
    ephemeral: true,
  });
  // console.log(i.user.avatarURL)
  const generate = (await api("/api/generate", {
    id: userID,
    name: i.user.username,
    avatar: i.user.avatarURL(),
  })) as GenerateResponse;

  await i.editReply({
    content: `# ⚠️ If someone you don't know has told you to use this page, **STOP**. Make sure you only help people you know claim external status. \n\nHelp someone claim external status: ${process.env.API_HOST}/verify/${generate.handover}/external/help`,
  });
};

const Command: Command = {
  meta: CommandMeta,
  handler: CommandHandler,
};

export default Command;
