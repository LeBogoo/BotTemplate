const Discord = require('discord.js');
const fs = require('fs');
require('dotenv').config();


const client = new Discord.Client();
require('discord-buttons')(client);

const events = fs.readdirSync('./events');
for (let event of events) {
    let eventname = event.replace('.js', '');
    event = require(`./events/${event}`);
    event.setup(client);
    client.on(eventname, event.run);
}

client.login(process.env.TOKEN);