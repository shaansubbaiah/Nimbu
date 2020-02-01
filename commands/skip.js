const { servers, client } = require('../data.js');

module.exports = {
	name: 'skip',
	description: 'Skip to the next track.',
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
};