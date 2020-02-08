![nimbu discord bot logo](https://github.com/shaansubbaiah/Nimbu/raw/master/extra/nimbu-github-template.png)

## Music bot for Discord

Nimbu lets you stream or download audio. Features a command handler, queuing system and various playback commands.

## Get Nimbu

 1. Clone the github repository.
 2. Open `config.json` and edit the `token`, `default_prefix` and `invite link`.
 3. Run: `npm install` and `node index.js` to get the bot running.


> You can create a bot and get a token at the [Discord Developer
> Portal](https://discordapp.com/developers/applications/)

## Add or Delete Commands
Using the command handler, it is very easy to add or remove commands.
- To remove a command just delete the associated javascript file from the commands/ directory.
- To add a command, duplicate the command/template.js file and add the function within the execute function.

		execute(message) {
			// function goes here
		}
- `Name`, `description`, `usage`, `arguments required`, `aliases` and `cooldown duration` can be set within the command file. 

**By default Nimbu uses the `!` prefix for commands. 
Sending `!help` in Discord will give you a list of its commands and its description.**

## Playing Music 
Play music by supplying a `youtube link` or `search query`.

eg. `!play Kendrick Lamar - HUMBLE` 

or `!play https://www.youtube.com/watch?v=tvTRZJ-4EyI`

**Nimbu adds songs to the playback queue and lets you `pause`, `resume`, `skip` or `stop` the song.
You can adjust the volume using the `!vol` or `!volume` command.**

## Downloading Music 
You can download music using Nimbu by sending the `!download` command.
You can supply a `youtube link` or `search query`.

eg. `!download Kendrick Lamar - HUMBLE` 

or `!download https://www.youtube.com/watch?v=tvTRZJ-4EyI`

**Nimbu uses `ytdl` download the song in `flv` to /tmp and uses `ffmpeg` to transcode the audio to `mp3`**

## Extra 
Change the prefix from within Discord using the `!prefix` command. This lets different servers have independent prefixes. 

To generate an invite link to add the bot, users can use the `!invite` command.

