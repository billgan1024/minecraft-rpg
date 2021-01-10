const embeds = require("../embeds");
module.exports = {
    name: "help",
    aliases: [],
    description: "Sends the list of commands.",
    run(message, args, db) {
    const { member, channel } = message, tag = `<@${member.id}>`;
        channel.send(tag);
        channel.send(embeds.help());
    }
}