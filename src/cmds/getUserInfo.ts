import { BaseInteraction, CacheType, Client, Interaction, REST, Routes } from "discord.js";
import { Command } from "../const/commands";
import { json } from "stream/consumers";


const CommandMeta = {
    name: "me",
    description: "Get information about your account standing"
}

const CommandHandler = async (i: Interaction<CacheType>, c: Client) => {
    if (!i.isChatInputCommand()) return;
    await i.deferReply({ ephemeral: true });

    try {
        const userFetch = await fetch(`${process.env.API_HOST}/api/getUserInfo`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-secret": process.env.SECRET
            },
            body: JSON.stringify({
                id: i.user.id
            })
        })
    
        const user = await userFetch.json();
    
        
        i.editReply(JSON.stringify(user));

    } catch(e) {
        i.editReply("An error occurred while fetching your information.")
    }
}

const Command: Command = {
    meta: CommandMeta,
    handler: CommandHandler
}

export default Command