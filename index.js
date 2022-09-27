require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");
const Discord = require("discord.js");
const { CronJob, CronTime } = require("cron");
const { deployCommands } = require("./deploy-commands");

const inspirationUrl = "https://inspirobot.me/api?generate=true";
const channelName = "inspirobot";
const timezone = "America/Chicago";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const dailyInspiration = new CronJob("0 0 9 * * *", async () => {
  try {
    const result = await getInspired();
    client.channels.cache.find(i => i.name === channelName).send(result)
  }
  catch (error) {
    console.log("Error occured when generating daily inspiration");
  }
}, null, true, timezone);

async function getInspired() {
  const response = await axios.get(inspirationUrl);
  return response.data;
};

//Listen to the event that signals bot is ready to start working
client.on("ready", () => {
  console.log(`logged in as ${client.user.tag}`);
  deployCommands();
  dailyInspiration.start();
});

client.on("interactionCreate", async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === "inspire_me") {
    try {
      const result = await getInspired();
      interaction.reply(result);
    }
    catch (error) {
      interaction.reply("Sorry, an error occured");
    }
	}
});

//Login to the server using bot token
client.login(process.env.TOKEN);
