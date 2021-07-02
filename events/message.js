const commandHandler = require('../handlers/commandHandler.js');

module.exports = {
    client: null,
    setup: async (c) => {
        this.client = c;
    },
    run: async (message) => {
        const { author, member, guild, channel, content, cleanContent } = message;
        if (guild) {
            console.log(`${guild.name} | #${channel.name} | ${author.username}: ${cleanContent}`);
        } else {
            console.log(`PRIVATE | ${author.username}: ${cleanContent}`);
        }
        commandHandler(message);
    }
}