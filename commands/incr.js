module.exports = {
    name: "incr",
    aliases: [],
    description: "Increases the counter by 1.",
    run(message, args) {
        if(message.channel.type === "text") {
            counter++;
            message.channel.send(`The counter is now ${counter}.`);
        }
    }
}