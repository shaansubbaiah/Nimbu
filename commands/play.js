const ytdl = require('ytdl-core');
<<<<<<< HEAD
var {servers} = require('../data.js');
=======
const { servers } = require('../data.js');
>>>>>>> vol

module.exports = {
	name: 'play',
	description: 'play command.',
	usage: '<youtube link>',
	args: true,
	cooldown: 5,
	execute(message, args) {
		console.log(`message: ${message}, args: ${args}`);
		console.log(`message.channel: ${message.member.voiceChannel}`);

		function play(connection, message) {
<<<<<<< HEAD
			var server = servers[message.guild.id];

			server.dispatcher = connection.playStream(ytdl(server.queue[0], { quality: 'highestaudio' , highWaterMark: 1 << 25}));
			// server.dispatcher = connection.play(ytdl(server.queue[0], { filter:'audioonly' , highWaterMark: 1 << 25}));
			
=======
			const server = servers[message.guild.id];

			server.dispatcher = connection.playStream(ytdl(server.queue[0], { quality: 'highestaudio', highWaterMark: 1 << 25 }));
			// server.dispatcher = connection.play(ytdl(server.queue[0], { filter:'audioonly' , highWaterMark: 1 << 25}));

>>>>>>> vol
			server.queue.shift();

			server.dispatcher.on('end', function() {
				if(server.queue[0]) {
					play(connection, message);
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

<<<<<<< HEAD
		var server = servers[message.guild.id];
=======
		const server = servers[message.guild.id];
>>>>>>> vol

		server.queue.push(args[0]);

		console.log(server.queue);

		if(!message.guild.voiceConnection) {
			message.member.voiceChannel.join()
<<<<<<< HEAD
			.then(function(connection) {
				play(connection, message);
			});
=======
				.then(function(connection) {
					play(connection, message);
				});
>>>>>>> vol
		}
	},
};