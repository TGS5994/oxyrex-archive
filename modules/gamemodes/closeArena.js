/*jslint node: true */
/*jshint -W061 */
/*global goog, Map, let */
"use strict";
// General requires
require('google-closure-library');
goog.require('goog.structs.PriorityQueue');
goog.require('goog.structs.QuadTree');

let arenaClosers = ["arenaCloser", "twinCloser", "machineCloser", "sniperCloser", "flankCloser", "directorCloser", "pounderCloser", "trapperCloser", "smasherCloser"].map(entry => Class[entry + "AI"]);
function closeArena() {
    if (arenaClosed) return;
    sockets.broadcast("Arena Closed: No players may join!");
    global.arenaClosed = true;
    for (let i = 0; i < 15; i++) {
        let angle = (Math.PI * 2) / 15 * i;
        let o = new Entity({
            x: room.width / 2 + (room.width * Math.cos(angle)),
            y: room.height / 2 + (room.height * Math.sin(angle))
        });
        o.define(ran.choose(arenaClosers));
        o.color = 3;
        o.SIZE = 50;
        o.team = -100;
        o.skill.score = 23650;
        o.isArenaCloser = true;
        o.name = "Arena Closer";
    }

    function close() {
        sockets.broadcast("Closing!");
        clearInterval(loop);
        setTimeout(process.exit, 1500);
    };
    let ticks = 0;
    const loop = setInterval(function checkSurvivors() {
        ticks++;
        if (ticks >= 240) return close();
        let alive = 0;
        loopThrough(entities, function amIAPlayer(instance, index) {
            if (instance.isPlayer || instance.isBot || (instance.isDominator && instance.team !== -100) || instance.isMothership) alive++;
        });
        if (!alive) close();
    }, 500);
};
module.exports = {
    closeArena
};
