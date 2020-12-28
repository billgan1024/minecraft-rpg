const embeds = require("../embeds");
module.exports = {
    name: "duel",
    aliases: [],
    description: `${prefix}duel @[player] - Challenges a player to a duel.`,
    run(message, args) {
        const accept = ["accept", "yes", "y"], deny = ["deny", "no"];
        if(args.length === 1)
        {
            if(accept.includes(args[0]))
            {

                return;
            }
            else if(deny.includes(args[0]))
            {
                return;
            }
        }
        if(message.channel.type === "text") {
            const { member, mentions } = message, tag1 = `<@${member.id}>`;
            const target = mentions.users.first();
            if (target) {
                const tag2 = `<@${target.id}>`;
                if(target.id === member.id) { message.channel.send(`${tag1} You cannot duel yourself.`); return; }
                const game1 = gameData.find(game => game.players.includes(member.id));
                const game2 = gameData.find(game => game.players.includes(target.id));
                if(game1)
                {
                    if(game1.state === "pending") message.channel.send(`${tag1} You already have an active duel request.`);
                    else message.channel.send(`${tag1} You cannot duel players while in game.`);
                    return;
                }
                if(game2)
                {
                    if(game2.state === "pending") message.channel.send(`${tag1} This player already has an active duel request.`);
                    else message.channel.send(`${tag1} This player is already in game.`);
                    return;
                }
                //console.log(target);
                message.channel.send(embeds.duelPending(tag1, tag2)).then(message => {
                    gameData.set(message.id, {
                        players: [member.id, target.id],
                        health: [0, 0],
                        class: ["none", "none"],
                        state: "pending"
                    });
                    console.log(gameData);

                    message.react(customEmojis.get("accept"));
                    message.react(customEmojis.get("deny"));

                    setTimeout(() => {
                        const game = gameData.get(message.id);
                        if(game && game.state === "pending") {
                            gameData.delete(message.id);
                            console.log(gameData);
                            const duelExpired = new Discord.MessageEmbed()
                                .setTitle("Duel")
                                .setDescription(`The duel request from ${tag1} to ${tag2} has expired.`);
                            message.edit(duelExpired);
                            message.reactions.removeAll();
                        }
                    }, 10000);
                })
            } else {
                message.channel.send(`${tag1} Invalid player specified.`);
            }
        }
    }
}