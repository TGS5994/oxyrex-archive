// Import everything.
const Discord = require("discord.js");
const config = require("../botConfig.json");
const util = require("../util.js");
const {
    createCanvas,
    loadImage,
    registerFont
} = require('canvas');

registerFont('Ubuntu-Bold.ttf', {
    family: 'Ubuntu'
});

function makeCanvas(w, h) {
    let canvas = createCanvas(w, h);
    let context = canvas.getContext("2d");
    return {
        canvas,
        context
    };
};

// A function that can mix two colors together.
let mixColors = function(colorA, colorB, amount) {
    const [rA, gA, bA] = colorA.match(/\w\w/g).map((c) => parseInt(c, 16));
    const [rB, gB, bB] = colorB.match(/\w\w/g).map((c) => parseInt(c, 16));
    const r = Math.round(rA + (rB - rA) * amount).toString(16).padStart(2, '0');
    const g = Math.round(gA + (gB - gA) * amount).toString(16).padStart(2, '0');
    const b = Math.round(bA + (bB - bA) * amount).toString(16).padStart(2, '0');
    return '#' + r + g + b;
}

const drawings = (function() {
    // Draw a circle. Uses two circles instead of fill/stroke.
    function circle(ctx, x, y, rad, fill, stroke) {
        ctx.beginPath();
        ctx.arc(x, y, rad * 1.15, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = stroke;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
    };

    // The pretty text drawing function.
    function text(canvas, ctx, text, x, y, size, align, fill) {
        ctx.save();
        ctx.font = "bold " + size + "px Ubuntu";
        let offX = align === "center" ? ctx.measureText(text).width / 2 : 0;
        let offY = ctx.measureText("M").width / 2;
        ctx.fillStyle = fill;
        ctx.fillText(text, x - offX, y + offY);
        ctx.restore();
    };
    return {
        circle,
        text
    };
})();

function replaceAll(string, replace, replaceWith) {
    let output = "";
    for (let i = 0; i < string.length; i ++) {
        let char = string[i];
        if (char === replace) char = replaceWith;
        output += char;
    }
    return output;
}

const chars = "qwertyuiopasdfghjkzxcvbnmQWERTYUOPASDFGHJKLZXCVBNM1234567890";
function createCaptcha() {
    const {
        canvas,
        context
    } = makeCanvas(750, 175);
    const text = (() => {
        let characters = [];
        for (let i = 0; i < 5 + (Math.random() * 6 | 0); i ++) characters.push(chars[Math.random() * chars.length | 0]);
        let output = "";
        for (let character of characters) {
            output += character;
            for (let i = 0; i < Math.random() * 2; i ++) output += " ";
        }
        return output;
    })();
    const textWidth = context.measureText(text).width;
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawings.text(canvas, context, text, canvas.width / 2, canvas.height / 2, 55, "center", "#FFFFFF");
    for (let i = 0; i < 10; i ++) {
        context.save();
        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate(Math.random() * Math.PI * 2);
        context.beginPath();
        const offset = {
            x: (Math.random() * canvas.width) - (canvas.width / 2),
            y: (Math.random() * canvas.height) - (canvas.height / 2)
        };
        switch (Math.random() * 2 | 0) {
            case 0: {
                context.moveTo(-canvas.width / 2 + offset.x, offset.y);
                context.lineTo(canvas.width / 2 + offset.x, offset.y);
            } break;
            case 1: {
                context.moveTo(-canvas.width / 2 + offset.x, offset.y);
                for (let i = 0; i < canvas.width; i ++) {
                    context.lineTo(i - canvas.width / 2 + offset.x, Math.cos(i / 10) * (canvas.height / 3) + offset.y);
                }
            } break;
        }
        context.strokeStyle = "#FFFFFF";
        context.stroke();
        context.closePath();
        context.restore();
    }
    return {
        text: replaceAll(text, " ", ""),
        image: new Discord.MessageAttachment(canvas.toBuffer(), "captcha.png")
    }
}

let captchas = {};
let verifiedUsers = [];

module.exports = {
    run: function(bot, message, args) {
        if (verifiedUsers.includes(message.author.id)) {
            let token;
            if (args.length === 1 && args[0] === "token") {
                let betaTester = c.TOKENS.find(entry => entry[1] === message.member.id);
                if (betaTester) token = betaTester[0];
                else return util.error(message, "You are not a Beta-Tester!");
            } else {
                let perms = util.checkPermissions(message);
                if (perms < 1 || args.length !== 1) args = ["#FFFFFF"];
                let nameColor = args[0];
                nameColor = nameColor.split("");
                for (let i = 0; i < nameColor.length; i ++) {
                    let char = nameColor[i];
                    if (char === "#") continue;
                    let all = "1234567890ABCDEFabcdef".split("");
                    if (!all.includes(char)) return util.error(message, "That is not a valid name color!");
                }
                nameColor = nameColor.join("").replace("#", "");
                if (nameColor.length !== 6) return util.error(message, "Your name color must be made up of 6 valid characters! The `#` at the start is optional. Valid characters are `a b c d e f A B C D E F 0 1 2 3 4 5 6 7 8 9`");
                token = accountEncryption.encode(`PASSWORD_${message.member.id}-${nameColor}_PASSWORD`);
            }
            let channel = bot.users.cache.get(message.member.id);
            util.info({ channel }, `Your token for Woomy.io is ||${token}||.\nWarning: **Do not give your token to anyone else. If they break any of the ingame rules while using your token, you will be punished as a result because your discord account is on the token.**`).then(() => util.info(message, "Please check your DMs from me.")).catch(() => util.error(message, "I am unable to DM you. Please check that your settings allow me to DM you."));
        } else {
            if (args.length) {
                const captcha = captchas[message.author.id];
                if (!captcha) return util.error(message, "You haven't been assigned a captcha yet!");
                if (args[0] !== captcha) {
                    return util.error(message, "That's the wrong captcha!");
                }
                util.success(message, "You've been accepted. You may now run the command again to recieve your token.");
                verifiedUsers.push(message.author.id);
                return;
            }
            message.channel.send("Working...").then(function(msg) {
                const result = createCaptcha(message);
                captchas[message.author.id] = result.text;
                msg.delete();
                const embed = new Discord.MessageEmbed()
                    .setColor(0xDD0000)
                    .setTitle(`Please Run \`${config.prefix + global.fingerPrint.prefix} claim <the captcha you see below (without any spaces)>\`:`)
                    .setAuthor(`Requested by ${message.guild.member(message.author).user.tag}`)
                    .setTimestamp()
                    .attachFiles(result.image)
                    .setImage('attachment://captcha.png')
                    .setFooter('Powered by Discord.js', 'https://i.imgur.com/wSTFkRM.png');
                message.channel.send(embed);
            });
        }
    },
    description: "Creates a custom token for the game. Sent in DMs.",
    usage: "claim"
};
