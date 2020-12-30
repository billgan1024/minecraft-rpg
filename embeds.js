module.exports = {
    duelPending(tag1, tag2)
    {
        const embed = new Discord.MessageEmbed()
            .setColor(primary)
            .setTitle("Duel")
            .setDescription(`${tag1} has requested to duel ${tag2}!
            \n${tag2} has 10 seconds to accept or decline by reacting to this message.`);
        return embed;
    },
    duelExpired(tag1, tag2)
    {
        const embed = new Discord.MessageEmbed()
            .setTitle("Duel")
            .setDescription(`The duel request from ${tag1} to ${tag2} has expired.`);
        return embed;
    },
    duelAccept(tag1, tag2)
    {
        const embed = new Discord.MessageEmbed()
            .setColor(green)
            .setTitle("Duel")
            .setDescription(`${tag2} accepted ${tag1}'s duel.`);
        return embed;
    },
    duelDeny(tag1, tag2)
    {
        const embed = new Discord.MessageEmbed()
            .setColor(red)
            .setTitle("Duel")
            .setDescription(`${tag2} denied ${tag1}'s duel.`);
        return embed;
    },
    classSelect(tag1, tag2, name1, name2, game)
    {
        const className1 = game.classes[0][0].toUpperCase() + game.classes[0].substring(1);
        const className2 = game.classes[1][0].toUpperCase() + game.classes[1].substring(1);
        const stat1 = classStats[game.classes[0]], stat2 = classStats[game.classes[1]];
        const classEmoji1 = customEmojis.get(game.classes[0]), classEmoji2 = customEmojis.get(game.classes[1]);
        const heart = customEmojis.get("heart");
        console.log(stat1);
        const weaponsEmoji1 = stat1 ? stat1.weapons.map(weapon =>
            customEmojis.get(weapon).toString()).join(" ") : "";
        const weaponsEmoji2 = stat2 ? stat2.weapons.map(weapon =>
            customEmojis.get(weapon).toString()).join(" ") : "";

        const embed = new Discord.MessageEmbed()
            .setColor(primary)
            .setTitle("Class Selection")
            .setDescription(`${tag1}, ${tag2}, react below to choose your class.\nWhen you are done, type "${prefix}ready".`);
            if(classEmoji1) embed.addField(`${name1}`, `${classEmoji1} ${className1}\n${heart} ${game.health[0]}\n${weaponsEmoji1}`, true);
            else embed.addField(`${name1}`, "No class selected", true);
            if(classEmoji2) embed.addField(`${name2}`, `${classEmoji2} ${className2}\n${heart} ${game.health[1]}\n${weaponsEmoji2}`, true);
            else embed.addField(`${name2}`, "No class selected", true);
        return embed;
    },
    classSelectReact(message)
    {
        message.react(customEmojis.get("druid"));
        message.react(customEmojis.get("warrior"));
        message.react(customEmojis.get("mage"));
        message.react(customEmojis.get("archer"));
        message.react(customEmojis.get("rogue"));
    },
    help()
    {
        const embed = new Discord.MessageEmbed().setColor(blue).setTitle("Commands List");
        for(const c of commands)
        {
            const command = c[1];
            embed.addField(command.name, command.description, false);
        }
        return embed;
    }
}

