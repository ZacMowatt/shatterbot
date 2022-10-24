const description = "Send a pong message to check if the bot is online.";

const init = (interaction, client) => {
	interaction.reply("Pong!");
};

module.exports = { init, description };
