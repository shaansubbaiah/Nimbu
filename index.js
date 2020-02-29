const fs = require('fs-extra');
const Discord = require('discord.js');
const { defaultPrefix, token, embedColor } = require('./config.json');
const { prefixs, client} = require('./data.js');


client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});
client.once('reconnecting', () => {
	console.log('Reconnecting!');
});
client.once('disconnect', () => {
	console.log('Disconnect!');
});

// welcome msg on joining server
client.on('guildCreate', guild => {
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	//asigning default prefix to the server 
	prefixs[guild.id]={
		serv_pre:defaultPrefix,
	};
	const welcomeEmbed = new Discord.RichEmbed()
		.setColor(embedColor)
		.setTitle('Nimbu')
		.setDescription(' ~ Thanks for adding me to the server! ~ ')
		.setThumbnail(client.user.displayAvatarURL)
		.addBlankField()
		.addField('Get to know me better!', '**·** Use **-help** for a list of my commands\n**·** **-prefix** to change my prefix\n', false)
		.addBlankField()
		.addField('Let\'s play some music!', '**·** Use **-play** to start playing a song\n**·** eg. `-play Kendrick Lamar - HUMBLE` or `-play https://www.youtube.com/watch?v=tvTRZJ-4EyI`\n**·** Commands **-pause**,  **-resume**,  **-skip**,  **-stop** control music playback.', false)
		.setFooter('When life gives you lemons, add em to your server ;)')
		.setTimestamp();
	guild.systemChannel.send(welcomeEmbed);
});

let prefix;

client.on('message', message => {
	const prefixMention = new RegExp(`^<@!?${client.user.id}>`);
	if(message.guild){
		if(!prefixs[message.guild.id]){
			prefixs[message.guild.id]={
				serv_pre:defaultPrefix,
			};
			prefix= message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : defaultPrefix;
		}
		else{
			prefix= message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : prefixs[message.guild.id].serv_pre;
		}
	}
	
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});


client.login(token);
