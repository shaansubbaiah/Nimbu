const ytdl = require('ytdl-core');
const { getInfo } = require('ytdl-getinfo');
let {servers}=require('./data.js');
const yts=require('yt-search');
const prefix='%';
const Discord = require('discord.js');
module.exports = {
	name: 'play',
	description: 'Play command.',
	usage: '<youtube link> or <search term>',
	args: true,
	cooldown: 5,
	execute(message, args) {
		function play(connection, message) {
			let server = servers[message.guild.id];

		function play(connection) {

			const server = servers[message.guild.id];
			// embed
			const NowPlayingEmbed = new Discord.RichEmbed()
				.setColor('#4dfff4')
				.setAuthor('| Now Playing', server.queue[0].authorthumb)
				.setDescription('```yaml\n' + server.queue[0].title + '```')
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

		function queueSong(songUrl) {

			yts(songUrl, function(err, s) {
				if(err) throw err;
				// first result only
				console.log(`result in songq: ${songUrl}`);
				const info = s.videos[0];
				console.log(info);

				const song = {
					title: info.title,
					url: info.url,
					timestamp: info.timestamp,
					seconds: info.seconds,
					// use info.thumbnail for lower res image
					thumb: info.image,
					// song requester's thumbnail
					authorthumb: message.author.displayAvatarURL,
				};

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
			message.channel.send('No link attached!');
			return;
		}
		if( !message.member.voiceChannel) { 
			message.channel.send('You must be in a channel to play the bot');
			return;
		}
		if(args[0].includes('youtube.com/')){
			if(!servers[message.guild.id]) {
				servers[message.guild.id] = {
					queue:[],
				};
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
					res[i] = v.videoId;
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
 
			
			const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
			collector.on('collect', message => {
				if (!message.content.startsWith(prefix) || message.author.bot) return; 
				const args = message.content.slice([prefix.length]).split(/ +/);
				if(args[0]=='play'){
					args.shift();
					let n = args[0];
					n=n-1;
					if (!isNaN(n) && n >= 0 && n <= 4) {
						if(!servers[message.guild.id]) {
							servers[message.guild.id] = {
								queue:[],
							};
						}
			
						var server = servers[message.guild.id];
						server.queue.push(res[n]);
			
						if(!message.guild.voiceConnection) {
							message.member.voiceChannel.join()
							.then(function(connection) {
								play(connection, message);
							});
						}
					}

					console.log('Result:');
					console.log(`${res[n - 1]}`);
					queueSong(res[n - 1]);

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
