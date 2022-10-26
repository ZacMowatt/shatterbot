const { updateData, getHighscores } = require("../firestore_helper");

const DiscordJS = require("discord.js");
const NUMBER = DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER;
const STRING = DiscordJS.Constants.ApplicationCommandOptionTypes.STRING;

const description = "View the recorded highscores for a given location";

const locations = [
	{ name: "Expedition", value: "Expedition" },
	{
		name: "Hecatomb",
		value: "Hecatomb",
	},
	{
		name: "Red Lake",
		value: "Red Lake",
	},
	{ name: "PVP", value: "PVP" },
];

const options = [
	{
		name: "location",
		description: "Location",
		required: true,
		choices: locations,
		type: STRING,
	},
];

const init = (interaction, client) => {
	const location = interaction.options.getString("location");

	getHighscores(location, interaction);
};

module.exports = { init, description, options };
