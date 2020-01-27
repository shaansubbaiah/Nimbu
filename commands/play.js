<<<<<<< HEAD
const ytdl = require('ytdl-core');
const { getInfo } = require('ytdl-getinfo');
let {servers}=require('./data.js');
const yts=require('yt-search');
const prefix='%';
const Discord = require('discord.js');
module.exports = {
	name: 'play',
	description: 'play command.',
	usage: '<youtube link>',
	args: true,
	cooldown: 5,
	execute(message, args) {
		function play(connection, message) {
			let server = servers[message.guild.id];

			server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter:'audioonly', quality: 'highestaudio' , highWaterMark: 1 << 25}));
			getInfo(server.queue[0]).then(info => { message.channel.send(info.items[0].title)});
			server.queue.shift();
			 server.dispatcher.on('end', function() {
			 	if(server.queue[0] ) {
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

			var server = servers[message.guild.id];

			server.queue.push(args[0]);

			if(!message.guild.voiceConnection) {
				message.member.voiceChannel.join()
				.then(function(connection) {
					play(connection, message);
				});
			}
		}
		else 
		{
			let res = [];
			yts(args.join(' '), function ( err, r ) {
				if ( err ) throw err
				const videos = r.videos.slice(0,5);
				let i=0;
				videos.forEach( function ( v ) {
					res[i]=(v.url);
				  message.channel.send(`${i+1} .${ v.title }-(${ v.timestamp })` );
				  i=i+1;
				} );
				message.channel.send('please prefix your code with a \'%\' ');
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
				 }
			})
		}
	},
};
=======
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const { servers, client } = require('../data.js');
const { prefix } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'play',
	description: 'play command.',
	usage: '<youtube link> or <search term>',
	args: true,
	cooldown: 2,
	execute(message, args) {

		function play(connection) {

			const server = servers[message.guild.id];

			message.channel.send('Now Playing: ' + server.queue[0].title);

			server.dispatcher = connection.playStream(ytdl(server.queue[0].url, { quality: 'highestaudio', highWaterMark: 1 << 25 }));

			client.user.setActivity('Music', { type: 'PLAYING' });

			server.queue.shift();

			server.dispatcher.on('end', function() {
				if(server.queue[0]) {play(connection);}

				else{
					connection.disconnect();
					client.user.setActivity('Quietly', { type: 'WATCHING' });
				}
			});
		}
		// end of play()

		function queueSong(songUrl) {

			yts(songUrl, function(err, r) {
				if(err) throw err;
				// first result only
				const info = r.videos[0];

				const song = {
					title: info.title,
					url: info.url,
					timestamp: info.timestamp,
					seconds: info.seconds,
					thumb: info.thumbnail,
				};
				server.queue.push(song);

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
		if(args[0].match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm)) {
			queueSong(args[0]);
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

				const n = parseInt(chargs[0]);

				// exit if not a number or arguments provided
				if(isNaN(n) || chargs[1]) return;

				if((n >= 1) && (n <= 5)) {

					if(!servers[choice.guild.id]) {
						servers[choice.guild.id] = {
							queue:[],
						};
					}

					queueSong(res[n - 1]);
				}

				else {choice.channel.send('Enter an integer between 1-5.');}
			});
		}
	},
};
>>>>>>> 19ddb844f697b507f5b84c3f72e2f355a5b2a853
