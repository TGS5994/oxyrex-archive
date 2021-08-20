// Import everything.
const Discord = require("discord.js");
const config = require("../botConfig.json");
const util = require("../util.js");

module.exports = {
    run: function(bot, message, args) {
        if (util.checkPermissions(message) < 2) return util.unauth(message);
        let id = args.shift();
        let socket = sockets.clients.find(socket => socket.id == id);
        if (!socket) return util.error(message, "No sockets matched that ID");
        socket.kick(args.join(" "));
        util.success(message, "The user has been kicked.");
        util.log(bot, "command", `<!@${message.author.id}> ran \`${message.content}\` in <#${message.channel.id}>`);
    },
    description: "Kicks a socket from the game.",
    usage: "kick <id> <reason>"
};
