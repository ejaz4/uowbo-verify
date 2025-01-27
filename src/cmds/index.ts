// Start advertising all the commands on the Discord API
import Verify from "./verify";
import Ping from "./ping";
import { REST, Routes } from "discord.js";
import { Command } from "../const/commands";
import GetUser from "./getUserInfo";
import Dashboard from "./dashboard";
import Setup from "./setup"

// Stable commands being advertised to the Discord API
export const availableCommands: Command[] = [
    Verify,
    Ping,
    GetUser,
    Dashboard,
    Setup
]

export const registerCommands = async () => {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    const stableMeta = availableCommands.map(e => e.meta)

    await rest.put(Routes.applicationCommands(process.env.DISCORD_APP_ID), {
        body: stableMeta
    });

    console.log(`Registered ${availableCommands.length} commands.`);
}