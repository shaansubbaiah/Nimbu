<<<<<<< HEAD
var {servers} = require('../data.js');

module.exports = {
    name: 'pause',
    description: '',
    execute(message, args) {
        var server = servers[message.guild.id];
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
>>>>>>> vol
};