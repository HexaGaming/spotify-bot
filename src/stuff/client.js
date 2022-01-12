const { Client, Intents } = require('discord.js'),
    { DISCORD } = require('../config')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

module.exports = class ClientDiscord {
    instance
    constructor(){
        this.rest = new REST({ version: '9' }).setToken(DISCORD.TOKEN)

    }
 
    _createInstance () {
        
        let object = new Client({ intents: [ "DIRECT_MESSAGES"] })
        object.on('ready', () => {
            console.log(`Logged in as ${object.user.tag}!`)
            object.on('messageCreate', async msg => {
                console.log(msg)
            })
        })
        
        object.login(DISCORD.TOKEN)
        return object
        
    }

    async updateCommands (commands) {
        try {
            console.log('Started refreshing application (/) commands.')
            DISCORD.GUILD_IDS.forEach(async element => {
                await this.rest.put(
                    Routes.applicationGuildCommands(DISCORD.CLIENT_ID, element),
                    { body: commands },
                ) 
            });

        
            console.log('Successfully reloaded application (/) commands.')
        } catch (error) {
            console.error(error)
        }
    }
 
    getInstance () {
        if (!this.instance) {
            this.instance = this._createInstance()
        }
        return this.instance
    }
}