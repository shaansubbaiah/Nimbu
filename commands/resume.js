var {servers} = require('../data.js');

module.exports = {
    name: 'resume',
    description: '',
    execute(message, args) {
        var server = servers[message.guild.id];
        server.dispatcher.resume();
    },
};