const embeds = require("../embeds");
module.exports = (client) => {
    client.on("messageReactionAdd", (reaction, user) => {
        //reaction.message.channel.send(embeds.duelAccept("e", "z"));
        //reaction.message.channel.send("A reactionw as added");
    });
}