const client = require('discord-rich-presence')("1075433460275101696");

function updatePresence(login, lvl, location, campus, coalition_logo_key, startedAt) {
	client.updatePresence({
		largeImageKey: "rp42-icon",
		smallImageKey: coalition_logo_key,
		details: `${login} | Lvl ${lvl}%`,
		state: `${location} in ${campus}`,
		startTimestamp: startedAt,
		instance: true,
	});
}

updatePresence("dhubleur", 9.23, "e1r1p1", "Paris", 'coa-order', Date.now());