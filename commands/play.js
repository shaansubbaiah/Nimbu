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


			server.dispatcher.on('finish', () => {
				console.log('Finished playing!');
				if(server.queue[0]) {
					play(connection, message);
				}
				else {
					server.dispatcher.destroy();
				}
			});
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
