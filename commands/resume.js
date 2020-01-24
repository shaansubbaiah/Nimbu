const { servers } = require('./data.js');

module.exports = {
	name: 'resume',
	description: '',
	execute(message) {
		const server = servers[message.guild.id];
		server.dispatcher.resume();
	},
};