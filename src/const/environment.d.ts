declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DISCORD_TOKEN: string;
            DISCORD_APP_ID: string;
            ROLE_ID: string;
        }
    }
}

export { }