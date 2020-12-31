const embeds = require("../embeds");
module.exports = (client) => {
    client.on("messageReactionAdd", (reaction, user) => {
        const { message } = reaction;
        if(user.bot || message.channel.type !== "text") return;
        const game = gameData.get(message.id);
        if(game && game.state === class_select)
        {
            const idx = game.players.indexOf(user.id);
            if(idx !== -1 && classesEmojis.includes(reaction.emoji.name))
            {
                const tag1 = `<@${game.players[0]}>`, tag2 = `<@${game.players[1]}>`;
                game.classes[idx] = reaction.emoji.name;
                game.health[idx] = classStats[reaction.emoji.name].health;
                message.edit(embeds.classSelect(tag1, tag2, game.names[0], game.names[1], game));
            }
        }
    });
}