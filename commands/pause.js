const { servers } = require('./data.js');

module.exports = {
	name: 'pause',
	description: '',
	execute(message) {
		const server = servers[message.guild.id];
		server.dispatcher.pause();
	},
};