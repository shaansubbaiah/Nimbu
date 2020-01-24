const Discord = require('discord.js');
module.exports = {
	name: 'data',
	description: 'servers array ',
	args: true,
	servers:{},
	client: new Discord.Client(),
};
