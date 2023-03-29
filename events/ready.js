const readline = require("readline");
const { Events } = require("discord.js");
const chalk = require("chalk");
const inquirer = require("inquirer");
//const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
  name: Events.ClientReady,
  once: true,

  async execute(client) {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(
      `\x1b[0m✝️  The bot is ready! Logged in as \x1b[37;46;1m${client.user.tag}\x1b[0m (\x1b[37;46;1m${client.user.id}\x1b[0m)\x1b[0m 
			`.replace(/\t/g, "")
    );

    async function printBanner() {
      process.stdout.write(`
\x1b[36m            \\       /        \x1b[38;5;70m  ____________________________________ 
\x1b[36m              .---.           \x1b[38;5;70m|  ________________________________  |
\x1b[36m         '-.  |   |  .-'      \x1b[38;5;70m| |                                | |
\x1b[36m           ___|   |___        \x1b[38;5;70m| |  The fear of the Lord is the   | |
\x1b[36m      -=  [           ]  =-   \x1b[38;5;70m| |     beginning of knowledge:    | |
\x1b[36m          \`---.   .---'       \x1b[38;5;70m| |    but fools despise wisdom    | |
\x1b[36m       __||__ |   | __||__    \x1b[38;5;70m| |         and instruction        | |
\x1b[36m       '-..-' |   | '-..-'    \x1b[38;5;70m| |         Proverbs 1:7-8         | |
\x1b[36m         ||   |   |   ||      \x1b[38;5;70m| |               KJV              | |
\x1b[36m         ||_.-|   |-          \x1b[38;5;70m| |________________________________| |
\x1b[36m       .-\"\`   \`\"\`'\`   \`\"-.    \x1b[38;5;70m|____________________________________|
\x1b[36m     .'                   '
\n\x1b[0m`);
    }

    //This lists options after initial login
    async function userLoginOptions() {
      console.clear();
      printBanner();
      inquirer
        .prompt({
          name: "question_inBot",
          type: "list",
          message: `Select one of the options below:\n`,
          prefix: "✝️ ",
          choices: [`Servers`, `Exit`],
        })
        .then((answers) => {
          if (answers.question_inBot == `Servers`) {
            return serversOptions();
          } else if (answers.question_inBot == `Settings`) {
          } else if (answers.question_inBot == `Help`) {
          } else {
            process.exit();
          }
        })
        .catch((err) => errorMsg(`inquirer interview failed, \n${err}`));
    }

    //TODO: Seperate each option into its own function
    userLoginOptions();
    //
    async function serversOptions() {
      console.clear();
      printBanner();
      let guilds = [];
      await Promise.all(
        client.guilds.cache.map(async (guild) => {
          guilds.push(`${guild.name}`);
        })
      );
      guilds.push(`Go Back`);
      inquirer
        .prompt({
          name: "question_inServers",
          type: "list",
          message: `Select one of the servers below:\n`,
          prefix: "✝️ ",
          choices: guilds,
        })
        .then((answers) => {
          if (answers.question_inServers == `Go Back`) {
            userLoginOptions();
          } else {
            getServer(answers.question_inServers);
          }
        })
        .catch((err) => errorMsg(`inquirer interview failed, \n${err}`));
    }

    async function getServer(guildName) {
      console.clear();
      printBanner();
      let server = await client.guilds.cache.find(
        (guild) => guild.name == guildName
      );
      inquirer
        .prompt({
          name: "question_inServer",
          type: "list",
          message: `Select one of the options for \x1b[37;46;1m${server.name}\x1b[0m below:\n`,
          prefix: "✝️ ",
          choices: ["Channels", "Members", "Go Back"],
        })
        .then((answers) => {
          if (answers.question_inServer == `Server Information`) {
            console.log(server);
          } else if (answers.question_inServer == `Members`) {
            let membersList = [];
            server.members.fetch().then((members) => {
              members.forEach((member) => {
                membersList.push(member.user.tag);
              });
            });
            console.clear();
            printBanner();
            membersList.push(`Go Back`);
            inquirer
              .prompt({
                name: "question_inMembers",
                type: "list",
                message: `Select one of the members below:\n`,
                prefix: "✝️ ",
                choices: membersList,
              })
              .then((answers) => {
                if (answers.question_inMembers == `Go Back`) {
                  serversOptions();
                } else {
                  getMember(answers.question_inMembers);
                }
              });
          } else {
            serversOptions();
          }
        })
        .catch((err) => errorMsg(`inquirer interview failed, \n${err}`));
    }
  },
};

/**
 * @function errorMsg
 * give user error messages
 * @param {string} msg - message to be logged out
 * @param {boolean} exit - if should exit after message, default true
 */
async function errorMsg(msg, exit = true) {
  console.error(chalk.red(`Error! ${msg}`));
  exit && process.exit(1);
}
