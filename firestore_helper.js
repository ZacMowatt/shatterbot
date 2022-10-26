const { PermissionFlagsBits } = require("discord-api-types/v10");
const { Util } = require("discord.js");
const { initializeApp } = require("firebase/app");
const {
	getDocs,
	getFirestore,
	collection,
	getDoc,
	updateDoc,
	doc,
	addDoc,
} = require("firebase/firestore/lite");

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
	collections["Expedition"] = collection(db, "Expedition");
	collections["Hecatomb"] = collection(db, "Hecatomb");
	collections["Red Lake"] = collection(db, "Red Lake");
	collections["PVP"] = collection(db, "PVP");
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
				values.location +
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
				message += "for **" + values.location + "** ";
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
				values.location +
				"**";
		}

		if (locationMetrics.length == 0 && newPersonal.length == 0 && !firstEntry) {
			message = "Sorry, no records broken. Keep trying, " + username + "!";
		}
	}

	// Final response
	interaction.reply(message);
};

const getHighscores = async (location, interaction) => {
	var message = "Displaying highscores for **" + location + "**";
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

module.exports = { initApp, updateData, getHighscores };
