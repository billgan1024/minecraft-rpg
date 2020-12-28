const embeds = require("../embeds");
module.exports = {
    name: "help",
    aliases: [],
    description: "Sends the list of commands.",
    run(message, args) {
    const { author } = message, tag = `<@${author.id}>`;
        message.channel.send(`${tag}`);
        message.channel.send(embeds.help());
    }
}