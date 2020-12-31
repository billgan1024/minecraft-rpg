module.exports = {
    name: "setprefix",
    aliases: [],
    description: "Sets the prefix used by the bot.",
    async run(message, args, db)
    {
        const { member } = message, tag1 = `<@${member.id}>`;
        if(!member.hasPermission("ADMINISTRATOR"))
        {
            message.channel.send(`${tag1} You do not have permission to run this command.`); return;
        }
        if(args.length !== 1)
        {
            message.channel.send(`${tag1} Invalid prefix specified.`);
        }
        else
        {
            db.collection("guilds").doc(message.guild.id).update({
                "prefix": args[0]
            }).then(() => {
                message.channel.send(`${tag1} Prefix successfully updated.`);
            });
        }
    }
}