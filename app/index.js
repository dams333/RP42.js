const client = require('discord-rich-presence')("1075433460275101696");
require('dotenv').config();
const Client = require('42.js').Client

const supported_coalitions = [
	"42cursus-paris-the-order",
	"42cursus-paris-the-alliance",
	"42cursus-paris-the-assembly",
	"42cursus-paris-the-federation",
];

function updatePresence(login, lvl, location, campus, coalition_logo_key, startedAt) {
	let params = {
		largeImageKey: "rp42-icon",
		details: `${login} | Lvl ${lvl}%`,
		state: `${location} in ${campus}`,
		startTimestamp: startedAt,
		instance: true,
	}
	if (supported_coalitions.includes(coalition_logo_key)) {
		params.smallImageKey = coalition_logo_key;
	} else {
		console.log(`Unsupported coalition: ${coalition_logo_key}`);
	}
	client.updatePresence(params);
}

process.title = "RP42";

(async () => {
	const api_client = new Client(
		process.env.CLIENT_ID,
		process.env.CLIENT_SECRET,
		{
			activeDebug: false,
		}
	);
	const login = process.env.USER;
	if (!login) {
		console.error("No user specified");
		return;
	}
	const user = await api_client.users.get(login);
	if (!user) {
		console.error("User not found");
		return;
	}

	let location = "";
	let startedAt = Date.now();
	if (user.location) {
		location = user.location;
		const locations = (await api_client.get(`/users/${user.id}/locations?filter[active]=true`)).data;
		if (locations.length > 0) {
			startedAt = new Date(locations[0].begin_at);
		}
	}
	else {
		location = "¯\\_(ツ)_/¯";
	}

	let campusName = "The World";
	const campuses = (await api_client.get(`/users/${user.id}/campus_users?filter[is_primary]=true`)).data;
	if (campuses.length > 0) {
		const campus = (await api_client.get(`/campus/${campuses[0].campus_id}`)).data;
		campusName = campus.name;
	}

	let level = 0;
	const cursuses = (await api_client.get(`/users/${user.id}/cursus_users?filter[active]=true`)).data;
	if (cursuses.length > 0) {
		level = cursuses[0].level;
	}

	let coalition_slug = "";
	let coalitions = (await api_client.get(`/users/${user.id}/coalitions_users`)).data;
	if (coalitions.length > 0) {
		coalitions = coalitions.sort((a, b) => a.updated_at - b.updated_at);
		const coalition = (await api_client.get(`/coalitions/${coalitions[0].coalition_id}`)).data;
		coalition_slug = coalition.slug;
	}
	
	console.log(`Logged in as ${login} | Lvl ${level}% | ${location} in ${campusName} | ${coalition_slug}`);
	updatePresence(login, level, location, campusName, coalition_slug, startedAt);
})();