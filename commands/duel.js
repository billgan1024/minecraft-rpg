const embeds = require("../embeds");
module.exports = {
    name: "duel",
    aliases: [],
    description: "Challenges a player to a duel.",
    run(message, args, db) {
        const { member, mentions, channel } = message, tag1 = `<@${member.id}>`;
        const target = mentions.users.first();
        if (target) {
            const tag2 = `<@${target.id}>`;
            if(target.id === member.id) { channel.send(`${tag1} You cannot duel yourself.`); return; }
            const game1 = gameData.find(game => game.players.includes(member.user) && game.message.channel === channel);
            const game2 = gameData.find(game => game.players.includes(target) && game.message.channel === channel);
            if(game1)
            {
                if(game1.state === pending) channel.send(`${tag1} You already have an active duel request.`);
                else channel.send(`${tag1} You cannot duel players while in game.`);
                return;
            }
            if(game2)
            {
                if(game2.state === pending) channel.send(`${tag1} This player already has an active duel request.`);
                else channel.send(`${tag1} This player is already in game.`);
                return;
            }
            //console.log(target);
            channel.send(embeds.duelPending(tag1, tag2)).then(duelMessage => {
                gameData.set(duelMessage.id, {
                    players: [member.user, target],
                    health: [0, 0],
                    ready: [false, false],
                    classes: ["none", "none"],
                    state: pending,
                    message: duelMessage,
                    skillMessage: [[], []],
                    skills: [{}, {}]
                });
                console.log(gameData);

                duelMessage.react(customEmojis.get("accept"));
                duelMessage.react(customEmojis.get("deny"));

                setTimeout(() => {
                    const game = gameData.get(duelMessage.id);
                    if(game && game.state === pending) {
                        gameData.delete(duelMessage.id);
                        console.log(gameData);
                        duelMessage.edit(embeds.duelExpired(tag1, tag2));
                        duelMessage.reactions.removeAll();
                    }
                }, 10000);
            })
        } else {
            channel.send(`${tag1} Invalid player specified.`);
        }
    }
}