import { Collection, Snowflake, GuildMember, Guild } from "discord.js";

export const registerUsers = async (
  members: Collection<Snowflake, GuildMember>,
  guild: [string, Guild],
  userId: string,
) => {
  const owner = guild[1].ownerId;

  const membersParsed: {
    id: string;
    username: string;
    avatar: string | null;
    isOwner: boolean;
  }[] = members.map((member) => {
    return {
      id: member.user.id,
      username: member.user.username,
      avatar: member.user.avatarURL(),
      isOwner: member.user.id === owner,
    };
  });

  const membersWithoutMe = membersParsed.filter(
    (member) => member.id !== userId,
  );

  const userFetch = await fetch(
    `${process.env.API_HOST}/api/bot/users/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-secret": process.env.SECRET as string,
      },
      body: JSON.stringify({
        users: membersWithoutMe,
        id: guild[1].id,
        name: guild[1].name,
        icon: guild[1].iconURL(),
      }),
    },
  );
};
