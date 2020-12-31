Discord = require("discord.js");
const fs = require("fs");
require("dotenv/config");

const firebase = require("firebase/app");
const FieldValue = require("firebase-admin").firestore.FieldValue;
const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

//note: prefix cannot be global anymore. It is instead fetched from the database because the prefix is now
//guild-dependent.
// prefix = config.prefix;

green = "00d166";
red = "f93a2f";
blue = "0099e1";
primary = "00c09a";

pending = 0;
class_select = 1;

const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL }, restTimeOffset: 50 });
client.login(process.env.token);
//client.login(token);

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

client.once("ready", async () => {
    console.log("Bot started.");
    const guild = await client.guilds.fetch(serverID);
    addEmojis(guild, weaponsEmojis); addEmojis(guild, classesEmojis); addEmojis(guild, miscEmojis);
    //console.log(customEmojis);
});

client.on("guildCreate", async guild => {
    db.collection("guilds").doc(guild.id).set({
        "id": guild.id,
        "name": guild.name,
        "owner": guild.owner.user.username,
        "ownerID": guild.owner.id,
        "memberCount": guild.memberCount,
        "prefix": "."
    });
    console.log("a new guild has appeared");
});

commands = new Discord.Collection();
dbCommands = new Discord.Collection();

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

client.on("message", async message => {
    if(message.channel.type !== "text") return;
    let prefix = "";
    await db.collection("guilds").doc(message.guild.id).get().then(results => {
        if (results.exists)
        {
            prefix = results.data().prefix;
        }
        else
        {
            const { guild } = message;
            db.collection("guilds").doc(guild.id).set({
                "id": guild.id,
                "name": guild.name,
                "owner": guild.owner.user.username,
                "ownerID": guild.owner.id,
                "memberCount": guild.memberCount,
                "prefix": "."
            });
            prefix = ".";
            console.log("A new guild has been stored in the database.");
        }
    });
    const args = message.content.toLowerCase().replace(/\s+/g, " ").trim().split(" ");
    if(!args[0].startsWith(prefix) || message.author.bot) return;
    const cmd = args.shift().slice(prefix.length);
    console.log(`${message.author.username} ran command "${cmd}" with arguments "${args}".`);
    for(const c of commands)
    {
        const command = c[1];
        if(cmd === command.name || command.aliases.includes(cmd))
        {
            command.run(message, args, db);
            break;
        }
    }
});

function addEmojis(guild, emojiNames) {
    emojiNames.forEach(name => customEmojis.set(name, guild.emojis.cache.find(emoji => emoji.name === name)));
}