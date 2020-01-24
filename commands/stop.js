const { servers, client } = require('../data.js');

module.exports = {
	name: 'stop',
	description: '',
	execute(message) {
		const server = servers[message.guild.id];

		server.queue = [];
		client.user.setActivity('Quietly', { type: 'WATCHING' });

		if(server.dispatcher) {
			server.dispatcher.end();
		}
		message.channel.send('Stopped, exiting.')
			.then(msg => {
				msg.delete(1500);
			})
			.catch(console.error);
	},
};