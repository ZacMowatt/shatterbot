const { locationManager } = require("./locations.js");
const { PermissionFlagsBits } = require("discord-api-types/v10");
const { Util } = require("discord.js");
const { initializeApp } = require("firebase/app");
const {
	getDocs,
	getFirestore,
	collection,
	updateDoc,
	addDoc,
	doc,
	setDoc,
} = require("firebase/firestore");
const {
	damage,
	deaths,
	gears,
	kills,
	precision,
	revivals,
	score,
} = require("./bot_responses.js");

const firebaseConfig = {
	apiKey: process.env.API_KEY,
	authDomain: process.env.AUTH_DOMAIN,
	projectId: process.env.PROJECT_ID,
	storageBucket: process.env.STORAGE_BUCKET,
	messagingSenderId: process.env.MESSAGING_SENDER_ID,
	appId: process.env.APP_ID,
};

var app;
var db;
var collections = [];

const initApp = () => {
	app = initializeApp(firebaseConfig);
	db = getFirestore(app);
	updateLocations();

	collections["Border Control"] = collection(db, "Border Control");
	collections["Cyber Trail"] = collection(db, "Cyber Trail");
	collections["Expedition"] = collection(db, "Expedition");
	collections["Hecatomb"] = collection(db, "Hecatomb");
	collections["PVP"] = collection(db, "PVP");
	collections["Red Lake"] = collection(db, "Red Lake");
	collections["Sunken Lab"] = collection(db, "Sunken Lab");
	collections["Border Control_V1"] = collection(db, "Border Control_V1");
	collections["Cyber Trail_V1"] = collection(db, "Cyber Trail_V1");
	collections["Expedition_V1"] = collection(db, "Expedition_V1");
	collections["Hecatomb_V1"] = collection(db, "Hecatomb_V1");
	collections["PVP_V1"] = collection(db, "PVP_V1");
	collections["Red Lake_V1"] = collection(db, "Red Lake_V1");
	collections["Sunken Lab_V1"] = collection(db, "Sunken Lab_V1");
	collections["Portal_V1"] = collection(db, "Portal_V1");
	collections["Stormbringer_V1"] = collection(db, "Stormbringer_V1");
	collections["Quicksand_V1"] = collection(db, "Quicksand_V1");
	collections["Hephaestus_V1"] = collection(db, "Hephaestus_V1");
	collections["Twin Stilts_V1"] = collection(db, "Twin Stilts_V1");
	collections["Bastion_V1"] = collection(db, "Bastion_V1");
	collections["Backstab_V1"] = collection(db, "Backstab_V1");
	collections["The Escape_V1"] = collection(db, "The Escape_V1");
	collections["Inside-Out_V1"] = collection(db, "Inside-Out_V1");
	collections["Liberty_V1"] = collection(db, "Liberty_V1");

	console.log("App initilised");
};

const updateData = async (username, userId, values, interaction) => {
	var message = "";
	const locationCol = collections[values.location];
	const usersCollection = collection(db, values.location + "/Users/users");
	const docs = (await getDocs(locationCol)).docs;
	var error = false;
	var firstEntry = false;

	var locationMetrics = [];
	var userMetrics = [];

	// Update location metrics
	docs.forEach((doc) => {
		const data = doc.data();

		if (data.value < values[doc.id]) {
			try {
				updateDoc(doc.ref, {
					username: username,
					userId: userId,
					value: values[doc.id],
				});
				locationMetrics.push(doc.id + " *(" + values[doc.id] + ")*");
			} catch (e) {
				error = true;
			}
		}
	});

	// Update user metrics
	const userDocs = (await getDocs(usersCollection)).docs;
	var userDoc;

	userDocs.forEach((doc) => {
		if (doc.data().userId === userId) {
			userDoc = doc;
		}
	});

	if (!userDoc) {
		// User doesn't have any scores for this location
		values["userId"] = userId;
		values["username"] = username;
		await addDoc(usersCollection, values);
		firstEntry = true;
	} else {
		// User already has scores for this location
		var toUpdate = {};
		const data = userDoc.data();

		if (data.damage < values["damage"]) {
			toUpdate["damage"] = values["damage"];
			userMetrics.push("damage" + " *(" + values["damage"] + ")*");
		}

		if (data.deaths < values["deaths"]) {
			toUpdate["deaths"] = values["deaths"];
			userMetrics.push("deaths" + " *(" + values["deaths"] + ")*");
		}

		if (data.gears < values["gears"]) {
			toUpdate["gears"] = values["gears"];
			userMetrics.push("gears" + " *(" + values["gears"] + ")*");
		}

		if (data.kills < values["kills"]) {
			toUpdate["kills"] = values["kills"];
			userMetrics.push("kills" + " *(" + values["kills"] + ")*");
		}

		if (data.precision < values["precision"]) {
			toUpdate["precision"] = values["precision"];
			userMetrics.push("precision" + " *(" + values["precision"] + ")*");
		}

		if (data.revivals < values["revivals"]) {
			toUpdate["revivals"] = values["revivals"];
			userMetrics.push("revivals" + " *(" + values["revivals"] + ")*");
		}

		if (data.score < values["score"]) {
			toUpdate["score"] = values["score"];
			userMetrics.push("score" + " *(" + values["score"] + ")*");
		}

		if (userMetrics.length > 0) {
			await updateDoc(userDoc.ref, toUpdate);
		}
	}

	// Compile message
	if (error) {
		message = "Error updating scores";
	} else {
		if (locationMetrics.length != 0) {
			message =
				"<@" +
				userId +
				"> now leads the scoreboard for **" +
				locationManager.locationDisplayName(values.location) +
				"** in: **" +
				locationMetrics.join("**, **") +
				"**";
		}

		var newPersonal = [];
		userMetrics.forEach((value) => {
			if (locationMetrics.indexOf(value) == -1) {
				newPersonal.push(value);
			}
		});

		if (newPersonal.length != 0) {
			var hs = locationMetrics.length != 0;
			if (hs) {
				message += "\n";
			}
			message += username;
			if (hs) {
				message += " also";
			}
			message += " beat their personal record ";
			if (!hs) {
				message +=
					"for **" +
					locationManager.locationDisplayName(values.location) +
					"** ";
			}
			message += "in: **" + newPersonal.join("**, **") + "**";
		} else if (firstEntry) {
			if (locationMetrics.length != 0) {
				message += "\n";
			}
			message +=
				"Setting " +
				username +
				"'s first personal scores for **" +
				locationManager.locationDisplayName(values.location) +
				"**";
		}

		if (locationMetrics.length == 0 && newPersonal.length == 0 && !firstEntry) {
			message = "Sorry, no records broken. Keep trying, " + username + "!";
		}
	}

	// Final response
	interaction.reply(message);
};

