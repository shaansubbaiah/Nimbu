const { servers } = require('../data.js');

module.exports = {
	name: 'volume',
	description: '',
	usage: '<frac value between 0 and 1>',
	execute(message, args) {
		const server = servers[message.guild.id];
		const vol = args[0];
		if (!isNaN(vol) && vol >= 0 && vol <= 1) {
			server.dispatcher.setVolume(vol);
			message.channel.send(`Volume set to ${vol * 100}%`)
				.then(msg => {
					msg.delete(1500);
				})
				.catch(console.error);
		}
		else {
			message.channel.send('Enter a value between 0 and 1')
				.then(msg => {
					msg.delete(1500);
				})
				.catch(console.error);
		}
	},
};
