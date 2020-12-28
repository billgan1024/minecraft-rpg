Discord = require("discord.js");
const fs = require("fs");
const config = require("./config.json");
const mongo = require("./mongo");
prefix = config.prefix; token = config.token;

serverID = "420736857597542402";
channelID = "790267535210577941";
userID = "195263520344899584";
botID = "792401061667012628";
debug = false;

green = "00d166";
red = "f93a2f";
blue = "0099e1";
primary = "00c09a";

const client = new Discord.Client({restTimeOffset: 50});
client.login(token);

counter = 0;
gameData = new Discord.Collection();;
customEmojis = new Discord.Collection();

client.once("ready", async () => {
    console.log("Bot started.");
    await mongo().then((mongoose) => {
        try {
            console.log("Connected to mongo!");
        } finally {
            mongoose.connection.close();
        }
    })
    addEmojis(["sword", "rod", "axe", "bow", "druid", "warrior", "mage", "archer", "rogue", "accept", "deny"]);
    //console.log(customEmojis);
});

commands = new Discord.Collection();
events = new Discord.Collection();

const commandFiles = fs.readdirSync("./commands");
const eventFiles = fs.readdirSync("./events");

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
}

for(const file of eventFiles) {
    const event = require(`./events/${file}`);
    event(client);
}

client.on("message", message => {
    const args = message.content.replace(/\s+/g, " ").trim().split(" ");
    if(!args[0].startsWith(prefix) || message.author.bot) return;
    const cmd = args.shift().slice(prefix.length);
    console.log(`${message.author.username} ran command "${cmd}" with arguments "${args}".`);
    for(const c of commands)
    {
        const command = c[1];
        if(cmd === command.name || command.aliases.includes(cmd))
        {
            command.run(message, args);
            break;
        }
    }
});

async function addEmojis(emojiNames) {
    const guild = await client.guilds.fetch(serverID);
    emojiNames.forEach(name => customEmojis.set(name, guild.emojis.cache.find(emoji => emoji.name === name)));
}