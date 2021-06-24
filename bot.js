const Discord = require('discord.js');
require('dotenv').config();


const client = new Discord.Client();


client.login(process.env.TOKEN);