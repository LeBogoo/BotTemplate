const fs = require('fs');

module.exports = {
    client: null,
    setup: async (c) => {
        this.client = c;
    },
    run: async (guild) => {
        fs.copyFileSync("./configs/default.json", `./configs/${guild.id}.json`);
    }
}