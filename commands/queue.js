const { servers } = require('../data.js');
const { embedColor } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'queue',
	description: 'Displays the song queue.',
	cooldown: 5,
	aliases: ['q'],
	args: false,
	usage: '',
	execute(message) {
		const server = servers[message.guild.id];
		if(server.queue.length == 0) {
			message.channel.send('Queue is Empty!');
		}
		else {
			const queueEmbed = new Discord.RichEmbed()
				.setColor(embedColor)
				.setAuthor('| Queue', message.author.displayAvatarURL)
				.setTimestamp();

			let i = 1;
			server.queue.forEach(song => {
				queueEmbed.addField(`${i}) ${song.url}`, `${song.title} - (${song.timestamp})`, false);
				i++;
			});

			message.channel.send(queueEmbed);
		}
	},
};