const { initializeApp } = require("firebase/app");
const {
	getDocs,
	getFirestore,
	collection,
	getDoc,
	updateDoc,
} = require("firebase/firestore/lite");

const DiscordJS = require("discord.js");
const NUMBER = DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER;
const STRING = DiscordJS.Constants.ApplicationCommandOptionTypes.STRING;

const description = "Updates your scores for each metric";

const locations = [
	{ name: "Expedition", value: "Expedition" },
	{
		name: "Hetacomb",
		value: "Hetacomb",
	},
	{
		name: "Red Field",
		value: "Red Field",
	},
	{ name: "PVP", value: "PVP" },
];

const options = [
	{
		name: "location",
		description: "Gamemode",
		required: true,
		choices: locations,
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
];

const firebaseConfig = {
	apiKey: process.env.API_KEY,
	authDomain: process.env.AUTH_DOMAIN,
	projectId: process.env.PROJECT_ID,
	storageBucket: process.env.STORAGE_BUCKET,
	messagingSenderId: process.env.MESSAGING_SENDER_ID,
	appId: process.env.APP_ID,
};

const init = (interaction, client) => {
	const location = interaction.options.getString("location");
	const score = interaction.options.getNumber("score");
	const kills = interaction.options.getNumber("kills");
	const deaths = interaction.options.getNumber("deaths");
	const precision = interaction.options.getNumber("precision");
	const revivals = interaction.options.getNumber("revivals");
	const damage = interaction.options.getNumber("damage");

	const userId = interaction.member.user.id;

	updateData(
		userId,
		{
			location: location,
			score: score,
			kills: kills,
			deaths: deaths,
			precision: precision,
			revivals: revivals,
			damage: damage,
		},
		interaction
	);
};

const updateData = async (userId, values, interaction) => {
	console.log(values["location"]);
	const app = initializeApp(firebaseConfig);
	const db = getFirestore(app);

	const locationCol = collection(db, values.location);
	const docs = (await getDocs(locationCol)).docs;
	var error = false;

	docs.forEach((doc) => {
		const data = doc.data();

		if (data.value < values[doc.id]) {
			try {
				updateDoc(doc.ref, { user_id: userId, value: values[doc.id] });
			} catch (e) {
				error = true;
			}
		}
	});

	if (error === true) {
		interaction.reply("Error updating scores");
	} else {
		interaction.reply("Successfully updated <@" + userId + ">'s scores");
	}
};

module.exports = { init, description, options };
