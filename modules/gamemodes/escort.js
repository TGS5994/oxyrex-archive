/*jslint node: true */
/*jshint -W061 */
/*global goog, Map, let */
"use strict";
// General requires
require('google-closure-library');
goog.require('goog.structs.PriorityQueue');
goog.require('goog.structs.QuadTree');

let stats = {
    mothership: {
        x: room.width / 2,
        y: room.height / 2
    },
    enemies: 0,
    finalBoss: false,
    defeated: 0,
    interval: -1
};

function loop() {
    if (stats.enemies < 3 && stats.mothership != null) {
        const distance = ((Math.random() * room.width) / room.xgrid) * 3 + room.width / room.xgrid;
        const angle = Math.random() * Math.PI * 2;
        const o = new Entity({
            x: stats.mothership.x + distance * Math.cos(angle),
            y: stats.mothership.y + distance * Math.sin(angle)
        });
        o.define(ran.choose([Class.testShip, Class.testShip2, Class.testShip3]));
        o.team = -100;
        stats.enemies ++;
        o.onDead = function() {
            stats.enemies --;
            stats.defeated ++;
        }
    }
}

module.exports = {
    initEscortLoop: function() {
        /*let o = new Entity(room.random());
        o.define(Class.mothership);
        o.isMothership = true;
        o.team = -1;
        o.color = 10;
        o.onDead = function() {
            stats.mothership = null;
            sockets.broadcast("Your mothership has been destroyed!");
            setTimeout(closeArena, 2500);
        }
        stats.mothership = o;*/
        stats.interval = setInterval(loop, 2500);
    }
}
