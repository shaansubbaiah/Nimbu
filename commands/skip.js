const { servers } = require('../data.js');

module.exports = {
	name: 'skip',
	description: '',
	execute(message) {
		const server = servers[message.guild.id];
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