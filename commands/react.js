module.exports = {
    name: "react",
    aliases: [],
    description: "Shows all custom emojis used by Info Index by reacting to your message.",
    run(message, args, db) {
        customEmojis.forEach(emoji => {
            message.react(emoji);
        });
    }
}