const ytdl = require('ytdl-core');
const yts = require('yt-search');
const { prefixs, servers } = require('../data.js');
const { embedColor } = require('../config.json');
const Discord = require('discord.js');
const fs = require('fs-extra');
const ffmpeg = require('fluent-ffmpeg');

module.exports = {
	name: 'download',
	aliases: ['dl'],
	description: 'Download a song in mp3 format..',
	usage: '<youtube link> or <search term>',
	args: true,
	cooldown: 2,
	execute(message, args) {
		const prefix=prefixs[message.guild.id].serv_pre;

		function downloadFile() {

			const server = servers[message.guild.id];

			message.channel.send(`Downloading ${server.dlQueue[0].title}. This may take a while.`);

			// generate random 4 digit number
			// in case same song is downloaded from different servers,
			// to prevent deletion of the song before it gets uploaded on each server
			const rndm = Math.floor(Math.random() * Math.floor(1234));
			const dlTitle = server.dlQueue[0].title + rndm;

			// create /tmp firectory if not already present
			const DownloadPath = './tmp';
			fs.ensureDir(DownloadPath, err => {
				console.log(err);
			});

			// download path of flv, mp3 files
			const flvPath = `./tmp/${dlTitle}.flv`;
			const mp3Path = `./tmp/${dlTitle}.mp3`;


			const convertToMp3 = () => {
				ffmpeg(flvPath)
					.toFormat('mp3')
					.save(mp3Path)
					.on('error', function(err) {
						console.log('An error occurred: ' + err.message);
					})
					.on('end', function() {
						const downloadEmbed = new Discord.RichEmbed()
							.setColor(embedColor)
							.setAuthor('| Download MP3', server.dlQueue[0].authorthumb)
							.setDescription('```yaml\n' + server.dlQueue[0].title + '```')
							.setThumbnail(server.dlQueue[0].thumb)
							.setTimestamp()
							.setFooter('(' + server.dlQueue[0].timestamp + ')')
							.attachFile(mp3Path);

						message.channel.send(downloadEmbed)
							.then(() => {
								// delete flv and mp3 files
								[flvPath, mp3Path].forEach(path => {
									fs.unlink(path, (err) => {
										if (err) {
											console.error(err);
											return;
										}
									});
								});
							})
							.catch(console.error);
					});
			};


			ytdl(server.dlQueue[0].url, { quality: 'highestaudio', highWaterMark: 1 << 25 })
				.on('error', console.error)
				// save to flvPath
				.on('end', function() {
					convertToMp3();
				})
				.pipe(fs.createWriteStream(flvPath));
		}
		// end of play()

		function queueSong(songUrl) {

			yts(songUrl, function(err, s) {
				if(err) throw err;

				// first result only
				const info = s.videos[0];

				const song = {
					title: info.title,
					url: info.url,
					timestamp: info.timestamp,
					seconds: info.seconds,
					// use info.thumbnail for lower res image
					thumb: info.image,
					// song requester's thumbnail
					authorthumb: message.author.displayAvatarURL,
				};

				server.dlQueue.push(song);

				downloadFile();


			});

			server.dlQueue.shift();

		}
		// end of queueSong()

		if(!args[0]) {
			message.channel.send('Enter a youtube link/ search term!');
			return;
		}

		if(!servers[message.guild.id]) {
			servers[message.guild.id] = {
				dlQueue:[],
			};
		}

		const server = servers[message.guild.id];

		// if youtube url entered
		let link = args[0];
		const timeRegex = /(\?t|\&t|&start)=(\S*)/gm;
		if(link.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm)) {
			// remove timestamp in url
			link = link.replace(timeRegex, '');
			queueSong(link);
		}

		// if search term provided
		else {
			// store search results
			const res = [];
			let vidlist = '', srchMsgId;
			yts(args.join(' '), function(err, r) {
				if (err) throw err;
				// top 5 results
				const videos = r.videos.slice(0, 5);

				let i = 0;
				videos.forEach(function(v) {
					res[i] = v.title;
					vidlist += `${i + 1}. ${ v.title } (${ v.timestamp }) \n`;
					i++;
				});

				vidlist += `eg. **${prefix}1** to play first result`;

				message.channel.send(vidlist)
					.then(sent => {srchMsgId = sent.id;})
					.catch(console.error);

				vidlist = '';
			});


			// to get selected option
			const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { max: 1 });
			collector.on('collect', choice => {
				if (!choice.content.startsWith(prefix) || choice.author.bot) return;

				const chargs = choice.content.slice([prefix.length]).split(/ +/);

				const n = parseInt(chargs[0]);

				// exit if not a number or arguments provided
				if(isNaN(n) || chargs[1]) return;

				if((n >= 1) && (n <= 5)) {

					if(!servers[choice.guild.id]) {
						servers[choice.guild.id] = {
							dlQueue:[],
						};
					}

					queueSong(res[n - 1]);

					// remove search result message
					message.channel.fetchMessage(srchMsgId).then(msg => {
						msg.delete();
					});
				}

				else {choice.channel.send('Enter an integer between 1-5.');}
			});
		}
	},
};