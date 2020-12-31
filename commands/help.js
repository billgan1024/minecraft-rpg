const embeds = require("../embeds");
module.exports = {
    name: "help",
    aliases: [],
    description: "Sends the list of commands.",
    run(message, args, db) {
    const { author } = message, tag = `<@${author.id}>`;
        message.channel.send(`${tag} The list of commands has been sent to your DMs.`);
        author.send(embeds.help());
    }
}