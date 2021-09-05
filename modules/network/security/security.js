/*jslint node: true */
/*jshint -W061 */
/*global goog, Map, let */
"use strict";
// General requires
require('google-closure-library');
goog.require('goog.structs.PriorityQueue');
goog.require('goog.structs.QuadTree');
const fs = require("fs");
const blockerDB = require("./blocker.js");
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
};
let securityDatabase = {
    bans: [],
    blackList: []
};
Object.keys(securityDatabase).forEach(key => {
    securityDatabase[key].removeItem = function(e) {
        let arr = [];
        for (let i = 0; i < this.length; i ++)
            if (this[i] !== e)
                arr.push(this[i]);
        this.length = 0;
        for (let i = 0; i < arr.length; i ++)
            this.push(arr[i]);
        return this;
    };
});

function checkIP(socket, req, bypassVPNBlocker = false) {
    // Returns
    // 0 - Kick (Reason is arg 2)
    // 1 - Valid (IP is arg 2)
    let valid = ["woomy.surge.sh"];
    let has = [0, 0];
    if (req.headers.origin)
        for (let ip of valid)
            if (req.headers.origin.includes(ip)) has[0]++;
    if (req.headers["user-agent"])
        for (let agent of ["Mozilla", "AppleWebKit", "Chrome", "Safari"])
            if (req.headers["user-agent"].includes(agent)) has[1]++;
    if (has[0] !== 1 || has[1] === 0) {
        console.log("Invalid user trying to connect! Origin:", req.headers.origin, "Has:", has, "Agent:", req.headers["user-agent"]) //"IP", req.headers["x-forwarded-for"]);
        return [0, `Fasttalk communication error. Error Code: (${has[0]}, ${has[1]})`]; // The error message is a lie :) That's part of why it works so well.
    }
    let ipAddress;
    try {
        ipAddress = socket._socket.address().address.slice(7);
    } catch (e) {
        console.log(e);
        return [0, "Invalid IP"];
    }
    if (ipAddress == null) return [0, "Attempting to spawn with a null IP adress."];
    if ((binarySearch(IPv4BadASNBlocks, ({
            ip,
            mask,
            asn
        }) => {
            let dbOut = ip >>> (32 - mask),
                ipOut = parseIPv4(ipAddress) >>> (32 - mask);
            return ipOut - dbOut;
        }) >= 0 || blockerDB.torIPs.includes(ipAddress)) && !bypassVPNBlocker) return [0, "VPN detected. Please disable it and try again."];
    let same = 0;
    for (let socket of sockets.clients)
        if (socket.ip === ipAddress) same++;
    if (same >= c.TAB_LIMIT) return [0, "You have too many tabs open. Please close some tabs and try again."];
    for (let ban of securityDatabase.bans)
        if (ipAddress === ban.ip) return [0, "You were banned from the game for: " + ban.reason];
    for (let ban of securityDatabase.blackList)
        if (ipAddress === ban.ip) return [0, "Your IP has been temporarily blacklisted for: " + ban.reason];
    if (sockets.clients.length >= c.MAX_PLAYERS) return [0, `The max player limit for this server (${c.MAX_PLAYERS}) has been reached. Please try a different server or come back later.`];
    return [1, ipAddress];
};
module.exports = {
    securityDatabase,
    checkIP
};
