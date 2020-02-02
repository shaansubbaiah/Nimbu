<<<<<<< HEAD
const { servers } = require('./data.js');

module.exports = {
	name: 'resume',
	description: '',
	execute(message) {
		const server = servers[message.guild.id];
		server.dispatcher.resume();
	},
=======
const { servers } = require('../data.js');

module.exports = {
	name: 'resume',
	description: 'Resumes a paused track.',
	execute(message) {
		const server = servers[message.guild.id];
		server.dispatcher.resume();
	},
>>>>>>> 19ddb844f697b507f5b84c3f72e2f355a5b2a853
};