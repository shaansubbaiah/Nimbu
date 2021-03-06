const { prefixs, client } = require('../data.js');
const { defaultPrefix, embedColor } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
		const { commands } = message.client;
		const prefix = defaultPrefix;

		// display help of all commands
		if (!args.length) {
			const helpEmbed = new Discord.RichEmbed()
				.setColor(embedColor)
				.setAuthor('| Help Commands', message.author.displayAvatarURL)
				.setTitle(`You can send \`${prefix}help [command name]\` to get info on a specific command!`)
				.setDescription(` PLEASE MAKE SURE TO : Replace ${prefix} with the Server's Prefix ;)`)
				.setThumbnail(client.user.displayAvatarURL)
				.setTimestamp();

			commands.forEach(command => {
				helpEmbed.addField(`**${prefix + command.name}**`, `${command.description || null}`, false);
			});

			return message.author.send(helpEmbed)
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you!');
				});
		}
	
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		// for single command help
		const commandEmbed = new Discord.RichEmbed()
			.setColor(embedColor)
			.setTitle(`\`${prefix}${command.name}\``);

		if (command.aliases) commandEmbed.addField('**Aliases:**', `${command.aliases.join(', ')}`, false);
		if (command.description) commandEmbed.addField('**Description:**', `${command.description}`, false);
		if (command.usage) commandEmbed.addField('**Usage:**', `${prefix}${command.name} ${command.usage}`, false);
		commandEmbed.addField('**Cooldown:**', `${command.cooldown || 3} second(s)`, true);

		message.author.send(commandEmbed);
	},
};
