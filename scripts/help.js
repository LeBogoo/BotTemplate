const fs = require('fs');
const Discord = require('discord.js');

module.exports = (message) => {
    const { author, member, guild, channel, content, cleanContent } = message;
    const config = JSON.parse(fs.readFileSync(`./configs/${guild.id}.json`));
    const commands = config.commands;
    var helpEmbed = new Discord.MessageEmbed();
    helpEmbed.setTitle(`${guild.name} - Commands`)
    var roles = member.roles.cache.array();
    var description = "";

    Object.keys(commands).forEach(commandName => {
        const command = commands[commandName];
        if (command.roles.length == 0) return description += `${config.prefix}${commandName}\n`;
        let allowed = member.hasPermission("ADMINISTRATOR");
        command.roles.forEach(role => {
            if (allowed) return;
            console.log(role);
        })
        if (allowed) {
            let args = "";
            if ("args" in command) {
                args = command.args.join(" ");
            }
            description += `${config.prefix}${commandName} ${args}\n`;
        }
    })
    helpEmbed.setDescription(description);
    channel.send(helpEmbed);
}