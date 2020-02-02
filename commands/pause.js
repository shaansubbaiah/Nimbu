const { servers } = require('../data.js');

module.exports = {
	name: 'pause',
	description: 'Pause the current track.',
	execute(message) {
		const server = servers[message.guild.id];
		server.dispatcher.pause();
	},
};