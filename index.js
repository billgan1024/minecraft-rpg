Discord = require("discord.js");
const fs = require("fs");

const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

//note: prefix cannot be global anymore. It is instead fetched from the database because the prefix is now
//guild-dependent.
// prefix = config.prefix;
serverID = "420736857597542402";

colours = {
    "green" : "00d166",
    "red" : "f93a2f",
    "blue" : "0099e1",
    "primary" : "00c09a",
    "druid" : "4aedd9",
    "warrior" : "c6c6c6",
    "mage" : "eaee57",
    "archer" : "969696",
    "rogue" : "72482e"
}

pending = 0;
class_select = 1;

const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL }, restTimeOffset: 50 });
client.login(process.env.token);

counter = 0;
/*gameData holds key-value pairs (message, data)
message stores the reference to the message object, data = object representing game data
data = {
    players: [user, user] (user objects),
    health: [int, int],
    ready: [bool, bool],
    classes: [string, string],
    state: int,
    message: message (message object)
}*/
gameData = new Discord.Collection();
customEmojis = new Discord.Collection();

//emoji groups
weaponsEmojis = ["sword", "rod", "axe", "bow"];
classesEmojis = ["druid", "warrior", "mage", "archer", "rogue"];
miscEmojis = ["accept", "deny", "health", "ultimate"];

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
    const {content} = message;
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
                "prefix": ".",
                "duelReqDuration": 10,
            });
            prefix = ".";
            console.log("A new guild has been stored in the database.");
        }
    });
    if(!content.startsWith(prefix) || message.author.bot) return;
    const args = content.toLowerCase().replace(/\s+/g, " ").trim().split(" ");
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

//class stats
classStats = {
    "druid": { health: 1500, weapons: ["sword", "rod", "axe"] },
    "warrior": { health: 1400, weapons: ["sword", "rod", "axe"] },
    "mage": { health: 1250, weapons: ["sword", "rod", "axe"] },
    "archer": { health: 1200, weapons: ["sword", "axe", "bow"] },
    "rogue": { health: 1000, weapons: ["sword", "axe", "bow"] }
}

//class skills
classSkills = {
    "druid": {
        "sword": [{ name: "Skill 1", desc: "Desc 1" }, { name: "Skill 2", desc: "Desc 2" }],
        "rod": [{ name: "Skill 1", desc: "Desc 1" }, { name: "Skill 2", desc: "Desc 2" }],
        "axe": [{ name: "Skill 1", desc: "Desc 1" }, { name: "Skill 2", desc: "Desc 2" }],
    },
    "warrior": {
        "sword": [{ name: "Skill 1", desc: "Desc 1" }, { name: "Skill 2", desc: "Desc 2" }],
        "rod": [{ name: "Skill 1", desc: "Desc 1" }, { name: "Skill 2", desc: "Desc 2" }],
        "axe": [{ name: "Skill 1", desc: "Desc 1" }, { name: "Skill 2", desc: "Desc 2" }],
    },
    "mage": {
        "sword": [{ name: "Skill 1", desc: "Desc 1" }, { name: "Skill 2", desc: "Desc 2" }],
        "rod": [{ name: "Skill 1", desc: "Desc 1" }, { name: "Skill 2", desc: "Desc 2" }],
        "axe": [{ name: "Skill 1", desc: "Desc 1" }, { name: "Skill 2", desc: "Desc 2" }],
    },
    "archer": {
        "sword": [{ name: "Skill 1", desc: "Desc 1" }, { name: "Skill 2", desc: "Desc 2" }],
        "axe": [{ name: "Skill 1", desc: "Desc 1" }, { name: "Skill 2", desc: "Desc 2" }],
        "bow": [{ name: "Skill 1", desc: "Desc 1" }, { name: "Skill 2", desc: "Desc 2" }],
    },
    "rogue": {
        "sword": [{ name: "Skill 1", desc: "Desc 1" }, { name: "Skill 2", desc: "Desc 2" }],
        "axe": [{ name: "Skill 1", desc: "Desc 1" }, { name: "Skill 2", desc: "Desc 2" }],
        "bow": [{ name: "Skill 1", desc: "Desc 1" }, { name: "Skill 2", desc: "Desc 2" }],
    }
}

//weapon stats
weaponStats = {
    "sword": { damage: 80, type: "melee" },
    "rod": { damage: 65, type: "ranged" },
    "axe": { damage: 70, type: "melee" },
    "bow": { damage: 75, type: "ranged" }
}

//ultimates
ultimates = {
    "druid": { name: "Ultimate", desc: "Desc" },
    "warrior": { name: "Ultimate", desc: "Desc" },
    "mage": { name: "Ultimate", desc: "Desc" },
    "archer": { name: "Ultimate", desc: "Desc" },
    "rogue": { name: "Ultimate", desc: "Desc" }
}