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
            if(game.classes[idx] === "none") { message.channel.send(`${tag} Select a class before toggling ready status.`); return; }
            game.ready[idx] = !game.ready[idx];
            message.channel.send(game.ready[idx] ? `${tag} is ready.` : `${tag} is no longer ready.`);
            if(game.ready[0] && game.ready[1])
            {
                //proceed to skill selection
                const tag1 = `<@${game.players[0].id}>`, tag2 = `<@${game.players[1].id}>`;
                message.channel.send(embeds.skillSelect(tag1, tag2));
                game.players[0].send(`${tag1}`);
                game.players[0].send(embeds.skills(game.classes[0]));
                game.players[1].send(`${tag2}`);
                game.players[1].send(embeds.skills(game.classes[1]));
            }
        }
        else
        {
            message.channel.send(`${tag} You are not currently selecting a class.`);
        }
    }
}