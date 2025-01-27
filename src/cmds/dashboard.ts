import { ActionRowBuilder, BaseInteraction, ButtonBuilder, ButtonStyle, CacheType, Client, Interaction, REST, Routes } from "discord.js";
import { Command } from "../const/commands";
import { json } from "stream/consumers";

const CommandMeta = {
    name: "dashboard",
    description: "Log into the server dashboard (for moderators and server owners)"
}

const CommandHandler = async (i: Interaction<CacheType>, c: Client) => {
    if (!i.isChatInputCommand()) return;
    const safetyMsg = "Anyone who has your Discord account can also use uowbo! to make changes to your server. Keep your account safe and do not share contents of this message with anyone."
    let status = "Trying to sign you in..."

    await i.reply({
        content: safetyMsg + "\n\n" + status,
        ephemeral: true
    });

    const userId = i.user.id;

    try {
        const userFetch = await fetch(`${process.env.API_HOST}/api/dashboard/issueToken`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-secret": process.env.SECRET
            },
            body: JSON.stringify({
                id: userId
            })
        })
    
        if (userFetch.status !== 200) {
            const user = await userFetch.json() as { message: string };
            return await i.editReply(user.message || "An error occurred while fetching your information.");
        }

        const user = await userFetch.json();
    
        if (user.error) {
            status = "An error occurred while fetching your information.";
            return await i.editReply(safetyMsg + "\n\n" + status);
        }

        let uri = `${process.env.API_HOST}/dashboard?exchange=${user.token}`
        const button = new ButtonBuilder().setLabel("Go to Dashboard").setURL(uri).setStyle(ButtonStyle.Link);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

        await i.editReply({
            content: safetyMsg + "\n\n" + "Click the button below to go to the dashboard.",
            components: [row],
        })
    } catch(e) {
        i.editReply(safetyMsg + "\n\n" + "An error occurred while fetching your information.")
    }
}

const Command: Command = {
    meta: CommandMeta,
    handler: CommandHandler
}

export default Command