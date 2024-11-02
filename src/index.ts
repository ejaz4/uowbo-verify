import { ActivityType, CacheType, Client, GatewayIntentBits, Interaction } from "discord.js";
import { config } from "dotenv";
import { registerCommands } from "./cmds";
import { availableCommands } from "./cmds";
import { Command } from "./const/commands";
import { server, webServerSetup } from "./ws";

// Get environment values
config()

try {
    registerCommands();
} catch (e) {
    console.error(e)
}

export const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMembers] });

client.on('ready', () => {
    if (!client.user) return;

    client.user.setPresence({
        activities: [{ name: `the server`, type: ActivityType.Watching }],
        status: 'dnd',
    });
    console.log(`Connected to ${client.user.tag}`)
})

client.on("interactionCreate", async (interaction: Interaction<CacheType>) => {
    if (!interaction.isChatInputCommand()) return;

    console.log(interaction.commandName)
    availableCommands.forEach((command: Command) => {
        const commandName = command.meta.name;

        if (interaction.commandName == commandName) {
            command.handler(interaction, client);
        }
    })
})

webServerSetup();
client.login(process.env.DISCORD_TOKEN);
server.listen({ host: "0.0.0.0", port: process.env.BOT_PORT });