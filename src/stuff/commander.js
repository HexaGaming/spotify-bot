const Client    = require('./client')
module.exports = class Commander {
    _handlers = new Map()

    constructor(){
        this.client = new Client()
        this.bot = this.client.getInstance()
    }

    /**
     * Throw if args are invalid
     * @private
     */
    _checkArgs (eventName) { // 
        if ( typeof eventName !== "string" ) {
            throw new Error('le param event doit être un string')
        }
    }

    register (commands) { // 
        this.client.updateCommands(commands)
    }
    /**
     * Return a promise resolved by using the command
     * args[command: string]
     * @public
     */
    subscribe(command, callcack){
        if (this._handlers.has(command.name)) {
            throw new Error('Commande déjà enregistrée.')
        } else {
            this._checkArgs(command.name)
            this._handlers.set(command.name, callcack)
            this.bot.on('interactionCreate', async interaction => {
                if (!interaction.isCommand()) return
                
                if (interaction.commandName === command.name) {
                    this._handlers.get(command.name)(interaction)
                }
            })
            return
        }
    }

}

