const Commander = require('./stuff/commander')
const Spotify = require('./stuff/spotify')
const { SlashCommandBuilder } = require('@discordjs/builders')
let spotify = new Spotify()
const { COMMON } = require('./config')
const commander = new Commander()
const players = new Map()
const bans = new Map()
let volume = true
Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h)
    return this
}

function tryPlayer(player, maxEntity) {
    let pl
    if(!players.has(player)){
        players.set(player, [ new Date  () ])
        return true
    }
    pl = players.get(player)
    const passed = (new Date()).addHours(-1)
    const nbPlayed = pl.filter(el => el > passed).length
    if(nbPlayed >= maxEntity){
        return false
    }
    else {
        pl.push(new Date())
        players.set(player, pl)
        return true
    }
}

const addMusicCommand = new SlashCommandBuilder()
	.setName('addmusic')
	.setDescription('Add a music to playback queue')
	.addStringOption(option =>
		option.setName('url')
			.setDescription('URL')
			.setRequired(true))

commander.subscribe(addMusicCommand, async (interaction) => {
    const link = interaction.options._hoistedOptions.shift().value
    if(bans.has(`<@!${interaction.user.id}>`)){
        interaction.reply('I remember you, you are a piece of shit! Now, please cry in silence. You will be banned forever.')
        return
    }

    if(tryPlayer(spotify.parseInput(link), 1) === true){
        if(tryPlayer(interaction.user.id, COMMON.MAX_PER_HOUR) === true || COMMON.ADMINS.includes(interaction.user.id)){
            spotify.addSongToQueue(link).then(res => {
                interaction.reply("https://open.spotify.com/track/" + res + " will be played later. <3")
                spotify.addSongToPlaylist(link).catch(() => {})
            }).catch((e) => {
                interaction.reply('Unable to find this song on Spotify.')
            })
        } else {
            interaction.reply('You can add at most ' + COMMON.MAX_PER_HOUR + ' musics per hour. why are you trying to exploit me?')
        }
    } else {
        interaction.reply('This song was already played in past hour, fucking retard.')
    }
})

const setVol = new SlashCommandBuilder()
	.setName('setvolume')
	.setDescription('Change volume of music in rooms')
	.addStringOption(option =>
		option.setName('volume')
			.setDescription('Number only. Don\'t try it little shit. I can break you if I want.')
			.setRequired(true))

commander.subscribe(setVol, async (interaction) => {
    if(bans.has(`<!@${interaction.user.id}>`)){
        interaction.reply('I remember you, you are a piece of shit, and now, please cry in silence. You will be banned forever.')
        return
    }
    if(volume === false && !COMMON.ADMINS.includes(interaction.user.id)){
        interaction.reply('This command is disabled.')
        return
    }

    spotify.setVolume(Number(interaction.options._hoistedOptions.shift().value)).then(res => {
        interaction.reply("It's oke )")
        return
    }).catch(() => {
        interaction.reply('Unable to change volume to this level. We are not going to break another amplifier today.')
    })
})

const banUser = new SlashCommandBuilder()
	.setName('banuser')
	.setDescription('Ban a retarded user from spotify bot')
	.addStringOption(option =>
		option.setName('user')
			.setDescription('User to ban.')
			.setRequired(true))

commander.subscribe(banUser, async (interaction) => {
    if(!COMMON.ADMINS.includes(interaction.user.id)){
        interaction.reply('Are you fucking retarded ? You are not my daddy. Now go fuck yourself with a banana. <3')
        return
    }

    const usr = interaction.options._hoistedOptions.shift()
    if(!usr.value.match(/<@![0-9]{18}>/g)){
        interaction.reply('It\'s not a user. It\'s a generic fucking idiot.')
        return
    }
    if(!bans.has(usr.value)){
        bans.set(usr.value, true)
        interaction.reply('It\'s ok bro\', this retard is now banned. now go slap him IRL. UwU')
    } else {
        interaction.reply('This biatch was already banned. Dumbass...')
    }
})

const swVol = new SlashCommandBuilder()
	.setName('swvol')
	.setDescription('Switch volume')

commander.subscribe(swVol, async (interaction) => {
    if(!COMMON.ADMINS.includes(interaction.user.id)){
        interaction.reply('Are you fucking retarded ? You are not my daddy. Now go fuck yourself with a banana. <3')
        return
    }

    if(volume === true){
        volume = false
        interaction.reply('Volume command is now disabled.')
    } else {
        volume = true
        interaction.reply('Volume command is now enabled.')
    }
})

const setToken = new SlashCommandBuilder()
	.setName('settoken')
	.setDescription('Change token')
    .addStringOption(option =>
		option.setName('token')
			.setDescription('Token spotify')
			.setRequired(true))

commander.subscribe(setToken, async (interaction) => {
    if(!COMMON.ADMINS.includes(interaction.user.id)){
        interaction.reply('Are you fucking retarded ? You are not my daddy. Now go fuck yourself with a banana. <3')
        return
    }

    spotify.setToken(interaction.options._hoistedOptions.shift().value)
    interaction.reply('Good')

})


const unbanUser = new SlashCommandBuilder()
	.setName('unbanuser')
	.setDescription('Unban someone from spotify bot')
	.addStringOption(option =>
		option.setName('user')
			.setDescription('User to unban.')
			.setRequired(true))

commander.subscribe(unbanUser, async (interaction) => {
    if(!COMMON.ADMINS.includes(interaction.user.id)){
        interaction.reply('Are you fucking retarded ? You are not my daddy. Now go fuck yourself with a banana. <3')
        return
    }

    const usr = interaction.options._hoistedOptions.shift()
    if(!usr.value.match(/<@![0-9]{18}>/g)){
        interaction.reply('It\'s not a user. But you, for sure, you are a brainless master.')
        return
    }
    if(!bans.has(usr.value)){
        interaction.reply('This user is not a retard for the time being. asshole.')
    } else {
        bans.delete(usr.value)
        interaction.reply('This biatch is now unbanned. That fucking piece of shit.')
    }
})

const clearUser = new SlashCommandBuilder()
	.setName('clearuser')
	.setDescription('Clear user history from spotify bot')
	.addStringOption(option =>
		option.setName('user')
			.setDescription('User to clear.')
			.setRequired(true))

commander.subscribe(clearUser, async (interaction) => {
    if(!COMMON.ADMINS.includes(interaction.user.id)){
        interaction.reply('Are you fucking retarded ? You are not my daddy. Now go fuck yourself with a banana. <3')
        return
    }

    const usr = interaction.options._hoistedOptions.shift()
    if(!usr.value.match(/<@![0-9]{18}>/g)){
        interaction.reply('It\'s not a user. But you, for sure, you are a brainless master.')
        return
    }
    const usrId = usr.value.split("!").pop().replace(">", "")
    if(!players.has(usrId)){
        interaction.reply('This user is not in history. asshole.')
    } else {
        players.delete(usrId)
        interaction.reply('This biatch is now cleared. That fucking piece of shit.')
    }
})

subscribeCommands = [
    addMusicCommand, 
    setVol,
    banUser,
    unbanUser,
    swVol,
    clearUser,
    setToken
]

commander.register(subscribeCommands)