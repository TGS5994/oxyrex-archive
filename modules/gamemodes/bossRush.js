/*jslint node: true */
/*jshint -W061 */
/*global goog, Map, let */
"use strict";
// General requires
require('google-closure-library');
goog.require('goog.structs.PriorityQueue');
goog.require('goog.structs.QuadTree');

const bossRush = (function() {
    const escorts = [Class.nestDefenderKrios, Class.nestDefenderTethys, Class.nestDefenderMnemosyne, Class.nestDefenderIapetus, Class.nestDefenderThemis, Class.nestDefenderNyx];
    const waves = (function() {
        let output = [];
        const types = [
            [Class.eliteDestroyer, Class.eliteGunner, Class.eliteSprayer, Class.eliteSprayer2, Class.eliteHunter, Class.eliteSkimmer, Class.sentryFragBoss, Class.eliteDirector],
            [Class.eliteSkimmer, Class.palisade, Class.summoner, Class.guardian, Class.greenGuardian, Class.atrium, Class.quadriatic, Class.sterilizerBoss, Class.lucrehulk],
            [Class.eggPrinceTier1, Class.eggPrinceTier2, Class.eggBossTier1, Class.eggBossTier2, Class.squareBossTier1, Class.squareBossTier2, Class.triangleBossTier1, Class.triangleBossTier2]
        ];
        const finalBosses = [Class.catalyst, Class.legendaryQuadralMachine, Class.mythicalCrasher, Class.oceanusCelestial, Class.thorCelestial, Class.raCelestial];
        types.push(types.flat());
        types.forEach((type, i) => types[i] = type.sort(() => 0.5 - Math.random()));
        for (let type of types) {
            for (let i = 0; i < 3; i ++) {
                let wave = [];
                for (let j = 0; j < 2; j ++) {
                    wave.push(type[j]);
                }
                output.push(wave);
                type = type.sort(() => 0.5 - Math.random());
            }
        }
        [Class.eggBossTier3, Class.eggPrinceTier3, Class.squareBossTier3, Class.eggBossTier4, Class.eggPrinceTier4, Class.triangleBossTier3, Class.sacredCrasher, Class.legendaryCrasher].sort(() => .5 - Math.random()).forEach(type => output.push([type]));
        [Class.apolloCelestial, Class.odinCelestial, Class.artemisCelestial, Class.lokiCelestial, Class.aresCelestial, Class.rheaCelestial, Class.demeterCelestial, Class.athenaCelestial].forEach(celestial => output.push([celestial]));
        output.push([finalBosses[Math.random() * finalBosses.length | 0]]);
        return output;
    })();
    let index = 0;
    function spawnWave() {
        const wave = waves[index];
        if (!wave) {
            sockets.broadcast("Your team has beaten the boss rush!");
            setTimeout(closeArena, 3000);
            return;
        }
        let bosses = wave.length;
        global.botScoreboard["Bosses Left"] = wave.length;
        for (let boss of wave) {
            let o = new Entity(room.randomType("nest"));
            o.define(boss);
            o.team = -100;
            o.onDead = function() {
                bosses --;
                global.botScoreboard["Bosses Left"] = bosses;
                if (bosses <= 0) {
                    sockets.broadcast("The next wave will begin in 10 seconds.");
                    index ++;
                    setTimeout(spawnWave, 10000);
                }
            }
        }
        for (let i = 0; i < 2; i ++) {
            let n = new Entity(room.randomType("nest"));
            n.define(ran.choose(escorts));
            n.team = -100;
        }
        global.botScoreboard.Wave = (index + 1);
        sockets.broadcast("Wave " + (index + 1) + " has arrived!");
    }
    let maxSanctuaries = 0;
    let sanctuaries = 0;
    let spawn = (loc, team, type = false) => {
        const realType = Class[team === -1 ? type + "Sanctuary" : type];
        let o = new Entity(loc);
        o.define(realType);
        o.team = team;
        o.color = [10, 11, 12, 15][-team - 1] || 3;
        o.skill.score = 111069;
        o.name = "Dominator";
        //o.SIZE = c.WIDTH / c.X_GRID / 10;
        o.isDominator = true;
        o.controllers = [new io_nearestDifferentMaster(o), new io_spinWhenIdle(o)];
        o.onDead = function() {
            if (o.team === -100) {
                spawn(loc, -1, type);
                room.setType("bas1", loc);
                sockets.broadcast("A dominator has been captured by BLUE!");
                if (sanctuaries < 1) {
                    sockets.broadcast("Your team may now respawn.");
                    for (const socket of sockets.clients) {
                        if (socket.awaitingSpawn) {
                            socket.reallySpawn();
                        }
                    }
                }
                sanctuaries ++;
            } else {
                sanctuaries --;
                if (sanctuaries < 1) {
                    sockets.broadcast("Your team can no longer respawn. Capture a dominator to allow respawning.");
                    sockets.broadcast("Your team will lose in 90 seconds");
                    function tick(i) {
                        if (sanctuaries > 0) {
                            return;
                        }
                        if (i <= 0) {
                            sockets.broadcast("Your team has lost!");
                            setTimeout(closeArena, 2500);
                            return;
                        }
                        if (i % 15 === 0 || i <= 10) {
                            sockets.broadcast(`${i} seconds until your team loses!`);
                        }
                        setTimeout(function retick() {
                            tick(i - 1);
                        }, 1000);
                    }
                    tick(91);
                }
                spawn(loc, -100, type);
                room.setType("dom0", loc);
                sockets.broadcast("A dominator has been captured by the bosses!");
            }
        }
    }
    return function() {
        global.botScoreboard = {
            "Wave": 0,
            "Bosses Left": 0
        };
        let time = 60;
        for (let loc of room["bas1"]) {
            maxSanctuaries ++;
            sanctuaries ++;
            spawn(loc, -1, ran.choose(['destroyerDominator', 'gunnerDominator', 'trapperDominator', 'droneDominator', 'steamrollerDominator', 'autoDominator', 'crockettDominator', 'spawnerDominator']));
        }
        console.log("Boss rush initialized.");
        function recursive() {
            time -= 5;
            sockets.broadcast(time + " seconds until the first wave!");
            if (time > 0) return setTimeout(recursive, 5000);
            spawnWave();
        }
        recursive();
    }
})();

module.exports = {
    bossRush
};
