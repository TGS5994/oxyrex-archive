// Import everything.
const Discord = require("discord.js");
const config = require("./botConfig.json");
const util = require("./util.js");
global.operatingSystem = require("os");
// Create the bot.
const bot = new Discord.Client();
// When our bot is online, we set it's activity.
bot.on("ready", async function() {
    bot.user.setActivity(`for commands (${config.prefix})`, {
        type: "WATCHING"
    });
    // Now we log that we started up in our logs channel.
    util.log(bot, "status", "Discord bot active.");
});
// We use folders for our commands so that it is all simple and split up.
let commands = {};
for (let command of [
    "players",
    "bots",
    "claim",
    "kick",
    "ban",
    "unban",
    "eval",
    "incogeval",
    "exit"
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
            value: `Description: **${command.description}**\nUsage: \`${config.prefix + command.usage}\``
        });
    }
    return {
        run: function(bot, message, args) {
            const embed = new Discord.MessageEmbed().setTitle("Help:").setColor(0xDD0000).addFields(...fields).setDescription("Here is a list of all commands that are usable:");
            message.channel.send(embed);
        },
        description: "Lists commands.",
        usage: config.prefix + "help"
    }
})();
async function messageEvent(message) {
    if (!message.content.startsWith(config.prefix)) return;
    if (message.author.bot) return;
    if (message.channel.type === "dm") return util.error(message, "You cannot use commands in a DM channel!");
    if (util.checkPermissions(message) === -1) return util.error(message, "You are blacklisted from using the bot.");
    let args = message.content.split(" ");
    let command = args.shift().slice(config.prefix.length).toLowerCase();
    if (commands[command]) return commands[command].run(bot, message, args);
    util.error(message, "That command doesn't exist!");
};
bot.on("message", messageEvent);
bot.on("error", console.log);
bot.login(config.token);
bot.util = util;
module.exports = {
    bot
};
