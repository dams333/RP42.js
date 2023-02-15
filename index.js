const client = require('discord-rich-presence')("1075433460275101696");

client.updatePresence({
	state: 'slithering',
	details: '🐍',
	startTimestamp: Date.now(),
	endTimestamp: Date.now() + 1337,
	largeImageKey: 'snek_large',
	smallImageKey: 'snek_small',
	instance: true,
  });