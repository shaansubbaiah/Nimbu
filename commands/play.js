const ytdl = require('ytdl-core');
const { getInfo } = require('ytdl-getinfo');
const { servers, client } = require('../data.js');

module.exports = {
	name: 'play',
	description: 'play command.',
	usage: '<youtube link>',
	args: true,
	cooldown: 5,
	execute(message, args) {
		function play(connection) {
			const server = servers[message.guild.id];

			let npid;
			getInfo(server.queue[0])
				.then(info => {
					message.channel.send('Now Playing: ' + info.items[0].title)
						.then(sent => {
							npid = sent.id;
						})
						.catch(console.error);
				});

			server.dispatcher = connection.playStream(ytdl(server.queue[0], { quality: 'highestaudio', highWaterMark: 1 << 25 }));

			console.log(`Now Playing: ${server.queue[0]}`);
			client.user.setActivity('Music', { type: 'PLAYING' });

			server.queue.shift();

			server.dispatcher.on('end', function() {
				message.channel.fetchMessage(npid).then(msg => {
					msg.delete();
				});

				if(server.queue[0]) {
					play(connection);
				}
				else{
					connection.disconnect();
					client.user.setActivity('Quietly', { type: 'WATCHING' });
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

		console.log(`Queue: ${server.queue}`);

		if(!message.guild.voiceConnection) {
			message.member.voiceChannel.join()
				.then(function(connection) {
					play(connection);
				});
		}
	},
};