const { REST, Routes } = require("discord.js");
const config = require("../config/config.json");
const fs = require("node:fs");
const path = require("node:path");
module.exports = (client, guild) => {
  const commands = [];
  // Grab all the command files from the commands director
  const commandsPath = path.join(__dirname, "../commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    commands.push(command.data.toJSON());
  }

  // Construct and prepare an instance of the REST module
  const rest = new REST({ version: "10" }).setToken(config.discord.token);

  // and deploy your commands!
  (async () => {
    try {
      // The put method is used to fully refresh all commands in the guild with the current set
      const data = await rest.put(
        Routes.applicationGuildCommands(client.user.id, guild.id),
        { body: commands }
      );
    } catch (error) {
      // And of course, make sure you catch and log any errors!
      console.error(error);
    }
  })();
};
