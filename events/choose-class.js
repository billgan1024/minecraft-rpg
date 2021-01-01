const embeds = require("../embeds");
module.exports = (client) => {
    client.on("messageReactionAdd", (reaction, user) => {
        const { message } = reaction;
        if(user.bot || message.channel.type !== "text") return;
        const game = gameData.get(message.id);
        if(game && game.state === class_select)
        {
            const idx = game.players.indexOf(user);
            if(idx !== -1 && classesEmojis.includes(reaction.emoji.name) && !game.ready[idx])
            {
                const tag1 = `<@${game.players[0].id}>`, tag2 = `<@${game.players[1].id}>`;
                game.classes[idx] = reaction.emoji.name;
                game.health[idx] = classStats[reaction.emoji.name].health;
                message.edit(embeds.classSelect(tag1, tag2, game.players[0].username, game.players[1].username, game));
            }
        }
    });
}