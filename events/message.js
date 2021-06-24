module.exports = {
    client: null,
    setup: async (c) => {
        this.client = c;
    },
    run: async (message) => {
        const { author, member, guild, channel, content, cleanContent } = message;
        console.log(`${guild.name} | #${channel.name} | ${author.username}: ${cleanContent}`);
    }
}