module.exports = {
    name: "debug",
    aliases: [],
    description: `Debug command`,
    run(message, args, db) {
        for(const [val, key] in customEmojis)
        {
            console.log(val);
        }
        //customEmojis.forEach((val, key) => console.log(key));
        /*message.channel.messages.fetch().then(results => {
            console.log(results);
        })*/
    }
}