const DiscordJS = require('discord.js');
const NUMBER = DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER;
const STRING = DiscordJS.Constants.ApplicationCommandOptionTypes.STRING;

const description = 'Updates your scores for each metric';

const locations = [
	{ name: 'Expedition', value: 'Expedition' },
	{
		name: 'Hetacomb',
		value: 'Hetacomb',
	},
	{
		name: 'Red Field',
		value: 'Red Field',
	},
	{ name: 'PVP', value: 'PVP' },
];

const options = [
	{
		name: 'location',
		description: 'Gamemode',
		required: true,
		choices: locations,
		type: STRING,
	},
	{
		name: 'score',
		description: 'Score',
		required: false,
		type: NUMBER,
	},
	{
		name: 'kills',
		description: 'How many kills did you steal?',
		required: false,
		type: NUMBER,
	},
	{
		name: 'deaths',
		description: 'Deaths',
		required: false,
		type: NUMBER,
	},
	{
		name: 'precision',
		description: 'Precision',
		required: false,
		type: NUMBER,
	},
	{
		name: 'revivals',
		description: 'Revivals',
		required: false,
		type: NUMBER,
	},
	{
		name: 'damage',
		description: 'Damage',
		required: false,
		type: NUMBER,
	},
];

const init = (interaction, client) => {
	const location = interaction.options.getString('location');
	const score = interaction.options.getNumber('score');
	const kills = interaction.options.getNumber('kills');
	const deaths = interaction.options.getNumber('deaths');
	const precision = interaction.options.getNumber('precision');
	const revivals = interaction.options.getNumber('revivals');
	const damage = interaction.options.getNumber('damage');

  const user  = interaction.member.user.id;

	var reply = 'Updating <@' + user+ '>\'s ' + location + ' score with values...';
	if (score) reply += '\nScore: ' + score;
	if (kills) reply += '\nKills: ' + kills;
	if (deaths) reply += '\nDeaths: ' + deaths;
	if (precision) reply += '\nPrecision: ' + precision;
	if (revivals) reply += '\nRevivals: ' + revivals;
	if (damage) reply += '\nDamage: ' + damage;
	interaction.reply(reply);
};

module.exports = { init, description, options };
