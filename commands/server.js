const embeds = require("../embeds");
module.exports = {
    name: "server",
    aliases: [],
    description: "Displays info about the server.",
    run(message, args, db) {
        const { guild, channel } = message;

        const { name, region, memberCount, owner, afkTimeout } = guild;
        const icon = guild.iconURL();

        const embed = new Discord.MessageEmbed()
            .setTitle(`Server info for ${name}`)
            .setColor(colours["blue"])
            .setThumbnail(icon)
            .addFields(
                {
                    name: 'Region',
                    value: region,
                },
                {
                    name: 'Members',
                    value: memberCount,
                },
                {
                    name: 'Owner',
                    value: owner.user.tag,
                },
                {
                    name: 'AFK Timeout',
                    value: `${afkTimeout / 60} minutes`,
                }
            );
        channel.send(embed);
    }
}