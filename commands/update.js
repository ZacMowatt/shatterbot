const { updateData } = require("../firestore_helper");
const { locationManager } = require("../locations");

const DiscordJS = require("discord.js");
const NUMBER = DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER;
const STRING = DiscordJS.Constants.ApplicationCommandOptionTypes.STRING;

const description = "Updates your scores for each metric";

const options = [
	{
		name: "location",
		description: "Gamemode",
		required: true,
		choices: locationManager.updatableLocations,
		type: STRING,
	},
	{
		name: "score",
		description: "Score",
		required: false,
		type: NUMBER,
	},
	{
		name: "kills",
		description: "How many kills did you steal?",
		required: false,
		type: NUMBER,
	},
	{
		name: "deaths",
		description: "Deaths",
		required: false,
		type: NUMBER,
	},
	{
		name: "precision",
		description: "Precision",
		required: false,
		type: NUMBER,
	},
	{
		name: "revivals",
		description: "Revivals",
		required: false,
		type: NUMBER,
	},
	{
		name: "damage",
		description: "Damage",
		required: false,
		type: NUMBER,
	},
	{
		name: "gears",
		description: "Expedition-only metric",
		required: false,
		type: NUMBER,
	},
];

const init = (interaction, client) => {
	const location = interaction.options.getString("location");
	const score = interaction.options.getNumber("score");
	const kills = interaction.options.getNumber("kills");
	const deaths = interaction.options.getNumber("deaths");
	const precision = interaction.options.getNumber("precision");
	const revivals = interaction.options.getNumber("revivals");
	const damage = interaction.options.getNumber("damage");
	const gears = interaction.options.getNumber("gears");

	const username = interaction.member.user.username;
	const userId = interaction.member.user.id;

	updateData(
		username,
		userId,
		{
			location: location,
			score: score,
			kills: kills,
			deaths: deaths,
			precision: precision,
			revivals: revivals,
			damage: damage,
			gears: gears,
		},
		interaction
	);
};

module.exports = { init, description, options };
