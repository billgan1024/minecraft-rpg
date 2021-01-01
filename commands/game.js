const embeds = require("../embeds");
module.exports = {
    name: "game",
    aliases: [],
    description: "Starts the testing level.",
    run(message, args, db) {
        const { member, mentions, channel } = message, tag1 = `<@${member.id}>`;
        const target = mentions.users.first();
    }
}