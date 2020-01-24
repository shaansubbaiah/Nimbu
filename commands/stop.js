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
};