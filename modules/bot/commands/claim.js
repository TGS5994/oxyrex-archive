// Import everything.
const Discord = require("discord.js");
const config = require("../botConfig.json");
const util = require("../util.js");

module.exports = {
    run: function(bot, message, args) {
        let token;
        let betaTester = c.TOKENS.find(entry => entry[1] === message.member.id);
        if (betaTester) token = betaTester[0];
        else return util.error(message, "You are not a Beta-Tester!");
        let channel = bot.users.cache.get(message.member.id);
        util.info({ channel }, `Your token for Woomy.io is ||${token}||.\nWarning: **Do not give your token to anyone else. If they break any of the ingame rules while using your token, you will be punished as a result because your discord account is on the token.**`).then(() => util.info(message, "Please check your DMs from me.")).catch(() => util.error(message, "I am unable to DM you. Please check that your settings allow me to DM you."));
    },
    description: "Creates a custom token for the game. Sent in DMs.",
    usage: "claim"
};
