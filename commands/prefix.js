module.exports = {
    name: "prefix",
    aliases: [],
    description: "Sets the prefix used by the bot. (Admin required)",
    async run(message, args, db)
    {
        const { member, channel } = message, tag1 = `<@${member.id}>`;
        if(!member.hasPermission("ADMINISTRATOR"))
        {
            channel.send(`${tag1} You do not have permission to run this command.`); return;
        }
        if(args.length !== 1)
        {
            channel.send(`${tag1} Invalid prefix specified.`);
        }
        else
        {
            db.collection("guilds").doc(message.guild.id).update({
                "prefix": args[0]
            }).then(() => {
                channel.send(`${tag1} Prefix successfully updated.`);
            });
        }
    }
}