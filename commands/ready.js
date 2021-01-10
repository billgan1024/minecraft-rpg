const embeds = require("../embeds");
module.exports = {
    name: "ready",
    aliases: ["r"],
    description: "Toggles ready status during class selection.",
    run(message, args, db) {
        const { member, channel } = message, tag = `<@${member.id}>`;
        //check all messages inside the channel
        const game = gameData.find(game => game.players.includes(member.user) && game.message.channel === channel);
        if(game)
        {
            const idx = game.players.indexOf(member.user);
            if(game.classes[idx] === "none") { channel.send(`${tag} Select a class before toggling ready status.`); return; }
            game.ready[idx] = !game.ready[idx];
            channel.send(game.ready[idx] ? `${tag} is ready.` : `${tag} is no longer ready.`);
            if(game.ready[0] && game.ready[1])
            {
                //proceed to skill selection
                game.state = skill_select;
                const tag1 = `<@${game.players[0].id}>`, tag2 = `<@${game.players[1].id}>`;
                channel.send(`<@${game.players[game.firstPlayer].id}> is going first.`);
                channel.send(embeds.skills(game.classes[game.firstPlayer]));
                //game.players[1].send(embeds.skills(game.classes[1]));
            }
        }
        else
        {
            channel.send(`${tag} You are not currently selecting a class.`);
        }
    }
}