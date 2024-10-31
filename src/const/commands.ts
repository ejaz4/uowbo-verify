import { CacheType, Client, Interaction } from "discord.js";

export type Command = {
    meta: {
        name: string;
        description: string
    },
    handler: (i: Interaction<CacheType>, c: Client) => Promise<void>;
}