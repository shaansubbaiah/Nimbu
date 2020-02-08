const { prefixs,servers,client } = require('../data.js');
const Discord = require('discord.js');
module.exports={
    name: 'prefix',
	description: 'Change the prefix for the server.',
    usage: '<new prefix>',
	execute(message,args) {
        if(message.guild.id){
        let before_prefix=prefixs[message.guild.id].serv_pre;    
        prefixs[message.guild.id].serv_pre=args[0];
        message.channel.send(`Prefix changed from \'${before_prefix}\' to \' ${args[0]} \'`);
        }
    },
};