<<<<<<< HEAD
const { servers } = require('./data.js');

module.exports = {
	name: 'pause',
	description: '',
	execute(message) {
		const server = servers[message.guild.id];
		server.dispatcher.pause();
	},
=======
const { servers } = require('../data.js');

module.exports = {
	name: 'pause',
	description: '',
	execute(message) {
		const server = servers[message.guild.id];
		server.dispatcher.pause();
	},
>>>>>>> 19ddb844f697b507f5b84c3f72e2f355a5b2a853
};