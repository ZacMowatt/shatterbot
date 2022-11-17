const { updateData, getHighscores } = require("../firestore_helper");

const DiscordJS = require("discord.js");
const NUMBER = DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER;
const STRING = DiscordJS.Constants.ApplicationCommandOptionTypes.STRING;
const USER = DiscordJS.Constants.ApplicationCommandOptionTypes.USER;

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
	{
		name: "user",
		description:
			"Gets scores for a given user. Leave blank to view shared scores",
		required: false,
		type: USER,
	},
];

const init = (interaction, client) => {
	const location = interaction.options.getString("location");
	const user = interaction.options.getUser("user");

	getHighscores(location, interaction, user);
};

module.exports = { init, description, options };
