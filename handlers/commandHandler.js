const fs = require('fs');
const disrequire = require('disrequire');

module.exports = async (message) => {
    const { author, member, guild, channel, content, cleanContent } = message;
    if (!guild) return;
    const configPath = `./configs/${guild.id}.json`;
    if (!fs.existsSync(configPath)) return;

    const config = JSON.parse(fs.readFileSync(configPath));
    if (!cleanContent.startsWith(config.prefix)) return;

    let command = cleanContent.replace(config.prefix, '').split(' ');
    let args = command.splice(1);

    if (!(command in config.commands)) return channel.send(`Command \`${command}\` doesn't exist.`);
    let cmd = config.commands[command];
    let allowed = cmd.roles.length == 0;
    if (!allowed) {
        let memberRoles = [];
        for (let role of member.roles.cache.array()) memberRoles.push(role.id);
        for (let role of cmd.roles) { if (memberRoles.includes(role)) allowed = true; break; }
    }

    if (member.hasPermission("ADMINISTRATOR")) allowed = true;

    if (!allowed) return channel.send(`You don't have permission to use this command.`);
    if ('response' in cmd) return channel.send(cmd.response);

    await require(`../scripts/${cmd.script}`)(message)
    disrequire(`../scripts/${cmd.script}`);
}