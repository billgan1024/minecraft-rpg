const embeds = require("../embeds");
module.exports = (client) => {
    client.on("messageReactionAdd", async (reaction, user) => {
        if(user.bot || message.channel.type !== "text") return;
        const { message, channel } = reaction, emojiName = reaction.emoji.name;
        const games = gameData.get(user.id);
        if(games)
        {
            const game = games.get(message.id);
            if(game && game.state === "pending" && !game.sent)
            {
                const tag1 = `<@${user.id}>`, tag2 = `<@${game.opponent}>`;
                if (emojiName === "accept") {
                    game.message.edit(embeds.duelAccept(tag1, tag2));
                    channel.send(embeds.classSelect(tag1, tag2, game.players[0].username, game.players[1].username, game)).then(msg => {
                        game.state = "class-select"; process.env
                    });
                }
                else if(emojiName === "deny")
                {
                    game.message.edit(embeds.duelDeny(tag1, tag2));
                    games.delete(message.id); gameData.get(game.opponent).delete(message.id);
                    console.log(gameData);
                }
            }
        }
        /*const tag1 = `<@${game.players[0].id}>`, tag2 = `<@${game.players[1].id}>`;
        if(user === game.players[1]) {
            if (reaction.emoji.name === "accept") {
                //gameData.set(message.id, game);

                message.edit(embeds.duelAccept(tag1, tag2));
                message.reactions.removeAll();
                channel.send(embeds.classSelect(tag1, tag2, game.players[0].username, game.players[1].username, game)).then(msg => {
                    game.state = class_select;
                    game.message = msg;
                    embeds.classSelectReact(msg);
                    gameData.set(msg.id, game);
                    gameData.delete(message.id);
                })
            } else if (reaction.emoji.name === "deny") {
                gameData.delete(message.id);
                message.edit(embeds.duelDeny(tag1, tag2));
                message.reactions.removeAll();
            }
        }*/
    });
}

