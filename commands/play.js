const ytdl = require('ytdl-core');

module.exports = {
	name: 'play',
	description: 'play command.',
	usage: '[command name]',
	args: true,
	cooldown: 5,
	execute(message, args) {
		
		var servers = {};
		function play(connection) {
			const server = servers[message.guild.id];

			server.dispatcher = connection.playStream(ytdl(server.queue[0], { filter:'audioonly' }));

			server.queue.shift();

			server.dispacther.on('end', function() {
				if(server.queue[0]) {
					play(connection);
				}
				else{
					connection.disconnect();
				}
			});
		}


		if(!args[0]) {
			message.channel.send('No link attached!');
			return;
		}
		if(!message.member.voiceChannel) {
			message.channel.send('You must be in a channel to play the bot');
			return;
		}

		if(!servers[message.guild.id]) {
			servers[message.guild.id] = {
				queue:[],
			};
		}

		const server = servers[message.guild.id];

		server.queue.push(args[0]);
		if(!message.guild.voiceConnection) {
			message.member.voiceChannel.join().then(function(connection) {
				play(connection);
			});
		}
	},
};