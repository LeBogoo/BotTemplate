const fs = require('fs');

module.exports = (message) => {
    const { author, member, guild, channel, content, cleanContent } = message;
    channel.send("addcommand command")

}