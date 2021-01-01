module.exports = {
    name: "debug",
    aliases: [],
    description: `Debug command`,
    run(message, args, db) {
        const {member} = message;
        console.log(member.user.id, member.id);
        //for(const key of customEmojis.keyArray()) console.log(key);
        //customEmojis.forEach((val, key) => console.log(key));
        /*message.channel.messages.fetch().then(results => {
            console.log(results);
        })*/
    }
}