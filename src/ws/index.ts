import fastify, { FastifyRequest } from "fastify";
import { client } from "..";


// This is a web server that should only accept requests from the front-end microservice and not any other application.
export const server = fastify({
    logger: true
});


export const webServerSetup = () => {
    server.get("/update", (req, res) => {
        console.log("Got update")
    })

    server.post("/check", async (req, res) => {
        const body = req.body as { username: string };

        const guild = client.guilds.cache.get("1287692332178735104");
        if (!guild) return res.code(404).send("Guild not found");

        const member = await guild.members.fetch({ query: body.username, limit: 1 })

        if (!member.size) return res.code(404).send({
            message: "Member not found."
        });

        const mem = member.first()
        if (!mem || mem.user.username != body.username) return res.code(404).send({
            message: "Member not found."
        });

        return res.status(200).send(mem)
    })

    server.post("/verify", async (req, res) => {
        const body = req.body as { userId: string; code: string; };

        const guild = client.guilds.cache.get("1287692332178735104");
        if (!guild) return res.code(404).send("Guild not found");

        const member = await client.users.fetch(body.userId);


        try {
            await member.send(`You're receiving this message because you or someone else is attempting to access your uowbo account.\nIf this was you, please enter the following code in the verification prompt: ${body.code}`)

            return res.code(200).send({ message: "Verification code sent." });

        } catch (e) {
            console.error(e)
            return res.code(403).send({ message: "Secure" });
        }

    });
}