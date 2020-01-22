var {servers} = require('../data.js');

module.exports = {
    name: 'pause',
    description: '',
    execute(message, args) {
        var server = servers[message.guild.id];
        server.dispatcher.pause();
    },
};