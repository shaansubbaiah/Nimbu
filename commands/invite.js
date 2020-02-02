const { embedColor, inviteLink } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'invite',
	description: 'Sends bot\'s invite link',
	cooldown: 5,
	args: false,
	execute(message) {
		const inviteEmbed = new Discord.RichEmbed()
			.setColor(embedColor)
			.setTitle('You can invite the bot using this link:')
			.setDescription(inviteLink);
		message.channel.send(inviteEmbed);
	},
};