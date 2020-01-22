module.exports = {
	name: 'test',
	description: 'Prints test msg',
	execute(message, args) {
		message.channel.send('12');
	},
};