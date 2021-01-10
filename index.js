Discord = require("discord.js");
const fs = require("fs");

const admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "minecraft-rpg-23867",
    "private_key_id": process.env.private_key_id,
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC3ep5KfzdEFWTw\ncGE/8/aO7uMcuIEH5Q+C+H4C6nqdlDP3L0dbDtFaZ0GwS2Ys9mpqko4170DjJ1IK\nqSlDNsiWBWt+U38Csh+AOHxUD+I/2yL4+/pSErwoD0mPCSr6/BiKGIGQIylA9PPB\nQNR08pXe4NiXXKU6wqUB8B9/dG878a8ZweLxTHNZ3BSnClDr3rGSiCyVJe4bAW8U\nTWPAw7PIiiYcPPKCRPQTgRygF6OyEONC4upsjlfesyx3t+DXBQrRHqsGWgcD26OG\nbmMp2qnPfQ4iqotmFXF7vh+8Aiz5nMLIbsIMilPrrnm1b0lelr6RrOAeCnD0qwEK\nGMWdTA+5AgMBAAECggEAJ6mLBEGh2cbiLhOtAh0jxFwhnjjIM8Oxabd7zfeQD/ZU\nkW+X9jgqy2cczRZPfRK7iFQsB76zgScj1gghUlVKYRvE0+cKwrNsmdQcFDPmzbT6\nR2Z5Azrnj6VWWmQ59U1/pIKNp3HiXhdVhgYUpz81ZJuoVngBg8VF1DhrJqstzIAg\neDKlkyAm4f3RgFPRydfClqmBcZqTr2Y+icgrmPjbNvl7FrS/PPjbA59A0CHsqh/Z\noXx/lc3/yLVH66JGQ04mju6b69Oco9bchW7ZLn+pwZPVHYsJUnTWrW9rkiLgFWPY\n9Lx5g6RDWsiOFCXk9LZ64mgxJBztSmnhE8FtIHGhMQKBgQD8SoREcmvAoWw4nKuj\nKUZItaEM2MRpM1Ef4SAIs2T/bNPPSWWyF8T1FDQ7dE/SlV6XXfmYhullZM+3rGyy\nADkTyPKuA8cYU+r3HYgEASZjn2Ex4HXqB/YeseKpgD7z4UV7wYMq8oyOdOslX/ZJ\nZ5y3keKydg8dvxSRKfZMuTsQ/QKBgQC6LSGUDh/2LH0rGEcveU+Y3iFA9wSrYHiQ\nZYaiLH8jGGNp/h8woLVyp989cshvVWQu/nE0zHGnRf1kxHWq89iZNcvEcUxcJe3i\nWAijw+AgN9msyBENePjCXeeDuMgwN8Qk2IbBE4/1gvrlzdan1/p8gvEOMMWKetRW\nJnRi639kbQKBgE7mvxbo8en8kevik4sjjWeP5h4ubL653dUqguo1sJBxaIybV8Kq\nzF4ZQ3yUk6I4NK0CJt0c1EFxlcTLl/LTPwaBAeSKKenh1MoT4kXeVjMx1SPUHwxi\nEQboewqnoQiEm0Zo7qyvzmV/C0tVB6FNViXS6iMF6RRUfgooJW85Ps/BAoGAIcec\nhxOFAxKRZ2dRSzDUm2T6XaI0K7AmT/TL19MBAmojZ5DfMeCG65W/8JNKAMFamxg5\njB3oJTSSxFzNCMaTr0DOhwcTlsie/+l/L8+Tc+UOTsZCKdKgOAv3vLOjRvRnV1Qe\nJxwYi7BHO7j8UJnkbgEIIc4BmZ2tty/lACnAhIUCgYBwolQGXS7DA8pGQ+LSwIL0\nFOQeq4U4JlOwzQYJ6AxNosbEtwYKXknvGn65R3o+dtO9TMQeRGKmMFkoRon2+Cgq\nJq0wHhPatMHokozKYM3NMkkqZvg8VQxeIRKd8svagLQCqh8/cKmCHuqFYavmIZZq\nRMHJeqNV76w/5t7BJJk/ag==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-r0h4c@minecraft-rpg-23867.iam.gserviceaccount.com",
    "client_id": "112605383321392124569",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-r0h4c%40minecraft-rpg-23867.iam.gserviceaccount.com"
})
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
skill_select = 2;

const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL }, restTimeOffset: 50 });
client.login(process.env.token);

counter = 0;

/*gameData holds key-value pairs (playerID, map(messageID, list of games))
game = {
    opponent: user object
    isFirst: bool
    ready: bool
    class: string
    state: string
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
    //console.log(guild.emojis.cache);
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
        "prefix": ".",
        "duelReqDuration": 10
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
    event(client);
}

client.on("message", async message => {
    if(message.channel.type !== "text" || message.author.bot) return;
    const { content } = message; let prefix = "";
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
    if(!content.startsWith(prefix)) return;
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