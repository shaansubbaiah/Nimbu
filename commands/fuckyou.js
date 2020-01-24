module.exports = {
	name: 'fuckyou',
	description: 'Swearing',
    cooldown: 5,
    aliases: ['FUCKYOU', 'fuck'],
	execute(message) {
		message.channel.send('hehe.');
	},
};
