const embeds = require("../embeds");
module.exports = {
    name: "ready",
    aliases: ["r"],
    description: "Toggles ready status during class selection",
    run(message, args) {
        if (message.channel.type !== "text") return;
    }
}