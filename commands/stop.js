var {servers} = require('../data.js');

module.exports = {
    name: 'stop',
    description: '',
    execute(message, args) {
        var server = servers[message.guild.id];
        server.dispatcher.destroy();
    },
};