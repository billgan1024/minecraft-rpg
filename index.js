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

pending = 0;
class_select = 1;

const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL }, restTimeOffset: 50 });
client.login(token);

counter = 0;
gameData = new Discord.Collection();;
customEmojis = new Discord.Collection();

//class stats
classStats = {
    "druid": { health: 1500, weapons: ["sword", "rod", "axe"] },
    "warrior": { health: 1400, weapons: ["sword", "rod", "axe"] },
    "mage": { health: 1250, weapons: ["sword", "rod", "axe"] },
    "archer": { health: 1200, weapons: ["sword", "axe", "bow"] },
    "rogue": { health: 1000, weapons: ["sword", "axe", "bow"] }
}

//class skills


//emoji groups
weaponsEmojis = ["sword", "rod", "axe", "bow"];
classesEmojis = ["druid", "warrior", "mage", "archer", "rogue"];
miscEmojis = ["accept", "deny", "heart"];
const welcome = require('./welcome')
client.once("ready", async () => {
    console.log("Bot started.");
    const guild = await client.guilds.fetch(serverID);
    /*await mongo().then((mongoose) => {
        try {
            mongoose.set("useFindAndModify", false);
            console.log("Connected to mongo!");
        } finally {
            mongoose.connection.close();
        }
    })*/
    addEmojis(guild, weaponsEmojis); addEmojis(guild, classesEmojis); addEmojis(guild, miscEmojis);
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
    event(client); console.log(file);
}

client.on("message", message => {
    const args = message.content.toLowerCase().replace(/\s+/g, " ").trim().split(" ");
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

function addEmojis(guild, emojiNames) {
    emojiNames.forEach(name => customEmojis.set(name, guild.emojis.cache.find(emoji => emoji.name === name)));
}