const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

var servers={};

const ytdl=require('ytdl-core');

const client = new Discord.Client();
client.commands = new Discord.Collection();

client.once('ready', () => {
	console.log('I am ready!');
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	
	switch(args[0]){
		case 'play':

			function play(connection,message){
				var server =servers[message.guild.id];

				server.dispacther=connection.playStream(ytdl(server.queue[0],{filter:"audioonly"}));

				server.queue.shift();

				server.dispacther.on("end",function(){
					if(server.queue[0]){
						play(connection,message);
					}
					else{
						connection.disconnect();
					}
				});
			}


			if(!args[1]){
				message.channel.send("No link attached!");
				return;
			}
			if(!message.member.voiceChannel){
				message.channel.send("You must be in a channel to play the bot");
				return;
			}
			
			if(!servers[message.guild.id])servers[message.guild.id]={
				queue:[]
			}

			var server=servers[message.guild.id];

			server.queue.push(args[1]);
			if(!message.guild.voiceConnection)message.member.voiceChannel.join().then(function(connection){
				play(connection,message);
			})


			break;

		case 'skip':
			var server=servers[message.guild.id];
			if(server.dispacther)server.dispacther.end();
			message.channel.send("Skip!Hop!Jump!");
			break;

		case 'stop':
			var server=servers[message.guild.id];
			if(message.guild.voiceConnection){
				for(var i=server.queue.length-1;i>=0;i--){
					server.queue.splice(i,1);
				}
				server.dispacther.end();
				message.channel.send("Ending the queue Leaving the voice channel");
				console.log("stopped the queue");
			}
			if(message.guild.id)message.guild.voiceConnection.disconnect()
			break;

			}
 });

client.login(token);