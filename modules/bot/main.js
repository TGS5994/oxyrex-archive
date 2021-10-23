// Import everything.
const Discord = require("discord.js");
const config = require("./botConfig.json");
const util = require("./util.js");
global.operatingSystem = require("os");
// Create the bot.
const bot = new Discord.Client();
bot.database = require("./database.js");
// When our bot is online, we set it's activity.
bot.on("ready", async function() {
    bot.user.setActivity(`for commands (${config.prefix}prefix)`, {
        type: "WATCHING"
    });
    // Now we log that we started up in our logs channel.
    bot.active = true;
    util.log(bot, "status", "Discord bot active.");
});
// We use folders for our commands so that it is all simple and split up.
let commands = {};
for (let command of [
    "ping",
    "players",
    "bots",
    "say",
    "claim",
    "achievements",
    "cip",
    "kick",
    "ban",
    "unban",
    "eval",
    "incogeval",
    "exit",
    "update"
]) {
    let module = require(`./commands/${command}.js`);
    commands[command.toLowerCase()] = module;
}
commands.help = (function() {
    let fields = [];
    for (let name in commands) {
        let command = commands[name];
        fields.push({
            name: name,
            value: `Description: **${command.description}**\nUsage: \`${`${config.prefix}${global.fingerPrint.prefix} ${command.usage}`}\``
        });
    }
    return {
        run: function(bot, message, args) {
            const embed = new Discord.MessageEmbed().setTitle("Help:").setColor(0xDD0000).addFields(...fields).setDescription("Here is a list of all commands that are usable:");
            message.channel.send(embed);
        },
        description: "Lists commands.",
        usage: config.prefix + global.fingerPrint.prefix + " help"
    }
})();
const whitelistedChannels = [
    "874395524894187531", // Bot Commands
    "876435248903229532" // Beta Tester Chat
];
async function messageEvent(message) {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return util.error(message, "You cannot use commands in a DM channel!");
    if (message.guild.id === "874377758007001099" && !whitelistedChannels.includes(message.channel.id) && message.content.startsWith(config.prefix)) return util.error(message, `Please go to <#874395524894187531> to use commands.`);
    if (util.checkPermissions(message) === -1) return util.error(message, "You are blacklisted from using the bot.");
    if (message.content === config.prefix + "prefix") return util.info(message, `The prefix for the ${global.fingerPrint.prefix} server is \`${config.prefix + global.fingerPrint.prefix}\`. Run \`${config.prefix + global.fingerPrint.prefix} help\` for more commands.`)
    if (!message.content.startsWith(config.prefix + global.fingerPrint.prefix + " ")) return;
    message.content = message.content.replace(config.prefix + global.fingerPrint.prefix + " ", "");
    let args = message.content.split(" ");
    let command = args.shift().toLowerCase();
    if (commands[command]) return commands[command].run(bot, message, args);
    util.error(message, "That command doesn't exist!");
};
bot.on("message", messageEvent);
bot.on("error", console.log);
bot.logRecord = function(data) {
    const channel = bot.channels.cache.get("895793977868058674");
    console.log(channel);
    for (const channel of ["895793977868058674", "884601275092729946"].map(id => bot.channels.cache.get(id))) {
        if (channel) {
            const embed = new Discord.MessageEmbed()
                .setTitle("A possible record has been auto validated")
                .setColor(0xDD0000)
                .setDescription(`Mode: **${c.gameModeName}**`)
                .addFields({
                    name: "Player Name",
                    value: data.name
                }, {
                    name: "Player Discord",
                    value: (data.discordID != null) ? `<@!${data.discordID}>` : "N/A"
                }, {
                    name: "Final Score",
                    value: global.util.formatLargeNumber(data.score)
                }, {
                    name: "Tank",
                    value: data.tank
                }, {
                    name: "Total Kills round(Kills + (Assists / 2) + (Bosses * 2)",
                    value: Math.round(data.kills + (data.assists / 2) + (data.bosses * 2))
                }, {
                    name: "Kills",
                    value: data.kills
                }, {
                    name: "Assists",
                    value: data.assists
                }, {
                    name: "Bosses",
                    value: data.bosses
                }, {
                    name: "Time Alive",
                    value: global.util.timeForHumans(data.timeAlive)
                })
                .setFooter("Powered by Discord.js :moan_daddy:", "https://i.imgur.com/wSTFkRM.png");
            channel.send(embed);
        }
    }
}
bot.login(config.token);
bot.util = util;
bot.config = config;
module.exports = {
    bot
};
