declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DISCORD_TOKEN: string;
            DISCORD_APP_ID: string;
            ROLE_ID: string;
            API_HOST: string;
        }
    }
}

export { }