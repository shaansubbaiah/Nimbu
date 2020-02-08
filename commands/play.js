const ytdl = require('ytdl-core');
const yts = require('yt-search');
const {prefixs,servers, client } = require('../data.js');
const { embedColor } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'play',
	description: 'Play command.',
	usage: '<youtube link> or <search term>',
	args: true,
	cooldown: 2,
	execute(message, args) {
		const prefix=prefixs[message.guild.id].serv_pre;
		function play(connection) {
			// join VC if not already in one
			if(!message.guild.voiceConnection) {
				message.member.voiceChannel.join();
			}

			const server = servers[message.guild.id];
			console.log(server);
			// embed
			const NowPlayingEmbed = new Discord.RichEmbed()
				.setColor(embedColor)
				.setAuthor('| Now Playing', server.queue[0].authorthumb)
				.setDescription('```CSS\n' + server.queue[0].title + '```')
				.setThumbnail(server.queue[0].thumb)
				.setTimestamp()
				.setFooter('(' + server.queue[0].timestamp + ')');

			message.channel.send(NowPlayingEmbed);
			// message.channel.send('Now Playing: ' + server.queue[0].title);

			server.dispatcher = connection.playStream(ytdl(server.queue[0].url, { quality: 'highestaudio', highWaterMark: 1 << 25 }));

			client.user.setActivity('Music', { type: 'PLAYING' });

			server.queue.shift();

			server.dispatcher.on('end', function() {

				if(server.queue[0]) {
					play(connection);
				}

				else{
					connection.disconnect();
					client.user.setActivity('Quietly', { type: 'WATCHING' });
				}
			});
		}
		// end of play()

		function queueSong(songUrl) {

			yts(songUrl, function(err, s) {
				if(err) throw err;
				// first result only
				console.log(`result in songq: ${songUrl}`);
				const info = s.videos[0];
				console.log(info);

				let song = {
					title: info.title,
					url: info.url,
					timestamp: info.timestamp,
					seconds: info.seconds,
					// use info.thumbnail for lower res image
					thumb: info.image,
					// song requester's thumbnail
					authorthumb: message.author.displayAvatarURL,
				};

				const addedQueueEmbed = new Discord.RichEmbed()
					.setColor(embedColor)
					.setDescription('Queued ```CSS\n' + song.title + '```');
				message.channel.send(addedQueueEmbed);

				server.queue.push(song);
				console.log('queue: ');
				console.log (server.queue);

			});


			if(!message.guild.voiceConnection) {
				message.member.voiceChannel.join()
					.then(function(connection) {
						play(connection);
					});
			}
		}
		// end of queueSong()

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

		const server = servers[message.guild.id];

		// if youtube url entered
		let link = args[0];
		const timeRegex = /(\?t|\&t|&start)=(\S*)/gm;
		if(link.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm)) {
			// remove timestamp in url
			link = link.replace(timeRegex, '');
			queueSong(link);
		}

		// if search term provided
		else {
			// store search results
			const res = [];
			let vidlist = '', srchMsgId;
			yts(args.join(' '), function(err, r) {
				if (err) throw err;
				// top 5 results
				const videos = r.videos.slice(0, 5);
				console.log(videos);

				let i = 0;
				videos.forEach(function(v) {
					res[i] = v.title;

					vidlist += `${i + 1}. ${ v.title } (${ v.timestamp }) \n`;
					i++;
				});
				console.log('i = ' + i);
				vidlist += `eg. **${prefix}1** to play first result`;

				message.channel.send(vidlist)
					.then(sent => {srchMsgId = sent.id;})
					.catch(console.error);

				vidlist = '';
			});


			// to get selected option
			const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { max: 1 });
			collector.on('collect', choice => {
				if (!choice.content.startsWith(prefix) || choice.author.bot) return;

				const chargs = choice.content.slice([prefix.length]).split(/ +/);

				const n = parseInt(chargs[0]);

				// exit if not a number or arguments provided
				if(isNaN(n) || chargs[1]) return;

				if((n >= 1) && (n <= 5)) {

					if(!servers[choice.guild.id]) {
						servers[choice.guild.id] = {
							queue:[],
						};
					}

					console.log('Result:');
					console.log(`${res[n - 1]}`);
					try {
						queueSong(res[n - 1]);
					}
					catch (error) {
						console.error(error);
						message.reply('there was an error trying to execute that command!');
					}

					// remove search result message
					message.channel.fetchMessage(srchMsgId).then(msg => {
						msg.delete();
					});
				}

				else {choice.channel.send('Enter an integer between 1-5.');}
			});
		}
	},
};
