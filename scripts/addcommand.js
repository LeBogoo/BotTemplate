const Discord = require('discord.js');
const fs = require('fs');
const { MessageButton } = require('discord-buttons');

module.exports = async (message) => {
    const { content, author, channel, guild, member, client } = message;
    const configPath = `./configs/${guild.id}.json`;
    const filter = (msg) => msg.author.id == author.id;
    const invokedCommand = content.split(" ");
    const args = invokedCommand.splice(1);

    let newCommand = {
        response: "",
        roles: [],
        protected: false
    }

    let deleteMessages = [];
    let commandName = args[0];
    if (!commandName) {
        deleteMessages.push(await channel.send("Please enter a command name:"))

        let commandNameMessage = await channel.awaitMessages(filter, { max: 1 })
        deleteMessages.push(commandNameMessage.first());

        commandName = commandNameMessage.first().content.split(" ")[0];
        if (commandName.length > 1999) return channel.send("Command cannot be longer than 2000 characters.");
    }

    commandName = commandName.toLowerCase();

    let config = JSON.parse(fs.readFileSync(configPath));
    if (commandName in config.commands) return channel.send("Commmand already exists.");

    deleteMessages.push(await channel.send("What should the bot reply with?"))

    let botReplyMessage = await channel.awaitMessages(filter, { max: 1 })
    deleteMessages.push(botReplyMessage.first());

    let botReply = botReplyMessage.first().content;

    if (botReply.length > 1999) return channel.send("Bot reply cannot be longer than 2000 characters.");
    newCommand.response = botReply;

    deleteMessages.push(await channel.send("Which roles should be able to use the command? (`-` for all roles)\n\nExample: `@role1 @role2`"))

    let allowedRolesMessage = await channel.awaitMessages(filter, { max: 1 })
    deleteMessages.push(allowedRolesMessage.first());

    let allowedRoles = allowedRolesMessage.first().mentions.roles.array();

    let confirmationEmbed = new Discord.MessageEmbed();
    confirmationEmbed.setTitle(`Please confirm to create the command.`)
    confirmationEmbed.addField("Command name:", commandName);

    let confirmRoles = '';

    for (let role of allowedRoles) {
        confirmRoles += `<@&${role.id}>\n`;
        newCommand.roles.push(role.id);
    }

    if (allowedRoles.length == 0) {
        newCommand.roles = []
        confirmRoles += `All`;
    }
    confirmationEmbed.addField("Allowed roles:", confirmRoles);
    confirmationEmbed.addField("Bot response:", botReply);

    for (let msg of deleteMessages) msg.delete();

    let yes = new MessageButton()
        .setStyle('green')
        .setLabel("Yes")
        .setID(`${guild.id}_addcommand_yes`);

    let no = new MessageButton()
        .setStyle('red')
        .setLabel("No")
        .setID(guild.id + `${guild.id}_addcommand_no`);

    let confirmMessage = await channel.send({ embed: confirmationEmbed, buttons: [yes, no] })

    const collector = await confirmMessage.awaitButtons(() => true, { maxButtons: 1 });
    await collector.first().reply.defer(true);

    if (collector.first().id == `${guild.id}_addcommand_yes`) {
        config.commands[commandName] = newCommand;
        fs.writeFileSync(configPath, JSON.stringify(config));
        channel.send(`Created command \`${commandName}\`.`);
    } else {
        channel.send("Command creation aborted.");
    }

    confirmMessage.delete()
}