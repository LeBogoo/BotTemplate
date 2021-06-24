const fs = require('fs');

module.exports = {
    client: null,
    setup: async (c) => {
        this.client = c;
    },
    run: async (guild) => {
        if (fs.existsSync(`./configs/${guild.id}.json`)) fs.unlinkSync(`./configs/${guild.id}.json`);
    }
}