#!/usr/bin/env node

/**
 * @author Bentio
 */
"use strict";

const chalk = require("chalk");
const inquirer = require("inquirer");
const { discord } = require("./config/config.json");
const { createSpinner } = require("nanospinner");

const { Client, Collection, GatewayIntentBits } = require("discord.js");
/**
 * @function userInterview
 * start the user interview with checkbox multi-select
 */

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

async function printRespects() {
  process.stdout.write(`
\x1b[38;5;70m	         .---.	
\x1b[38;5;70m	    ___ /_____\\	         \x1b[36m ___                    ___  \x1b[38;5;70m
\x1b[38;5;70m	   /\\.-'( '.' )	         \x1b[36m(o o)                  (o o) \x1b[38;5;70m
\x1b[38;5;70m	  / /    \\_-_/_	        \x1b[36m(  V  )paying respects+(  V  )\x1b[38;5;70m
\x1b[38;5;70m	  \\ '-.-"''V'//-.	\x1b[36m--m-m--------------------m-m--\x1b[38;5;70m
\x1b[38;5;70m	   '.__,   |// , \\	 \x1b[31m__________________________ \x1b[38;5;70m
\x1b[38;5;70m	       |Ll //Ll|\\ \\	\x1b[37m|  ______________________  |\x1b[38;5;70m
\x1b[38;5;70m	       |__//   | \\_\\	\x1b[31m| |    \x1b[36mUnited States \x1b[31mof  | |\x1b[38;5;70m
\x1b[38;5;70m	      /---|[]==| / /	\x1b[37m| |      of America      | |\x1b[38;5;70m
\x1b[38;5;70m	      \\__/ |   \\/\\/	\x1b[31m| |     July 4, 1776  -  | |\x1b[38;5;70m
\x1b[38;5;70m	      /_   | Ll_\\|	\x1b[37m| |   January 20, 2021   | |\x1b[38;5;70m
\x1b[38;5;70m	       |'^"""^'|	\x1b[31m| |______________________| |\x1b[38;5;70m
\x1b[38;5;70m	       |   |   |	\x1b[37m|__________________________|\x1b[38;5;70m
\x1b[38;5;70m	       |   |   |	
\x1b[38;5;70m	       |   |   |	
\x1b[38;5;70m	       |   |   |	
\x1b[38;5;70m	       L___l___J	
\x1b[38;5;70m	        |_ | _|	
\x1b[38;5;70m	       (___|___)	
\x1b[38;5;70m	        ^^^ ^^^	     
\n\x1b[0m`);
}
async function userOptions() {
  // Clear the console
  console.clear();
  // Print the banner
  printBanner();
  // Ask for user input
  inquirer
    // Prompt the user to select an option
    .prompt({
      name: "question_main",
      type: "list",
      message: "Select one of the options below:\n",
      prefix: "✝️ ",
      choices: [
        `Start Bot`,
        `Deploy Commands`,
        `Help`,
        `Pay Respects`,
        `Credits`,
        `Exit`,
      ],
    })
    // Once the user has selected an option, handle the answer
    .then((answers) => {
      return handleAnswer(answers.question_main);
    })
    // If something goes wrong, log the error
    .catch((err) => errorMsg(`CLI failed, \n${err}`));
}

async function handleAnswer(answer) {
  console.clear();
  printBanner();
  if (answer == `Start Bot`) {
    // Someone make a spinner for this please
    const discordbot = require("./structures/discordbot");
  } else if (answer == `Deploy Commands`) {
    // Create a new Discord client and log in
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    });
    let progressLabel = `Logging in to Discord...`;
    const spinner = createSpinner(progressLabel).start({
      text: chalk.yellow(`Logging in`),
    });
    client.login(discord.token);

    // When the client is ready, run this code (only once)
    client.on("ready", async () => {
      // Change the spinner text to show that the client is logged in
      spinner.update({
        text: chalk.yellow(`Logged in as ${client.user.tag}!`),
      });

      // Loop through all the guilds (servers) and deploy commands to them
      await Promise.all(
        client.guilds.cache.map(async (guild) => {
          await require("./utils/deploy-commands")(client, guild);
          spinner.update({
            text: chalk.yellow(`Deploying commands for ${guild.name}`),
          });
        })
      );

      // Change the spinner text to show that the commands have been loaded
      spinner.success({ text: chalk.green(`Commands have been reloaded!`) });
      console.clear();
      printBanner();

      // Ask the user if they want to go back to the main menu
      inquirer
        .prompt({
          name: "question_complete",
          type: "list",
          message: "Success! Slash commands loaded.\n",
          prefix: "✅ ",
          choices: [`Go back Home`],
        })

        .then(() => {
          // When the user has answered the question, destroy the client
          client.destroy();

          // And then go back to the main menu
          return userOptions();
        })
        .catch((err) => errorMsg(`CLI failed, \n${err}`));
    });
  } else if (answer == `Help`) {
    console.clear();
    printBanner();
    inquirer
      .prompt({
        name: "question_complete",
        type: "list",
        message: `There is no help, you're on your own.\n`,
        prefix: "✝️  ",
        choices: [`Go back Home`],
      })
      .then(() => {
        return userOptions();
      });
  } else if (answer == `Pay Respects`) {
    console.clear();
    printRespects();
    inquirer
      .prompt({
        name: "question_complete",
        type: "list",
        message: `Press f to pay respects.\n`,
        prefix: "✝️  ",
        choices: [`Go back Home`],
      })
      .then(() => {
        return userOptions();
      });
  } else if (answer == `Credits`) {
    console.clear();
    printBanner();
    inquirer
      .prompt({
        name: "question_complete",
        type: "list",
        message: `I made this for everyone - Benito\n`,
        prefix: "✝️  ",
        choices: [`Go back Home`],
      })
      .then(() => {
        return userOptions();
      });
  } else {
    process.exit(0);
  }
}

userOptions();

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
