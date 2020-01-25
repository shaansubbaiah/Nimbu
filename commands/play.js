const ytdl = require('ytdl-core');
const yts = require('yt-search');
const { getInfo } = require('ytdl-getinfo');
const { servers, client } = require('../data.js');
const { prefix } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'play',
	description: 'play command.',
	usage: '<youtube link>',
	args: true,
	cooldown: 2,
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

				if(server.queue[0]) {play(connection);}

				else{
					connection.disconnect();
					client.user.setActivity('Quietly', { type: 'WATCHING' });
				}
			});
		}
		// end of play()


		if(!args[0]) {
			message.channel.send('Enter a youtube link/ search term!');
			return;
		}

		if(!message.member.voiceChannel) {
			message.channel.send('You must be in a voice channel to play the bot!');
			return;
		}

		if(!servers[message.guild.id]) {
			servers[message.guild.id] = {
				queue:[],
			};
		}

		let server = servers[message.guild.id];

		// if youtube url entered
		if(args[0].match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm)) {

			server.queue.push(args[0]);
			console.log(`Queue: ${server.queue}`);

			if(!message.guild.voiceConnection) {
				message.member.voiceChannel.join()
					.then(function(connection) {
						play(connection);
					});
			}
		}

		// if search term provided
		else {
			// store search results
			const res = [];
			let vidlist = '';
			yts(args.join(' '), function(err, r) {
				if (err) throw err;
				// top 5 results
				const videos = r.videos.slice(0, 5);

				let i = 0;
				videos.forEach(function(v) {
					res[i] = (v.url);
					vidlist += `${i + 1}. ${ v.title } (${ v.timestamp }) \n`;
					i++;
				});

				vidlist += `eg. **${prefix}1** to play first result`;
				message.channel.send(vidlist);
				vidlist = '';
			});

			// to get selected option

			const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { max: 1 });
			collector.on('collect', choice => {
				if (!choice.content.startsWith(prefix) || choice.author.bot) return;

				const chargs = choice.content.slice([prefix.length]).split(/ +/);
				console.log('val: ' + chargs[0]);

				const n = parseInt(chargs[0]);

				// exit if not a number or arguments provided
				if(isNaN(n) || chargs[1]) return;


				if((n >= 1) && (n <= 5)) {

					if(!servers[choice.guild.id]) {
						servers[choice.guild.id] = {
							queue:[],
						};
					}

					server = servers[choice.guild.id];
					server.queue.push(res[n - 1]);


					if(!choice.guild.voiceConnection) {
						choice.member.voiceChannel.join()
							.then(function(connection) {
								play(connection, choice);
							});
					}

				}
				else {
					choice.channel.send('Enter an integer between 1-5.');
				}
			});
		}
	},
};