// Import everything.
const Discord = require("discord.js");
const config = require("../botConfig.json");
const util = require("../util.js");

const prizes = [{
    role: "904376763612807219",
    requirement: "Trick-Or-Treat",
    searchName: "trick-or-treat"
}, {
    role: "895830766305562668",
    requirement: "Millionare",
    searchName: "competent"
}, {
    role: "895830357679689738",
    requirement: "Dang this guy is serious",
    searchName: "skillful"
}, {
    role: "895830022231822336",
    requirement: "Wtf dude.... How much time do you have?",
    searchName: "professional"
}, {
    role: "924036949319233566",
    requirement: "Winter Rush",
    searchName: "happy holidays"
}];

module.exports = {
    run: function(bot, message, args) {
        const request = args.join(" ").toLowerCase().replace("!", "");
        if (request === "list") {
            util.info(message, "Here are the prize roles and their required achievement!\n" + prizes.map(entry => `**<@&${entry.role}>** - ${entry.requirement}`).join("\n"));
            return;
        }
        const prize = prizes.find(entry => entry.searchName === request);
        if (!prize) return util.error(message, "Cannot find that prize! Please put the name of the prize role, properly typed out. If you need to, use `" + `${config.prefix}${global.fingerPrint.prefix} prize list` + "` to see the prizes.");
        bot.database.load(bot, config.logs.achievementDatabase).then(data => {
            data = data.filter(function filter(entry) {
                return entry.content.id === message.author.id;
            }).map(entry => entry.content.achievement).map(instance => instance.split("|||")[0]);
            if (!data.includes(prize.requirement)) return util.error(message, "You need to get the corresponding achievement first! `" + prize.requirement + "`");
            message.member.roles.add(message.guild.roles.cache.find(r => r.id === prize.role)).then(() => util.success(message, "Congratulations!")).catch(e => util.error(message, "I was unable to add the role to the user!"));
        });
    },
    description: "Gives or removes a prize role to/from the user",
    usage: "prize <role name>"
};
