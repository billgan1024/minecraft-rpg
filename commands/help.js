const embeds = require("../embeds");
module.exports = {
    name: "help",
    aliases: [],
    description: "Sends the list of commands.",
    run(message, args, db) {
    const { author } = message, tag = `<@${author.id}>`;
        author.send(embeds.help()).then(msg => {
            message.channel.send(`${tag} The list of commands has been sent to your DMs.`);
        }).catch(e => {
            message.channel.send(`${tag} The message could not be sent to your DMs. Make sure you are allowing direct messages from server members.`);
        });
    }
}