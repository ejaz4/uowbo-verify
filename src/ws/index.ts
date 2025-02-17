import fastify, { FastifyRequest } from "fastify";
import { client } from "..";

// This is a web server that should only accept requests from the front-end microservice and not any other application.
export const server = fastify({
  logger: true,
});

export const webServerSetup = () => {
  server.get("/update", (req, res) => {
    console.log("Got update");
  });

  server.post("/check", async (req, res) => {
    const body = req.body as { username: string };

    const guilds = await client.guilds.fetch();
    let user = null;

    for (const guild of guilds) {
      const guildId = guild[0];

      const guildUsable = client.guilds.cache.get(guildId);
      if (!guildUsable) continue;

      const member = await guildUsable.members.fetch({
        query: body.username,
        limit: 1,
      });

      if (!member.size) continue;

      const mem = member.first();
      if (!mem || mem.user.username != body.username) continue;

      user = mem;
    }

    if (!user) return res.code(404).send("User not found");

    return res.status(200).send(
      JSON.stringify({
        userId: user.id,
        displayAvatarURL: user.displayAvatarURL,
      })
    );
  });

  server.post("/verify", async (req, res) => {
    const body = req.body as { userId: string; code: string };

    const guilds = await client.guilds.fetch();
    let sent = false;

    for (const guildEntry of guilds) {
      const guild = client.guilds.cache.get(guildEntry[0]);
      if (!guild) continue;

      const member = await client.users.fetch(body.userId);

      if (sent) continue;

      try {
        sent = true;
        await member.send(
          `You or someone else is trying to access your uowbo! account. If this was you, please enter the following code: ${body.code}\n\nDon't share with anyone, not even anyone on the uowbo! team.`
        );

        return res.code(200).send({ message: "Verification code sent." });
      } catch (e) {
        console.error(e);
        return res.code(403).send({ message: "Secure" });
      }
    }

    return res.code(403).send({ message: "Secure" });
  });

  server.post("/verifyUser", async (req, res) => {
    const body = req.body as {
      userId: string;
      verified: boolean;
      method: string;
      guilds: {
        guildId: string;
        settings: {
          allowsBiometricEntry: boolean;
          allowsEmailEntry: boolean;
          allowsExternalEntry: boolean;
          verifiedRoleId: string;
        }[];
      }[];
    };

    console.log("Adding role to user", body.userId, body.method);
    for (const guildsGiven of body.guilds) {
      console.log(guildsGiven.settings);
      const guild = client.guilds.cache.get(guildsGiven.guildId);
      const member = await guild?.members.fetch(body.userId);

      if (guildsGiven.settings.length == 0) continue;

      try {
        if (body.method == "biometricEntry") {
          if (guildsGiven.settings[0].allowsBiometricEntry) {
            console.log("Adding role via biometric entry");
            await member?.roles.add(guildsGiven.settings[0].verifiedRoleId);
            continue;
          }
        }

        if (body.method == "emailEntry") {
          if (guildsGiven.settings[0].allowsEmailEntry) {
            console.log("Adding role via email entry");
            await member?.roles.add(guildsGiven.settings[0].verifiedRoleId);
            continue;
          }
        }

        if (body.method == "externalEntry") {
          if (guildsGiven.settings[0].allowsExternalEntry) {
            console.log("Adding role via external entry");
            await member?.roles.add(guildsGiven.settings[0].verifiedRoleId);
            continue;
          }
        }
      } catch (e) {
        console.error(e);
        continue;
      }
    }

    return res.code(200).send({ message: "User verified." });
  });

  server.get("/guild/:guildId/roles", async (req, res) => {
    const secret = req.headers["x-secret"];

    if (secret !== process.env.SECRET) return res.code(403).send("Forbidden");

    const { guildId } = req.params as { guildId: string };

    const guild = client.guilds.cache.get(guildId);

    if (!guild) return res.code(404).send("Guild not found");

    return res.code(200).send(
      JSON.stringify(
        guild.roles.cache.map((r) => {
          return { id: r.id, name: r.name, color: r.hexColor };
        })
      )
    );
  });

  server.get("/guild/:guildId/roles/:roleId/members", async (req, res) => {
    const secret = req.headers["x-secret"];

    if (secret !== process.env.SECRET) return res.code(403).send("Forbidden");

    const { guildId, roleId } = req.params as {
      guildId: string;
      roleId: string;
    };

    const guild = client.guilds.cache.get(guildId);

    if (!guild) return res.code(404).send("Guild not found");

    const role = guild.roles.cache.get(roleId);

    if (!role) return res.code(404).send("Role not found");

    return res.code(200).send(
      JSON.stringify(
        role.members.map((m) => {
          return {
            id: m.id,
            username: m.user.username,
            displayAvatarURL: m.user.displayAvatarURL(),
          };
        })
      )
    );
  });

  server.post("/guild/:guildId/member/:userId/message", async (req, res) => {
    const secret = req.headers["x-secret"];

    if (secret !== process.env.SECRET) return res.code(403).send("Forbidden");

    const { guildId, userId } = req.params as {
      guildId: string;
      userId: string;
    };

    const body = req.body as { message: string };

    if (!body.message) return res.code(400).send("Bad request");

    const guild = client.guilds.cache.get(guildId);

    if (!guild) return res.code(404).send("Guild not found");

    const member = await guild.members.fetch(userId);

    if (!member) return res.code(404).send("Member not found");

    try {
      await member.send(body.message.replace("%GUILDNAME", guild.name));

      return res.code(200).send("Internal server error");
    } catch (e) {
      console.error(e);
      return res.code(500).send("Internal server error");
    }
  });
};
