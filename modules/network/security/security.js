/*jslint node: true */
/*jshint -W061 */
/*global goog, Map, let */
"use strict";
// General requires
require('google-closure-library');
goog.require('goog.structs.PriorityQueue');
goog.require('goog.structs.QuadTree');
const fs = require("fs");
/*const blockerDB = require("./blocker.js");
const parseIPv4 = ip => {
    let [a, b, c, d] = ip.split(".").map(r => parseInt(r, 10));
    return (a << 24) | (b << 16) | (c << 8) | d;
};
const IPv4ASNDB = fs.readFileSync("./modules/network/security/GeoLite2-ASN-Blocks-IPv4.csv", "utf8").trim().split("\n").slice(1).map(line => {
    let [ip, mask, asn] = line.split(/[,/]/);
    return {
        ip: parseIPv4(ip),
        mask: +mask,
        asn: +asn
    };
});
const IPv4BadASNBlocks = IPv4ASNDB.filter(line => blockerDB.badASNs.includes(line.asn));
const binarySearch = (array, compare) => {
    let m = 0,
        n = array.length - 1;
    while (m <= n) {
        let k = (n + m) >> 1,
            cmp = compare(array[k]);
        if (cmp > 0) m = k + 1;
        else if (cmp < 0) n = k - 1;
        else return k;
    }
    return -m - 1;
};
const getASN = IPv4 => {
    if (!IPv4.includes(".")) return "Invalid IP specified.";
    return IPv4ASNDB[binarySearch(IPv4ASNDB, ({
        ip,
        mask,
        asn
    }) => {
        let dbOut = ip >>> (32 - mask),
            ipOut = parseIPv4(IPv4) >>> (32 - mask);
        return ipOut - dbOut;
    })].asn;
};*/
let securityDatabase = {
    bans: [{ // ||WAtcher||
        ip: "110.224.133.127",
        reason: "The decision is final."
    }],
    blackList: []
};
Object.keys(securityDatabase).forEach(key => {
    securityDatabase[key].removeItem = function(e) {
        const arr = [];
        for (let i = 0; i < this.length; i ++)
            if (this[i] !== e)
                arr.push(this[i]);
        this.length = 0;
        for (let i = 0; i < arr.length; i ++)
            this.push(arr[i]);
        return this;
    };
});

const verifySocket = (function() {
    const getIP = require("forwarded-for");
    const IPManager = require("./IPManager.js");
    const manager = new IPManager();
    // Whitelisted IPs - These IPs bypass the VPN detector - Put what they are and who whitelisted them next to the whitelist function
    manager.whitelistIP("72.10.96.30"); // My school - Oblivion
    manager.whitelistIP("104.225.189.8"); // My school - Oblivion
    const validOrigins = ["woomy.surge.sh"];
    function checkHeaders(headers) {
        const origin = headers.origin.replace("http://", "").replace("https://", "").replace("/", "");
        if (validOrigins.indexOf(origin) === -1) {
            bot.util.log(bot, "player", "Failed header verification! Origin: " + origin);
            return [0, "You may only connect to the game from the proper client."];
        }
        if (headers.upgrade !== "websocket") {
            bot.util.log(bot, "player", "Failed header verification! Upgrade: " + headers.upgrade);
            return [0, "Proxy detected."];
        }
        let agentIndex = 0;
        for (let agent of ["Mozilla", "AppleWebKit", "Chrome", "Safari"]) {
            if (headers["user-agent"].includes(agent)) {
                agentIndex ++;
            }
        }
        if (agentIndex === 0) {
            bot.util.log(bot, "player", "Failed header verification! User-Agent: " + headers["user-agent"]);
            return [0, "Unsupported client."];
        }
        return [1];
    }
    async function checkIP(socket, request, bypassVPNBlocker) {
        let ipAddress;
        try {
            ipAddress = getIP(request, request.headers).ip.split(":").pop()
        } catch (e) {
            console.log(e);
            return [0, "Invalid IP"];
        }
        if (ipAddress == null) return [0, "Attempting to spawn with a null IP adress."];
        if (await manager.checkIsVPN(ipAddress) && !bypassVPNBlocker) return [0, "VPN/Proxy Detected. Please disable it and try again."];
        /*if ((binarySearch(IPv4BadASNBlocks, ({ ip, mask, asn }) => {
            let dbOut = ip >>> (32 - mask),
                ipOut = parseIPv4(ipAddress) >>> (32 - mask);
            return ipOut - dbOut;
        }) >= 0 || blockerDB.torIPs.includes(ipAddress)) && !bypassVPNBlocker) return [0, "VPN detected. Please disable it and try again."];*/
        let same = 0;
        for (let socket of sockets.clients)
            if (socket.ip === ipAddress) same++;
        if (same >= c.tabLimit) return [0, "You have too many tabs open. Please close some tabs and try again."];
        for (let ban of securityDatabase.bans)
            if (ipAddress === ban.ip) return [0, "You were banned from the game for: " + ban.reason];
        for (let ban of securityDatabase.blackList)
            if (ipAddress === ban.ip) return [0, "Your IP has been temporarily blacklisted for: " + ban.reason];
        if (sockets.clients.length >= c.maxPlayers && !bypassVPNBlocker) return [0, `The max player limit for this server (${c.MAX_PLAYERS}) has been reached. Please try a different server or come back later.`];
        return [1, ipAddress];
    }
    return async function(socket, request, bypassVPNBlocker = false) {
        const headerCheck = checkHeaders(request.headers);
        if (headerCheck[0] === 0) return headerCheck;
        return await checkIP(socket, request, bypassVPNBlocker);
    }
})();

module.exports = {
    securityDatabase,
    checkIP: verifySocket
};
