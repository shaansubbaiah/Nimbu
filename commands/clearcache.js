const fs = require('fs-extra');
const { adminId } = require('../config.json');

module.exports = {
	name: 'clearcache',
	description: 'Deletes temporary folder containing downloads',
	cooldown: 5,
	args: false,
	usage: '!clearcache',
	execute(message) {
		// delete entire tmp folder
		if (message.author.id === adminId){
            fs.remove("./tmp", (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
            message.channel.send("Cleared Cache!");
        }
        else {
            message.channel.send("You are not authorized to use this command. Contact the Bot's Admin!");
        }
	},
};