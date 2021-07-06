const discord = require('discord.js');
const fs = require('fs');
const { MessageButton } = require('discord-buttons');

module.exports = async (message) => {
    const { content, author, channel, guild, member, client } = message;
    const configPath = `./configs/${guild.id}.json`;
    const command = content.split(" ");
    const args = command.splice(1);
    const filter = (msg) => msg.author.id == author.id;


    let deleteMessages = [];

    let commandName = args[0];
    if (!commandName) {
        deleteMessages.push(await channel.send("Please enter a command name:"))

        let commandNameMessage = await channel.awaitMessages(filter, { max: 1 })
        deleteMessages.push(commandNameMessage.first());

        commandName = commandNameMessage.first().content.split(" ")[0];
    }

    commandName = commandName.toLowerCase();

    let config = JSON.parse(fs.readFileSync(configPath));

    if (!(commandName in config.commands)) return channel.send("This command doesn't exist.");
    if (config.commands[commandName].protected) return channel.send("This command cannot be deleted.")
    let confirmationEmbed = new discord.MessageEmbed();
    confirmationEmbed.setTitle(`Do you really want to delete \`${config.prefix}${commandName}\`?`);
    confirmationEmbed.addField("Response:", config.commands[commandName].response);

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
        delete config.commands[commandName];
        fs.writeFileSync(configPath, JSON.stringify(config));

        channel.send(`Deleted command \`${commandName}\`.`);
    } else {
        channel.send("Command deletion aborted.");
    }

    confirmMessage.delete()

}