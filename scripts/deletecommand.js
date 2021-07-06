const discord = require('discord.js');
const fs = require('fs');
const { MessageButton } = require('discord-buttons');

module.exports = async (message) => {
    const { content, author, channel, guild, member, client } = message;
    const configPath = `./configs/${guild.id}.json`;


    let deleteMessages = [];

    let command = content.split(" ");
    let args = command.splice(1);


    let config = JSON.parse(fs.readFileSync(configPath));

    if (!(args[0] in config.commands)) return channel.send("This command doesn't exist.");
    if (config.commands[args[0]].protected) return channel.send("This command cannot be deleted.")
    let confirmationEmbed = new discord.MessageEmbed();
    confirmationEmbed.setTitle(`Do you really want to delete \`${config.prefix}${args[0]}\`?`);
    confirmationEmbed.addField("Response:", config.commands[args[0]].response);

    for (let msg of deleteMessages) msg.delete();

    let yes = new MessageButton()
        .setStyle('green')
        .setLabel("Yes")
        .setID(guild.id + "_deletecommand_yes");

    let no = new MessageButton()
        .setStyle('red')
        .setLabel("No")
        .setID(guild.id + "_deletecommand_no");

    let confirmMessage = await channel.send({ embed: confirmationEmbed, buttons: [yes, no] })

    const collector = await confirmMessage.awaitButtons(() => true, { maxButtons: 1 });
    await collector.first().reply.defer(true)

    if (collector.first().id == guild.id + "_deletecommand_yes") {
        delete config.commands[args[0]];
        fs.writeFileSync(configPath, JSON.stringify(config));

        channel.send(`Deleted command \`${args[0]}\`.`);
    } else {
        channel.send("Command deletion aborted.");
    }

    confirmMessage.delete()

}