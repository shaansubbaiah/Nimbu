module.exports = {
	name: 'test',
	description: 'Prints test msg',
	execute(message, args) {
		message.channel.send('Test Ok.' + args[0]);
	},
};