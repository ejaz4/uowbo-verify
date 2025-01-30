export const updateRoles = (guildId: string) => {
  console.log("Sending request to update roles");
  fetch(`${process.env.API_HOST}/api/dashboard/${guildId}/roles/update`, {
    headers: {
      "x-secret": process.env.SECRET as string,
    },
  });
};
