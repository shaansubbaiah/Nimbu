<<<<<<< HEAD
var {servers} = require('../data.js');

module.exports = {
    name: 'stop',
    description: '',
    execute(message, args) {
        var server = servers[message.guild.id];
        server.queue = [];
        if(server.dispatcher) {
            server.dispatcher.end();
        }
        message.channel.send('Stopped, exiting.');
    },
=======
const { servers } = require('../data.js');

module.exports = {
	name: 'stop',
	description: '',
	execute(message) {
		const server = servers[message.guild.id];
		server.queue = [];
		if(server.dispatcher) {
			server.dispatcher.end();
		}
		message.channel.send('Stopped, exiting.')
			.then(msg => {
				msg.delete(1500);
			})
			.catch(console.error);
	},
>>>>>>> vol
};