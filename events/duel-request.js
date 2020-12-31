const embeds = require("../embeds");
module.exports = (client) => {
    client.on("messageReactionAdd", async (reaction, user) => {
        const { message } = reaction;
        if(user.bot || message.channel.type !== "text") return;
        const game = gameData.get(message.id);
        if(game && game.state === pending)
        {
            const tag1 = `<@${game.players[0]}>`, tag2 = `<@${game.players[1]}>`;
            if(user.id === game.players[1]) {
                if (reaction.emoji.name === "accept") {
                    game.state = class_select;
                    //gameData.set(message.id, game);

                    message.edit(embeds.duelAccept(tag1, tag2));
                    message.reactions.removeAll();
                    message.channel.send(embeds.classSelect(tag1, tag2, game.names[0], game.names[1], game)).then(msg => {
                        embeds.classSelectReact(msg);
                        gameData.set(msg.id, game);
                        gameData.delete(message.id);
                    })
                } else if (reaction.emoji.name === "deny") {
                    gameData.delete(message.id);
                    message.edit(embeds.duelDeny(tag1, tag2));
                    message.reactions.removeAll();
                }
            }
        }
    });
}

