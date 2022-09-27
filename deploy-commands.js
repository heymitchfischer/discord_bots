const { REST, SlashCommandBuilder, Routes } = require('discord.js');

const commands = [
	new SlashCommandBuilder().setName('inspire_me').setDescription('Replies with inspiration!'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

async function deployCommands() {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
}

module.exports = {
  deployCommands,
}
