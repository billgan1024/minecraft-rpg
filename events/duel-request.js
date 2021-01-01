const embeds = require("../embeds");
module.exports = (client) => {
    client.on("messageReactionAdd", async (reaction, user) => {
        const { message } = reaction;
        if(user.bot || message.channel.type !== "text") return;
        const game = gameData.get(message.id);
        if(game && game.state === pending)
        {
            const tag1 = `<@${game.players[0].id}>`, tag2 = `<@${game.players[1].id}>`;
            if(user === game.players[1]) {
                if (reaction.emoji.name === "accept") {
                    //gameData.set(message.id, game);

                    message.edit(embeds.duelAccept(tag1, tag2));
                    message.reactions.removeAll();
                    message.channel.send(embeds.classSelect(tag1, tag2, game.players[0].username, game.players[1].username, game)).then(msg => {
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
            }
        }
    });
}

