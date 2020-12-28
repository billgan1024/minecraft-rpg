module.exports = {
    duelPending(tag1, tag2)
    {
        const embed = new Discord.MessageEmbed()
            .setColor("00c09a")
            .setTitle("Duel")
            .setDescription(`${tag1} has requested to duel ${tag2}!
            \n${tag2} has 10 seconds to accept or decline by reacting to this message.`);
        return embed;
    },
    duelAccept(tag1, tag2)
    {
        const embed = new Discord.MessageEmbed()
            .setColor(green)
            .setTitle("Duel")
            .setDescription(`${tag1} accepted ${tag2}'s duel.`);
        return embed;
    },
    duelDeny(tag1, tag2)
    {
        const embed = new Discord.MessageEmbed()
            .setColor(red)
            .setTitle("Duel")
            .setDescription(`${tag1} denied ${tag2}'s duel.`);
        return embed;
    },
    classSelect(tag1, tag2)
    {
        const embed = new Discord.MessageEmbed()
            .setColor(primary)
            .setTitle("Class Selection")
            .setDescription(`${tag1}, ${tag2}, react below or type "${prefix}class [name]" to select your class.`);
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

