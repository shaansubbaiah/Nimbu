module.exports = {
	name: 'template',
	description: 'Contains template command',
	cooldown: 5,
	aliases: ['blueprint'],
	args: false,
	usage: '!template',
	execute(message) {
		// function goes here
		message.channel.send('YAH YAH YAH');
	},
};
