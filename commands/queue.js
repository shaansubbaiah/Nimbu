const { servers } = require('../data.js');
const Discord = require('discord.js');

module.exports = {
	name: 'queue',
	description: 'prints song queue',
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
				.setColor('#4dfff4')
				.setAuthor('| Queue', message.author.displayAvatarURL)
				.setTimestamp();

			let i = 1;
			server.queue.forEach(song => {
				queueEmbed.addField(`${i}) ${song.url}`, song.title, false);
				i++;
			});

			message.channel.send(queueEmbed);
		}
	},
};