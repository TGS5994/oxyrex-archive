/*jslint node: true */
/*jshint -W061 */
/*global goog, Map, let */
"use strict";
// General requires
require('google-closure-library');
goog.require('goog.structs.PriorityQueue');
goog.require('goog.structs.QuadTree');
const GLOBAL = require("./modules/global.js");
console.log(`[${GLOBAL.creationDate}]: Server initialized.\nRoom Info:\nDimensions: ${room.width} x ${room.height}\nMax Food / Nest Food: ${room.maxFood} / ${room.maxFood * room.nestFoodAmount}`);
// Let's get a cheaper array removal thing
Array.prototype.remove = function(index) {
    if (index === this.length - 1) return this.pop();
    let r = this[index];
    this[index] = this.pop();
    return r;
};
util.log(room.width + ' x ' + room.height + ' room initalized.  Max food: ' + room.maxFood + ', max nest food: ' + (room.maxFood * room.nestFoodAmount) + '.');
// The most important loop. Fast looping.
const gameloop = (() => {
    // Collision stuff
    function collide(collision) {
        // Pull the two objects from the collision grid
        let instance = collision[0],
            other = collision[1];
        // Check for ghosts...
        if (other.isGhost && other.settings.hitsOwnType !== "everything") {
            util.error('GHOST FOUND');
            util.error(other.label);
            util.error('x: ' + other.x + ' y: ' + other.y);
            util.error(other.collisionArray);
            util.error('health: ' + other.health.amount);
            util.warn('Ghost removed.');
            if (grid.checkIfInHSHG(other)) {
                util.warn('Ghost removed.');
                grid.removeObject(other);
            }
            return 0;
        }
        if (instance.isGhost && instance.settings.hitsOwnType !== "everything") {
            util.error('GHOST FOUND');
            util.error(instance.label);
            util.error('x: ' + instance.x + ' y: ' + instance.y);
            util.error(instance.collisionArray);
            util.error('health: ' + instance.health.amount);
            if (grid.checkIfInHSHG(instance)) {
                util.warn('Ghost removed.');
                grid.removeObject(instance);
            }
            return 0;
        }
        if (!instance.activation.check() && !other.activation.check()) {
            util.warn('Tried to collide with an inactive instance.');
            return 0;
        }
        if (instance.settings.hitsOwnType === "everything" && other.settings.hitsOwnType === "everything") {
            return 0;
        }
        if (c.SANDBOX && instance.sandboxId !== other.sandboxId) {
            return 0;
        }
        if (instance.master.passive || other.master.passive) return;
        switch (true) {
            case (instance.type === "wall" || other.type === "wall"):
                if (instance.type === "wall" && other.type === "wall") return;
                if (instance.label.includes("Collision") || other.label.includes("Collision")) return;
                if (instance.settings.goThroughWalls || other.settings.goThroughWalls || instance.master.settings.goThroughWalls || other.master.settings.goThroughWalls || instance.master.godmode || other.master.godmode) return;
                let wall = instance.type === "wall" ? instance : other;
                let entity = instance.type === "wall" ? other : instance;
                switch (wall.shape) {
                    case 4:
                        reflectCollide(wall, entity)
                        break;
                    case 0:
                        mooncollide(wall, entity);
                        break;
                    default:
                        let a = ((entity.type === "bullet") ? 1 + 10 / (entity.velocity.length + 10) : 1);
                        advancedcollide(wall, entity, false, false, a);
                        break;
                };
                break;
            case ((instance.label.includes("Collision") || other.label.includes("Collision")) && (instance.settings.hitsOwnType === "everything" || other.settings.hitsOwnType === "everything") && instance.team !== other.team): {
                if (instance.passive || other.passive) return;
                if (instance.invuln || other.invuln) return;
                const flail = instance.label.includes("Collision") ? instance : other;
                const entity = instance.label.includes("Collision") ? other : instance;
                if (entity.label.includes("Collision")) return;
                advancedcollide(flail, entity, true, false, null);
            } break;
            case (instance.settings.hitsOwnType === "everything" || other.settings.hitsOwnType === "everything"): {
                if (instance.label === "Collision" || other.label === "Collision") return;
                if (instance.team === other.team || instance.master.id === other.master.id) return;
                if (instance.isDominator || other.isDominator || instance.isMothership || other.isMothership) return;
                let shield = instance.settings.hitsOwnType === "everything" ? instance : other,
                    entity = instance.settings.hitsOwnType === "everything" ? other : instance;
                firmcollide(shield, entity);
            } break;
            case (instance.team === other.team && (instance.settings.hitsOwnType === "pushOnlyTeam" || other.settings.hitsOwnType === "pushOnlyTeam")): { // Dominator / Mothership collisions
                if (instance.settings.hitsOwnType === other.settings.hitsOwnType) return;
                let pusher = instance.settings.hitsOwnType === "pushOnlyTeam" ? instance : other;
                let entity = instance.settings.hitsOwnType === "pushOnlyTeam" ? other : instance;
                if (entity.type !== "tank" || entity.settings.hitsOwnType === "never") return;
                let a = 1 + 10 / (Math.max(entity.velocity.length, pusher.velocity.length) + 10);
                advancedcollide(pusher, entity, false, false, a);
            }
            break;
        case ((instance.type === 'crasher' && other.type === 'food') || (other.type === 'crasher' && instance.type === 'food')):
            firmcollide(instance, other);
            break;
        case (instance.team !== other.team):
            advancedcollide(instance, other, true, true);
            break;
        case (instance.settings.hitsOwnType == 'never' || other.settings.hitsOwnType == 'never'):
            break;
        case (instance.settings.hitsOwnType === other.settings.hitsOwnType):
            switch (instance.settings.hitsOwnType) {
                case 'push':
                    advancedcollide(instance, other, false, false);
                    break;
                case 'hard':
                    firmcollide(instance, other);
                    break;
                case 'hardWithBuffer':
                    firmcollide(instance, other, 30);
                    break;
                case "hardOnlyTanks":
                    if (instance.type === "tank" && other.type === "tank" && !instance.isDominator && !other.isDominator) firmcollide(instance, other);
                case "hardOnlyBosses":
                    if (instance.type === other.type && instance.type === "miniboss") firmcollide(instance, other);
                case 'repel':
                    simplecollide(instance, other);
                    break;
            };
            break;
        };
    };
    // Living stuff
    function entitiesactivationloop(my) {
        // Update collisions.
        my.collisionArray = [];
        // Activation
        my.activation.update();
        my.updateAABB(my.activation.check());
    }

    function entitiesliveloop(my) {
        // Consider death.
        if (my.contemplationOfMortality()) my.destroy();
        else {
            if (my.bond == null) {
                // Resolve the physical behavior from the last collision cycle.
                logs.physics.set();
                my.physics();
                logs.physics.mark();
            }
            if (my.activation.check() || my.isPlayer) {
                logs.entities.tally();
                // Think about my actions.
                logs.life.set();
                my.life();
                logs.life.mark();
                // Apply friction.
                my.friction();
                my.confinementToTheseEarthlyShackles();
                logs.selfie.set();
                my.takeSelfie();
                logs.selfie.mark();
            }
        }
        // Update collisions.
        my.collisionArray = [];
    }
    let time;
    // Return the loop function
    let ticks = 0;
    return () => {
        logs.loops.tally();
        logs.master.set();
        logs.activation.set();
        global.sandboxIds.forEach(id => {
            if (!entities.some(entry => entry.sandboxId === id)) {
                global.sandboxIds = global.sandboxIds.filter(entry => entry !== id);
            }
        });
        loopThrough(entities, entitiesactivationloop);
        logs.activation.mark();
        // Do collisions
        logs.collide.set();
        if (entities.length > 1) {
            // Load the grid
            grid.update();
            // Run collisions in each grid
            const pairs = grid.queryForCollisionPairs();
            loopThrough(pairs, collide);
        }
        logs.collide.mark();
        // Do entities life
        logs.entities.set();
        loopThrough(entities, entitiesliveloop);
        logs.entities.mark();
        logs.master.mark();
        // Remove dead entities
        purgeEntities();
        room.lastCycle = util.time();
        ticks++;
        if (true) {
            loopThrough(sockets.players, function(instance) {
                instance.socket.view.gazeUpon();
                instance.socket.lastUptime = Infinity;
            });
        }
        if (ticks % 25 === 0 && Math.min(1, global.fps / roomSpeed / 1000 * 30) < 0.95) {
            antiLagbot();
        }
    };
})();
setTimeout(closeArena, 60000 * 240); // Restart every 2 hours
// A less important loop. Runs at an actual 5Hz regardless of game speed.
const maintainloop = (() => {
    // Place obstacles
    function placeRoids() {
        function placeRoid(type, entityClass) {
            let x = 0;
            let position;
            do {
                position = room.randomType(type);
                x++;
                if (x > 200) {
                    util.warn("Could not place some roids.");
                    return 0;
                }
            } while (dirtyCheck(position, 10 + entityClass.SIZE));
            let o = new Entity(position);
            o.define(entityClass);
            o.team = -101;
            o.facing = ran.randomAngle();
            o.protect();
            o.life();
        }
        // Start placing them
        let roidcount = room.roid.length * room.width * room.height / room.xgrid / room.ygrid / 40000 / 1.5;
        let rockcount = room.rock.length * room.width * room.height / room.xgrid / room.ygrid / 80000 / 1.5;
        let count = 0;
        for (let i = Math.ceil(roidcount); i; i--) {
            count++;
            placeRoid('roid', Class.obstacle);
        }
        for (let i = Math.ceil(roidcount * 0.3); i; i--) {
            count++;
            placeRoid('roid', Class.babyObstacle);
        }
        for (let i = Math.ceil(rockcount * 0.8); i; i--) {
            count++;
            placeRoid('rock', Class.obstacle);
        }
        for (let i = Math.ceil(rockcount * 0.5); i; i--) {
            count++;
            placeRoid('rock', Class.babyObstacle);
        }
        util.log('Placing ' + count + ' obstacles!');
    }
    placeRoids();

    function spawnWall(loc) {
        let o = new Entity(loc);
        o.define(Class.mazeWall);
        o.team = -101;
        o.SIZE = (room.width / room.xgrid) / 2;
        o.protect();
        o.life();
    };
    const doors = [];
    const buttons = [];
    function makeDoor(loc, team = -101) {
        const door = new Entity(loc);
        door.define(Class.mazeWall);
        door.team = -101;
        door.SIZE = (room.width / room.xgrid) / 2;
        door.protect();
        door.life();
        doors.push(door);
        const doorID = doors.length;
        door.onDead = function() {
            for (const button of buttons) {
                if (button.doorID === doorID) {
                    button.ignoreButtonKill = 2;
                    button.kill();
                }
            }
        }
    }
    function makeButton(loc, open, doorID) {
        const button = new Entity(loc);
        button.define(Class.button);
        button.pushability = button.PUSHABILITY = 0;
        button.team = -101;
        button.doorID = doorID;
        button.color = open ? 12 : 11;
        button.onDead = function() {
            if (!button.ignoreButtonKill) {
                const door = doors[button.doorID];
                if (open) {
                    door.alpha = 0.2;
                    door.passive = true;
                } else {
                    door.alpha = 1;
                    door.passive = false;
                }
                for (const other of buttons) {
                    if (button !== other && button.doorID === other.doorID) {
                        other.ignoreButtonKill = true;
                        other.kill();
                    }
                }
            }
            if (button.ignoreButtonKill !== 2) {
                makeButton(loc, !open, doorID);
            }
        }
        buttons.push(button);
    }
    for (const loc of room.door) {
        makeDoor(loc);
        let buttonLocs = [{
            x: loc.x + (room.width / room.xgrid),
            y: loc.y
        }, {
            x: loc.x - (room.width / room.xgrid),
            y: loc.y
        }, {
            x: loc.x,
            y: loc.y + (room.height / room.ygrid)
        }, {
            x: loc.x,
            y: loc.y - (room.height / room.ygrid)
        }];
        buttonLocs = buttonLocs.filter(function(entry) {
            return ["norm", "nest"].includes(room.setup[Math.floor((entry.y * room.ygrid) / room.height)][Math.floor((entry.x * room.xgrid) / room.width)]);
        });
        for (const loc of buttonLocs) {
            makeButton(loc, 1, doors.length - 1);
        }
    }
    for (let loc of room["wall"]) spawnWall(loc);
    // Spawning functions
    let spawnBosses = (() => {
        let timer = 0;
        let boss = (() => {
            let i = 0,
                names = [],
                bois = [Class.egg],
                n = 0,
                begin = 'yo some shit is about to move to a lower position',
                arrival = 'Something happened lol u should probably let Neph know this broke',
                loc = 'norm';
            let spawn = () => {
                let spot, m = 0;
                do {
                    spot = room.randomType(loc);
                    m++;
                } while (dirtyCheck(spot, 500) && m < 30);
                let o = new Entity(spot);
                o.name = ran.chooseBossName("all", 1)[0];
                o.define(ran.choose(bois));
                o.team = -100;
            };
            return {
                prepareToSpawn: (classArray, number, nameClass, typeOfLocation = 'norm') => {
                    n = number;
                    bois = classArray;
                    loc = typeOfLocation;
                    names = ran.chooseBossName("all", number + 3);
                    i = 0;
                    if (n === 1) {
                        begin = 'A visitor is coming.';
                        arrival = names[0] + ' has arrived.';
                    } else {
                        begin = 'Visitors are coming.';
                        arrival = '';
                        for (let i = 0; i < n - 2; i++) arrival += names[i] + ', ';
                        arrival += names[n - 2] + ' and ' + names[n - 1] + ' have arrived.';
                    }
                },
                spawn: () => {
                    sockets.broadcast(begin);
                    for (let i = 0; i < n; i++) {
                        setTimeout(spawn, ran.randomRange(3500, 5000));
                    }
                    // Wrap things up.
                    setTimeout(() => sockets.broadcast(arrival), 5000);
                    util.log('[SPAWN] ' + arrival);
                },
            };
        })();
        let timerThing = 60 * 5;
        return census => {
            if (timer > timerThing && ran.dice(timerThing - timer)) {
                util.log('[SPAWN] Preparing to spawn...');
                timer = 0;
                let choice = [];
                switch (ran.chooseChance(1, 1, 1)) {
                    case 0:
                        choice = [
                            [Class.eliteDestroyer, Class.eliteGunner, Class.eliteSprayer, Class.eliteSprayer2, Class.eliteHunter, Class.eliteSkimmer, Class.sentryFragBoss], 1 + (Math.random() * 2 | 0), 'a', 'nest'
                        ];
                        sockets.broadcast("A stirring in the distance...");
                        break;
                    case 1:
                        choice = [
                            [Class.summoner, Class.eliteSkimmer, Class.palisade, Class.atrium, Class.guardian, Class.greenGuardian, Class.quadriatic], 1 + (Math.random() * 2 | 0), 'a', 'norm'
                        ];
                        sockets.broadcast("A strange trembling...");
                        break;
                    case 2:
                        choice = [
                            [Class.fallenOverlord, Class.fallenBooster, Class.fallenHybrid], 1 + (Math.random() * 2 | 0), 'a', 'norm'
                        ];
                        sockets.broadcast("Many sought the day they'd return, but not in this way...");
                        break;
                }
                boss.prepareToSpawn(...choice);
                setTimeout(boss.spawn, 3000);
                // Set the timeout for the spawn functions
            } else if (!census.miniboss) timer++;
        };
    })();
    let spawnSanctuaries = (() => {
        let timer = 0;
        let boss = (() => {
            let i = 0,
                names = [],
                bois = [Class.egg],
                n = 0,
                begin = 'yo some shit is about to move to a lower position',
                arrival = 'Something happened lol u should probably let Neph know this broke';
            let spawn = () => {
                let o = new Entity(room.randomType("norm"));
                o.name = names[i++];
                o.define(ran.choose(bois));
                o.team = -100;
                o.isSanctuary = true;
                o.onDead = () => {
                    setTimeout(() => {
                        let n = new Entity(o);
                        n.define(Class[o.spawnOnDeath]);
                        n.team = o.team;
                        n.name = ran.chooseBossName("all", 1)[0];
                        sockets.broadcast(util.addArticle(n.label, true) + " has spawned to avenge the " + o.label + "!");
                    }, 5000);
                };
            };
            return {
                prepareToSpawn: (classArray, number, nameClass) => {
                    n = number;
                    bois = classArray;
                    names = ran.chooseBossName(nameClass, number);
                    i = 0;
                    if (n === 1) {
                        begin = 'A sanctuary is coming.';
                        arrival = names[0] + ' has arrived.';
                    } else {
                        begin = 'Sanctuaries are coming.';
                        arrival = '';
                        for (let i = 0; i < n - 2; i++) arrival += names[i] + ', ';
                        arrival += names[n - 2] + ' and ' + names[n - 1] + ' have arrived.';
                    }
                },
                spawn: () => {
                    sockets.broadcast(begin);
                    for (let i = 0; i < n; i++) {
                        setTimeout(spawn, ran.randomRange(3500, 5000));
                    }
                    // Wrap things up.
                    setTimeout(() => sockets.broadcast(arrival), 5000);
                    util.log('[SPAWN] ' + arrival);
                },
            };
        })();
        return census => {
            let timerThing = 60 * 4;
            if (timer > timerThing && ran.dice(timerThing - timer)) {
                util.log('[SPAWN] Preparing to spawn...');
                timer = 0;
                let choice = [
                    [[Class.eggSanctuary, Class.squareSanctuary, Class.triangleSanctuary][ran.chooseChance(5, 4, 3)]],
                    1 + Math.floor(Math.random()) | 0, "a"
                ];
                boss.prepareToSpawn(...choice);
                setTimeout(boss.spawn, 3000);
                // Set the timeout for the spawn functions
            } else if (!census.sanctuary && !census.miniboss) timer++;
        };
    })();
    let spawnCrasher = (() => {
        let nestDefenderSpawned = false;
        const config = {
            max: 25,
            chance: 0.8,
            sentryChance: 0.95,
            nestDefenderChance: 0.999,
            crashers: [Class.crasher],
            sentries: [Class.sentryGun, Class.sentrySwarm, Class.sentryTrap, Class.greenSentrySwarm, Class.sentryOmission],
            nestDefenders: [Class.nestDefenderKrios, Class.nestDefenderTethys]
        };
        function getType() {
            const seed = Math.random();
            if (seed > config.nestDefenderChance && !nestDefenderSpawned) return ran.choose(config.nestDefenders);
            if (seed > config.sentryChance) return ran.choose(config.sentries);
            return ran.choose(config.crashers);
        }
        return census => {
            if (c.SANDBOX && global.sandboxIds.length < 1) {
                return {};
            }
            if (census.crasher < config.max) {
                for (let i = 0; i < config.max - census.crasher; i ++) {
                    if (Math.random() > config.chance) {
                        let spot, i = 25;
                        do {
                            spot = room.randomType('nest');
                            i --;
                            if (!i) return 0;
                        } while (dirtyCheck(spot, 250));
                        let o = new Entity(spot);
                        o.define(getType());
                        o.team = -100;
                        if (c.SANDBOX) {
                            o.sandboxId = ran.choose(global.sandboxIds);
                        }
                        if (o.label === "Nest Defender") {
                            nestDefenderSpawned = true;
                            sockets.broadcast("The nest cries out for help!");
                            setTimeout(sockets.broadcast, 2500, "The call was answered.");
                            o.onDead = () => {
                                setTimeout(() => nestDefenderSpawned = false, 60000 * 3);
                            }
                        }
                    }
                }
            }
        }
    })();
    /*let spawnCrasher = census => {
        if (census.crasher < 25) {
            let spot, i = 30;
            do {
                spot = room.randomType('nest');
                i--;
                if (!i) return 0;
            } while (dirtyCheck(spot, 100));
            let type = (Math.random() > 0.9) ? ran.choose([Class.sentryGun, Class.sentrySwarm, Class.sentryTrap]) : ran.choose([Class.crasher, Class.grouper, Class.fragment, Class.triBlade, Class.crusher, Class.visDestructia]);
            let o = new Entity(spot);
            o.define(type);
            o.team = -100;
        }
    };*/
    function getBuild() {
        const output = [];
        for (let i = 0; i < 10; i ++) {
            output.push(Math.random() * 10 | 0);
        }
        return output;
    }
    function spawnBot(TEAM = null) {
        let team = TEAM ? TEAM : getTeam();
        let set = (c.NAVAL_SHIPS ? {
            startClass: ran.choose(["alexanderNevsky", "yamato"]),
            build: getBuild(),
            ai: "bot"
        } : (c.HIDE_AND_SEEK && team == 2) ? {
            startClass: "landmine",
            build: [12, 0, 0, 0, 0, 12, 12, 12, 12, 12],
            ai: "hideBot"
        } : ran.choose(botSets));
        const botName = ran.chooseBotName();
        let color = [10, 11, 12, 15][team - 1];
        if (room.gameMode === "ffa") color = (c.RANDOM_COLORS ? Math.floor(Math.random() * 20) : 11);
        let loc = c.SPECIAL_BOSS_SPAWNS ? ((room["bas1"] && room["bas1"].length) ? room.randomType("bas1") : room.randomType("nest")) : room.randomType("norm");
        let o = new Entity(loc);
        o.color = color;
        o.invuln = true;
        o.define(Class[set.startClass]);
        o.name += botName;
        o.refreshBodyAttributes();
        o.color = color;
        if (room.gameMode === "tdm") o.team = -team;
        o.skill.score = 59210;
        o.isBot = true;
        o.nameColor = "#7289DA";
        /*if (c.GROUPS) {
            let master = {
                player: {
                    body: o
                }
            };
            groups.addMember(master);
            o.team = -master.rememberedTeam;
            o.ondead = function() {
                groups.removeMember(master);
            }
        }*/
        setTimeout(function() {
            if (!o || o.isDead()) return;
            const index = o.index;
            let className = set.startClass;
            for (let key in Class)
                if (Class[key].index === index) className = key;
            o.define(Class[set.ai]);
            o.define(Class[className]);
            o.refreshBodyAttributes();
            o.name += botName;
            o.invuln = false;
            o.skill.set(set.build);
        }, 3000 + (Math.floor(Math.random() * 7000)));
        return o;
    };
    if (c.SPACE_MODE) {
        {
            let o = new Entity(room.random());
            o.define(Class.moon);
            o.team = -101;
            o.SIZE = room.width / 15;
            o.protect();
            o.life();
        }
        function ring(x, y, radius, size = 1, gap = 1) {
            const angle = Math.random() * Math.PI * 2;
            const amount = 20 + radius / 10;
            for (let i = gap; i < amount; i ++) {
                let o = new Entity({
                    x: x + radius * Math.cos(angle + (i / amount) * (Math.PI * 2)) * 5,
                    y: y + radius * Math.sin(angle + (i / amount) * (Math.PI * 2)) * 5
                });
                o.define(Class.obstacle);
                o.team = -101;
                o.SIZE = radius / 2.5 * size;
                o.facing = angle + (i / amount) * (Math.PI * 2);
                o.protect();
                o.life();
            }
        }
        //for (const loc of room.nest) ring(loc.x, loc.y, room.width / room.xgrid / room.xgrid, 2, 3);
    }
    // The NPC function
    let makenpcs = (() => {
        // Make base protectors if needed.
        let f = (loc, team) => {
            let o = new Entity(loc);
            o.define(Class.baseDroneSpawner); // Class.baseProtector
            o.team = -team;
            o.color = [10, 11, 12, 15][team - 1];
        };
        for (let i = 1; i < 5; i++) {
            room['bap' + i].forEach((loc) => {
                f(loc, i);
            });
        }
        // Return the spawning function
        global.bots = [];
        return () => {
            let census = {
                crasher: 0,
                miniboss: 0,
                tank: 0,
                mothership: 0,
                sanctuary: 0
            };
            let npcs = entities.map(function npcCensus(instance) {
                if (instance.isSanctuary) {
                    census.sanctuary++;
                    return instance;
                }
                if (census[instance.type] != null) {
                    census[instance.type]++;
                    return instance;
                }
                if (instance.isMothership) {
                    census.mothership++;
                    return instance;
                }
            }).filter(e => {
                return e;
            });
            // Spawning
            spawnCrasher(census);
            if (!c.SANDBOX) {
                spawnBosses(census);
                spawnSanctuaries(census);
                // Bots
                if (bots.length + views.length < Math.ceil(c.maxPlayers / 2) && !global.arenaClosed) {
                    if (c.SPECIAL_BOSS_SPAWNS && (!(room["bas1"] || []).length)) {} else {
                        for (let i = bots.length + views.length; i < Math.ceil(c.maxPlayers / 2); i ++) {
                            if (Math.random() > .5) {
                                bots.push(spawnBot(global.nextTagBotTeam.shift() || null));
                            }
                        }
                    }
                }
            }
            // Remove dead ones
            bots = bots.filter(e => {
                return !e.isDead();
            });
            // Slowly upgrade them
            loopThrough(bots, function(o) {
                if (o.skill.level < 60) {
                    o.skill.score += 35;
                    o.skill.maintain();
                }
                if (o.upgrades.length && Math.random() > 0.5 && !o.botDoneUpgrading) {
                    o.upgrade(Math.floor(Math.random() * o.upgrades.length));
                    if (Math.random() > .9) {
                        o.botDoneUpgrading = true;
                    }
                }
            });
        };
    })();
    const createFood = (() => {
        class FoodType {
            constructor(groupName, types, chances, chance, isNestFood = false) {
                if (chances[0] === "scale") {
                    const scale = chances[1];
                    chances = [];
                    for (let i = types.length; i > 0; i --) {
                        chances.push(i ** scale);
                    }
                }
                this.name = groupName;
                if (types.length !== chances.length) {
                    throw new RangeError(groupName + ": error with group. Please make sure there is the same number of types as chances.");
                }
                this.types = types;
                this.chances = chances;
                this.chance = chance;
                this.isNestFood = isNestFood;
            }
            choose() {
                return this.types[ran.chooseChance(...this.chances)];
            }
        }
        const types = [
            new FoodType("Normal Food", [
                Class.egg, Class.square, Class.triangle,
                Class.pentagon, Class.bigPentagon
            ], [25, 20, 14, 7, 1], 1000),
            new FoodType("Rare Food", [
                Class.gem, Class.greensquare, Class.greentriangle,
                Class.greenpentagon
            ], ["scale", 2], 1),
            new FoodType("Nest Food", [
                Class.pentagon, Class.bigPentagon, Class.hugePentagon,
                Class.alphaHexagon, Class.alphaHeptagon, Class.alphaOctogon,
                Class.alphaNonagon, Class.alphaDecagon, Class.icosagon
            ], ["scale", 3], 1, true)
        ];
        function getFoodType(isNestFood = false) {
            const possible = [[], []];
            for (let i = 0; i < types.length; i ++) {
                if (types[i].isNestFood == isNestFood) {
                    possible[0].push(i);
                    possible[1].push(types[i].chance);
                }
            }
            return possible[0][ran.chooseChance(...possible[1])];
        }
        function spawnShape(location, type = 0) {
            if (c.SANDBOX && global.sandboxIds.length < 1) {
                return {};
            }
            let o = new Entity(location);
            type = types[type].choose();
            o.define(type);
            o.define({
                BODY: {
                    ACCELERATION: 0.015 / (type.FOOD.LEVEL + 1)
                }
            })
            o.facing = ran.randomAngle();
            o.team = -100;
            if (c.SANDBOX) {
                o.sandboxId = ran.choose(global.sandboxIds);
            }
            return o;
        };
        function spawnGroupedFood() {
            let location;
            do {
                location = room.random();
            } while (room.isIn("nest", location));
            for (let i = 0, amount = (Math.random() * 10) | 0; i < amount; i ++) {
                const angle = Math.random() * Math.PI * 2;
                spawnShape({
                    x: location.x + Math.cos(angle) * (Math.random() * 50),
                    y: location.y + Math.sin(angle) * (Math.random() * 50)
                }, getFoodType());
            }
        }
        function spawnDistributedFood() {
            let location;
            do {
                location = room.random();
            } while (room.isIn("nest", location));
            spawnShape(location, getFoodType());
        }
        function spawnNestFood() {
            let shape = spawnShape(room.randomType("nest"), getFoodType(true));
            shape.isNestFood = true;
        }
        return () => {
            const maxFood = 1 + room.maxFood + 1 * views.length;
            const maxNestFood = 1 + room.maxFood * room.nestFoodAmount;
            const census = (() => {
                let food = 0;
                let nestFood = 0;
                loopThrough(entities, instance => {
                    if (instance.type === "food") {
                        if (instance.isNestFood) nestFood ++;
                        else food ++;
                    }
                });
                return {
                    food,
                    nestFood
                };
            })();
            if (census.food < maxFood) [spawnGroupedFood, spawnDistributedFood][+(Math.random() < 0.8)]();
            if (census.nestFood < maxNestFood) spawnNestFood();
        };
    })();
    // The big food function
    /*let makefood = (() => {
        let food = [],
            foodSpawners = [];
        // The two essential functions
        function getFoodClass(level) {
            let a = {};
            switch (level) {
                case 0:
                    a = Math.random() > 0.995 ? Class.gem : Class.egg;
                    break;
                case 1:
                    a = Math.random() > 0.995 ? Class.greensquare : Class.square;
                    break;
                case 2:
                    a = Math.random() > 0.995 ? Class.greentriangle : Class.triangle;
                    break;
                case 3:
                    a = Math.random() > 0.995 ? Class.greenpentagon : Class.pentagon;
                    break;
                case 4:
                    a = Class.bigPentagon;
                    break;
                case 5:
                    a = Class.hugePentagon;
                    break;
                case 6:
                    a = Class.alphaHexagon;
                    break;
                case 7:
                    a = Class.alphaHeptagon;
                    break;
                case 8:
                    a = Class.alphaOctogon;
                    break;
                case 9:
                    a = Class.alphaNonagon;
                    break;
                case 10:
                    a = Class.alphaDecagon;
                    break;
                default:
                    throw ('bad food level');
            }
            if (a !== {}) {
                a.BODY.ACCELERATION = 0.015 / (a.FOOD.LEVEL + 1);
            }
            return a;
        }
        let placeNewFood = (position, scatter, level, allowInNest = false) => {
            let o = nearest(food, position);
            let mitosis = false;
            let seed = false;
            if (o != null) {
                for (let i = 50; i > 0; i--) {
                    if (scatter == -1 || util.getDistance(position, o) < scatter) {
                        if (ran.dice((o.foodLevel + 1) * (o.foodLevel + 1))) {
                            mitosis = true;
                            break;
                        } else {
                            seed = true;
                            break;
                        }
                    }
                }
            }
            // Decide what to do
            if (scatter != -1 || mitosis || seed) {
                // Splitting
                if (o != null && (mitosis || seed) && room.isIn('nest', o) === allowInNest) {
                    let levelToMake = (mitosis) ? o.foodLevel : level,
                        place = {
                            x: o.x + o.size * Math.cos(o.facing),
                            y: o.y + o.size * Math.sin(o.facing),
                        };
                    let new_o = new Entity(place);
                    new_o.define(getFoodClass(levelToMake));
                    new_o.team = -100;
                    new_o.facing = o.facing + ran.randomRange(Math.PI / 2, Math.PI);
                    food.push(new_o);
                    return new_o;
                }
                // Brand new
                else if (room.isIn('nest', position) === allowInNest) {
                    if (!dirtyCheck(position, 20)) {
                        o = new Entity(position);
                        o.define(getFoodClass(level));
                        o.team = -100;
                        o.facing = ran.randomAngle();
                        food.push(o);
                        return o;
                    }
                }
            }
        };
        // Define foodspawners
        class FoodSpawner {
            constructor() {
                this.foodToMake = Math.ceil(Math.abs(ran.gauss(0, room.scale.linear * 80)));
                this.size = Math.sqrt(this.foodToMake) * 25;
                // Determine where we ought to go
                let position = {};
                let o;
                do {
                    position = room.gaussRing(1 / 3, 20);
                    o = placeNewFood(position, this.size, 0);
                } while (o == null);
                // Produce a few more
                for (let i = Math.ceil(Math.abs(ran.gauss(0, 4))); i <= 0; i--) {
                    placeNewFood(o, this.size, 0);
                }
                // Set location
                this.x = o.x;
                this.y = o.y;
                //util.debug('FoodSpawner placed at ('+this.x+', '+this.y+'). Set to produce '+this.foodToMake+' food.');
            }
            rot() {
                if (--this.foodToMake < 0) {
                    //util.debug('FoodSpawner rotted, respawning.');
                    util.remove(foodSpawners, foodSpawners.indexOf(this));
                    foodSpawners.push(new FoodSpawner());
                }
            }
        }
        // Add them
        foodSpawners.push(new FoodSpawner());
        foodSpawners.push(new FoodSpawner());
        foodSpawners.push(new FoodSpawner());
        foodSpawners.push(new FoodSpawner());
        // Food making functions
        let makeGroupedFood = () => { // Create grouped food
            // Choose a location around a spawner
            let spawner = foodSpawners[ran.irandom(foodSpawners.length - 1)],
                bubble = ran.gaussRing(spawner.size, 1 / 4);
            placeNewFood({
                x: spawner.x + bubble.x,
                y: spawner.y + bubble.y,
            }, -1, 0);
            spawner.rot();
        };
        let makeDistributedFood = () => { // Distribute food everywhere
            //util.debug('Creating new distributed food.');
            let spot = {};
            do {
                spot = room.gaussRing(3, 2);
            } while (room.isInNorm(spot));
            placeNewFood(spot, 0.01 * room.width, 0);
        };
        let makeCornerFood = () => { // Distribute food in the corners
            let spot = {};
            do {
                spot = room.gaussInverse(5);
            } while (room.isInNorm(spot));
            placeNewFood(spot, 0.05 * room.width, 0);
        };
        let makeNestFood = () => { // Make nest pentagons
            let spot = room.randomType('nest');
            placeNewFood(spot, 0.01 * room.width, 3, true);
        };
        // Return the full function
        return () => {
            // Find and understand all food
            let census = {
                [0]: 0, // Egg
                [1]: 0, // Square
                [2]: 0, // Triangle
                [3]: 0, // Penta
                [4]: 0, // Beta
                [5]: 0, // Alpha
                [6]: 0,
                [7]: 0,
                [8]: 0,
                [9]: 0,
                [10]: 0,
                tank: 0,
                sum: 0,
            };
            let censusNest = {
                [0]: 0, // Egg
                [1]: 0, // Square
                [2]: 0, // Triangle
                [3]: 0, // Penta
                [4]: 0, // Beta
                [5]: 0, // Alpha
                [6]: 0,
                [7]: 0,
                [8]: 0,
                [9]: 0,
                [10]: 0,
                sum: 0,
            };
            food = [];
            loopThrough(entities, function foodCensusUpdate(instance) {
                try {
                    if (instance.type === 'tank') {
                        census.tank++;
                    } else if (instance.foodLevel > -1) {
                        if (room.isIn('nest', {
                                x: instance.x,
                                y: instance.y,
                            })) {
                            censusNest.sum++;
                            censusNest[instance.foodLevel]++;
                        } else {
                            census.sum++;
                            census[instance.foodLevel]++;
                        }
                        food.push(instance);
                    }
                } catch (err) {
                    util.error(instance.label);
                    util.error(err);
                    instance.kill();
                }
            });
            // Sum it up
            let maxFood = 1 + room.maxFood + 1 * census.tank;
            let maxNestFood = 1 + room.maxFood * room.nestFoodAmount;
            let foodAmount = census.sum;
            let nestFoodAmount = censusNest.sum;
            foodSpawners.forEach(spawner => {
                if (ran.chance(1 - foodAmount / maxFood)) spawner.rot();
            });
            for (let i = foodAmount; i < maxFood; i ++) {
                if (Math.random() > 0.5) {
                    switch (ran.chooseChance(1, 5, 3)) {
                        case 0:
                            makeGroupedFood();
                            break;
                        case 1:
                            makeDistributedFood();
                            break;
                        case 2:
                            makeCornerFood();
                            break;
                    }
                }
            }
            for (let i = nestFoodAmount; i < maxNestFood; i ++) {
                if (Math.random() > 0.25) {
                    makeNestFood();
                }
            }
            if (!food.length) return 0;
            for (let i = Math.ceil(food.length / 100); i > 0; i--) {
                let o = food[ran.irandom(food.length - 1)], // A random food instance
                    oldId = -1000,
                    overflow, location;
                // Bounce 6 times
                for (let j = 0; j < 6; j++) {
                    overflow = 10;
                    // Find the nearest one that's not the last one
                    do {
                        o = nearest(food, {
                            x: ran.gauss(o.x, 30),
                            y: ran.gauss(o.y, 30),
                        });
                    } while (o.id === oldId && --overflow);
                    if (!overflow) continue;
                    // Configure for the nest if needed
                    let proportions = c.FOOD,
                        cens = census,
                        amount = foodAmount;
                    if (room.isIn('nest', o)) {
                        proportions = c.FOOD_NEST;
                        cens = censusNest;
                        amount = nestFoodAmount;
                    }
                    // Upgrade stuff
                    o.foodCountup += Math.ceil(Math.abs(ran.gauss(0, 100)));
                    while (o.foodCountup >= (o.foodLevel + 1) * 100) {
                        o.foodCountup -= (o.foodLevel + 1) * 100;
                        if (ran.chance(1 - cens[o.foodLevel + 1] / amount / proportions[o.foodLevel + 1])) {
                            o.define(getFoodClass(o.foodLevel + 1));
                        }
                    }
                }
            }
        };
    })();*/
    // Define food and food spawning
    return () => {
        // Do stuff
        makenpcs();
        createFood();
    };
})();
// Bring it to life
setInterval(gameloop, room.cycleSpeed);
setInterval(maintainloop, 1000);
setInterval(speedcheckloop, 1000);
setInterval(gamemodeLoop, 1000);
