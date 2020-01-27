<<<<<<< HEAD
const { servers, client } = require('./data.js');

module.exports = {
	name: 'skip',
	description: '',
	execute(message) {
		const server = servers[message.guild.id];

		if(server.queue.length == 0) {
			client.user.setActivity('Quietly', { type: 'WATCHING' });
		}

		if(server.dispatcher) {
			server.dispatcher.end();
		}
		message.channel.send('Skipping')
			.then(msg => {
				msg.delete(1500);
			})
			.catch(console.error);
	},
=======
const { servers, client } = require('../data.js');

module.exports = {
	name: 'skip',
	description: '',
	execute(message) {
		const server = servers[message.guild.id];

		if(server.queue.length == 0) {
			client.user.setActivity('Quietly', { type: 'WATCHING' });
		}

		if(server.dispatcher) {
			server.dispatcher.end();
		}
		message.channel.send('Skipping')
			.then(msg => {
				msg.delete(1500);
			})
			.catch(console.error);
	},
>>>>>>> 19ddb844f697b507f5b84c3f72e2f355a5b2a853
};