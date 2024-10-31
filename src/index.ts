import { ActivityType, CacheType, Client, GatewayIntentBits, Interaction } from "discord.js";
import { config } from "dotenv";
import { registerCommands } from "./cmds";
import { availableCommands } from "./cmds";
import { Command } from "./const/commands";

// Get environment values
config()

try {
    registerCommands();
} catch (e) {
    console.error(e)
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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

client.login(process.env.DISCORD_TOKEN);
