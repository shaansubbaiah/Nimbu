module.exports = {
	name: 'source',
	description: 'Linked to Nimbu\'s Github',
	cooldown: 1,
	args: false,
	execute(message) {
		message.channel.send('https://github.com/shaansubbaiah/Nimbu');
	},
};
