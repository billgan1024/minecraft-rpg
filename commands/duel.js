const embeds = require("../embeds");
module.exports = {
    name: "duel",
    aliases: [],
    description: "Challenges a player to a duel.\n**accept** - Accepts a duel request.\n**deny** - Denies a duel request.",
    async run(message, args, db) {
        const { member, mentions, channel, guild } = message, tag1 = `<@${member.id}>`;
        const target = mentions.users.first();
        if (target && !target.bot) {
            const tag2 = `<@${target.id}>`;
            if(target.id === member.id) { channel.send(`${tag1} You cannot duel yourself.`); return; }
            const games1 = gameData.get(member.id);
            const games2 = gameData.get(target.id);
            if(games1)
            {
                const game = games1.find(game => game.message.channel === channel);
                if(game)
                {
                    if(game.state === "pending") channel.send(`${tag1} You already have an active duel request.`);
                    else channel.send(`${tag1} You cannot duel players while in game.`);
                    return;
                }
            }
            if(games2)
            {
                const game = games2.find(game => game.message.channel === channel);
                if(game)
                {
                    if(game.state === "pending") channel.send(`${tag1} You already have an active duel request.`);
                    else channel.send(`${tag1} You cannot duel players while in game.`);
                    return;
                }
            }
            let duration = 10;
            await db.collection("guilds").doc(guild.id).get().then(results => {
                if (results.exists) duration = results.data().duelReqDuration;
            })
            //console.log(target);
            channel.send(embeds.duelPending(tag1, tag2, duration)).then(duelMessage => {
                if (!gameData.get(member.id)) gameData.set(member.id, new Discord.Collection());
                if (!gameData.get(target.id)) gameData.set(target.id, new Discord.Collection());
                const games1 = gameData.get(member.id), games2 = gameData.get(target.id);
                games1.set(duelMessage.id, {
                    opponent: target.id,
                    sent: true,
                    ready: false,
                    class: "none",
                    state: "pending",
                    message: duelMessage
                });
                games2.set(duelMessage.id, {
                    opponent: member.id,
                    sent: false,
                    ready: false,
                    class: "none",
                    state: "pending",
                    channelID: channel.id,
                    message: duelMessage
                });
                console.log(gameData);
                duelMessage.react(customEmojis.get("accept"));
                duelMessage.react(customEmojis.get("deny"));

                setTimeout(() => {
                    if (games1.get(duelMessage.id).state === "pending") {
                        games1.delete(duelMessage.id);
                        games2.delete(duelMessage.id);
                        console.log(gameData);
                        duelMessage.edit(embeds.duelExpired(tag1, tag2));
                    }
                }, duration * 1000);
            });
        } else {
            channel.send(`${tag1} Invalid player specified.`);
        }
    }
}