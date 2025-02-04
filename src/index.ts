import {
  ActivityType,
  CacheType,
  Client,
  GatewayIntentBits,
  Interaction,
} from "discord.js";
import { config } from "dotenv";
import { registerCommands } from "./cmds";
import { availableCommands } from "./cmds";
import { Command } from "./const/commands";
import { server, webServerSetup } from "./ws";
import { registerUsers } from "./libs/registerUsers";
import { updateRoles } from "./libs/updateRoles";

// Get environment values
config();

try {
  registerCommands();
} catch (e) {
  console.error(e);
}

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", async () => {
  if (!client.user) return;

  client.user.setPresence({
    activities: [{ name: `the communities`, type: ActivityType.Watching }],
    status: "dnd",
  });

  const guilds = client.guilds.cache;

  for (const guild of guilds) {
    const members = await guild[1].members.fetch();
    registerUsers(members, guild, client.user.id);
  }

  console.log(`Connected to ${client.user.tag}`);
});

client.on("guildMemberAdd", (member) => {
  const guildId = member.guild.id;
  const mem = {
    id: member.id,
    username: member.user.username,
    avatar: member.user.avatarURL() as string,
    isOwner: member.user.id === member.guild.ownerId,
  };

  console.log("New member", mem.username, "added to", member.guild.name);
  fetch(`${process.env.API_HOST}/api/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-secret": process.env.SECRET as string,
    },
    body: JSON.stringify({
      users: [mem],
      id: guildId,
      name: member.guild.name,
      icon: member.guild.iconURL() as string,
    }),
  });
});

client.on("guildCreate", async (guild) => {
  const guilds = client.guilds.cache;

  for (const guild of guilds) {
    const members = await guild[1].members.fetch();
    registerUsers(members, guild, client!!.user!!.id);
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const guildId = message.guildId;
  let msgParsed: {
    guildId: string;
    messageId: string;
    authorId: string;
    message: string;
    attachmentUrl?: string;
    timestamp: number;
    mentionedMessage?: string;
  } = {
    guildId: guildId as string,
    messageId: message.id,
    authorId: message.author.id,
    message: message.content,
    attachmentUrl:
      message.attachments.size > 0
        ? message.attachments.first()!!.url
        : undefined,
    timestamp: message.createdTimestamp,
  };

  if (message.reference) {
    msgParsed.mentionedMessage = message.reference.messageId as string;
  }

  fetch(`${process.env.API_HOST}/api/users/message/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-secret": process.env.SECRET as string,
    },
    body: JSON.stringify(msgParsed),
  });
});

client.on("interactionCreate", async (interaction: Interaction<CacheType>) => {
  if (!interaction.isChatInputCommand()) return;

  console.log(interaction.commandName);
  availableCommands.forEach((command: Command) => {
    const commandName = command.meta.name;

    if (interaction.commandName == commandName) {
      command.handler(interaction, client);
    }
  });
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {
  if (oldMember.roles.cache.size == newMember.roles.cache.size) return;

  console.log("Roles updated", newMember.guild.id);
  updateRoles(newMember.guild.id);
});

webServerSetup();
client.login(process.env.DISCORD_TOKEN);
server.listen({ host: "0.0.0.0", port: process.env.BOT_PORT });
