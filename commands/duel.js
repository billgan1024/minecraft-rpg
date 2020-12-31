const embeds = require("../embeds");
module.exports = {
    name: "duel",
    aliases: [],
    description: "Challenges a player to a duel.",
    run(message, args, db) {
        const { member, mentions } = message, tag1 = `<@${member.id}>`;
        const target = mentions.users.first();
        if (target) {
            const tag2 = `<@${target.id}>`;
            if(target.id === member.id) { message.channel.send(`${tag1} You cannot duel yourself.`); return; }
            const game1 = gameData.find(game => game.players.includes(member.id));
            const game2 = gameData.find(game => game.players.includes(target.id));
            if(game1)
            {
                if(game1.state === pending) message.channel.send(`${tag1} You already have an active duel request.`);
                else message.channel.send(`${tag1} You cannot duel players while in game.`);
                return;
            }
            if(game2)
            {
                if(game2.state === pending) message.channel.send(`${tag1} This player already has an active duel request.`);
                else message.channel.send(`${tag1} This player is already in game.`);
                return;
            }
            //console.log(target);
            message.channel.send(embeds.duelPending(tag1, tag2)).then(async message => {
                let name = ["", ""];
                await message.client.users.fetch(member.id).then(user => {
                    name[0] = user.username;
                });
                await message.client.users.fetch(target.id).then(user => {
                    name[1] = user.username;
                });
                gameData.set(message.id, {
                    players: [member.id, target.id],
                    health: [0, 0],
                    names: name,
                    classes: ["none", "none"],
                    state: pending
                });
                console.log(gameData);

                message.react(customEmojis.get("accept"));
                message.react(customEmojis.get("deny"));

                setTimeout(() => {
                    const game = gameData.get(message.id);
                    if(game && game.state === pending) {
                        gameData.delete(message.id);
                        console.log(gameData);;
                        message.edit(embeds.duelExpired(tag1, tag2));
                        message.reactions.removeAll();
                    }
                }, 10000);
            })
        } else {
            message.channel.send(`${tag1} Invalid player specified.`);
        }
    }
}