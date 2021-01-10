module.exports = {
    duelPending(tag1, tag2, duration)
    {
        const embed = new Discord.MessageEmbed()
            .setColor(colours["primary"])
            .setTitle("Duel")
            .setDescription(`${tag1} has requested to duel ${tag2}!
            \n${tag2} has ${duration} seconds to accept or decline by reacting to this message.`);
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
            .setColor(colours["green"])
            .setTitle("Duel")
            .setDescription(`${tag1} accepted ${tag2}'s duel.`);
        return embed;
    },
    duelDeny(tag1, tag2)
    {
        const embed = new Discord.MessageEmbed()
            .setColor(colours["red"])
            .setTitle("Duel")
            .setDescription(`${tag1} denied ${tag2}'s duel.`);
        return embed;
    },
    classSelect(tag1, tag2, name1, name2, game)
    {
        const className1 = cap(game.classes[0]), className2 = cap(game.classes[1]);
        const stat1 = classStats[game.classes[0]], stat2 = classStats[game.classes[1]];
        const classEmoji1 = customEmojis.get(game.classes[0]), classEmoji2 = customEmojis.get(game.classes[1]);
        const health = customEmojis.get("health");
        const weaponsEmoji1 = stat1 ? stat1.weapons.map(weapon =>
            customEmojis.get(weapon).toString()).join(" ") : "";
        const weaponsEmoji2 = stat2 ? stat2.weapons.map(weapon =>
            customEmojis.get(weapon).toString()).join(" ") : "";

        const embed = new Discord.MessageEmbed()
            .setColor(colours["primary"])
            .setTitle("Class Selection")
            .setDescription(`${tag1}, ${tag2}, react below to choose your class.\nWhen you are done, use the "ready" command.`);
            if(classEmoji1) embed.addField(`${name1}`, `${classEmoji1} ${className1}\n${health} ${game.health[0]}\n${weaponsEmoji1}`, true);
            else embed.addField(`${name1}`, "No class selected", true);
            if(classEmoji2) embed.addField(`${name2}`, `${classEmoji2} ${className2}\n${health} ${game.health[1]}\n${weaponsEmoji2}`, true);
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
        const embed = new Discord.MessageEmbed().setColor(colours["blue"]).setTitle("Commands List");
        for(const c of commands)
        {
            const command = c[1];
            embed.addField(command.name, command.description, false);
        }
        return embed;
    },
    skillSelect(tag1, tag2)
    {
        const embed = new Discord.MessageEmbed().setColor(colours["primary"]).setTitle("Skill Selection")
            .setDescription(`${tag1}, ${tag2}, check your DMs to select your skills.\nWhen you are done, return to this channel.`);
        return embed;
    },
    skills(className)
    {
        const embed = new Discord.MessageEmbed()
            .setTitle("Skill Selection")
            .setColor(colours[className])
            .setDescription(cap(className))
            .setFooter(`Select your skills for each weapon by reacting to this message.`);
        for(const weapon in classSkills[className])
        {
            const emoji = customEmojis.get(weapon);
            embed.addField(`${emoji} ${cap(weapon)}`, `**Base damage:** ${weaponStats[weapon].damage}\n**Type:** ${cap(weaponStats[weapon].type)}`, false);
            for(const skill of classSkills[className][weapon])
            {
                embed.addField(skill.name, skill.desc, true);
            }
        }
        const emoji = customEmojis.get("ultimate");
        embed.addField(`${emoji} Ultimate`, `**${ultimates[className].name}**\n${ultimates[className].desc}`);
        return embed;
    }
}

function cap(s) { return s[0].toUpperCase() + s.substring(1); }
