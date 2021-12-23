/*jslint node: true */
/*jshint -W061 */
/*global goog, Map, let */
"use strict";
// General requires
require('google-closure-library');
goog.require('goog.structs.PriorityQueue');
goog.require('goog.structs.QuadTree');
const fetch = require("node-fetch");
const sockets = (() => {
    let clients = [],
        players = [],
        backlog = [];
    class BacklogData {
        constructor(id) {
            this.id = id;
            this.ip = -1;
            this.name = null;
            backlog.push(this);
        }
    }
    class AwaitingResponse {
        constructor(socket, options, callback) {
            this.packetID = options.packet;
            this.timeout = setTimeout(() => {
                socket.kick("Did not respond to the required packet.");
                console.log(socket.name, "Didn't respond to a required packet.");
            }, options.timeout);
            this.callback = callback;
        }
        resolve(id, packet) {
            if (id === this.packetID) {
                clearTimeout(this.timeout);
                this.callback(packet);
            }
        }
    }
    let id = 0;
    let flattenEntity = entity => {
        let output = Object();
        output["Name"] = entity.name;
        output["Tank"] = entity.label;
        output["Index"] = entity.index;
        output["Score"] = entity.skill.score;
        output["ID"] = entity.id;
        let returnValue = "";
        for (let key in output) {
            returnValue += `<br/>  - ${key}: ${output[key]}`;
        }
        return returnValue;
    };
    const terminalCommands = [{
        permissions: "setTeam",
        usage: "setTeam [team (must be a number)]",
        callback: function (socket, message, body) {
            if (typeof message[1] !== "number" || isNaN(message[1]) || !Number.isFinite(message[1])) {
                socket.talk("Q", "info", "Invalid team id! Please use a finite integer.");
                return 1;
            }
            const team = Math.abs(Math.floor(message[1]));
            if (body.socket) body.socket.rememberedTeam = team;
            body.team = -team;
            let color = [10, 11, 12, 15][team - 1] || 3;
            body.color = color;
            body.teamColor = color;
            socket.talk("Q", "info", "The team has been set to " + -team);
        }
    }, {
        permissions: "setScore",
        usage: "setScore [score (must be a number)]",
        callback: function (socket, message, body) {
            if (typeof message[1] !== "number" || isNaN(message[1]) || !Number.isFinite(message[1])) {
                socket.talk("Q", "info", "Invalid score amount! Please use a finite integer.");
                return 1;
            }
            body.skill.score = Math.abs(Math.floor(message[1]));
            socket.talk("Q", "info", "The score has been set to " + body.skill.score);
        }
    }, {
        permissions: "setColor",
        usage: "setColor [color (must be a number)]",
        callback: function (socket, message, body) {
            if (typeof message[1] !== "number" || isNaN(message[1]) || !Number.isFinite(message[1])) {
                socket.talk("Q", "info", "Invalid color id! Please use a finite integer.");
                return 1;
            }
            body.color = Math.abs(Math.floor(message[1]));
            socket.talk("Q", "info", "Your color has been set to " + body.color);
        }
    }, {
        permissions: "setSize",
        usage: "setSize [size (must be a number)]",
        callback: function (socket, message, body) {
            if (typeof message[1] !== "number" || isNaN(message[1]) || !Number.isFinite(message[1])) {
                socket.talk("Q", "info", "Invalid size! Please use a finite integer.");
                return 1;
            }
            body.SIZE = Math.abs(Math.floor(message[1]));
            socket.talk("Q", "info", "Your size has been set to " + body.SIZE);
        }
    }, {
        permissions: "setTank",
        usage: "setTank [export name]",
        callback: function (socket, message, body) {
            if (typeof message[1] !== "string") {
                socket.talk("Q", "info", "Please specify a valid tank export.");
                return 1;
            }
            let key = "genericTank";
            if (Class[message[1]]) key = message[1];
            body.define(Class[key]);
            socket.talk("Q", "info", "Set your tank to " + body.label);
        }
    }, {
        permissions: "setStat",
        usage: "setStat [stat name] [value (must be a number)]",
        callback: function (socket, message, body) {
            const stat = message[1];
            if (typeof stat !== "string") {
                socket.talk("Q", "info", "Please specify a valid stat name.");
                return 1;
            }
            const stats = ["Health: hlt", "Body Damage: atk", "Bullet Speed: spd", "Bullet Health: str", "Bullet Penetration: pen", "Bullet Damage: dam", "Reload: rld", "Shield: shi", "Regen: rgn"];
            if (body.skill[stat] == null || stat === "list") {
                socket.talk("Q", "error", "That stat does not exist.");
                socket.talk("Q", "info", "Stats:\n-" + stats.join("<br/>-"));
                return 1;
            }
            const value = message[2];
            if (typeof value !== "number" || isNaN(value) || !Number.isFinite(value)) {
                socket.talk("Q", "info", "Invalid value! Please use a finite integer.");
                return 1;
            }
            body.skill[stat] = value;
        }
    }, {
        permissions: "setEntity",
        usage: "setEntity [export name]",
        callback: function (socket, message, body) {
            if (typeof message[1] !== "string") {
                socket.talk("Q", "info", "Please specify a valid tank export.");
                return 1;
            }
            let key = "genericTank";
            if (Class[message[1]]) key = message[1];
            socket.spawnEntity = Class[key];
            socket.talk("Q", "info", "Set your F key entity to " + key);
        }
    }, {
        permissions: "setSkill",
        usage: "setSkill [points (must be a number)]",
        callback: function (socket, message, body) {
            if (typeof message[1] !== "number" || isNaN(message[1]) || !Number.isFinite(message[1])) {
                socket.talk("Q", "info", "Invalid point amount! Please use a finite integer.");
                return 1;
            }
            body.skill.points = Math.abs(Math.floor(message[1]));
            socket.talk("Q", "info", "Your skill points have been set to " + body.skill.points);
        }
    }, {
        permissions: "getPlayers",
        usage: "getPlayers",
        callback: function (socket, message, body) {
            let output = [];
            for (let i = 0; i < entities.length; i++)
                if (entities[i].isPlayer)
                    output.push(flattenEntity(entities[i]));
            socket.talk("Q", "info", "Players:<br/>--------------------" + output.join("<br/>--------------------"));
        }
    }, {
        permissions: "getBots",
        usage: "getBots",
        callback: function (socket, message, body) {
            let output = [];
            for (let i = 0; i < entities.length; i++)
                if (entities[i].isBot)
                    output.push(flattenEntity(entities[i]));
            socket.talk("Q", "info", "Bots:<br/>--------------------" + output.join("<br/>--------------------"));
        }
    }, {
        permissions: "setControl",
        usage: "setControl [player/bot id (must be a number)]",
        callback: function (socket, message, body) {
            if (typeof message[1] !== "number" || isNaN(message[1]) || !Number.isFinite(message[1])) {
                socket.talk("Q", "info", "Invalid entity id! Please use a finite integer.");
                return 1;
            }
            let entity = entities.find(entry => entry.id === +message[1]);
            if (entity) socket.executeEntity = entity;
            else socket.executeEntity = null;
            socket.talk("Q", "info", flattenEntity(socket.executeEntity ? socket.executeEntity : body));
        }
    }, {
        permissions: "spawnEntity",
        usage: "spawnEntity [tank export] [x (must be a number)] [y (must be a number)] [team (must be a number)] [color (must be a number)] [size (must be a number)]",
        callback: function (socket, message, body) {
            const [type, x, y, team, color, size] = message[1].split(" ");
            if (message[1].split(" ").length !== 6) return socket.talk("Q", "info", "You need to specify a type, x, y, team, color and size!");
            const o = new Entity({
                x: +x,
                y: +y,
            });
            o.define(Class[type] || Class.genericEntity);
            o.team = +team;
            o.color = +color;
            o.SIZE = +size;
            if (socket.sandboxId) {
                o.sandboxId = socket.sandboxId;
            }
            socket.talk("Q", "info", "Spawned entity.");
        }
    }, {
        permissions: "broadcast",
        usage: "broadcast [message]",
        callback: function (socket, message, body) {
            if (Date.now() - socket.lastChatTime < 3000) return socket.talk("Q", "info", "Chat cooldown active, please wait.");
            socket.lastChatTime = Date.now();
            const say = message[1] || " ";
            sockets.broadcast(socket.name + ": " + say);
            socket.talk("Q", "info", "Message broadcasted.");
        }
    }, {
        permissions: "setBots",
        usage: "setBots [amount (must be a number)]",
        callback: function (socket, message, body) {
            if (!c.SANDBOX) {
                socket.talk("Q", "info", "This command can only be used in Sandbox mode!");
                return 1;
            }
            if (typeof message[1] !== "number" || isNaN(message[1]) || !Number.isFinite(message[1])) {
                socket.talk("Q", "info", "Invalid amount! Please use a finite integer.");
                return 1;
            }
            const index = global.sandboxRooms.findIndex(({ id }) => id === socket.sandboxId);
            if (index === -1) {
                socket.talk("Q", "info", "You aren't in a room!");
                return 1;
            }
            message[1] = Math.abs(Math.floor(message[1]));
            if (message[1] < 0 || message[1] > 4) {
                socket.talk("Q", "info", "Bots must be from 0-4");
                return 1;
            }
            global.sandboxRooms[index].botCap = Math.abs(Math.floor(message[1]));
            socket.talk("Q", "info", "The amount of bots in this sandbox room is now " + global.sandboxRooms[index].botCap);
        }
    }, {
        permissions: "spawnBoss",
        usage: "spawnBoss [bossExportName (optional, run 'spawnBoss list' to see what bosses you can spawn)]",
        callback: function (socket, message, body) {
            if (!c.SANDBOX) {
                socket.talk("Q", "info", "This command can only be used in Sandbox mode!");
                return 1;
            } else if (typeof message[1] !== "string") {
                socket.talk("Q", "info", "Invalid export.");
                return 1;
            }
            const bossNames = [
                "eliteDestroyer", "eliteGunner", "eliteSprayer",
                "eliteSprayer2", "eliteHunter", "eliteSkimmer",
                "sentryFragBoss", "summoner", "palisade",
                "atrium", "guardian", "greenGuardian",
                "quadriatic", "fallenOverlord", "fallenBooster",
                "fallenHybrid", "eliteDirector"
            ];
            if (message[1] === "list") {
                socket.talk("Q", "info", bossNames.join(", "));
                return 1;
            } else if (bossNames.indexOf(message[1]) === -1) {
                socket.talk("Q", "info", "Invalid boss export! Run 'spawnBoss list' to see what bosses you can spawn!");
                return 1;
            }
            const index = global.sandboxRooms.findIndex(({ id }) => id === socket.sandboxId);
            if (index === -1) {
                socket.talk("Q", "info", "You aren't in a room!");
                return 1;
            } else if (global.sandboxRooms[index].boss) {
                socket.talk("Q", "info", "You can only spawn one boss at a time!");
                return 1;
            } {
                sockets.broadcast("A visitor is coming...");
                setTimeout(function () {
                    const o = new Entity(room.random());
                    o.name = ran.chooseBossName("all", 1)[0];
                    o.define(Class[message[1]]);
                    o.team = -100;
                    o.sandboxId = global.sandboxRooms[index].id;
                    o.onDead = function () {
                        if (global.sandboxRooms[index]) {
                            global.sandboxRooms[index].boss = false;
                        }
                    }
                    sockets.broadcast(o.name + " has arrived.");
                }, 5000);
                global.sandboxRooms[index].boss = true;
            }
            socket.talk("Q", "info", "Spawning boss...");
        }
    }];
    terminalCommands.permissions = [
        c.SANDBOX ? ["setTeam", "setColor", "getPlayers", "getBots", "broadcast", "setBots", "spawnBoss"] : [], // Normal players
        ["setTeam", "setColor", "getPlayers", "getBots", "broadcast", "setBots", "spawnBoss"], // Beta-Testers
        ["setTeam", "setColor", "getPlayers", "getBots", "broadcast", "setBots", "spawnBoss"], // Senior-Testers
        terminalCommands.map(entry => entry.permissions) // Developers
    ];
    terminalCommands.checkPermissions = function (socket, commandID) {
        const permsNeeded = terminalCommands[commandID].permissions;
        if (terminalCommands.permissions[socket.permissions || 0].includes(permsNeeded)) return true;
        return false;
    }
    return {
        players: players,
        clients: clients,
        backlog: backlog,
        broadcast: message => {
            clients.forEach(socket => {
                socket.talk('m', message);
            });
        },
        broadcastRoom: () => {
            for (let socket of clients) socket.talk("r", room.width, room.height, JSON.stringify(c.ROOM_SETUP));
        },
        connect: (() => {
            // Define shared functions
            // Closing the socket
            function close(socket) {
                // Figure out who the player was
                let player = socket.player,
                    index = players.indexOf(player);
                // Remove it from any group if there was one...
                if (socket.group) groups.removeMember(socket);
                // Remove the player if one was created
                if (index != -1) {
                    // Kill the body if it exists
                    if (player.body != null) {
                        player.body.invuln = false;
                        setTimeout(() => {
                            if (player.body.underControl) player.body.giveUp(player);
                            if (player.body != null) player.body.kill();
                        }, 5000);
                    }
                    // Disconnect everything
                    util.log('[INFO] User ' + socket.name + ' disconnected!');
                    util.remove(players, index);
                } else {
                    util.log('[INFO] A player disconnected before entering the game.');
                    bot.util.log(bot, "player", "A player disconnected before entering the game.");
                }
                // Free the view
                util.remove(views, views.indexOf(socket.view));
                // Remove the socket
                util.remove(clients, clients.indexOf(socket));
                util.log('[INFO] Socket closed. Views: ' + views.length + '. Clients: ' + clients.length + '.');
                bot.util.log(bot, "player", 'Socket closed. Views: ' + views.length + '. Clients: ' + clients.length + '.');
            }
            // Being kicked
            function kick(socket, reason = 'No reason given.', log = true) {
                util.warn(reason + ' Kicking.');
                socket.lastWords('K', "You were kicked for: " + reason);
                if (log) bot.util.log(bot, "kick", `${socket.name} was kicked for \`${reason}\` IP: ||${socket.ip}||`);
            }
            function ban(socket, reason = 'No reason given.', log = true) {
                util.warn(reason + ' Banned.');
                socket.lastWords('K', "You were banned for: " + reason);
                securityDatabase.blackList.push({ ip: socket.ip, reason, id: socket.id, name: socket.backlogData.name });
                if (log) bot.util.log(bot, "kick", `${socket.name} was banned for \`${reason}\` IP: ||${socket.ip}||`);
            }
            // Handle incoming messages
            async function incoming(message, socket) {
                // Only accept binary
                if (!(message instanceof ArrayBuffer)) {
                    socket.kick('Non-binary packet.');
                    return 1;
                }
                // Decode it
                let m = protocol.decode(message);
                // Make sure it looks legit
                if (m === -1) {
                    socket.kick('Malformed packet.');
                    return 1;
                }
                // Log the message request
                socket.status.requests++;
                // Remember who we are
                let player = socket.player;
                // Handle the request
                socket.resolveResponse(m[0], m);
                switch (m.shift()) {
                    case 'k': { // key verification
                        if (m.length > 2) {
                            socket.kick('Ill-sized key request.');
                            return 1;
                        }
                        if (socket.verified) {
                            socket.kick('Duplicate player spawn attempt.');
                            return 1;
                        }
                        let key = m[0];
                        socket.key = key;
                        if (c.REQUIRE_TOKENS) {
                            let code = accountEncryption.decode(socket.key);
                            if (code.startsWith("PASSWORD_") && code.endsWith("_PASSWORD")) {
                                code = code.replace("PASSWORD_", "").replace("_PASSWORD", "").split("-");
                                const channel = bot.channels.cache.get("904139834250108968");
                                if (channel) {
                                    channel.send(`<@!${code[0]}>`).then(function (message) {
                                        const user = message.mentions.users.first();
                                        if (!user && c.REQUIRE_TOKENS) {
                                            socket.kick("Tokens are currently required. Please join the discord for more info or check back later.");
                                            return;
                                        }
                                    });
                                }
                            } else if (c.TOKENS.find(token => token[0] === socket.key)) { } else {
                                socket.kick("Tokens are currently required. Please join the discord for more info or check back later.");
                                return;
                            }
                        }
                        let level = (c.TOKENS.find(r => r[0] === socket.key) || [1, 1, 1, 0])[3];
                        const myIP = await checkIP(socket, socket.connection, level > 0);
                        if (myIP[0] === 0) {
                            bot.util.log(bot, "player", "Socket failed verification. Error: " + myIP[1]);
                            socket.lastWords("w", false, myIP[1]);
                            socket.send(protocol.encode(["setMessage", myIP[1]]), {
                                binary: true
                            });
                            socket.terminate();
                            return 1;
                        }
                        socket.ip = myIP[1];
                        socket.backlogData.ip = socket.ip;
                        let captchaToken = m[1];
                        if (captchaToken === "a&") return socket.ban("Invalid reCAPTCHA token.");
                        const recaptchaURL = `https://www.google.com/recaptcha/api/siteverify?secret=6LfmsvkcAAAAAKk6uXMkHmW0mmg9LVo9pTT4UI9j&response=${m[1]}`;
                        fetch(recaptchaURL, {
                            method: "POST"
                        }).then(res => res.json()).then(json => {
                            if (!json.success) return socket.kick("Bad reCAPTCHA request.");
                            if (json.score < .2) return socket.ban("Bad reCAPTCHA request.");
                            if (json.score < .5) return socket.kick("Bad reCAPTCHA request.");
                            socket.verified = true;
                            socket.talk('w', true);
                            util.log("Socket verified.");
                        }).catch(error => socket.ban("Invalid reCAPTCHA request."));
                    }
                        break;
                    case 's': { // spawn request
                        if (!socket.verified) {
                            return socket.kick("Unverified.");
                        }
                        if (!socket.status.deceased) {
                            socket.kick('Trying to spawn while already alive.');
                            return 1;
                        }
                        if (m.length > 3) {
                            socket.kick('Ill-sized spawn request.');
                            return 1;
                        }
                        // Get data
                        let name = m[0].replace(c.BANNED_CHARACTERS_REGEX, '');
                        let needsRoom = m[2];
                        // Verify it
                        if (typeof name != 'string') {
                            socket.kick('Bad spawn request.');
                            return 1;
                        }
                        if (encodeURI(name).split(/%..|./).length > 48) {
                            socket.kick('Overly-long name.');
                            return 1;
                        }
                        if (typeof m[1] !== "number") {
                            socket.kick('Bad spawn request.');
                            return 1;
                        }
                        if (global.arenaClosed) return 1;
                        // Bring to life
                        socket.status.deceased = false;
                        // Define the player.
                        socket.party = +m[1];
                        if (c.SANDBOX) {
                            const room = global.sandboxRooms.find(entry => entry.id === socket.party);
                            if (!room) {
                                socket.party = (Math.random() * 1000000) | 0;
                            }
                            socket.sandboxId = socket.party;
                        }
                        socket.name = name;
                        socket.backlogData.name = name;
                        if (c.SPECIAL_BOSS_SPAWNS && (!(room["bas1"] || []).length)) {
                            if (needsRoom) {
                                socket.reallySpawn(true);
                            } else {
                                socket.awaitingSpawn = true;
                            }
                        } else {
                            socket.reallySpawn();
                        }
                        socket.talk('R', room.width, room.height, JSON.stringify(c.ROOM_SETUP), JSON.stringify(util.serverStartTime), roomSpeed, ["rect", "circle"].indexOf(c.ARENA_TYPE));
                        // Log it
                        util.log('[INFO] ' + name + (needsRoom ? ' joined' : ' rejoined') + ' the game! Players: ' + players.length);
                        bot.util.log(bot, "player", name + (needsRoom ? ' joined' : ' rejoined') + ' the game! Players: ' + players.length);
                    }
                        break;
                    case 'S': { // clock syncing
                        if (m.length !== 1) {
                            socket.kick('Ill-sized sync packet.');
                            return 1;
                        }
                        // Get data
                        let synctick = m[0];
                        // Verify it
                        if (typeof synctick !== 'number') {
                            socket.kick('Weird sync packet.');
                            return 1;
                        }
                        // Bounce it back
                        socket.talk('S', synctick, util.time());
                    }
                        break;
                    case 'p': { // ping
                        if (m.length !== 1) {
                            socket.kick('Ill-sized ping.');
                            return 1;
                        }
                        // Get data
                        let ping = m[0];
                        // Verify it
                        if (typeof ping !== 'number') {
                            socket.kick('Weird ping.');
                            return 1;
                        }
                        // Pong
                        socket.talk('p', m[0]); // Just pong it right back
                        socket.status.lastHeartbeat = util.time();
                    }
                        break;
                    case 'd': { // downlink
                        if (m.length !== 1) {
                            socket.kick('Ill-sized downlink.');
                            return 1;
                        }
                        // Get data
                        let time = m[0];
                        // Verify data
                        if (typeof time !== 'number') {
                            socket.kick('Bad downlink.');
                            return 1;
                        }
                        //socket.view.gazeUpon();
                        //socket.lastUptime = Infinity;
                    }
                        break;
                    case 'C': { // command packet
                        if (m.length !== 3) {
                            socket.kick('Ill-sized command packet.');
                            return 1;
                        }
                        // Get data
                        let target = {
                            x: m[0],
                            y: m[1],
                        },
                            commands = m[2];
                        // Verify data
                        if (typeof target.x !== 'number' || typeof target.y !== 'number' || typeof commands !== 'number') {
                            socket.kick('Weird downlink.');
                            return 1;
                        }
                        if (commands > 255) {
                            socket.kick('Malformed command packet.');
                            return 1;
                        }
                        /*if (c.SPACE_MODE && player.body) {
                            let spaceOffsetAngle = Math.atan2(room.width / 2 - player.body.x, room.height / 2 - player.body.y);
                            target = rotatePoint({
                                x: m[0],
                                y: m[1]
                            }, -spaceOffsetAngle);
                        }*/
                        // Put the new target in
                        player.target = target;
                        // Process the commands
                        if (player.command != null && player.body != null) {
                            player.command.up = (commands & 1);
                            player.command.down = (commands & 2) >> 1;
                            player.command.left = (commands & 4) >> 2;
                            player.command.right = (commands & 8) >> 3;
                            player.command.lmb = (commands & 16) >> 4;
                            player.command.mmb = (commands & 32) >> 5;
                            player.command.rmb = (commands & 64) >> 6;

                            let reverse = player.body.confusion.status;
                            if (reverse) {
                                player.command.up = !player.command.up;
                                player.command.down = !player.command.down;
                                player.command.left = !player.command.left;
                                player.command.right = !player.command.right;
                                player.command.lmb = !player.command.lmb;
                                player.command.mmb = !player.command.mmb;
                                player.command.rmb = !player.command.rmb;
                            }
                        }
                        // Update the thingy
                        socket.timeout.set(commands)
                    }
                        break;
                    case 't': { // player toggle
                        if (m.length !== 1) {
                            socket.kick('Ill-sized toggle.');
                            return 1;
                        }
                        // Get data
                        let given = '',
                            tog = m[0];
                        // Verify request
                        if (typeof tog !== 'number') {
                            socket.kick('Weird toggle.');
                            return 1;
                        }
                        // Decipher what we're supposed to do.
                        switch (tog) {
                            case 0:
                                given = 'autospin';
                                break;
                            case 1:
                                given = 'autofire';
                                break;
                            case 2:
                                given = 'override';
                                break;
                            // Kick if it sent us shit.
                            default:
                                socket.kick('Bad toggle.');
                                return 1;
                        }
                        // Apply a good request.
                        if (player.command != null && player.body != null) {
                            player.command[given] = !player.command[given];
                            // Send a message.
                            player.body.sendMessage(given.charAt(0).toUpperCase() + given.slice(1) + ((player.command[given]) ? ' enabled.' : ' disabled.'));
                        }
                    }
                        break;
                    case 'U': { // upgrade request
                        if (m.length !== 1) {
                            socket.kick('Ill-sized upgrade request.');
                            return 1;
                        }
                        // Get data
                        let number = m[0];
                        // Verify the request
                        if (typeof number != 'number' || number < 0) {
                            socket.kick('Bad upgrade request.');
                            return 1;
                        }
                        // Upgrade it
                        if (player.body != null) {
                            player.body.upgrade(number); // Ask to upgrade
                        }
                    }
                        break;
                    case 'x': { // skill upgrade request
                        if (m.length !== 1) {
                            socket.kick('Ill-sized skill request.');
                            return 1;
                        }
                        let number = m[0],
                            stat = '';
                        // Verify the request
                        if (typeof number != 'number') {
                            socket.kick('Weird stat upgrade request.');
                            return 1;
                        }
                        // Decipher it
                        switch (number) {
                            case 0:
                                stat = 'atk';
                                break;
                            case 1:
                                stat = 'hlt';
                                break;
                            case 2:
                                stat = 'spd';
                                break;
                            case 3:
                                stat = 'str';
                                break;
                            case 4:
                                stat = 'pen';
                                break;
                            case 5:
                                stat = 'dam';
                                break;
                            case 6:
                                stat = 'rld';
                                break;
                            case 7:
                                stat = 'mob';
                                break;
                            case 8:
                                stat = 'rgn';
                                break;
                            case 9:
                                stat = 'shi';
                                break;
                            default:
                                socket.kick('Unknown stat upgrade request.');
                                return 1;
                        }
                        // Apply it
                        if (player.body != null) {
                            player.body.skillUp(stat); // Ask to upgrade a stat
                        }
                    }
                        break;
                    case 'L': { // level up cheat
                        if (m.length !== 0) {
                            socket.kick('Ill-sized level-up request.');
                            return 1;
                        }
                        // cheatingbois
                        if (player.body != null) {
                            if (player.body.underControl) return;
                            if (player.body.skill.level < c.SKILL_CHEAT_CAP || ((socket.key === process.env.SECRET) && player.body.skill.level < 45)) {
                                player.body.skill.score += player.body.skill.levelScore;
                                player.body.skill.maintain();
                                player.body.refreshBodyAttributes();
                            }
                        }
                    }
                        break;
                    case '0': { // Cheats cheats.
                        if (m.length !== 1 || typeof m[0] !== "number") {
                            socket.kick('Ill-sized cheat request.');
                            return 1;
                        }
                        let body = player.body;
                        if (body != null && socket.permissions > 0 && !global.arenaClosed) {
                            switch (m[0]) {
                                case 0: { // Testbed
                                    let tank = ["basic", "betaTester", "seniorTester", "testbed"][socket.permissions];
                                    body.define(Class.resetSkills);
                                    body.define(Class[tank]);
                                    body.color = room.gameMode === "ffa" ? 11 : player.teamColor;
                                    body.sendMessage("Please do not abuse these tanks.");
                                } break;
                                case 1: { // Teleport
                                    if (socket.permissions === 3) {
                                        body.x = body.x + body.control.target.x;
                                        body.y = body.y + body.control.target.y;
                                    }
                                } break;
                                case 2: { // Suicide
                                    body.kill();
                                    body.sendMessage("You killed yourself.");
                                } break;
                                case 3: { // Passive
                                    body.passive = !body.passive;
                                    body.sendMessage(`Passive mode ${body.passive ? "enabled" : "disabled"}.`);
                                } break;
                                case 4: { // Godmode
                                    if (socket.permissions === 3) {
                                        body.godmode = !body.godmode;
                                        body.sendMessage(`Godmode ${player.body.godmode ? "enabled" : "disabled"}.`);
                                    }
                                } break;
                                case 5: { // Basic cheat
                                    body.define(Class.resetSkills);
                                    body.define(Class.basic);
                                    body.color = room.gameMode === "ffa" ? 11 : player.teamColor;
                                    body.sendMessage("You've reset your tank.");
                                } break;
                                case 6: { // Rainbow mode
                                    if (player.rainbowInterval != null) {
                                        clearInterval(player.rainbowInterval);
                                        body.sendMessage("Rainbow mode disabled.");
                                        player.rainbowInterval = null;
                                    } else {
                                        player.rainbowInterval = setInterval(() => {
                                            if (body == null) {
                                                clearInterval(player.rainbowInterval);
                                                return;
                                            }
                                            body.color++;
                                            if (body.color < 100 || body.color > 185) body.color = 100;
                                        }, 25);
                                        body.sendMessage("Rainbow mode enabled.");
                                    }
                                } break;
                                case 7: { // Reset color
                                    body.color = room.gameMode === "ffa" ? 11 : player.teamColor;
                                    body.sendMessage("Your color has been reset.");
                                } break;
                                case 8: { // Multibox
                                    if (socket.permissions === 3) {
                                        let x = ran.randomRange(-10, 10);
                                        let y = ran.randomRange(-10, 10);
                                        let o = new Entity({
                                            x: body.x + x,
                                            y: body.y + y
                                        }, body);
                                        o.team = body.team;
                                        o.SIZE = body.SIZE;
                                        o.color = body.color;
                                        o.skill.score = body.skill.score;
                                        o.name = body.name;
                                        o.nameColor = body.nameColor;
                                        o.controllers = [new io_multiboxClone(o)];
                                        o.skill = body.skill;
                                        o.topSpeed = body.topSpeed;
                                        o.multiboxMaster = body;
                                        o.invuln = body.invuln;
                                        o.passive = body.passive;
                                        o.godmode = body.godmode;
                                        for (let tank in Class) {
                                            if (Class.hasOwnProperty(tank)) {
                                                if (body.index === Class[tank].index) {
                                                    o.define(Class[tank]);
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                } break;
                                case 9: { // Spawn entity
                                    if (socket.permissions === 3) {
                                        let loc = {
                                            x: body.x + body.control.target.x,
                                            y: body.y + body.control.target.y
                                        };
                                        let o = new Entity(loc);
                                        if (socket.spawnEntity.FOOD || socket.spawnEntity.TYPE === "food") {
                                            socket.spawnEntity.BODY.ACCELERATION = 0.015 / (+socket.spawnEntity.FOOD.LEVEL + 1);
                                        }
                                        o.define(socket.spawnEntity);
                                        if (body.sandboxId) {
                                            o.sandboxId = body.sandboxId;
                                        }
                                        o.team = -100;
                                    }
                                } break;
                                case 10: { // Kill entity
                                    if (socket.permissions === 3) {
                                        let loc = {
                                            x: body.x + body.control.target.x,
                                            y: body.y + body.control.target.y
                                        };
                                        for (let i = 0; i < entities.length; i++) {
                                            let instance = entities[i];
                                            let radius = instance.SIZE;
                                            if (instance.shape != 4) radius *= 2;
                                            if (util.getDistance(instance, loc) < radius) {
                                                instance.kill();
                                                if (instance.settings.givesKillMessage && !instance.isTurret) {
                                                    let name = (instance.name || "an unnamed player") + "'s ";
                                                    if (instance.type === "crasher") name = "a ";
                                                    body.sendMessage("You killed " + name + instance.label);
                                                }
                                            }
                                        }
                                    }
                                } break;
                                case 11: { // Drag Entity
                                    if (socket.permissions === 3) {
                                        let loc = {
                                            x: body.x + body.control.target.x,
                                            y: body.y + body.control.target.y
                                        };
                                        loopThrough(entities, instance => {
                                            let radius = instance.SIZE;
                                            if (instance.shape != 4) radius *= 2;
                                            if (util.getDistance(instance, loc) < radius) {
                                                instance.x = loc.x;
                                                instance.y = loc.y;
                                            }
                                        });
                                    }
                                } break;
                                case 12: { // Stealth Mode
                                    if (socket.permissions === 3) {
                                        body.stealthMode = !body.stealthMode;
                                        body.settings.leaderboardable = !body.stealthMode;
                                        body.alpha = +!body.stealthMode;
                                        body.sendMessage(`Stealth mode ${body.stealthMode ? "enabled" : "disabled"}.`);
                                    }
                                } break;
                                case 13: {
                                    if (socket.permissions === 3) {
                                        let loc = {
                                            x: body.x + body.control.target.x,
                                            y: body.y + body.control.target.y
                                        };
                                        loopThrough(entities, instance => {
                                            if (util.getDistance(instance, loc) < instance.SIZE) {
                                                body.controllers = [];
                                                body.passive = false;
                                                // Kill the old body
                                                setTimeout(() => {
                                                    if (body != null) {
                                                        body.invuln = false;
                                                        body.kill();
                                                    }
                                                }, 5000);
                                                instance.sendMessage("You have been taken over!");
                                                player.body = instance;
                                                player.body.refreshBodyAttributes();
                                                player.body.sendMessage = (content, color = 9) => socket.talk("m", content, color, false);
                                                player.body.controllers = [new io_listenToPlayer(player.body, player)];
                                                player.body.sendMessage("You have taken over the entity!");
                                            }
                                        });
                                    }
                                } break;
                                default: {
                                    socket.kick("Unknown cheat index.");
                                    return 1;
                                } break;
                            }
                        }
                    }
                        break;
                    case "1": { // Developer commands
                        if (m.length < 2 || typeof m[0] !== "number") {
                            socket.kick("Invalid command.");
                            return 1;
                        }
                        if (m[0] === -1) {
                            const commands = terminalCommands.permissions[socket.permissions || 0].map(name => {
                                return `${name} - Useage: <code>${terminalCommands.find(entry => entry.permissions === name).usage}</code>`;
                            });
                            if (!commands.length) return socket.talk("Q", "info", "You are unable to use any commands.");
                            socket.talk("Q", "info", `You are able to use the following commands:<br/>- ${commands.join("<br/>- ")}`);
                            return;
                        }
                        if (player.body) {
                            let body = socket.executeEntity ? socket.executeEntity : player.body;
                            if (terminalCommands[m[0]]) {
                                if (!terminalCommands.checkPermissions(socket, m[0])) return socket.talk("Q", "info", "You are not authorized to use this command.");
                                terminalCommands[m[0]].callback(socket, m, body);
                            }
                        }
                    } break;
                    case "cv": {
                        if (m.length !== 1 || typeof m[0] !== "string") {
                            socket.kick("Invalid CV request.");
                            return 1;
                        }
                        if (player.body && !player.body.isCarrier) {
                            switch (m[0]) {
                                case "relinquish": { // Relinquish Squadron
                                    player.body.controllingSquadron = false;
                                    const squadron = player.body.guns.find(gun => gun.launchSquadron && gun.children.length);
                                    if (squadron) {
                                        for (const child of squadron.children) {
                                            child.kill();
                                        }
                                        player.body.sendMessage("Squadron relinquished.");
                                    }
                                } break;
                                case "heBomb": case "apBomb": case "skipBomb": case "sapBomb": case "carpetBomb": { // launch Dive / Skip Bombers
                                    const gun = player.body.guns.find(r => r.launchSquadron === m[0]);
                                    if (gun && (Date.now() - gun.coolDown.time >= 10000 + (gun.countsOwnKids * 1000)) && !player.body.controllingSquadron) {
                                        gun.coolDown.time = Date.now();
                                        let gx = gun.offset * Math.cos(gun.direction + gun.angle + gun.body.facing) + (1.5 * gun.length - gun.width * gun.settings.size / 2) * Math.cos(gun.angle + gun.body.facing),
                                            gy = gun.offset * Math.sin(gun.direction + gun.angle + gun.body.facing) + (1.5 * gun.length - gun.width * gun.settings.size / 2) * Math.sin(gun.angle + gun.body.facing);
                                        for (let i = 0; i < gun.countsOwnKids; i++) setTimeout(() => gun.fire(gx, gy, gun.body.skill, true), 75 * i);
                                        setTimeout(() => {
                                            player.body.controllingSquadron = true;
                                            player.body.sendMessage("Right click to fire.");
                                            player.body.sendMessage("Squadron airborne.");
                                        }, 75 * gun.countsOwnKids);
                                    }
                                } break;
                                case "torpedo": { // launch Torpedo Bombers
                                    const gun = player.body.guns.find(r => r.launchSquadron === "torpedo");
                                    if (gun && (Date.now() - gun.coolDown.time >= 10000 + (gun.countsOwnKids * 1000)) && !player.body.controllingSquadron) {
                                        gun.coolDown.time = Date.now();
                                        let gx = gun.offset * Math.cos(gun.direction + gun.angle + gun.body.facing) + (1.5 * gun.length - gun.width * gun.settings.size / 2) * Math.cos(gun.angle + gun.body.facing),
                                            gy = gun.offset * Math.sin(gun.direction + gun.angle + gun.body.facing) + (1.5 * gun.length - gun.width * gun.settings.size / 2) * Math.sin(gun.angle + gun.body.facing);
                                        for (let i = 0; i < gun.countsOwnKids; i++) setTimeout(() => gun.fire(gx, gy, gun.body.skill, true), 100 * i);
                                        setTimeout(() => {
                                            player.body.controllingSquadron = true;
                                            player.body.sendMessage("Right click to fire.");
                                        }, 100 * gun.countsOwnKids);
                                    }
                                } break;
                                case "heRocket": case "apRocket": case "sapRocket": { // launch Rocket Attack Planes
                                    const gun = player.body.guns.find(r => r.launchSquadron === m[0]);
                                    if (gun && (Date.now() - gun.coolDown.time >= 10000 + (gun.countsOwnKids * 1000)) && !player.body.controllingSquadron) {
                                        gun.coolDown.time = Date.now();
                                        let gx = gun.offset * Math.cos(gun.direction + gun.angle + gun.body.facing) + (1.5 * gun.length - gun.width * gun.settings.size / 2) * Math.cos(gun.angle + gun.body.facing),
                                            gy = gun.offset * Math.sin(gun.direction + gun.angle + gun.body.facing) + (1.5 * gun.length - gun.width * gun.settings.size / 2) * Math.sin(gun.angle + gun.body.facing);
                                        for (let i = 0; i < gun.countsOwnKids; i++) setTimeout(() => gun.fire(gx, gy, gun.body.skill, true), 50 * i);
                                        setTimeout(() => {
                                            player.body.controllingSquadron = true;
                                            player.body.sendMessage("Right click to fire.");
                                        }, 50 * gun.countsOwnKids);
                                    }
                                } break;
                            }
                        }
                    } break;
                    case "sub": {
                        if (player.body != null && player.body.submarine && player.body.submarine.maxAir > 0) {
                            player.body.submarine.submerged = !player.body.submarine.submerged;
                        }
                    } break;
                    case "A": {
                        if (player.body != null) return 1;
                        let possible = entities.map(entry => {
                            if (entry.type === "miniboss") return entry;
                            if (entry.isDominator || entry.isMothership || entry.isArenaCloser) return entry;
                            if (c.MODE === "tdm" && -socket.rememberedTeam === entry.team && entry.type === "tank" && entry.bond == null) return entry;
                            return false;
                        }).filter(instance => !!instance);
                        if (!possible.length) {
                            socket.talk("m", "There are no entities to spectate!");
                            return 1;
                        }
                        let entity;
                        do {
                            entity = ran.choose(possible);
                        } while (entity === socket.spectateEntity && possible.length > 1);
                        socket.spectateEntity = entity;
                        socket.talk("m", `You are now spectating ${entity.name.length ? entity.name : "An unnamed player"}! (${entity.label})`);
                    }
                        break;
                    case "H": {
                        if (player.body == null) return 1;
                        let body = player.body;
                        if (body.underControl) {
                            body.giveUp(player, body.isDominator ? "" : undefined);
                            socket.talk("m", "You are no longer controling the entity.");
                            return 1;
                        }
                        if (c.MOTHERSHIP_LOOP) {
                            let motherships = entities.map(entry => {
                                if (entry.isMothership && entry.team === player.body.team && !entry.underControl) return entry;
                            }).filter(instance => instance);
                            if (!motherships.length) {
                                socket.talk("m", "There are no motherships available that are on your team!");
                                return 1;
                            }
                            let mothership = motherships.shift();
                            mothership.controllers = [];
                            mothership.underControl = true;
                            player.body = mothership;
                            body.kill();
                            player.body.become(player);
                            player.body.FOV += 0.5;
                            player.body.refreshBodyAttributes();
                            player.body.name = body.name;
                            player.body.sendMessage('You are now controlling the mothership!');
                            player.body.sendMessage("Press H to relinquish control of the mothership!");
                        } else if (c.DOMINATOR_LOOP) {
                            let dominators = entities.map(entry => {
                                if (entry.isDominator && entry.team === player.body.team && !entry.underControl) return entry;
                            }).filter(instance => instance);
                            if (!dominators.length) {
                                socket.talk("m", "There are no dominators available that are on your team!");
                                return 1;
                            }
                            let dominator = dominators.shift();
                            dominator.controllers = [];
                            dominator.underControl = true;
                            player.body = dominator;
                            body.kill();
                            player.body.become(player, true);
                            player.body.FOV += 0.5;
                            player.body.refreshBodyAttributes();
                            player.body.name = body.name;
                            player.body.sendMessage('You are now controlling the dominator!');
                            player.body.sendMessage("Press H to relinquish control of the dominator!");
                        } else socket.talk("m", "You cannot use this.");
                    }
                        break;
                }
            }
            // Monitor traffic and handle inactivity disconnects
            function traffic(socket) {
                let strikes = 0;
                // This function will be called in the slow loop
                return () => {
                    // Kick if it's d/c'd
                    if (util.time() - socket.status.lastHeartbeat > c.maxHeartbeatInterval) {
                        socket.kick('Heartbeat lost.');
                        return 0;
                    }
                    // Add a strike if there's more than 50 requests in a second
                    if (socket.status.requests > 50) {
                        strikes++;
                    } else {
                        strikes = 0;
                    }
                    // Kick if we've had 3 violations in a row
                    if (strikes > 3) {
                        socket.kick('Socket traffic volume violation!');
                        return 0;
                    }
                    // Reset the requests
                    socket.status.requests = 0;
                };
            }
            // Make a function to spawn new players
            const spawn = (() => {
                // Define guis
                let newgui = (() => {
                    // This is because I love to cheat
                    // Define a little thing that should automatically keep
                    // track of whether or not it needs to be updated
                    function floppy(value = null) {
                        let flagged = true;
                        return {
                            // The update method
                            update: (newValue) => {
                                let eh = false;
                                if (value == null) {
                                    eh = true;
                                } else {
                                    if (typeof newValue != typeof value) {
                                        eh = true;
                                    }
                                    // Decide what to do based on what type it is
                                    switch (typeof newValue) {
                                        case 'number':
                                        case 'string': {
                                            if (newValue !== value) {
                                                eh = true;
                                            }
                                        }
                                            break;
                                        case 'object': {
                                            if (Array.isArray(newValue)) {
                                                if (newValue.length !== value.length) {
                                                    eh = true;
                                                } else {
                                                    for (let i = 0, len = newValue.length; i < len; i++) {
                                                        if (newValue[i] !== value[i]) eh = true;
                                                    }
                                                }
                                                break;
                                            }
                                        } // jshint ignore:line
                                        default:
                                            util.error(newValue);
                                            throw new Error('Unsupported type for a floppyvar!');
                                    }
                                }
                                // Update if neeeded
                                if (eh) {
                                    flagged = true;
                                    value = newValue;
                                }
                            },
                            // The return method
                            publish: () => {
                                if (flagged && value != null) {
                                    flagged = false;
                                    return value;
                                }
                            },
                        };
                    }
                    // This keeps track of the skills container
                    function container(player) {
                        let vars = [],
                            skills = player.body.skill,
                            out = [],
                            statnames = ['atk', 'hlt', 'spd', 'str', 'pen', 'dam', 'rld', 'mob', 'rgn', 'shi'];
                        // Load everything (b/c I'm too lazy to do it manually)
                        for (let i = 0; i < statnames.length; i++) {
                            vars.push(floppy());
                            vars.push(floppy());
                            vars.push(floppy());
                        }
                        return {
                            update: () => {
                                let needsupdate = false,
                                    i = 0;
                                // Update the things
                                for (let j = 0; j < statnames.length; j++) {
                                    let a = statnames[j];
                                    vars[i++].update(skills.title(a));
                                    vars[i++].update(skills.cap(a));
                                    vars[i++].update(skills.cap(a, true));
                                }
                                /* This is a for and not a find because we need
                                 * each floppy cyles or if there's multiple changes
                                 * (there will be), we'll end up pushing a bunch of
                                 * excessive updates long after the first and only
                                 * needed one as it slowly hits each updated value
                                 */
                                for (let j = 0; j < vars.length; j++)
                                    if (vars[j].publish() != null) needsupdate = true;
                                if (needsupdate) {
                                    // Update everything
                                    for (let j = 0; j < statnames.length; j++) {
                                        let a = statnames[j];
                                        out.push(skills.title(a));
                                        out.push(skills.cap(a));
                                        out.push(skills.cap(a, true));
                                    }
                                }
                            },
                            /* The reason these are seperate is because if we can
                             * can only update when the body exists, we might have
                             * a situation where we update and it's non-trivial
                             * so we need to publish but then the body dies and so
                             * we're forever sending repeated data when we don't
                             * need to. This way we can flag it as already sent
                             * regardless of if we had an update cycle.
                             */
                            publish: () => {
                                if (out.length) {
                                    let o = out.splice(0, out.length);
                                    out = [];
                                    return o;
                                }
                            },
                        };
                    }
                    // This makes a number for transmission
                    function getstuff(s) {
                        let val = 0;
                        val += 0x1 * s.amount('atk');
                        val += 0x10 * s.amount('hlt');
                        val += 0x100 * s.amount('spd');
                        val += 0x1000 * s.amount('str');
                        val += 0x10000 * s.amount('pen');
                        val += 0x100000 * s.amount('dam');
                        val += 0x1000000 * s.amount('rld');
                        val += 0x10000000 * s.amount('mob');
                        val += 0x100000000 * s.amount('rgn');
                        val += 0x1000000000 * s.amount('shi');
                        return val.toString(36);
                    }
                    // These are the methods
                    function update(gui) {
                        let b = gui.master.body;
                        // We can't run if we don't have a body to look at
                        if (!b) return 0;
                        gui.bodyid = b.id;
                        // Update most things
                        gui.fps.update(Math.min(1, global.fps / roomSpeed / 1000 * 30));
                        gui.color.update(gui.master.teamColor);
                        gui.label.update(b.index);
                        gui.score.update(b.skill.score);
                        gui.points.update(b.skill.points);
                        // Update the upgrades
                        let upgrades = [];
                        for (let i = 0; i < b.upgrades.length; i++)
                            if (b.skill.level >= b.upgrades[i].level) upgrades.push(b.upgrades[i].index);
                        gui.upgrades.update(upgrades);
                        // Update the stats and skills
                        gui.stats.update();
                        gui.skills.update(getstuff(b.skill));
                        // Update physics
                        gui.accel.update(b.acceleration);
                        gui.topspeed.update(c.SANDBOX ? b.sandboxId : -b.team * room.partyHash);
                    }

                    function publish(gui) {
                        let o = {
                            fps: gui.fps.publish(),
                            label: gui.label.publish(),
                            score: gui.score.publish(),
                            points: gui.points.publish(),
                            upgrades: gui.upgrades.publish(),
                            color: gui.color.publish(),
                            statsdata: gui.stats.publish(),
                            skills: gui.skills.publish(),
                            accel: gui.accel.publish(),
                            top: gui.topspeed.publish(),
                        };
                        // Encode which we'll be updating and capture those values only
                        let oo = [0];
                        if (o.fps != null) {
                            oo[0] += 0x0001;
                            oo.push(o.fps || 1);
                        }
                        if (o.label != null) {
                            oo[0] += 0x0002;
                            oo.push(o.label);
                            oo.push(o.color || gui.master.teamColor);
                            oo.push(gui.bodyid);
                        }
                        if (o.score != null) {
                            oo[0] += 0x0004;
                            oo.push(o.score);
                        }
                        if (o.points != null) {
                            oo[0] += 0x0008;
                            oo.push(o.points);
                        }
                        if (o.upgrades != null) {
                            oo[0] += 0x0010;
                            oo.push(o.upgrades.length, ...o.upgrades);
                        }
                        if (o.statsdata != null) {
                            oo[0] += 0x0020;
                            oo.push(...o.statsdata);
                        }
                        if (o.skills != null) {
                            oo[0] += 0x0040;
                            oo.push(o.skills);
                        }
                        if (o.accel != null) {
                            oo[0] += 0x0080;
                            oo.push(o.accel);
                        }
                        if (o.top != null) {
                            oo[0] += 0x0100;
                            oo.push(o.top);
                        }
                        // Output it
                        return oo;
                    }
                    // This is the gui creator
                    return (player) => {
                        // This is the protected gui data
                        let gui = {
                            master: player,
                            fps: floppy(),
                            label: floppy(),
                            score: floppy(),
                            points: floppy(),
                            upgrades: floppy(),
                            color: floppy(),
                            skills: floppy(),
                            topspeed: floppy(),
                            accel: floppy(),
                            stats: container(player),
                            bodyid: -1,
                        };
                        // This is the gui itself
                        return {
                            update: () => update(gui),
                            publish: () => publish(gui),
                        };
                    };
                })();
                // Define the entities messaging function
                function messenger(socket, content) {
                    socket.talk('m', content);
                }
                // The returned player definition function
                return (socket, name) => {
                    let player = {},
                        loc = {};
                    // Find the desired team (if any) and from that, where you ought to spawn
                    if (!socket.group && c.GROUPS) groups.addMember(socket, socket.party);
                    player.team = socket.rememberedTeam;
                    switch (room.gameMode) {
                        case "tdm": {
                            if (player.team <= c.TEAMS && player.team > 0 || player.team == null) {
                                let team = getTeam();
                                // Choose from one of the least ones
                                if (player.team == null || (player.team != null && player.team !== team && global.defeatedTeams.includes(-player.team))) player.team = team;
                                if (socket.party) {
                                    let team = socket.party / room.partyHash;
                                    if (!c.TAG && team > 0 && team < c.TEAMS + 1 && Number.isInteger(team) && !global.defeatedTeams.includes(-team)) {
                                        player.team = team;
                                        console.log("Party Code with team:", team, "Party:", socket.party);
                                    }
                                }
                                // Make sure you're in a base
                                if (room['bas' + player.team].length)
                                    do {
                                        loc = room.randomType('bas' + player.team);
                                    } while (dirtyCheck(loc, 50));
                                else
                                    do {
                                        loc = room.gaussInverse(5);
                                    } while (dirtyCheck(loc, 50));
                            } else
                                do {
                                    loc = room.gaussInverse(5);
                                } while (dirtyCheck(loc, 50));
                        }
                            break;
                        default:
                            do {
                                if (socket.group) loc = room.near(socket.group.getSpawn(), 300);
                                else loc = room.gaussInverse(5);
                            } while (dirtyCheck(loc, 50));
                    }
                    socket.rememberedTeam = player.team;
                    // Create and bind a body for the player host
                    let body = new Entity(loc);
                    body.socket = socket;
                    if (socket.sandboxId) {
                        body.sandboxId = socket.sandboxId;
                    }
                    body.protect();
                    body.isPlayer = true;
                    body.define(c.NAVAL_SHIPS ? Class.navalShips : (c.HIDE_AND_SEEK && player.team == 2) ? Class.landmine : survival.started ? Class.observer : Class.basic); // Start as a basic tank
                    body.name = name; // Define the name
                    if (c.SURVIVAL && !survival.started) {
                        survival.players.push(body);
                        body.onDead = () => survival.removePlayer(body);
                        body.godmode = true;
                    }
                    // Dev hax
                    {
                        const beta = c.TOKENS.find(r => r[0] === socket.key);
                        if (beta) {
                            socket.discordID = beta[1];
                            body.nameColor = beta[2];
                            socket.permissions = beta[3];
                        } else {
                            let code = accountEncryption.decode(socket.key);
                            if (code.startsWith("PASSWORD_") && code.endsWith("_PASSWORD")) {
                                code = code.replace("PASSWORD_", "").replace("_PASSWORD", "").split("-");
                                socket.discordID = code[0];
                                body.nameColor = "#" + code[1];
                            }
                        }
                    }
                    socket.talk("Z", body.nameColor);
                    body.addController(new io_listenToPlayer(body, player)); // Make it listen
                    body.sendMessage = content => messenger(socket, content); // Make it speak
                    socket.spectateEntity = null;
                    body.invuln = true; // Make it safe
                    player.body = body;
                    // Decide how to color and team the body
                    switch (room.gameMode) {
                        case "tdm": {
                            body.team = -player.team;
                            body.color = [10, 11, 12, 15][player.team - 1] || 3;
                        }
                            break;
                        default: {
                            if (socket.group) {
                                body.team = -player.team;
                                body.color = socket.group.color;
                                //socket.talk("J", player.team * 12345);
                                // col
                            } else body.color = (c.RANDOM_COLORS) ? ran.choose([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]) : 11; // red
                        }
                    }
                    // Decide what to do about colors when sending updates and stuff
                    player.teamColor = (!c.RANDOM_COLORS && room.gameMode === 'ffa' && !socket.group) ? 10 : body.color; // blue
                    // Set up the targeting structure
                    player.target = {
                        x: 0,
                        y: 0
                    };
                    // Set up the command structure
                    player.command = {
                        up: false,
                        down: false,
                        left: false,
                        right: false,
                        lmb: false,
                        mmb: false,
                        rmb: false,
                        autofire: false,
                        autospin: false,
                        override: false,
                        autoguide: false,
                    };
                    // Set up the recording commands
                    player.records = (() => {
                        let begin = util.time();
                        return () => {
                            return [
                                player.body.skill.score,
                                Math.floor((util.time() - begin) / 1000),
                                player.body.killCount.solo,
                                player.body.killCount.assists,
                                player.body.killCount.bosses,
                                player.body.killCount.killers.length, ...player.body.killCount.killers
                            ];
                        };
                    })();
                    // Set up the player's gui
                    player.gui = newgui(player);
                    // Save the the player
                    player.socket = socket;
                    players.push(player);
                    // Focus on the new player
                    socket.camera.x = body.x;
                    socket.camera.y = body.y;
                    socket.camera.fov = 2000;
                    // Mark it as spawned
                    socket.status.hasSpawned = true;
                    body.sendMessage('You have spawned! Welcome to the game.');
                    body.sendMessage('You will be invulnerable until you move or shoot.');
                    if (c.SANDBOX) {
                        [
                            "Press CTRL+SHIFT+F to open the terminal! Type 'help' to see what commands you can use",
                            "To get people to join your room, send them your party link!",
                            "Welcome to sandbox!"
                        ].forEach(body.sendMessage);
                    }
                    // Move the client camera
                    socket.talk('c', socket.camera.x, socket.camera.y, socket.camera.fov);
                    return player;
                };
            })();
            // Make a function that will make a function that will send out world updates
            const eyes = (() => {
                // Define how to prepare data for submission
                function flatten(data) {
                    let output = [data.type]; // We will remove the first entry in the persepective method
                    if (data.type & 0x01) {
                        output.push(
                            // 1: facing
                            data.facing,
                            // 2: layer
                            data.layer);
                    } else {
                        output.push(
                            // 1: id
                            data.id,
                            // 2: index
                            data.index,
                            // 3: x
                            data.x,
                            // 4: y
                            data.y,
                            // 5: vx
                            data.vx,
                            // 6: vy
                            data.vy,
                            // 7: size
                            data.size,
                            // 8: facing
                            data.facing,
                            // 9: vfacing
                            data.vfacing,
                            // 10: twiggle
                            data.twiggle,
                            // 11: layer
                            data.layer,
                            // 12: color
                            data.color,
                            // 13: health
                            Math.ceil(255 * data.health),
                            // 14: shield
                            Math.round(255 * data.shield),
                            // 15: alpha
                            Math.round(255 * data.alpha),
                            // 16: width
                            data.sizeRatio[0],
                            // 17: height
                            data.sizeRatio[1]
                        );
                        if (data.type & 0x04) {
                            output.push(
                                // 17: name
                                data.name,
                                // 18: score
                                data.score);
                        }
                    }
                    // Add the gun data to the array
                    let gundata = [data.guns.length];
                    for (let i = 0; i < data.guns.length; i++) gundata.push(data.guns[i].time, data.guns[i].power);
                    output.push(...gundata);
                    // For each turret, add their own output
                    let turdata = [data.turrets.length];
                    for (let i = 0; i < data.turrets.length; i++) turdata.push(...flatten(data.turrets[i]));
                    // Push all that to the array
                    output.push(...turdata);
                    // Return it
                    return output;
                }

                function perspective(e, player, data) {
                    if (player.body != null) {
                        if (player.body.id === e.master.id) {
                            data = data.slice(); // So we don't mess up references to the original
                            // Set the proper color if it's on our team
                            let colorOverride = false;
                            if (player.rainbowInterval != null || player.body.type !== "tank") colorOverride = true;
                            if (room.gameMode === "ffa" && player.body.color !== 11) colorOverride = true;
                            if (room.gameMode === "tdm" && player.body.color !== player.teamColor) colorOverride = true;
                            data[12] = colorOverride ? e.color : player.teamColor;
                            // And make it force to our mouse if it ought to
                            if (player.command.autospin || player.body.facingType === "smoothWithMotion") {
                                data[10] = 1;
                            }
                        }
                        if (player.body.team === e.source.team && c.GROUPS) { // GROUPS
                            data = data.slice();
                            data[12] = player.teamColor;
                        }
                    }
                    return data;
                }

                function check(camera, obj) {
                    let a = Math.abs(obj.x - camera.x) < camera.fov * 0.6 + 1.5 * (obj.size * (obj.width || 1)) + 100;
                    let b = Math.abs(obj.y - camera.y) < camera.fov * 0.6 * 0.5625 + 1.5 * (obj.size * (obj.height || 1)) + 100;
                    return a && b;
                }
                // The actual update world function
                return socket => {
                    let lastVisibleUpdate = 0;
                    let nearby = [];
                    let x = -1000;
                    let y = -1000;
                    let fov = 0;
                    let o = {
                        add: e => {
                            if (check(socket.camera, e)) nearby.push(e);
                        },
                        remove: e => {
                            let i = nearby.indexOf(e);
                            if (i !== -1) util.remove(nearby, i);
                        },
                        check: (e, f) => {
                            return check(socket.camera, e);
                        }, //Math.abs(e.x - x) < e.size + f*fov && Math.abs(e.y - y) < e.size + f*fov; },
                        gazeUpon: () => {
                            logs.network.set();
                            let player = socket.player,
                                camera = socket.camera;
                            // If nothing has changed since the last update, wait (approximately) until then to update
                            let rightNow = room.lastCycle;
                            // ...elseeeeee...
                            // Update the record.
                            camera.lastUpdate = rightNow;
                            // Get the socket status
                            socket.status.receiving++;
                            // Now prepare the data to emit
                            let setFov = camera.fov;
                            // If we are alive, update the camera
                            if (player.body != null) {
                                // But I just died...
                                if (player.body.isDead()) {
                                    socket.status.deceased = true;
                                    // Let the client know it died
                                    const records = player.records();
                                    if (!socket.awaitingSpawn) {
                                        socket.talk('F', ...records);
                                    }
                                    // If we have a valid record, let's verify it!
                                    if (records[0] > 500000) { // Score > 500k
                                        const totalKills = Math.round(records[2] + (records[3] / 2) + (records[4] * 2));
                                        if (totalKills >= Math.floor(records[0] / 100000)) { // Total kills >= 100k(s) aka the amount of kills is greater than or equal to your score / 100k, 1 kill per 100k
                                            bot.logRecord({
                                                name: socket.name || "Unnamed",
                                                discordID: socket.discordID,
                                                tank: player.body.label,
                                                score: records[0],
                                                kills: records[2],
                                                assists: records[3],
                                                bosses: records[4],
                                                timeAlive: records[1]
                                            });
                                        }
                                    }
                                    // Remove the body
                                    player.body = null;
                                }
                                // I live!
                                else if (player.body.photo) {
                                    // Update camera position and motion
                                    camera.x = player.body.photo.cx;
                                    camera.y = player.body.photo.cy;
                                    camera.vx = player.body.photo.vx;
                                    camera.vy = player.body.photo.vy;
                                    // Get what we should be able to see
                                    setFov = player.body.fov;
                                    // Get our body id
                                    player.viewId = player.body.id;
                                }
                            }
                            if (player.body == null) { // u dead bro
                                setFov = 2000;
                                if (socket.spectateEntity != null) {
                                    if (socket.spectateEntity) {
                                        camera.x = socket.spectateEntity.x;
                                        camera.y = socket.spectateEntity.y;
                                    }
                                }
                            }
                            // Smoothly transition view size
                            camera.fov += Math.max((setFov - camera.fov) / 30, setFov - camera.fov);
                            // Update my stuff
                            x = camera.x;
                            y = camera.y;
                            fov = camera.fov;
                            // Find what the user can see.
                            // Update which entities are nearby
                            if (camera.lastUpdate - lastVisibleUpdate > c.visibleListInterval) {
                                // Update our timer
                                lastVisibleUpdate = camera.lastUpdate;
                                // And update the nearby list
                                nearby = [];
                                for (let i = 0, l = entities.length; i < l; i++) if (check(socket.camera, entities[i])) nearby.push(entities[i]);
                            }
                            // Look at our list of nearby entities and get their updates
                            let visible = [];
                            for (let i = 0, l = nearby.length; i < l; i++) {
                                if (nearby[i].photo) {
                                    //if (Math.abs(e.x - x) < fov / 2 + 1.5 * e.size && Math.abs(e.y - y) < fov / 2 * (9 / 16) + 1.5 * e.size) {
                                    // Grab the photo
                                    if (!c.SANDBOX || nearby[i].sandboxId === socket.sandboxId) {
                                        if (!nearby[i].flattenedPhoto) nearby[i].flattenedPhoto = flatten(nearby[i].photo);
                                        const output = perspective(nearby[i], player, nearby[i].flattenedPhoto);
                                        if (output) {
                                            if (player.body != null) {
                                                if (player.body.submarine.submerged != nearby[i].submarine.submerged) {
                                                    output[15] = Math.round(255 * (+player.body.submarine.submerged * .25));
                                                }
                                            }
                                            visible.push(output);
                                        }
                                    }
                                    //}
                                }
                            }
                            // Update the gui
                            player.gui.update();
                            // Send it to the player
                            if (player.body != null && player.body.submarine && player.body.submarine.maxAir > 0) {
                                const data = player.body.submarine;
                                socket.talk("sub", true, data.air, data.submerged);
                            } else {
                                socket.talk("sub", false);
                            }
                            socket.talk('u', rightNow, camera.x, camera.y, setFov, camera.vx, camera.vy, ...player.gui.publish(), visible.length, ...visible.flat());
                            logs.network.mark();
                        },
                    };
                    views.push(o);
                    return o;
                };
            })();
            // Make a function that will send out minimap
            // and leaderboard updates. We'll also start
            // the mm/lb updating loop here. It runs at 1Hz
            // and also kicks inactive sockets
            const broadcast = (() => {
                // This is the public information we need for broadcasting
                let readlb;
                // Util
                let getBarColor = entry => {
                    if (c.GROUPS && entry.isPlayer) return entry.color;
                    switch (entry.team) {
                        case -100:
                            return entry.color
                        case -1:
                            return 10
                        case -2:
                            return 11
                        case -3:
                            return 12
                        case -4:
                            return 15
                        default:
                            if (room.gameMode[0] === '2' || room.gameMode[0] === '3' || room.gameMode[0] === '4') return entry.color;
                            return 12;
                    }
                }
                // Delta Calculator
                const Delta = class {
                    constructor(dataLength, finder) {
                        this.dataLength = dataLength
                        this.finder = finder
                        this.now = finder()
                    }
                    update() {
                        let old = this.now
                        let now = this.finder()
                        this.now = now
                        let oldIndex = 0
                        let nowIndex = 0
                        let updates = []
                        let updatesLength = 0
                        let deletes = []
                        let deletesLength = 0
                        while (oldIndex < old.length && nowIndex < now.length) {
                            let oldElement = old[oldIndex]
                            let nowElement = now[nowIndex]
                            if (oldElement.id === nowElement.id) { // update
                                nowIndex++
                                oldIndex++
                                let updated = false
                                for (let i = 0; i < this.dataLength; i++)
                                    if (oldElement.data[i] !== nowElement.data[i]) {
                                        updated = true
                                        break
                                    }
                                if (updated) {
                                    updates.push(nowElement.id, ...nowElement.data)
                                    updatesLength++
                                }
                            } else if (oldElement.id < nowElement.id) { // delete
                                deletes.push(oldElement.id)
                                deletesLength++
                                oldIndex++
                            } else { // create
                                updates.push(nowElement.id, ...nowElement.data)
                                updatesLength++
                                nowIndex++
                            }
                        }
                        for (let i = oldIndex; i < old.length; i++) {
                            deletes.push(old[i].id)
                            deletesLength++
                        }
                        for (let i = nowIndex; i < now.length; i++) {
                            updates.push(now[i].id, ...now[i].data)
                            updatesLength++
                        }
                        let reset = [0, now.length]
                        for (let element of now) reset.push(element.id, ...element.data)
                        let update = [deletesLength, ...deletes, updatesLength, ...updates]
                        return {
                            reset,
                            update
                        }
                    }
                }
                // Deltas
                let minimapAll = new Delta(7, () => {
                    let all = [];
                    for (let my of entities.concat(Object.values(global.squadronPoints))) {
                        if ((my.type === 'wall' && my.alpha > 0.2) || my.type === 'miniboss' || (my.type === 'tank' && my.lifetime) || my.isMothership || my.showsOnMap) {
                            all.push({
                                id: my.id,
                                data: [
                                    (my.type === 'wall' || my.isSquadron) ? my.isSquadron ? 3 : my.shape === 4 ? 2 : 1 : 0,
                                    util.clamp(Math.floor(256 * my.x / room.width), 0, 255),
                                    util.clamp(Math.floor(256 * my.y / room.height), 0, 255),
                                    my.color,
                                    Math.round(my.SIZE),
                                    my.width || 1,
                                    my.height || 1
                                ]
                            });
                        }
                    }
                    return all;
                });
                let teamIDs = [1, 2, 3, 4];
                if (c.GROUPS) {
                    for (let i = 1; i < 100; i++) teamIDs[i - 1] = i;
                    /*for (let i = 0; i < global.activeGroups.length; i ++) {
                        teamIDs[global.activeGroups[i].teamID - 1] = global.activeGroups[i].teamID;
                        console.log(teamIDs);
                    }*/
                }
                let minimapTeams = teamIDs.map(team => new Delta(3, () => {
                    let all = [];
                    for (let my of entities)
                        if (my.type === 'tank' && my.team === -team && my.master === my && !my.lifetime) all.push({
                            id: my.id,
                            data: [
                                util.clamp(Math.floor(256 * my.x / room.width), 0, 255),
                                util.clamp(Math.floor(256 * my.y / room.height), 0, 255),
                                my.color
                            ]
                        });
                    return all;
                }));
                let leaderboard = new Delta(6 + c.SANDBOX, () => {
                    let list = [];
                    if (c.TAG || c.SOCCER || c.KILL_RACE || c.HIDE_AND_SEEK || (c.EPICENTER && typeof epicenter === "object")) {
                        let epicenterScoreboard;
                        if (c.EPICENTER) {
                            epicenterScoreboard = epicenter.getScoreboard();
                        }
                        for (let i = 0; i < c.TEAMS; i++) {
                            let teamNames = ["BLUE", "RED", "GREEN", "PURPLE"];
                            let teamColors = [10, 11, 12, 15];
                            list.push({
                                id: i,
                                skill: {
                                    score: c.EPICENTER ? epicenterScoreboard.find(thing => thing.index === i).count : c.SOCCER ? soccer.scoreboard[i] : (c.KILL_RACE && typeof killRace === "object") ? killRace.data[i] : (c.HIDE_AND_SEEK && typeof hideAndSeek === "object") ? hideAndSeek.data[i] : 0
                                },
                                index: Class[c.TAG ? "tagMode" : c.SOCCER ? "soccerScoreboard" : (c.HIDE_AND_SEEK || c.EPICENTER) ? "hideAndSeek" : "killRace"].index,
                                name: teamNames[i],
                                color: teamColors[i],
                                nameColor: "#FFFFFF",
                                team: -i - 1
                            });
                        }
                    }
                    if (!c.KILL_RACE && !c.HIDE_AND_SEEK && !c.SOCCER && !c.EPICENTER) loopThrough(entities, function (instance) {
                        if (c.MOTHERSHIP_LOOP) {
                            if (instance.isMothership) list.push(instance);
                        } else if (c.TAG) {
                            let entry = list.find(r => r.team === instance.team);
                            if (entry && (instance.isPlayer || instance.isBot)) entry.skill.score++;
                        } else {
                            if (instance.settings.leaderboardable && instance.settings.drawShape && (instance.type === 'tank' || instance.killCount.solo || instance.killCount.assists)) list.push(instance);
                        }
                    });
                    let topTen = [];
                    for (let i = 0; i < 10 && list.length; i++) {
                        let top, is = 0
                        for (let j = 0; j < list.length; j++) {
                            let val = list[j].skill.score
                            if (val > is) {
                                is = val
                                top = j
                            }
                        }
                        if (is === 0) break
                        let entry = list[top];
                        topTen.push({
                            id: entry.id,
                            data: [
                                c.MOTHERSHIP_LOOP ? Math.round(entry.health.amount) : Math.round(entry.skill.score),
                                entry.index,
                                entry.name,
                                entry.color,
                                getBarColor(entry),
                                entry.nameColor
                            ]
                        });
                        if (c.SANDBOX) {
                            topTen[topTen.length - 1].data.push(entry.sandboxId);
                        }
                        list.splice(top, 1)
                    }
                    room.topPlayerID = topTen.length ? topTen[0].id : -1
                    return topTen.sort((a, b) => a.id - b.id);
                })
                // Periodically give out updates
                let subscribers = []
                const sandboxMinimaps = {};
                setInterval(() => {
                    logs.minimap.set();
                    let leaderboardUpdate = leaderboard.update();
                    if (c.SANDBOX) {
                        for (let i = 0; i < global.sandboxRooms.length; i++) {
                            const id = global.sandboxRooms[i].id;
                            if (sandboxMinimaps[id] == null) {
                                sandboxMinimaps[id] = new Delta(7, () => {
                                    let all = [];
                                    for (let my of entities) {
                                        if (my.sandboxId === id) {
                                            if ((my.type === 'wall' && my.alpha > 0.2) || my.type === 'miniboss' || (my.type === 'tank' && my.lifetime) || my.isMothership || my.showsOnMap) {
                                                all.push({
                                                    id: my.id,
                                                    data: [
                                                        (my.type === 'wall' || my.isMothership) ? my.shape === 4 ? 2 : 1 : 0,
                                                        util.clamp(Math.floor(256 * my.x / room.width), 0, 255),
                                                        util.clamp(Math.floor(256 * my.y / room.height), 0, 255),
                                                        my.color,
                                                        Math.round(my.SIZE),
                                                        my.width || 1,
                                                        my.height || 1
                                                    ]
                                                });
                                            }
                                        }
                                    }
                                    return all;
                                });
                            }
                        }
                        for (const ID in sandboxMinimaps) {
                            if (global.sandboxRooms.find(entry => entry.id === ID) == null) {
                                delete sandboxMinimaps[ID];
                            }
                        }
                        const newMaps = {};
                        for (const id in sandboxMinimaps) {
                            newMaps[id] = sandboxMinimaps[id].update();
                        }
                        for (let socket of subscribers) {
                            if (!socket.status.hasSpawned) continue;
                            let minimapUpdate = newMaps[socket.sandboxId];
                            if (socket.status.needsNewBroadcast) {
                                socket.talk('b', ...(minimapUpdate ? minimapUpdate.reset : [0, 0]), ...([0, 0]), ...(socket.anon ? [0, 0] : leaderboardUpdate.reset))
                                socket.status.needsNewBroadcast = false;
                            } else {
                                socket.talk('b', ...(minimapUpdate ? minimapUpdate.reset : [0, 0]), ...([0, 0]), ...(socket.anon ? [0, 0] : leaderboardUpdate.update))
                            }
                        }
                    } else {
                        let minimapUpdate = minimapAll.update();
                        let minimapTeamUpdates = minimapTeams.map(r => r.update());
                        for (let socket of subscribers) {
                            if (!socket.status.hasSpawned) continue;
                            let team = minimapTeamUpdates[socket.player.team - 1];
                            if (socket.status.needsNewBroadcast) {
                                socket.talk('b', ...minimapUpdate.reset, ...(team ? team.reset : [0, 0]), ...(socket.anon ? [0, 0] : leaderboardUpdate.reset))
                                socket.status.needsNewBroadcast = false
                            } else {
                                socket.talk('b', ...minimapUpdate.update, ...(team ? team.update : [0, 0]), ...(socket.anon ? [0, 0] : leaderboardUpdate.update))
                            }
                        }
                    }
                    logs.minimap.mark();
                    let time = util.time();
                    for (let socket of clients) {
                        if (socket.timeout.check(time)) socket.lastWords('K', "Socket timed out.");
                        if (time - socket.statuslastHeartbeat > c.maxHeartbeatInterval) socket.kick('Lost heartbeat.');
                    }
                }, 250);
                return {
                    subscribe(socket) {
                        subscribers.push(socket)
                    },
                    unsubscribe(socket) {
                        let i = subscribers.indexOf(socket)
                        if (i !== -1) util.remove(subscribers, i)
                    },
                }
            })()
            // Build the returned function
            // This function initalizes the socket upon connection
            let lastTime = 0;
            return (socket, req) => {
                if (Date.now() - lastTime < 250) return socket.terminate();
                lastTime = Date.now();
                // Get information about the new connection and verify it
                util.log('A client is trying to connect...');
                bot.util.log(bot, "player", "A client is connecting...");
                // Set it up
                socket.binaryType = 'arraybuffer';
                socket.connection = req;
                socket.key = '';
                socket.ip = -1;
                socket.fingerprint = (req.fingerprint || { hash: -1 }).hash;
                if (socket.fingerprint === -1) return socket.terminate();
                socket.id = id++;
                socket.spawnEntity = Class.icosagon;
                socket.name = "Unnamed";
                socket.player = {
                    camera: {},
                };
                socket.spectateEntity = null;
                socket.onerror = () => { };
                socket.timeout = (() => {
                    let mem = 0;
                    let timer = 0;
                    return {
                        set: val => {
                            if (mem !== val) {
                                mem = val;
                                timer = util.time();
                            }
                        },
                        check: time => {
                            return timer && time - timer > c.maxHeartbeatInterval;
                        }
                    };
                })();
                socket.awaiting = {};
                socket.awaitResponse = function (options, callback) {
                    socket.awaiting[options.packet] = {
                        callback: callback,
                        timeout: setTimeout(() => {
                            socket.kick("Did not responde?");
                            console.log("Didn't respond lol@");
                        }, options.timeout)
                    }
                }
                socket.resolveResponse = function (id, packet) {
                    if (socket.awaiting[id]) {
                        clearTimeout(socket.awaiting[id].timeout);
                        socket.awaiting[id].callback(packet);
                    }
                }
                // Set up the status container
                socket.status = {
                    verified: false,
                    receiving: 0,
                    deceased: true,
                    requests: 0,
                    hasSpawned: false,
                    needsFullMap: true,
                    needsNewBroadcast: true,
                    lastHeartbeat: util.time(),
                };
                // Set up loops
                socket.loops = (() => {
                    let nextUpdateCall = null; // has to be started manually
                    let trafficMonitoring = setInterval(() => traffic(socket), 1500);
                    broadcast.subscribe(socket)
                    // Return the loop methods
                    return {
                        setUpdate: timeout => {
                            nextUpdateCall = timeout;
                        },
                        cancelUpdate: () => {
                            clearTimeout(nextUpdateCall);
                        },
                        terminate: () => {
                            clearTimeout(nextUpdateCall);
                            clearTimeout(trafficMonitoring);
                            broadcast.unsubscribe(socket)
                        },
                    };
                })();
                // Set up the camera
                socket.camera = {
                    x: room.width / 2,
                    y: room.height / 2,
                    vx: 0,
                    vy: 0,
                    lastUpdate: util.time(),
                    lastDowndate: undefined,
                    fov: 2000,
                };
                // Set up the viewer
                socket.makeView = () => {
                    socket.view = eyes(socket);
                };
                socket.makeView();
                // Put the fundamental functions in the socket
                socket.kick = (reason, log = true) => kick(socket, reason, log);
                socket.ban = (reason, log = true) => ban(socket, reason, log);
                socket.talk = (...message) => {
                    if (socket.readyState === socket.OPEN) {
                        socket.send(protocol.encode(message), {
                            binary: true,
                        });
                    }
                }
                socket.lastWords = (...message) => {
                    if (socket.readyState === socket.OPEN) {
                        socket.send(protocol.encode(message), {
                            binary: true,
                        }, () => setTimeout(() => socket.terminate(), 1000));
                    }
                }
                socket.on('message', message => incoming(message, socket));
                socket.on('close', () => {
                    socket.loops.terminate();
                    close(socket);
                });
                socket.on('error', e => {
                    util.log('[ERROR]:');
                    util.error(e);
                });
                // Put the player functions in the socket
                socket.reallySpawn = function (spawnkill) {
                    if (players.indexOf(socket.player) != -1) {
                        util.remove(players, players.indexOf(socket.player));
                    }
                    // Free the old view
                    if (views.indexOf(socket.view) != -1) {
                        util.remove(views, views.indexOf(socket.view));
                        socket.makeView();
                    }
                    socket.awaitingSpawn = false;
                    socket.player = socket.spawn(socket.name);
                    if (spawnkill) {
                        setTimeout(function () {
                            socket.awaitingSpawn = true;
                            socket.player.body.sendMessage("Your sanctuaries have been destroyed. You may respawn when one is recontrolled.");
                            socket.player.body.kill();
                        }, 500);
                    }
                }
                socket.spawn = name => {
                    return spawn(socket, name);
                };
                // Log it
                clients.push(socket);
                socket.backlogData = new BacklogData(socket.id);
                util.log('[INFO] New socket opened');
                bot.util.log(bot, "player", "New socket opened!");
            };
        })()
    };
})();
module.exports = {
    sockets
};
