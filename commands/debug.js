module.exports = {
    name: "debug",
    aliases: [],
    description: `Debug command`,
    run(message, args) {
        message.channel.send("Sent debug messages to console.");
        console.log(gameData);
    }
}