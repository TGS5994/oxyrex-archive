/*jslint node: true */
/*jshint -W061 */
/*global goog, Map, let */
"use strict";
// General requires
require('google-closure-library');
goog.require('goog.structs.PriorityQueue');
goog.require('goog.structs.QuadTree');
/*function generateWaves() {
    let bosses = [Class.eliteDestroyer, Class.eliteGunner, Class.eliteSprayer, Class.eliteSprayer2, Class.eliteHunter, Class.eliteSkimmer, Class.palisade, Class.summoner, Class.eggPrinceTier1, Class.eggPrinceTier2, Class.eggPrinceTier3, Class.eggPrinceTier4].sort(() => 0.5 - Math.random());
    let waves = [];
    for (let i = 0; i < 4; i++) {
        let wave = [];
        for (let i = 0; i < 2 + Math.random() * 7; i++) wave.push(ran.choose(bosses));
        bosses = bosses.sort(() => 0.5 - Math.random());
        waves.push(wave);
    }
    return waves;
};
const bossRush = (function() {
    let mothershipChoices = [Class.mothership];
    let waves = generateWaves();
    let wave = -1;
    let gameActive = true;
    let timer = 0;

    function spawnMothership() {
        return;
        sockets.broadcast("A Mothership has spawned!");
        let o = new Entity(room.randomType("bas1"));
        o.define(ran.choose(mothershipChoices));
        o.define({
            DANGER: 10
        });
        o.color = 10
        o.team = -1
        o.name = "Mothership";
        o.isMothership = true;
        o.controllers.push(new io_nearestDifferentMaster(o));
        o.controllers.push(new io_botMovement(o));
    };
    let spawn = (loc, team, type = false) => {
        type = type ? type : Class.destroyerDominator;
        let o = new Entity(loc);
        o.define(type);
        o.team = team;
        o.color = [10, 11, 12, 15][-team - 1] || 3;
        o.skill.score = 111069;
        o.name = "Dominator";
        o.SIZE = c.WIDTH / c.X_GRID / 10;
        o.isDominator = true;
        o.controllers = [new io_nearestDifferentMaster(o), new io_spinWhenIdle(o)];
        o.onDead = function() {
            if (o.team === -100) {
                spawn(loc, -1, type);
                room.setType("dom1", loc);
                sockets.broadcast("A dominator has been captured by BLUE!");
            } else {
                spawn(loc, -100, type);
                room.setType("dom0", loc);
                sockets.broadcast("A dominator has been captured by the bosses!");
            }
        };
    };

    function init() {
        for (let i = 0; i < 1; i++) spawnMothership();
        for (let loc of room["bas1"]) spawn(loc, -1);
        console.log("Boss rush initialized.");
    };

    function getCensus() {
        let census = {
            bosses: 0,
            motherships: 0
        }
        loopThrough(entities, function(entry) {
            if (entry.isBoss) census.bosses++;
            if (entry.isMothership) census.motherships++;
        });
        return census;
    };

    function loop() {
        let census = getCensus();
        if (census.motherships < 1) spawnMothership();
        if (census.bosses === 0 && timer <= 0) {
            wave++;
            if (!waves[wave]) {
                if (!gameActive) return;
                gameActive = false;
                sockets.broadcast("BLUE has won the game!");
                setTimeout(closeArena, 1500);
                return;
            }
            sockets.broadcast(`Wave ${wave + 1} has arrived!`);
            for (let boss of waves[wave]) {
                let spot, m = 0;
                do {
                    spot = room.randomType("boss");
                    m++;
                } while (dirtyCheck(spot, 500) && m < 30);
                let o = new Entity(spot);
                o.define(boss);
                o.define({
                    DANGER: 25 + o.SIZE / 5
                });
                o.team = -100;
                o.FOV = 10;
                o.refreshBodyAttributes();
                o.isBoss = true;
                for (let i = 0; i < 2; i++) {
                    let n = new Entity(room.randomType("boss"));
                    n.define(ran.choose([Class.sentryGun, Class.sentrySwarm, Class.sentryTrap]));
                    n.team = -100;
                    n.FOV = 10;
                    n.refreshBodyAttributes();
                }
                for (let i = 0; i < 4; i++) {
                    let n = new Entity(room.randomType("boss"));
                    n.define(Class.crasher);
                    n.team = -100;
                    n.FOV = 10;
                    n.refreshBodyAttributes();
                }
            }
        } else if (census.bosses > 0) timer = 10;
        timer--;
    };
    return {
        init,
        loop
    };
})();*/

const bossRush = (function() {
    const escorts = [Class.nestDefenderKrios, Class.nestDefenderTethys, Class.nestDefenderMnemosyne, Class.nestDefenderIapetus, Class.nestDefenderThemis, Class.nestDefenderNyx];
    const waves = (function() {
        let output = [];
        const types = [
            [Class.eliteDestroyer, Class.eliteGunner, Class.eliteSprayer, Class.eliteSprayer2, Class.eliteHunter, Class.eliteSkimmer],
            [Class.eliteSkimmer, Class.palisade, Class.summoner],
            [Class.eggPrinceTier1, Class.eggPrinceTier2, Class.eggPrinceTier3, Class.eggPrinceTier4, Class.eggBossTier1, Class.eggBossTier2]
        ];
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
        [Class.apolloCelestial, Class.odinCelestial, Class.artemisCelestial, Class.lokiCelestial, Class.aresCelestial, Class.rheaCelestial, Class.demeterCelestial, Class.athenaCelestial].forEach(celestial => output.push([celestial]));
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
        for (let boss of wave) {
            let o = new Entity(room.randomType("nest"));
            o.define(boss);
            o.team = -100;
            o.onDead = function() {
                bosses --;
                if (bosses <= 0) {
                    sockets.broadcast("The next wave will begin in 10 seconds.");
                    index ++;
                    setTimeout(spawnWave, 10000);
                }
            }
        }
        for (let i = 0; i < 1; i ++) {
            let n = new Entity(room.randomType("nest"));
            n.define(ran.choose(escorts));
            n.team = -100;
        }
        sockets.broadcast("Wave " + (index + 1) + " has arrived!");
    }
    let spawn = (loc, team, type = false) => {
        type = type ? type : Class.destroyerDominator;
        let o = new Entity(loc);
        o.define(type);
        o.team = team;
        o.color = [10, 11, 12, 15][-team - 1] || 3;
        o.skill.score = 111069;
        o.name = "Dominator";
        o.SIZE = c.WIDTH / c.X_GRID / 10;
        o.isDominator = true;
        o.controllers = [new io_nearestDifferentMaster(o), new io_spinWhenIdle(o)];
        o.onDead = function() {
            if (o.team === -100) {
                spawn(loc, -1, type);
                room.setType("bas1", loc);
                sockets.broadcast("A dominator has been captured by BLUE!");
            } else {
                spawn(loc, -100, type);
                room.setType("dom0", loc);
                sockets.broadcast("A dominator has been captured by the bosses!");
            }
        }
    }
    return function() {
        let time = 60;
        for (let loc of room["bas1"]) spawn(loc, -1, ran.choose([Class.destroyerDominator, Class.gunnerDominator, Class.trapperDominator]));
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