const getHighscores = async (location, interaction, user) => {
	if (user) {
		if (user.username === "Shatterbot" && user.bot === true) {
			highscoresBot(location, interaction);
		} else {
			highscoresPersonal(location, user, interaction);
		}
	} else {
		highscoresGlobal(location, interaction);
	}
};

const highscoresPersonal = async (location, user, interaction) => {
	const docs = (await getDocs(collection(db, location + "/Users/users"))).docs;
	var data;
	var message;

	docs.forEach((doc) => {
		if (doc.data().userId == user) {
			data = doc.data();
		}
	});

	if (data) {
		var message =
			"Displaying **" +
			data.username +
			"'s** personal highscores for **" +
			locationManager.locationDisplayName(location) +
			"**";
		message += "\n---------------------------------------------";
		message += rowFormat("damage:", data.damage);
		message += rowFormat("deaths:", data.deaths);
		if (location.contains("Expedition"))
			message += rowFormat("gears:", data.gears);
		message += rowFormat("kills:", data.kills);
		if (!location.contains("Expedition"))
			message += rowFormat("precision:", data.precision);
		message += rowFormat("revivals:", data.revivals);
		message += rowFormat("score:", data.score);
		message += "\n---------------------------------------------";
	} else {
		message =
			"Unable to find any scores for **" +
			user.username +
			"** for **" +
			locationManager.locationDisplayName(location) +
			"**";
	}

	interaction.reply(message);
};

const rowFormat = (title, value) => {
	var message = "\n**" + title + "**\t";
	message += value ? value : "~";
	return message;
};

const highscoresGlobal = async (location, interaction) => {
	var message =
		"Displaying highscores for **" +
		locationManager.locationDisplayName(location) +
		"**";
	message += "\n---------------------------------------------";

	const docs = (await getDocs(collections[location])).docs;

	docs.forEach((doc) => {
		if (doc.id != "Users") {
			const data = doc.data();
			message += "\n**" + doc.id + ":**\t";

			if (data.username) {
				message += data.value;
				message += " *(" + data.username + ")*";
			} else {
				message += "~";
			}
		}
	});

	message += "\n---------------------------------------------";

	interaction.reply(message);
};

const highscoresBot = (location, interaction) => {
	var message =
		"Displaying **Shatterbot's** personal highscores for **" +
		locationManager.locationDisplayName(location) +
		"**";
	message += "\n---------------------------------------------";
	message += rowFormat(
		"damage:",
		damage[Math.floor(Math.random() * damage.length)]
	);
	message += rowFormat(
		"deaths:",
		deaths[Math.floor(Math.random() * deaths.length)]
	);
	if (location.contains("Expedition"))
		message += rowFormat(
			"gears:",
			gears[Math.floor(Math.random() * gears.length)]
		);
	message += rowFormat(
		"kills:",
		kills[Math.floor(Math.random() * kills.length)]
	);
	message += rowFormat(
		"precision:",
		precision[Math.floor(Math.random() * precision.length)]
	);
	message += rowFormat(
		"revivals:",
		revivals[Math.floor(Math.random() * revivals.length)]
	);
	message += rowFormat(
		"score:",
		score[Math.floor(Math.random() * score.length)]
	);
	message += "\n---------------------------------------------";

	interaction.reply(message);
};

/// Helper for adding new locations to firestore
const newLocations = [];

const templateData = {
	userId: "",
	username: "",
	value: 0,
};

async function updateLocations() {
	for (const location of newLocations) {
		console.log("creating location: " + location);

		var docRef = doc(db, location, "Users");
		await setDoc(docRef, {});

		var docRef = doc(db, location, "Users/users/0");
		await setDoc(docRef, {});

		var docRef = doc(db, location, "damage");
		await setDoc(docRef, templateData);

		docRef = doc(db, location, "deaths");
		await setDoc(docRef, templateData);

		docRef = doc(db, location, "kills");
		await setDoc(docRef, templateData);

		docRef = doc(db, location, "precision");
		await setDoc(docRef, templateData);

		docRef = doc(db, location, "revivals");
		await setDoc(docRef, templateData);

		docRef = doc(db, location, "score");
		await setDoc(docRef, templateData);
	}
}

/// End helper

module.exports = { initApp, updateData, getHighscores };
