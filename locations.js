const locations = [
	{ name: "Bastion", value: "Bastion_V1" },
	{ name: "Border Control", value: "Border Control_V1" },
	{ name: "Cyber Trail", value: "Cyber Trail_V1" },
	{ name: "Expedition", value: "Expedition_V1" },
	{ name: "Hecatomb", value: "Hecatomb_V1" },
	{ name: "Hephaestus", value: "Hephaestus_V1" },
	{ name: "PVP", value: "PVP_V1" },
	{ name: "Portal", value: "Portal_V1" },
	{ name: "Quicksand", value: "Quicksand_V1" },
	{ name: "Red Lake", value: "Red Lake_V1" },
	{ name: "Stormbringer", value: "Stormbringer_V1" },
	{ name: "Sunken Lab", value: "Sunken Lab_V1" },
	{ name: "Twin Stilts", value: "Twin Stilts_V1" },
	{ name: "Backstab", value: "Backstab_V1" },
	{ name: "The Escape", value: "The Escape_V1" },
	{ name: "Inside-Out", value: "Inside-Out_V1" },
	{ name: "Liberty", value: "Liberty_V1" },
];

const earlyAccessLocations = [
	{ name: "Early Access - Border Control", value: "Border Control" },
	{ name: "Early Access - Cyber Trail", value: "Cyber Trail" },
	{ name: "Early Access - Expedition", value: "Expedition" },
	{ name: "Early Access - Hecatomb", value: "Hecatomb" },
	{ name: "Early Access - Red Lake", value: "Red Lake" },
	{ name: "Early Access - Sunken Lab", value: "Sunken Lab" },
];

const locationManager = {
	// Getter for updatableLocations (using only locations)
	get updatableLocations() {
		return locations;
	},

	// Getter for readableLocations (combining locations and earlyAccessLocations)
	get readableLocations() {
		return [...locations, ...earlyAccessLocations];
	},

	locationDisplayName(location) {
		const l = this.readableLocations.find((loc) => loc.value === location);
		return l.name ?? location;
	},
};

module.exports = { locationManager };
