var {servers} = require('../data.js');

module.exports = {
    name: 'skip',
    description: '',
    execute(message, args) {
        var server = servers[message.guild.id];
        if(server.dispatcher) {
            server.dispatcher.end();
        }
        message.channel.send('Skipping');
    },
};