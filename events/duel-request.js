const embeds = require("../embeds");
module.exports = (client) => {
    client.on("messageReactionAdd", (reaction, user) => {
        if(user.bot) return;
        const { message } = reaction, game = gameData.get(message.id);
        if(game && game.state === "pending")
        {
            const tag1 = `<@${game.players[0]}>`, tag2 = `<@${game.players[1]}>`;
            if(user.id === game.players[1]) {
                if (reaction.emoji.name === "accept") {
                    game.state = "class-select";
                    gameData.set(message.id, game);

                    message.edit(embeds.duelAccept(tag1, tag2));
                    message.reactions.removeAll();
                    message.channel.send(embeds.classSelect(tag1, tag2)).then(msg => {
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

