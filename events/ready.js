module.exports = {
    client: null,
    setup: async (c) => {
        this.client = c;
    },
    run: async () => {
        console.log(`${this.client.user.username} is now ready!`);
        console.log(`Invite: https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=bot`);
    }
}