const combineStats = function(arr) {
    try { // Build a blank array of the appropiate length
        let data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        arr.forEach(function(component) {
            for (let i = 0; i < data.length; i++) {
                data[i] = data[i] * component[i];
            }
        });
        return {
            reload: data[0],
            recoil: data[1],
            shudder: data[2],
            size: data[3],
            health: data[4],
            damage: data[5],
            pen: data[6],
            speed: data[7],
            maxSpeed: data[8],
            range: data[9],
            density: data[10],
            spray: data[11],
            resist: data[12],
        };
    } catch (err) {
        console.log(err);
        console.log(JSON.stringify(arr));
    }
};
const setBuild = build => {
    let skills = build.split(build.includes('/') ? '/' : '').map(r => +r);
    if (skills.length !== 10) throw new RangeError('Build must be made up of 10 numbers');
    return [6, 4, 3, 5, 2, 9, 0, 1, 8, 7].map(r => skills[r]);
};
const skillSet = (() => {
    let config = require('../config.json');
    let skcnv = {
        rld: 0,
        pen: 1,
        str: 2,
        dam: 3,
        spd: 4,
        shi: 5,
        atk: 6,
        hlt: 7,
        rgn: 8,
        mob: 9,
    };
    return args => {
        let skills = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let s in args) {
            if (!args.hasOwnProperty(s)) continue;
            skills[skcnv[s]] = Math.round(config.MAX_SKILL * args[s]);
        }
        return skills;
    };
})();
const g = {
    // Reload, Recoil, Shudder, Size, Health, Damage, Penetration, Speed, MaxSpeed, Range, Density, Spray, Resist.
    blank: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    fake: [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1],
    bullet: [17.5, 1.4, .1, 1, 1, .85, 1.05, 5.5, 1, 1.1, 1, 15, 1],
    explosion: [1, 0, 0.1, 50, 100, 0.2, 100, 0, 0, 1.75, 1, 1, 2],
    drone: [60, .25, .1, .55, 2.7, 1, .5, 3, 1, 1, 1, 1, 1.1],
    trap: [27, 1, .08, .65, 1.05, .5, .8, 4.5, 1, 1.25, 1, 8, 5],
    swarm: [24, .25, .05, .4, .85, .5, .7, 3.5, .95, 1.3, 1.25, 5, 1.25],
    spawner: [45, 1, .1, .75, 4.5, .3, .2, 2, 1, 1, 1.5, 1, 1.25],
    minion: [1.25, 1, 1, 1, .55, .55, .55, 1, 1, 1, 1, 1, 1],
    // Level 15 Stats
    twin: [1, .5, .9, 1, .9, .9, .9, 1, 1, 1, 1, 1, 1],
    pound: [1.5, 2.25, .75, 1, 1.52, 1.52, 1.52, .85, .75, 1, 1, 1, 2],
    sniper: [1.2, 1.1, .5, 1, 1.1, 1, 1.3, 1.2, 1.4, 1.1, 1, .25, 1],
    flank: [1, 1, 1, 1, 1, .95, .9, 1, .875, 1, 1, 1, 1],
    mach: [0.6, 1.2, 2, 1.1, .8, .8, .8, .9, 1, 1, 1, 2, 1],
    turret: [2, .5, 1, 1, .8, .8, 1.4, 1.1, 1.1, 1.1, 1, 1, 1],
    grower: [1, 1, 1, .75, 1, .9, 1, .9, 1, 1, 2, 1, .5],
    // Level 30 Stats
    destroy: [2, 2.25, .75, 1, 1.65, 1.65, 1.2, .75, .65, 1, 1, 1, 2],
    overseer: [1.33, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    double: [1, .2, 1, 1, .9, .9, .9, 1, 1, 1, 1, 1, 1],
    bent: [1, 1, 1, 1, 1, .95, 1.2, 1, 1, 1, 1, 1, 1],
    block: [1.2, 2, .1, 1.5, 2, .98, .91, 1.465, 2.475, 1.215, 1.1, 1, 1.5],
    assassin: [1.2, 1, 1, 1, 1, 1.05, 1.05, 1.2, 1, 1, 1, 1, 1],
    mini: [1, .6, 1, .8, .55, .55, 1, 1, .8, 1.25, 1, .6, 1],
    missileTrail: [.6, 0.25, 2, 1, 1, .9, .7, .4, 1, .5, 1, 1, 1],
    twisterMissileTrail: [1.75, 1, 1, 1, 0.8, 0.725, 0.8, 1, 1, 0.8, 1, 1, 1],
    sidewinderMissileTrail: [1, 1, 1, 1, 1, 1, 0.75, 0.5, 0.5, 1, 3, 1, 1],
    sidewinderMissileTrail2: [1.2, 0.8, 5, 1, 0.9, 0.9, 1.5, 0.8, 0.6, 0.8, 1, 3, 1],
    attackMissileTrail: [1.2, 1, 1, 1, 0.8, 0.667, 0.8, 1, 1, 1, 1, 1.5, 1],
    rocketeerMissileTrail: [0.5, 7, 1.5, 0.8, 0.8, 0.7, 1, 0.9, 0.8, 1, 1, 5, 1],
    hypermissileTrail: [2, 1, 1, 1, 1.05, 1.05, 1.05, 1.1, 0.8, 0.8, 1, 1, 1],
    speedbumpMissileTrail: [4, 0.75, 1, 1, 0.5, 0.6, 0.5, 1, 1, 1, 1, 0.75, 1],
    panzerfMissileTrail: [1.5, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1],
    rpgRocket: [1, 1, 3, 1, 0.4, 0.6, 0.3, 1, 1, 1, 1, 4, 1],
    launcher: [1.5, 1.5, .1, .85, 0.875, 0.9, 1, 1, 1, 1, 1, 1, 1.5],
    guard: [1, 1.4, 1, 1, 1, .95, .9, 1, .875, 1, 1.2, 1, 1],
    guardtrap: [1, .5, 1, 1.1, 1.1, 1, 1.1, 1, 1.2, 1.2, 1.1, 1, 1.1],
    hexa: [1, 1, 1, 1, 1, .95, .95, 1, 1, 1, 1, 1, 1],
    lightning: [1, 1, 1.1, 1, .6, 1.02, 1, 1.1, 1.1, 1, 1, 1, 1],
    swarmguard: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1.25, 1, 1, 1],
    bee: [1.2, 1, 1.2, 1, .7, 1, .9, .5, 1.15, 1, 1, 1, 1],
    hive: [1.25, 1, 1.05, .834, 1.2, 1, .9, .9, .85, .9, 1, 1, 1],
    boomerang: [1.25, 2, .1, 1.5, 2, .95, .9, 1.465, 2.475, 1.215, 1.1, 1, 1.5],
    sunchip: [3.5, 1, 1, 1.25, 1.1, .6, 1, .6, 1, 1, 1, 1, 1.5],
    taurus: [1.5, 1, 1, 1.5, 1, 0, .1, .001, .001, .75, 1, 1, 1],
    boxerback: [1, 1.2, 1, 1, .9, .95, .9, 1, 1, .8, 1, 1, 1],
    boxerfront: [1, 1.2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    quadtrap: [1.025, 1, 1, 1, 1, 1, 1, 1, 1, .5, 1, 1, 1],
    hunter: [1.05, 1.15, 1.05, 1, .8, .7, .95, 1, 1, 1, 1, 1, 1],
    hunter2: [1, .55, 1, 1, .9, 1.1, .8, 1, 1, 1, 1, 1, 1],
    binary: [1.2, 1.15, 1.05, 1, .8, .7, .95, 1, 1, 1, 1, 1, 1],
    binary2: [1, .55, 1, 1, .9, 1.1, .8, 1, 1, 1, 1, 1, 1],
    hewn: [.85, 0, 1, 1, 1.3, .5, 1, .8, 1, 1.2, .5, 1, 1],
    contagi: [.95, 1, 1, 1, 1.35, .6, .5, 1, 1, 1, 1.5, 1, 1],
    click: [1, .25, .5, 1, .4, 1.1, .8, .9, .975, 1, .9, .25, 1],
    multishot: [3, .4, 1.1, 1.5, 1, .7, .72, 1.675, .7, 1, 1.2, 1.4, 1],
    arthropoda: [1.1, 1, 1, 1, 1.5, .3, .8, 1, 1, 1, .5, 1, 1],
    heatseeker: [1.1, 1, 1, 1, 1, 1, 1, .7, 1, 1, 1, 1, 1],
    twinMachine: [1, 1.25, 1.25, 1.35, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    // Level 45 Stats
    eggmancer: [.4, 1, 1, .8, .8, .8, .8, 1.2, 1, 1, 1, 1, 1],
    trimancer: [1.5, 1, 1, .775, 1.25, 1.3, 1, .8, 1, 1, 1, 1, 1.1],
    factory: [1, 1, 1, 1, 1.2, .9, 1, 1.1, 1, 1, .9, 1, .8],
    hitScanMain: [3, 1.5, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    hitScan: [1, 2, 1, .75, 5, 5, 1, 1, 1, .25, 1, 1, 1],
    thunder: [1.1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    overlord: [1.33, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    octo: [1, 1, 1, 1, 1, .95, .9, .95, 1, 1, 1, 1, 1],
    myriapoda: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    presser: [.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    carrier: [2, 1.25, 1, 1, 1.3, 1.2, 1, 0.9, 1, 1, 1, 1, 1.25],
    skimmer: [1.1, 1.1, 1, 0.925, 1.1, 1.1, 1.1, 0.9, 1, 0.9, 1, 1, 1.05],
    hyperskimmer: [1.175, 1.1, 1, 1, 1.1, 1.1, 1, 0.9, 1, 0.9, 1, 1, 1],
    twister: [1.175, 0.8, 1, 1.15, 1.2, 0.9, 0.8, 0.9, 0.75, 1, 1.5, 1, 1],
    sidewinder: [1, 1, 2, 1.05, 1, 0.9, 1.25, 0.8, 1, 1, 1, 1, 1],
    rocketeer: [1.5, 1, 0.9, 0.9, 1.35, 1.2, 1.2, 0.225, 1, 1.3, 1, 1, 1.1],
    shrapnel: [1.5, 1, 1, 1.05, 0.8, 1.1, 1.1, 1, 1, 0.5, 1, 1, 1],
    catapult: [1.5, 1, 1, 1, 0.8, 0.6, 1, 0.8, 1, 0.675, 1, 1, 1],
    catapultMissile: [1.25, 0.1, 1, 1, 0.4, 0.4, 1, 1, 1, 0.675, 1, 3, 1],
    speedbump: [1.5, 1.1, 1, 1.175, 0.8, 1.05, 0.9, 1, 1, 0.9, 1, 1, 1],
    // NPCs
    protectorSwarm: [3, 0, 2, 1, 2, 2, 2, 2, 1, .75, 2, 1, 1],
    destroyerDominator: [5, 0, 1, 1, 7.5, 5, 2, .5, 1, 1, 1, 1, 1],
    gunnerDominator: [0.75, 0, 2, .85, .325, .6, .9, .9, 1, 1, 2, 1, 1],
    trapperDominator: [1.25, 0, .1, 1, 1, 1, 1, .8, 1, .9, 1, 1, 1],
    mothership: [2, 1, 1, 1, .5, .75, .75, 1, 1, 1, 2, 1, 1],
    arenaCloser: [.825, .5, 1, 1, 2, 2, 2, 1.5, 1.5, 1, 1, 1, 1],
    sentrySwarm: [1.5, 2, 1, 1, 1.5, 1.5, 1.5, 1.2, 1, 1, 1, 1, 1],
    nestDefenderTrapTurret: [5, 1, 0.5, 1, 2, 2, 1, 0.6, 1, 0.8, 1.2, 1, 1.5],
    crasherSpawner: [2, 1, 1, 1, .25, .25, .25, .5, 1, 1, 1, 1, 1],
    eliteGunner: [2.25, 2, 2, .8, 1.25, 1.25, 1.25, 1.1, 1.1, .8, 2, 5, 1],
    industry: [.8, 1, 1, .275, 1.75, 1, .25, .9, 1, 1, 3, 1, 1],
    summoner: [.1, 1, 1, 1, .25, .3, 1, 1, 1, 1, 1, 1, 1],
    eliteSkimmer: [1.75, 0, 1, .85, 1.6, 0.5, 1, .9, 1, .8, 1, .5, 1.5],
    eliteSkimmerMissile: [2, 0.9, 2, 1, 1.25, 1.25, 1.25, 0.8, 1, 0.8, 1, 2, 1],
    eggPrinceSwarm: [1.5, 1, 1, 1, 0.5, 2, 1, 3, 1.5, 0.9, 1, 1, 1],
    eggPrinceTier3Swarm: [0.8, 1, 1, 0.6, 0.9, 0.8, 1, 1, 0.9, 1, 1, 1, 1],
    eggPrinceBullet: [1, 0, 0.1, 1, 0.5, 0.5, 1.5, 1.5, 1, 0.9, 1, 0.1, 1],
	aifix: [10000000, 1, 1, 1, 1, 1, 1, 1, 1000, 1, 1, 1, 1],
	serpent: [8, 0, .000001, 1.2, 1, 1, 1, 0, 0, 2, 1, 1, 1],
	serpentTurret: [3, 0, 1, 1, 1, 1, 1, 1.1, 1.8, 0.8, 1, 1, 1],
};
for (let key in g)
    if (g[key].length !== 13) throw new Error("Error with gun stat: " + key + "\nStat has either too many values or too little values. Please review it and fix it.");
const dfltskl = 9; // NAMES
const statnames = {
    smasher: 1,
    drone: 2,
    necro: 3,
    swarm: 4,
    trap: 5,
    generic: 6,
};
const gunCalcNames = {
    default: 0,
    bullet: 1,
    drone: 2,
    swarm: 3,
    fixedReload: 4,
    thruster: 5,
    sustained: 6,
    necro: 7,
    trap: 8
};
const base = {
    ACCEL: 1.6,
    SPEED: 6.5,
    HEALTH: 20,
    DAMAGE: 5,
    RESIST: 1,
    PENETRATION: 1.05,
    SHIELD: 12,
    REGEN: 0.3,
    FOV: 1,
    DENSITY: 0.5
};

const shapeConfig = require("./definitionsHelpers/shapeConfig.js");

function makeAuto(type, name = -1, options = {}) {
    let turret = {
        type: exports.autoTurret,
        size: 10,
        independent: true
    };
    if (options.type != null) turret.type = options.type;
    if (options.size != null) turret.size = options.size;
    if (options.independent != null) turret.independent = options.independent;
    let output = JSON.parse(JSON.stringify(type));
    let autogun = {
        POSITION: [turret.size, 0, 0, 180, 360, 1],
        TYPE: [turret.type, {
            CONTROLLERS: ['nearestDifferentMaster'],
            INDEPENDENT: turret.independent
        }]
    };
    if (type.GUNS != null) output.GUNS = type.GUNS;
    if (type.TURRETS == null) output.TURRETS = [autogun];
    else output.TURRETS = [...type.TURRETS, autogun];
    if (name == -1) output.LABEL = 'Auto-' + type.LABEL;
    else output.LABEL = name;
    output.DANGER = type.DANGER ? (type.DANGER + 1) : 7;
    return output;
};

function makeHybrid(type, name = -1) {
    let output = JSON.parse(JSON.stringify(type));
    let spawner = {
        POSITION: [7, 12, 1.2, 8, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone]),
            TYPE: [exports.drone, {
                INDEPENDENT: true
            }],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: false,
            MAX_CHILDREN: 3
        }
    };
    if (type.TURRETS != null) output.TURRETS = type.TURRETS;
    if (type.GUNS == null) output.GUNS = [spawner];
    else output.GUNS = [...type.GUNS, spawner];
    if (name == -1) output.LABEL = 'Hybrid ' + type.LABEL;
    else output.LABEL = name;
    return output;
};

function bossStats(options = {}) {
    if (!options.health) options.health = 1;
    if (!options.damage) options.damage = 1;
    if (!options.speed) options.speed = 1;
    if (!options.fov) options.fov = 1;
    return {
        HEALTH: (base.HEALTH * 100) * options.health,
        DAMAGE: (base.DAMAGE * 1.5) * options.damage,
        SPEED: (base.SPEED * 0.05) * options.speed,
        DENSITY: 500,
        FOV: (base.FOV * 1.25) * options.fov,
        SHIELD: base.SHIELD * 0.9
    };
};
function crasherStats(options = {}) {
    if (!options.health) options.health = 1;
    if (!options.damage) options.damage = 1;
    if (!options.speed) options.speed = 1;
    if (!options.fov) options.fov = 1;
    return {
        HEALTH: (base.HEALTH * 0.1) * options.health,
        DAMAGE: (base.DAMAGE * 2) * options.damage,
        SPEED: (base.SPEED * 2.25) * options.speed,
        FOV: (base.FOV * 1.25) * options.fov,
        PENETRATION: 1.5,
        DENSITY: 0.1,
        PUSHABILITY: 0.1
    };
};
let makeAI = exportName => {
    exports[`${exportName}AI`] = {
        PARENT: [exports[exportName]],
        CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
        BODY: {
            FOV: 10
        },
        ACCEPTS_SCORE: false,
        CAN_BE_ON_LEADERBOARD: false
    };
};
const wepHealthFactor = 1;
const wepDamageFactor = 1.5;
const basePolygonDamage = 3.5;
const basePolygonHealth = 3.5;
exports.genericEntity = {
    NAME: "",
    LABEL: "Unknown Entity",
    TYPE: "unknown",
    DAMAGE_CLASS: 0,
    DANGER: 0,
    VALUE: 0,
    SHAPE: 0,
    COLOR: 16,
    INDEPENDENT: false,
    CONTROLLERS: ["doNothing"],
    HAS_NO_MASTER: false,
    MOTION_TYPE: "glide",
    FACING_TYPE: "toTarget",
    DRAW_HEALTH: false,
    DRAW_SELF: true,
    DAMAGE_EFFECTS: true,
    RATEFFECTS: true,
    MOTION_EFFECTS: true,
    INTANGIBLE: false,
    ACCEPTS_SCORE: true,
    GIVE_KILL_MESSAGE: false,
    CAN_GO_OUTSIDE_ROOM: false,
    HITS_OWN_TYPE: "normal",
    DIE_AT_LOW_SPEED: false,
    DIE_AT_RANGE: false,
    CLEAR_ON_MASTER_UPGRADE: false,
    PERSISTS_AFTER_DEATH: false,
    VARIES_IN_SIZE: false,
    HEALTH_WITH_LEVEL: true,
    CAN_BE_ON_LEADERBOARD: true,
    HAS_NO_RECOIL: false,
    AUTO_UPGRADE: "none",
    BUFF_VS_FOOD: false,
    OBSTACLE: false,
    CRAVES_ATTENTION: false,
    NECRO: false,
    UPGRADES_TIER_1: [],
    UPGRADES_TIER_2: [],
    UPGRADES_TIER_3: [],
    SKILL: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    LEVEL: 0,
    SKILL_CAP: [dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl],
    GUNS: [],
    MAX_CHILDREN: 0,
    BODY: {
        ACCELERATION: 1,
        SPEED: 0,
        HEALTH: 1,
        RESIST: 1,
        SHIELD: 0,
        REGEN: 0,
        DAMAGE: 1,
        PENETRATION: 1,
        RANGE: 0,
        FOV: 1,
        DENSITY: 1,
        STEALTH: 1,
        PUSHABILITY: 1,
        HETERO: 2
    },
    FOOD: {
        LEVEL: -1
    }
};
exports.genericTank = {
    LABEL: "Unknown Class",
    TYPE: "tank",
    DAMAGE_CLASS: 2,
    DANGER: 5,
    MOTION_TYPE: "motor",
    FACING_TYPE: "toTarget",
    SIZE: 12,
    MAX_CHILDREN: 0,
    DAMAGE_EFFECTS: false,
    BODY: {
        ACCELERATION: base.ACCEL,
        SPEED: base.SPEED,
        HEALTH: base.HEALTH,
        DAMAGE: base.DAMAGE,
        PENETRATION: base.PENETRATION,
        SHIELD: base.SHIELD,
        REGEN: base.REGEN,
        FOV: base.FOV,
        DENSITY: base.DENSITY,
        PUSHABILITY: .9,
        HETERO: 3
    },
    GUNS: [],
    TURRETS: [],
    GIVE_KILL_MESSAGE: true,
    DRAW_HEALTH: true,
    HITS_OWN_TYPE: "hardOnlyTanks"
};
exports.smasherBody = {
    LABEL: "",
    CONTROLLERS: ["spin"],
    COLOR: 9,
    SHAPE: 6,
    INDEPENDENT: true
};
exports.serpentBody = {
    LABEL: "",
    CONTROLLERS: ["spin"],
    COLOR: 9,
    SHAPE: 0,
    INDEPENDENT: true
};
exports.bullet = {
    LABEL: "Bullet",
    TYPE: "bullet",
    ACCEPTS_SCORE: false,
    BODY: {
        PENETRATION: 1,
        SPEED: 3.75,
        RANGE: 90,
        DENSITY: 1.25,
        HEALTH: .33,
        DAMAGE: 4.5,
        PUSHABILITY: .3
    },
    FACING_TYPE: "smoothWithMotion",
    CAN_GO_OUTSIDE_ROOM: true,
    HITS_OWN_TYPE: "never",
    DIE_AT_RANGE: true
};
exports.necroBullet = {
    PARENT: [exports.bullet],
    NECRO: true,
    HITS_OWN_TYPE: "hard"
};
exports.homingBullet = {
    PARENT: [exports.bullet],
    TYPE: "swarm",
    MOTION_TYPE: "swarm",
    FACING_TYPE: "smoothWithMotion",
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
	INDEPENDENT: true,
	BODY: {
		FOV: 1,
		ACCELERATION: 5,
	},
	AI: {
		SKYNET: true
	},
};
exports.drone = {
    LABEL: "Drone",
    TYPE: "drone",
    ACCEPTS_SCORE: false,
    DANGER: 2,
    CONTROL_RANGE: 0,
    SHAPE: 3,
    MOTION_TYPE: "chase",
    FACING_TYPE: "smoothToTarget",
    CONTROLLERS: ["nearestDifferentMaster", "canRepel", "mapTargetToGoal", "hangOutNearMaster"],
    AI: {
        BLIND: true
    },
    BODY: {
        PENETRATION: .5,
        PUSHABILITY: 1,
        ACCELERATION: .05,
        HEALTH: 1.5 * wepHealthFactor,
        DAMAGE: 2.75 * wepDamageFactor,
        SPEED: 5,
        RANGE: 90,
        DENSITY: 0.5,
        RESIST: 1.5,
        FOV: 1.25
    },
    HITS_OWN_TYPE: "hard",
    DRAW_HEALTH: false,
    CLEAR_ON_MASTER_UPGRADE: true,
    BUFF_VS_FOOD: true
};
exports.sunchip = {
    PARENT: [exports.drone],
    LABEL: "Square",
    SHAPE: 4,
    NECRO: true
};
exports.autoSunchip = {
    PARENT: [exports.sunchip],
    AI: {
        FARMER: true
    },
    INDEPENDENT: true
};
exports.eggchip = {
    PARENT: [exports.drone],
    LABEL: "Egg",
    SHAPE: 0,
    NECRO: true
};
exports.dorito = {
    PARENT: [exports.drone],
    LABEL: "Triangle",
    SHAPE: 3,
    NECRO: true
};
exports.minion = {
    PARENT: [exports.genericTank],
    LABEL: 'Minion',
    TYPE: 'minion',
    DAMAGE_CLASS: 0,
    HITS_OWN_TYPE: 'hardWithBuffer',
    FACING_TYPE: 'smoothToTarget',
    BODY: {
        FOV: .5,
        SPEED: 3.25,
        ACCELERATION: 0.4,
        HEALTH: 5,
        SHIELD: 0,
        DAMAGE: 1.2,
        RESIST: 1,
        PENETRATION: .25,
        DENSITY: 1
    },
    AI: {
        BLIND: true
    },
    DRAW_HEALTH: false,
    CLEAR_ON_MASTER_UPGRADE: true,
    GIVE_KILL_MESSAGE: false,
    CONTROLLERS: ['nearestDifferentMaster', 'mapAltToFire', 'minion', 'canRepel', 'hangOutNearMaster'],
    GUNS: [{
        POSITION: [17, 9, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minion]),
            WAIT_TO_CYCLE: true,
            TYPE: exports.bullet
        }
    }]
};
exports.trap = {
    LABEL: "Thrown Trap",
    TYPE: "trap",
    ACCEPTS_SCORE: false,
    SHAPE: -3,
    MOTION_TYPE: "glide",
    FACING_TYPE: "turnWithSpeed",
    HITS_OWN_TYPE: "push",
    DIE_AT_RANGE: true,
    BODY: {
        HEALTH: 4,
        DAMAGE: 2,
        PENETRATION: .25,
        RANGE: 450,
        DENSITY: 3,
        RESIST: 1,
        SPEED: .001
    }
};
exports.block = {
    LABEL: "Set Trap",
    PARENT: [exports.trap],
    SHAPE: -4,
    MOTION_TYPE: "motor",
    CONTROLLERS: ["goToMasterTarget"],
    BODY: {
        SPEED: 1,
        DENSITY: 1.5
    }
};
exports.pillboxTurret = {
    PARENT: [exports.genericTank],
    LABEL: "",
    COLOR: 16,
    BODY: {
        FOV: 2
    },
    HAS_NO_RECOIL: true,
    DANGER: 0,
    GUNS: [{
        POSITION: [22, 11, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minion]),
            TYPE: exports.bullet
        }
    }]
};
exports.pillbox = {
    LABEL: "Pillbox",
    PARENT: [exports.trap],
    SHAPE: -4,
    MOTION_TYPE: "motor",
    CONTROLLERS: ["goToMasterTarget", "nearestDifferentMaster"],
    INDEPENDENT: true,
    BODY: {
        SPEED: 1,
        DENSITY: 5
    },
    DIE_AT_RANGE: true,
    DANGER: 0,
    TURRETS: [{
        POSITION: [11, 0, 0, 0, 360, 1],
        TYPE: exports.pillboxTurret
    }]
};
exports.swarm = {
    LABEL: "Swarm Drone",
    TYPE: "swarm",
    ACCEPTS_SCORE: false,
    SHAPE: 3,
    MOTION_TYPE: "swarm",
    FACING_TYPE: "smoothWithMotion",
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    CRAVES_ATTENTION: true,
    BODY: {
        ACCELERATION: 3,
        PENETRATION: 1.5,
        HEALTH: .35 * wepHealthFactor,
        DAMAGE: 1.5 * wepDamageFactor,
        SPEED: 4.5,
        RESIST: 1.6,
        RANGE: 225,
        DENSITY: 12,
        PUSHABILITY: .5,
        FOV: 3
    },
    DIE_AT_RANGE: true,
    BUFF_VS_FOOD: true
};
exports.autoswarm = {
    PARENT: [exports.swarm],
    AI: {
        FARMER: true
    },
    INDEPENDENT: true
};
exports.bee = {
    PARENT: [exports.swarm],
    PERSISTS_AFTER_DEATH: true,
    SHAPE: 4,
    LABEL: 'Drone',
    HITS_OWN_TYPE: 'hardWithBuffer',
    BODY: {
        FOV: 1.5
    }
};
exports.autobee = {
    PARENT: [exports.bee],
    AI: {
        FARMER: true
    },
    INDEPENDENT: true
};
exports.turretParent = {
    PARENT: [exports.genericTank],
    LABEL: "Turret",
    BODY: {
        FOV: 3
    },
    DANGER: 0,
    CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"]
};
exports.autoTurret = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [22, 10, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.turret]),
            TYPE: exports.bullet
        }
    }]
};
exports.elite4gun = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [16, 4, 1, 0, -3.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.sniper, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 4, 1, 0, 3.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.sniper, g.turret]),
            TYPE: exports.bullet
        }
    }]
};
exports.bigelite4gun = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [14, 5, 1, 0, -4.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.sniper, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [14, 5, 1, 0, 4.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.sniper, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.sniper, g.turret]),
            TYPE: exports.bullet
        }
    }]
};
exports.heavyTurret = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [19, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.turret]),
            TYPE: exports.bullet
        }
    }]
};
exports.basic = {
    PARENT: [exports.genericTank],
    LABEL: "Basic",
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet]),
            TYPE: exports.bullet
        }
    }]
};
exports.testbedParent = {
    PARENT: [exports.genericTank],
    LABEL: "Developer",
    GUNS: [{
        POSITION: [18, 10, -1.4, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet]),
            TYPE: exports.bullet
        }
    }]
};
exports.resetSkills = {
    PARENT: [exports.genericTank],
    RESET_UPGRADES: true,
    SKILL: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    LEVEL: -1
};
exports.testbed = {
    PARENT: [exports.testbedParent]
};
exports.betaTester = {
    PARENT: [exports.testbedParent],
    LABEL: "Beta Tester"
};
exports.betaTanks = {
    PARENT: [exports.testbedParent],
    LABEL: "Beta Tanks"
};
exports.bosses = {
    PARENT: [exports.testbedParent],
    LABEL: "Bosses"
};
exports.arenaClosers = {
    PARENT: [exports.testbedParent],
    LABEL: "Arena Closers"
};
exports.dominators = {
    PARENT: [exports.testbedParent],
    LABEL: "Dominators"
};
exports.food = {
    TYPE: "food",
    DAMAGE_CLASS: 1,
    CONTROLLERS: ["moveInCircles"],
    HITS_OWN_TYPE: "hard",
    MOTION_TYPE: "drift",
    FACING_TYPE: "turnWithSpeed",
    VARIES_IN_SIZE: true,
    BODY: {
        STEALTH: 30,
        PUSHABILITY: 1
    },
    DAMAGE_EFFECTS: false,
    RATEFFECTS: false,
    HEALTH_WITH_LEVEL: false
};
exports.icosagon = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 20
    },
    LABEL: "Icosagon",
    VALUE: 1e8,
    SHAPE: 20,
    SIZE: 115,
    COLOR: 106,
    BODY: {
        DAMAGE: 3 * basePolygonDamage,
        DENSITY: 80,
        HEALTH: 3000 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        SHIELD: 30 * basePolygonHealth,
        REGEN: .1,
        PENETRATION: 2
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
};
exports.alphaDecagon = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 10
    },
    LABEL: "Alpha Decagon",
    VALUE: 100e3,
    SHAPE: 10,
    SIZE: 75,
    COLOR: 16,
    BODY: {
        DAMAGE: 4 * basePolygonDamage,
        DENSITY: 80,
        HEALTH: 1500 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        SHIELD: 40 * basePolygonHealth,
        REGEN: .1,
        PENETRATION: 2
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
};
exports.alphaNonagon = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 9
    },
    LABEL: "Alpha Nonagon",
    VALUE: 75e3,
    SHAPE: 9,
    SIZE: 70,
    COLOR: 0,
    BODY: {
        DAMAGE: 4 * basePolygonDamage,
        DENSITY: 80,
        HEALTH: 1000 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        SHIELD: 40 * basePolygonHealth,
        REGEN: .1,
        PENETRATION: 2
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
};
exports.alphaOctogon = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 8
    },
    LABEL: "Alpha Octagon",
    VALUE: 50e3,
    SHAPE: 8,
    SIZE: 65,
    COLOR: 4,
    BODY: {
        DAMAGE: 4 * basePolygonDamage,
        DENSITY: 80,
        HEALTH: 750 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        SHIELD: 40 * basePolygonHealth,
        REGEN: .1,
        PENETRATION: 2
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
};
exports.alphaHeptagon = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 7
    },
    LABEL: "Alpha Heptagon",
    VALUE: 37.5e3,
    SHAPE: 7,
    SIZE: 60,
    COLOR: 2,
    BODY: {
        DAMAGE: 4 * basePolygonDamage,
        DENSITY: 80,
        HEALTH: 500 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        SHIELD: 40 * basePolygonHealth,
        REGEN: .1,
        PENETRATION: 2
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
};
exports.alphaHexagon = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 6
    },
    LABEL: "Alpha Hexagon",
    VALUE: 25e3,
    SHAPE: 6,
    SIZE: 55,
    COLOR: 1,
    BODY: {
        DAMAGE: 4 * basePolygonDamage,
        DENSITY: 80,
        HEALTH: 250 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        SHIELD: 40 * basePolygonHealth,
        REGEN: .1,
        PENETRATION: 2
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
};
exports.hugePentagon = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 5
    },
    LABEL: "Alpha Pentagon",
    VALUE: 15e3,
    SHAPE: -5,
    SIZE: 50,
    COLOR: 14,
    BODY: {
        DAMAGE: 4 * basePolygonDamage,
        DENSITY: 80,
        HEALTH: 100 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        SHIELD: 40 * basePolygonHealth,
        REGEN: .1,
        PENETRATION: 2
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
};
exports.bigPentagon = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 4
    },
    LABEL: "Beta Pentagon",
    VALUE: 2e3,
    SHAPE: 5,
    SIZE: 30,
    COLOR: 14,
    BODY: {
        DAMAGE: 4 * basePolygonDamage,
        DENSITY: 30,
        HEALTH: 25 * basePolygonHealth,
        RESIST: Math.pow(1.25, 2),
        SHIELD: 20 * basePolygonHealth,
        PENETRATION: 2,
        REGEN: .2
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
};
exports.pentagon = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 3
    },
    LABEL: "Pentagon",
    VALUE: 400,
    SHAPE: 5,
    SIZE: 16,
    COLOR: 14,
    BODY: {
        DAMAGE: 1.4 * basePolygonDamage,
        DENSITY: 10,
        HEALTH: 9 * basePolygonHealth,
        RESIST: 1.25,
        PENETRATION: 2
    },
    DRAW_HEALTH: true
};
exports.triangle = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 2
    },
    LABEL: "Triangle",
    VALUE: 100,
    SHAPE: 3,
    SIZE: 9,
    COLOR: 2,
    BODY: {
        DAMAGE: 1.2 * basePolygonDamage,
        DENSITY: 5,
        HEALTH: 3 * basePolygonHealth,
        RESIST: 1,
        PENETRATION: 1.1
    },
    DRAW_HEALTH: true
};
exports.square = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 1
    },
    LABEL: "Square",
    VALUE: 25,
    SHAPE: 4,
    SIZE: 10,
    COLOR: 13,
    BODY: {
        DAMAGE: .7 * basePolygonDamage,
        DENSITY: 4,
        HEALTH: basePolygonHealth / .7,
        PENETRATION: 1
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false
};
exports.egg = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 0
    },
    HITS_OWN_TYPE: "repel",
    LABEL: "Egg",
    VALUE: 5,
    SHAPE: 0,
    SIZE: 6,
    COLOR: 6,
    INTANGIBLE: true,
    BODY: {
        DAMAGE: 0,
        DENSITY: 1.9,
        HEALTH: 5e-4,
        PUSHABILITY: 0
    },
    DRAW_HEALTH: false
};
exports.greenpentagon = {
    PARENT: [exports.food],
    LABEL: "Pentagon",
    VALUE: 3e4,
    SHAPE: 5,
    SIZE: 16,
    COLOR: 1,
    BODY: {
        DAMAGE: 3,
        DENSITY: 8,
        HEALTH: 200,
        RESIST: 1.25,
        PENETRATION: 1.1
    },
    DRAW_HEALTH: true,
    FOOD: {
        LEVEL: 3
    }
};
exports.greentriangle = {
    PARENT: [exports.food],
    LABEL: "Triangle",
    VALUE: 7e3,
    SHAPE: 3,
    SIZE: 9,
    COLOR: 1,
    BODY: {
        DAMAGE: 1,
        DENSITY: 6,
        HEALTH: 60,
        RESIST: 1.15,
        PENETRATION: 1.5
    },
    DRAW_HEALTH: true,
    FOOD: {
        LEVEL: 2
    }
};
exports.greensquare = {
    PARENT: [exports.food],
    LABEL: "Square",
    VALUE: 2e3,
    SHAPE: 4,
    SIZE: 10,
    COLOR: 1,
    BODY: {
        DAMAGE: .5,
        DENSITY: 4,
        HEALTH: 20,
        PENETRATION: 2
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    FOOD: {
        LEVEL: 1
    }
};
exports.gem = {
    PARENT: [exports.food],
    LABEL: "Gem",
    VALUE: 2e3,
    SHAPE: 6,
    SIZE: 5,
    COLOR: 0,
    BODY: {
        DAMAGE: basePolygonDamage / 4,
        DENSITY: 4,
        HEALTH: 10,
        PENETRATION: 2,
        RESIST: 2,
        PUSHABILITY: .25
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    FOOD: {
        LEVEL: 0
    }
};
exports.obstacle = {
    TYPE: "wall",
    DAMAGE_CLASS: 1,
    LABEL: "Rock",
    FACING_TYPE: "turnWithSpeed",
    SHAPE: -9,
    BODY: {
        PUSHABILITY: 0,
        HEALTH: 1e4,
        SHIELD: 1e4,
        REGEN: 1e3,
        DAMAGE: 1,
        RESIST: 100,
        STEALTH: 1
    },
    VALUE: 0,
    SIZE: 60,
    COLOR: 16,
    VARIES_IN_SIZE: true,
    GIVE_KILL_MESSAGE: true,
    ACCEPTS_SCORE: false
};
exports.babyObstacle = {
    PARENT: [exports.obstacle],
    SIZE: 25,
    SHAPE: -7,
    LABEL: "Gravel"
};
exports.moon = {
    PARENT: [exports.obstacle],
    SHAPE: 0,
    LABEL: "Moon"
};
exports.mazeWall = {
    PARENT: [exports.obstacle],
    SHAPE: 4,
    LABEL: "Wall"
};
exports.chonkrock = {
    PARENT: [exports.obstacle],
    SIZE: 25,
    SHAPE: -7,
    LABEL: "Gravel",
    MOTION_TYPE: "chonk"
};
exports.observer = {
    PARENT: [exports.genericTank],
    LABEL: "Observer",
    ALPHA: 0,
    DANGER: -5,
    BODY: {
        ACCELERATION: 2 * base.ACCEL,
        SPEED: 2 * base.SPEED,
        FOV: 3,
        HEALTH: 1e10,
        DAMAGE: 0,
        REGEN: 1e10
    }
};
exports.twin = {
    PARENT: [exports.genericTank],
    DANGER: 5,
    LABEL: "Twin",
    GUNS: [{
        POSITION: [19, 8, 1, 0, 5.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 8, 1, 0, -5.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin]),
            TYPE: exports.bullet
        }
    }]
};
exports.grower = {
    PARENT: [exports.genericTank],
    LABEL: "Grower",
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.grower]),
            TYPE: [exports.bullet, {MOTION_TYPE: 'grower'}]
	}, }, {
        POSITION: [2, 10, 1, 14, 0, 0, 0],
    }]
};
exports.botanist = {
    PARENT: [exports.genericTank],
    LABEL: "Botanist",
	DANGER: 5,
    BODY: {
        ACCELERATION: .85 * base.ACCEL
    },
    GUNS: [{
        POSITION: [19, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.grower]),
            TYPE: [exports.bullet, {MOTION_TYPE: 'grower'}]
	}, }, {
        POSITION: [2, 14, 1, 15, 0, 0, 0],
    }]
};
exports.superstorm = {
    PARENT: [exports.genericTank],
    DANGER: 6,
    BODY: {
        ACCELERATION: .8 * base.ACCEL
    },
    LABEL: "Superstorm",
    GUNS: [{
        POSITION: [20, 14, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.destroy, g.grower]),
            TYPE: [exports.bullet, {MOTION_TYPE: 'grower'}]
	}, }, {
        POSITION: [2, 16, 1, 16, 0, 0, 0],
    }]
};
exports.binary = {
    PARENT: [exports.genericTank],
    DANGER: 6,
    LABEL: "Binary",
    GUNS: [{
        POSITION: [19, 5, 1, 0, 5.5, 0, 0.25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.binary, g.binary2]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 5, 1, 0, -5.5, 0, 0.75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.binary, g.binary2]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 7, 1, 0, 5.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.binary]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 7, 1, 0, -5.5, 0, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.binary]),
            TYPE: exports.bullet
        }
    }]
};
exports.hewn = {
    PARENT: [exports.genericTank],
    DANGER: 6,
    LABEL: 'Hewn',
    BODY: {
        ACCELERATION: 1.25 * base.ACCEL,
        SPEED: 1.05 * base.SPEED
    },
    GUNS: [{
        POSITION: [16, 4, 1, 0, -7, -20, 0.25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.hewn]),
            TYPE: exports.bullet,
            LABEL: 'Secondary'
        },
    }, {
        POSITION: [16, 4, 1, 0, 7, 20, 0.75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.hewn]),
            TYPE: exports.bullet,
            LABEL: 'Secondary'
        },
    }, {
        POSITION: [19, 8, 1, 0, 5.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 8, 1, 0, -5.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin]),
            TYPE: exports.bullet
        }
    }]
};
exports.director = {
    PARENT: [exports.genericTank],
    LABEL: "Director",
    STAT_NAMES: statnames.drone,
    DANGER: 5,
    BODY: {
        ACCELERATION: .75 * base.ACCEL
    },
    MAX_CHILDREN: 6,
    GUNS: [{
        POSITION: [6, 12, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone
        }
    }]
};
exports.trapper = {
    PARENT: [exports.genericTank],
    LABEL: "Trapper",
    DANGER: 5,
    GUNS: [{
        POSITION: [13, 8, 1, 0, 0, 0, 0]
    }, {
        POSITION: [3, 8, 1.7, 13, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }]
};
exports.contagion = {
    PARENT: [exports.genericTank],
    LABEL: "Contagion",
    DANGER: 6,
    GUNS: [{
        POSITION: [18, 5, 1, 0, 0, 0, 0, ],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.contagi]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [13, 8, 1, 0, 0, 0, 0]
    }, {
        POSITION: [3, 8, 1.7, 13, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }]
};
exports.quadtrapper = {
    PARENT: [exports.genericTank],
    LABEL: "Quad Trapper",
    DANGER: 6,
    BODY: {
        ACCELERATION: .9 * base.ACCEL
    },
    GUNS: [{
        POSITION: [13, 8, 1, 0, 0, 0, 0]
    }, {
        POSITION: [3, 8, 1.7, 13, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.quadtrap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [13, 8, 1, 0, 0, 90, 0]
    }, {
        POSITION: [3, 8, 1.7, 13, 0, 90, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.quadtrap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [13, 8, 1, 0, 0, 180, 0]
    }, {
        POSITION: [3, 8, 1.7, 13, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.quadtrap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [13, 8, 1, 0, 0, 270, 0]
    }, {
        POSITION: [3, 8, 1.7, 13, 0, 270, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.quadtrap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }]
};
exports.pounder = {
    PARENT: [exports.genericTank],
    DANGER: 5,
    BODY: {
        ACCELERATION: .85 * base.ACCEL
    },
    LABEL: "Pounder",
    GUNS: [{
        POSITION: [19, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound]),
            TYPE: exports.bullet
        }
    }]
};
exports.destroyer = {
    PARENT: [exports.genericTank],
    DANGER: 6,
    BODY: {
        ACCELERATION: .8 * base.ACCEL
    },
    LABEL: "Destroyer",
    GUNS: [{
        POSITION: [20, 14, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.destroy]),
            TYPE: exports.bullet
        }
    }]
};
exports.boxer = {
    PARENT: [exports.genericTank],
    LABEL: "Boxer",
    DANGER: 6,
    GUNS: [{
        POSITION: [19, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.boxerfront]),
            TYPE: exports.bullet,
            ALT_FIRE: true
        }
    }, {
        POSITION: [19, 8, 1, 0, 5.5, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.boxerback]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 8, 1, 0, -5.5, 180, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.boxerback]),
            TYPE: exports.bullet
        }
    }]
};
exports.multishot = {
    PARENT: [exports.genericTank],
    DANGER: 6,
    BODY: {
        ACCELERATION: .8 * base.ACCEL
    },
    LABEL: "Multishot",
    GUNS: [{
        POSITION: [18, 4, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 4.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 2.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 3, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 2, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot]),
            TYPE: exports.bullet
        }
    },{
        POSITION: [19, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.fake]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5, 12, -1.2, 7.5, 0, 0, 0, ],
    }]
};
exports.overseer = {
    PARENT: [exports.genericTank],
    LABEL: "Overseer",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        ACCELERATION: .75 * base.ACCEL,
        SPEED: .9 * base.SPEED
    },
    MAX_CHILDREN: 8,
    GUNS: [{
        POSITION: [6, 12, 1.2, 8, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6, 12, 1.2, 8, 0, 270, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }]
};
exports.heatseeker = {
    PARENT: [exports.genericTank],
    LABEL: "Heatseeker",
    DANGER: 5,
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker]),
            TYPE: exports.homingBullet
        }
    }, {
        POSITION: [3, 15, 1.3, 18, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.fake]),
            TYPE: exports.homingBullet
        }
    }]
};
exports.flycatcher = {
    PARENT: [exports.genericTank],
    LABEL: "Flycatcher",
    DANGER: 6,
    GUNS: [{
        POSITION: [24, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.sniper]),
            TYPE: exports.homingBullet
        }
    }, {
        POSITION: [3, 15, 1.3, 24, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.sniper, g.fake]),
            TYPE: exports.homingBullet
        }
    }]
};
exports.presser = {
    PARENT: [exports.genericTank],
    LABEL: "Presser",
	DANGER: 6,
    GUNS: [{
        POSITION: [19, 8, 1, 0, 5.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.twin]),
            TYPE: exports.homingBullet
        }
    }, {
        POSITION: [19, 8, 1, 0, -5.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.twin]),
            TYPE: exports.homingBullet
        }
    }, {
        POSITION: [3, 21, 1.3, 18, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.twin, g.presser, g.fake]),
            TYPE: exports.homingBullet
        }
    }]
};
exports.astronaut = {
    PARENT: [exports.genericTank],
    DANGER: 6,
    BODY: {
        ACCELERATION: .85 * base.ACCEL
    },
    LABEL: "Astronaut",
    GUNS: [{
        POSITION: [19, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.pound]),
            TYPE: exports.homingBullet
        }
    }, {
        POSITION: [3, 19, 1.3, 19, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.pound, g.fake]),
            TYPE: exports.homingBullet
        }
    }]
};
exports.overlord = {
    PARENT: [exports.genericTank],
    LABEL: "Overlord",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        ACCELERATION: .75 * base.ACCEL,
        SPEED: .9 * base.SPEED
    },
    MAX_CHILDREN: 8,
    GUNS: [{
        POSITION: [6, 12, 1.2, 8, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overlord]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6, 12, 1.2, 8, 0, 270, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overlord]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6, 12, 1.2, 8, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overlord]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6, 12, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overlord]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }]
};
exports.double = {
    PARENT: [exports.genericTank],
    LABEL: "Double",
    DANGER: 6,
    GUNS: [{
        POSITION: [20, 8, 1, 0, 5.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.double]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 8, 1, 0, -5.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.double]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 8, 1, 0, 5.5, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.double]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 8, 1, 0, -5.5, 180, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.double]),
            TYPE: exports.bullet
        }
    }]
};
exports.builder = {
    PARENT: [exports.genericTank],
    DANGER: 6,
    LABEL: "Builder",
    STAT_NAMES: statnames.trap,
    BODY: {
        SPEED: .8 * base.SPEED,
        FOV: 1.15 * base.FOV
    },
    GUNS: [{
        POSITION: [18, 12, 1, 0, 0, 0, 0]
    }, {
        POSITION: [2, 12, 1.1, 18, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block]),
            TYPE: exports.block
        }
    }]
};
exports.sniper = {
    PARENT: [exports.genericTank],
    LABEL: "Sniper",
    DANGER: 5,
    BODY: {
        ACCELERATION: .8 * base.ACCEL,
        FOV: 1.25 * base.FOV
    },
    GUNS: [{
        POSITION: [24, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper]),
            TYPE: exports.bullet
        }
    }]
};
exports.assassin = {
    PARENT: [exports.genericTank],
    DANGER: 6,
    LABEL: "Assassin",
    BODY: {
        ACCELERATION: .75 * base.ACCEL,
        FOV: 1.4 * base.FOV
    },
    GUNS: [{
        POSITION: [27, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.assassin]),
            TYPE: exports.bullet
        }
    }]
};
exports.clicker = {
    PARENT: [exports.genericTank],
    LABEL: "Clicker",
    DANGER: 6,
    BODY: {
        ACCELERATION: .85 * base.ACCEL,
        FOV: 1.2 * base.FOV
    },
    GUNS: [{
        POSITION: [24, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.click]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [24, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.click]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [24, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.click]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [24, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.click]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5, 8.5, -1.6, 8, 0, 0, 0, ],
    }]
};
exports.hunter = {
    PARENT: [exports.genericTank],
    LABEL: 'Hunter',
    DANGER: 6,
    BODY: {
        ACCELERATION: base.ACCEL * .9,
        FOV: base.FOV * 1.25
    },
    GUNS: [{
        POSITION: [24, 7, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.hunter2]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [21, 10.5, 1, 0, 0, 0, 0.25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter]),
            TYPE: exports.bullet
        },
    }]
};
exports.cruiser = {
    PARENT: [exports.genericTank],
    LABEL: "Cruiser",
    DANGER: 6,
    FACING_TYPE: "locksFacing",
    STAT_NAMES: statnames.swarm,
    BODY: {
        ACCELERATION: .8 * base.ACCEL,
        FOV: 1.1 * base.FOV
    },
    GUNS: [{
        POSITION: [7, 7.5, .6, 7, 4, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 7.5, .6, 7, -4, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }]
};
exports.carrier = {
    PARENT: [exports.genericTank],
    LABEL: "Carrier",
    DANGER: 7,
    FACING_TYPE: "locksFacing",
    STAT_NAMES: statnames.swarm,
    BODY: {
        ACCELERATION: .75 * base.ACCEL,
        FOV: 1.2 * base.FOV
    },
    GUNS: [{
        POSITION: [7, 7.5, .6, 7, 2, 40, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.carrier]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 7.5, .6, 7, -2, -40, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.carrier]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 7.5, .6, 7, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.carrier]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }]
};
exports.minigun = {
    PARENT: [exports.genericTank],
    LABEL: "Minigun",
    DANGER: 6,
    BODY: {
        FOV: 1.2
    },
    GUNS: [{
        POSITION: [22, 7.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 7.5, 1, 0, 0, 0, .333],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 7.5, 1, 0, 0, 0, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini]),
            TYPE: exports.bullet
        }
    }]
};
exports.launcherMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [16, 8, 1, 0, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
};
exports.skimmerMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [14, 6, 1, 0, -2, 130, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [14, 6, 1, 0, 2, 230, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
};
exports.hyperskimmerMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [14, 6, 1, 0, -2, 150, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.hypermissileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [14, 6, 1, 0, 2, 210, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.hypermissileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [14, 6, 1, 0, -2, 90, .5],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.hypermissileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [14, 6, 1, 0, 2, 270, .5],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.hypermissileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }]
};
exports.hovercraftMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [15, 7.5, 0.6, 0, -2, 130, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.swarm, g.missileTrail, g.hypermissileTrail]),
            TYPE: [exports.swarm, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [15, 7.5, 0.6, 0, 2, 230, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.swarm, g.missileTrail, g.hypermissileTrail]),
            TYPE: [exports.swarm, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
};
exports.patherMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [14, 6, 1, 0, -2, 130, 0]
    }, {
        POSITION: [2, 6, 1.5, 14, -2, 130, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.trap, g.missileTrail, g.hypermissileTrail]),
            TYPE: [exports.trap, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [14, 6, 1, 0, 2, 230, 0]
    }, {
        POSITION: [2, 6, 1.5, 14, 2, 230, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.trap, g.missileTrail, g.hypermissileTrail]),
            TYPE: [exports.trap, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
};
exports.twisterMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: false,
    CONTROLLERS: ["spinMissile"],
    FACING_TYPE: "toTarget",
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [15, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.twisterMissileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [15, 8, 1, 0, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.twisterMissileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
};
exports.demomanMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: false,
    CONTROLLERS: ["spinMissile"],
    FACING_TYPE: "toTarget",
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [15, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.twisterMissileTrail, g.twisterMissileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [15, 8, 1, 0, 0, 90, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.twisterMissileTrail, g.twisterMissileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [15, 8, 1, 0, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.twisterMissileTrail, g.twisterMissileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [15, 8, 1, 0, 0, 270, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.twisterMissileTrail, g.twisterMissileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
};
exports.tornadoMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: false,
    CONTROLLERS: ["spinMissile"],
    FACING_TYPE: "toTarget",
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [16, 9, 0.75, 0, 0, 0, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.swarm, g.missileTrail, g.twisterMissileTrail]),
            TYPE: [exports.swarm, {
                PERSISTS_AFTER_DEATH: true,
                INDEPENDENT: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 9, 0.75, 0, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.swarm, g.missileTrail, g.twisterMissileTrail]),
            TYPE: [exports.swarm, {
                PERSISTS_AFTER_DEATH: true,
                INDEPENDENT: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
};
exports.frontierMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: false,
    CONTROLLERS: ["spinMissile"],
    FACING_TYPE: "toTarget",
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [15, 8, 1, 0, 0, 0, 0]
    }, {
        POSITION: [3, 8, 1.5, 15, 0, 0, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.trap, g.missileTrail, g.twisterMissileTrail]),
            TYPE: [exports.trap, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [15, 8, 1, 0, 0, 180, 0]
    }, {
        POSITION: [3, 8, 1.5, 15, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.trap, g.missileTrail, g.twisterMissileTrail]),
            TYPE: [exports.trap, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
};
exports.rocketeerMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [16.5, 10, 1.5, 0, 0, 180, 7.5],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.rocketeerMissileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
};
exports.speedbumpMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: (() => {
        let output = [];
        for (let i = 0; i < 6; i ++) {
            output.push({
                POSITION: [50 - (i * 5), 11, 1, 0, 0, 180, 1.875 + (i / 6)],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.rocketeerMissileTrail, g.speedbumpMissileTrail]),
                    TYPE: [exports.bullet, {
                        PERSISTS_AFTER_DEATH: true
                    }],
                    STAT_CALCULATOR: gunCalcNames.thruster,
                    AUTOFIRE: true
                }
            })
        }
        return output;
    })()
};
exports.panzerfMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [16.5, 10, 2, 0, 0, 180, 3.75],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.swarm, g.missileTrail, g.rocketeerMissileTrail, g.panzerfMissileTrail]),
            TYPE: [exports.swarm, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
};
exports.kievMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [16.5, 10, 1.5, 0, 0, 180, 0]
    }, {
        POSITION: [3, 15, 1.5, 16.5, 0, 180, 7.5],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.trap, g.missileTrail, g.rocketeerMissileTrail]),
            TYPE: [exports.trap, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
};
exports.sidewinderMissile = {
    PARENT: [exports.bullet],
    LABEL: "Snake",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    MOTION_TYPE: "sidewinder",
    FACING_TYPE: "smoothWithMotion",
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    LIKES_SHAPES: true,
    GUNS: [{
        POSITION: [6, 12, 1.4, 8, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            STAT_CALCULATOR: gunCalcNames.thruster,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.sidewinderMissileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [10, 12, .8, 8, 0, 180, .5],
        PROPERTIES: {
            AUTOFIRE: true,
            NEGATIVE_RECOIL: true,
            STAT_CALCULATOR: gunCalcNames.thruster,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.sidewinderMissileTrail, g.sidewinderMissileTrail2]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }]
};
exports.attackMissilerMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    MOTION_TYPE: "sidewinder",
    FACING_TYPE: "smoothWithMotion",
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    LIKES_SHAPES: true,
    GUNS: [{
        POSITION: [6, 12, 1.4, 8, 2, 145, 0.334],
        PROPERTIES: {
            AUTOFIRE: true,
            STAT_CALCULATOR: gunCalcNames.thruster,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.sidewinderMissileTrail, g.attackMissileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [6, 12, 1.4, 8, -2, 215, 0.334],
        PROPERTIES: {
            AUTOFIRE: true,
            STAT_CALCULATOR: gunCalcNames.thruster,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.sidewinderMissileTrail, g.attackMissileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [6, 12, 1.4, 8, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            STAT_CALCULATOR: gunCalcNames.thruster,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.sidewinderMissileTrail, g.attackMissileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [10, 12, .8, 8, 0, 180, .667],
        PROPERTIES: {
            AUTOFIRE: true,
            NEGATIVE_RECOIL: true,
            STAT_CALCULATOR: gunCalcNames.thruster,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.sidewinderMissileTrail, g.sidewinderMissileTrail2, g.attackMissileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }]
};
exports.jupiterMissile = {
    PARENT: [exports.bullet],
    LABEL: "Thunderclap",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    MOTION_TYPE: "sidewinder",
    FACING_TYPE: "smoothWithMotion",
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    LIKES_SHAPES: true,
    GUNS: [{
        POSITION: [6, 12, 1.8, 8, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            STAT_CALCULATOR: gunCalcNames.thruster,
            SHOOT_SETTINGS: combineStats([g.swarm, g.missileTrail, g.sidewinderMissileTrail]),
            TYPE: [exports.swarm, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [10, 12, .5, 8, 0, 180, .5],
        PROPERTIES: {
            AUTOFIRE: true,
            NEGATIVE_RECOIL: true,
            STAT_CALCULATOR: gunCalcNames.thruster,
            SHOOT_SETTINGS: combineStats([g.swarm, g.missileTrail, g.sidewinderMissileTrail, g.sidewinderMissileTrail2]),
            TYPE: [exports.swarm, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }]
};
exports.saturnMissile = {
    PARENT: [exports.bullet],
    LABEL: "Ringer",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    MOTION_TYPE: "sidewinder",
    FACING_TYPE: "smoothWithMotion",
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    LIKES_SHAPES: true,
    GUNS: [{
        POSITION: [6, 12, 1.4, 8, 0, 180, 0]
    }, {
        POSITION: [3, 16.8, 1.4, 14, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            STAT_CALCULATOR: gunCalcNames.thruster,
            SHOOT_SETTINGS: combineStats([g.trap, g.missileTrail, g.sidewinderMissileTrail]),
            TYPE: [exports.trap, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [10, 12, .8, 8, 0, 180, 0]
    }, {
        POSITION: [3, 9.6, 1.25, 18, 0, 180, .5],
        PROPERTIES: {
            AUTOFIRE: true,
            NEGATIVE_RECOIL: true,
            STAT_CALCULATOR: gunCalcNames.thruster,
            SHOOT_SETTINGS: combineStats([g.trap, g.missileTrail, g.sidewinderMissileTrail, g.sidewinderMissileTrail2]),
            TYPE: [exports.trap, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }]
};
exports.swamperMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [16, 8, 0.6, 0, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.swarm, g.missileTrail]),
            TYPE: [exports.swarm, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
};
exports.promenaderMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [16, 8, 1, 0, 0, 180, 0],
    }, {
        POSITION: [3, 8, 1.5, 16, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.trap, g.missileTrail]),
            TYPE: [exports.trap, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
};
exports.catapultMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [9, 16, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [16, 17.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.catapultMissile]),
            TYPE: [exports.launcherMissile, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.sustained,
            AUTOFIRE: true
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
};
exports.trebutchetMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [10, 14, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [17, 15, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.skimmer, g.catapultMissile]),
            TYPE: [exports.skimmerMissile, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.sustained,
            AUTOFIRE: true
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
};
exports.twistepultMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [10, 11, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [17, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.twister, g.catapultMissile]),
            TYPE: [exports.twisterMissile, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.sustained,
            AUTOFIRE: true
        }
    }, {
        POSITION: [5.5, 12, -1.3, 6.5, 0, 0, 0]
    }, {
        POSITION: [16, 8, 1, 0, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
};
exports.onagerMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [10, 12.5, -.7, 10, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.rocketeer, g.catapultMissile]),
            TYPE: [exports.rocketeerMissile, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.sustained,
            AUTOFIRE: true
        }
    }, {
        POSITION: [17, 18, .65, 0, 0, 0, 0]
    }, {
        POSITION: [16, 8, 1, 0, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
};
exports.AIM9Missile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [10, 11, -.5, 14, 0, 0, 0]
    }, {
        POSITION: [21, 12, -1.1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.sidewinder, g.catapultMissile]),
            TYPE: [exports.sidewinderMissile, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.sustained,
            AUTOFIRE: true
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
};
exports.mangonelMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [9, 16, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [16, 13, 1.5, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.catapult, g.catapultMissile]),
            TYPE: [exports.catapultMissile, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.sustained,
            AUTOFIRE: true
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
};
exports.curatorMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [9, 16, .5, 9, 0, 0, 0]
    }, {
        POSITION: [16, 17.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.catapultMissile]),
            TYPE: [exports.swamperMissile, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.sustained,
            AUTOFIRE: true
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
};
exports.inventoryMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [3, 13, 1.5, 13, 0, 0, 0]
    }, {
        POSITION: [9, 16, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [16, 17.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.catapultMissile]),
            TYPE: [exports.promenaderMissile, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.sustained,
            AUTOFIRE: true
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
};
exports.explosion = {
    PARENT: [exports.bullet],
    LABEL: "Explosion",
    MOTION_TYPE: "explosion",
    GO_THROUGH_WALLS: true,
    BODY: {
        SPEED: 0.001
    }
};
exports.shard = {
    PARENT: [exports.bullet],
    LABEL: "Shard",
    SHAPE: shapeConfig.shard
};
exports.nuke = {
    PARENT: [exports.bullet],
    LABEL: "Nuke",
    SHAPE: shapeConfig.nuke,
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [1, 1, 1, 0, 0, 0, Infinity],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.explosion]),
            TYPE: [exports.explosion, {
                PERSISTS_AFTER_DEATH: true
            }],
            SHOOT_ON_DEATH: true
        }
    }]
};
exports.crockettNuke = {
    PARENT: [exports.bullet],
    LABEL: "Nuke",
    SHAPE: shapeConfig.nuke,
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: (() => {
        let output = [{
            POSITION: [1, 1, 1, 0, 0, 0, Infinity],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.bullet, g.explosion]),
                TYPE: [exports.explosion, {
                    PERSISTS_AFTER_DEATH: true
                }],
                SHOOT_ON_DEATH: true
            }
        }];
        for (let i = 0; i < 8; i ++) {
            output.push({
                POSITION: [1, 6, 1, 0, 0, 360 / 8 * i, Infinity],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.bullet, g.mach]),
                    TYPE: [exports.shard, {
                        PERSISTS_AFTER_DEATH: true
                    }],
                    SHOOT_ON_DEATH: true
                }
            });
        }
        return output;
    })()
};
exports.rpgRocket = {
    PARENT: [exports.bullet],
    LABEL: "Rocket",
    SHAPE: shapeConfig.rpgRocket,
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: (() => {
        let output = [{
            POSITION: [1, 7.5, 1, 0, 0, 180, 3],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.rocketeerMissileTrail]),
                TYPE: [exports.bullet, {
                    PERSISTS_AFTER_DEATH: true
                }]
            }
        }];
        for (let i = 0; i < 18; i ++) {
            output.push({
                POSITION: [1, 6, 1, 0, 0, 360 / 18 * i, Infinity],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.bullet, g.rpgRocket]),
                    TYPE: [exports.shard, {
                        PERSISTS_AFTER_DEATH: true
                    }],
                    SHOOT_ON_DEATH: true
                }
            });
        }
        return output;
    })()
};
exports.launcher = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.075 * base.FOV
    },
    LABEL: "Launcher",
    DANGER: 6,
    GUNS: [{
        POSITION: [9, 12, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [16, 13, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher]),
            TYPE: exports.launcherMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }]
};
exports.skimmer = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.15 * base.FOV
    },
    LABEL: "Skimmer",
    DANGER: 7,
    GUNS: [{
        POSITION: [10, 14, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [17, 15, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.skimmer]),
            TYPE: exports.skimmerMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }]
};
exports.hyperskimmer = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.15 * base.FOV
    },
    LABEL: "Hyperskimmer",
    DANGER: 8,
    GUNS: [{
        POSITION: [10, 16.5, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [17, 18, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.skimmer, g.hyperskimmer]),
            TYPE: exports.hyperskimmerMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }]
};
exports.hovercraft = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.15 * base.FOV
    },
    LABEL: "Hovercraft",
    DANGER: 8,
    GUNS: [{
        POSITION: [10, 14, .5, 9, 0, 0, 0]
    }, {
        POSITION: [17, 15, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.skimmer]),
            TYPE: exports.hovercraftMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }]
};
exports.pather = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.075 * base.FOV
    },
    LABEL: "Pather",
    DANGER: 8,
    GUNS: [{
        POSITION: [3, 15, 1.5, 14, 0, 0, 0]
    }, {
        POSITION: [10, 14, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [17, 15, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.skimmer]),
            TYPE: exports.patherMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }]
};
exports.twister = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.075 * base.FOV
    },
    LABEL: "Twister",
    DANGER: 7,
    GUNS: [{
        POSITION: [10, 11, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [17, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.twister]),
            TYPE: exports.twisterMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [5.5, 12, -1.3, 6.5, 0, 0, 0]
    }]
};
exports.demoman = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.075 * base.FOV
    },
    LABEL: "Demoman",
    DANGER: 8,
    GUNS: [{
        POSITION: [10, 9, -.5, 11, 0, 0, 0]
    }, {
        POSITION: [10, 11, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [17, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.twister]),
            TYPE: exports.demomanMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [5.5, 12, -1.3, 6.5, 0, 0, 0]
    }]
};
exports.tornado = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.075 * base.FOV
    },
    LABEL: "Tornado",
    DANGER: 8,
    GUNS: [{
        POSITION: [10, 11, .5, 9, 0, 0, 0]
    }, {
        POSITION: [17, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.twister]),
            TYPE: exports.tornadoMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [5.5, 12, -1.3, 6.5, 0, 0, 0]
    }]
};
exports.frontier = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.075 * base.FOV
    },
    LABEL: "Frontier",
    DANGER: 8,
    GUNS: [{
        POSITION: [3, 13, 1.5, 14, 0, 0, 0]
    }, {
        POSITION: [10, 11, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [17, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.twister]),
            TYPE: exports.frontierMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [5.5, 12, -1.3, 6.5, 0, 0, 0]
    }]
};
exports.rocketeer = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.15 * base.FOV
    },
    LABEL: "Rocketeer",
    DANGER: 7,
    GUNS: [{
        POSITION: [10, 12.5, -.7, 10, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.rocketeer]),
            TYPE: exports.rocketeerMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [17, 18, .65, 0, 0, 0, 0]
    }]
};
exports.speedbump = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.15 * base.FOV
    },
    LABEL: "Speedbump",
    DANGER: 8,
    GUNS: [{
        POSITION: [10, 12.5, -.7, 18, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.rocketeer, g.speedbump]),
            TYPE: exports.speedbumpMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [25, 18, .65, 0, 0, 0, 0]
    }, {
        POSITION: [12, 18, 0.8, 0, 0, 0, 0]
    }]
};
exports.panzerf = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.15 * base.FOV
    },
    LABEL: "Panzerfaust",
    DANGER: 8,
    GUNS: [{
        POSITION: [10, 12.5, .7, 10, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.rocketeer]),
            TYPE: exports.panzerfMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [17, 18, .65, 0, 0, 0, 0]
    }]
};
exports.kiev = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.15 * base.FOV
    },
    LABEL: "Kiev",
    DANGER: 8,
    GUNS: [{
        POSITION: [3, 13, 1.5, 14, 0, 0, 0]
    }, {
        POSITION: [10, 12.5, -.7, 10, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.rocketeer]),
            TYPE: exports.kievMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [17, 18, .65, 0, 0, 0, 0]
    }]
};
exports.sidewinder = {
    PARENT: [exports.genericTank],
    LABEL: "Sidewinder",
    DANGER: 7,
    BODY: {
        FOV: 1.15 * base.FOV
    },
    GUNS: [{
        POSITION: [10, 11, -.5, 14, 0, 0, 0]
    }, {
        POSITION: [21, 12, -1.1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.sidewinder]),
            TYPE: exports.sidewinderMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }]
};
exports.attackMissiler = {
    PARENT: [exports.genericTank],
    LABEL: "Attack Missiler",
    DANGER: 8,
    BODY: {
        FOV: 1.15 * base.FOV
    },
    GUNS: [{
        POSITION: [10, 9, -.5, 16, 0, 0, 0]
    }, {
        POSITION: [10, 11, -.5, 14, 0, 0, 0]
    }, {
        POSITION: [21, 12, -1.1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.sidewinder]),
            TYPE: exports.attackMissilerMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }]
};
exports.jupiter = {
    PARENT: [exports.genericTank],
    LABEL: "Jupiter",
    DANGER: 8,
    BODY: {
        FOV: 1.15 * base.FOV
    },
    GUNS: [{
        POSITION: [10, 11, .5, 14, 0, 0, 0]
    }, {
        POSITION: [21, 12, -1.1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.sidewinder]),
            TYPE: exports.jupiterMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }]
};
exports.saturn = {
    PARENT: [exports.genericTank],
    LABEL: "Saturn",
    DANGER: 8,
    BODY: {
        FOV: 1.15 * base.FOV
    },
    GUNS: [{
        POSITION: [3, 12, 1.5, 19, 0, 0, 0]
    }, {
        POSITION: [10, 11, -.5, 14, 0, 0, 0]
    }, {
        POSITION: [21, 12, -1.1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.sidewinder]),
            TYPE: exports.saturnMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }]
};
exports.swamper = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.075 * base.FOV
    },
    LABEL: "Swamper",
    DANGER: 7,
    GUNS: [{
        POSITION: [9, 12, .5, 9, 0, 0, 0]
    }, {
        POSITION: [16, 13, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher]),
            TYPE: exports.swamperMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }]
};
exports.promenader = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.075 * base.FOV
    },
    LABEL: "Promenader",
    DANGER: 6,
    GUNS: [{
        POSITION: [3, 13, 1.5, 13, 0, 0, 0]
    }, {
        POSITION: [9, 12, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [16, 13, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher]),
            TYPE: exports.promenaderMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }]
};
exports.catapult = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.075 * base.FOV
    },
    LABEL: "Catapult",
    DANGER: 7,
    GUNS: [{
        POSITION: [9, 16, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [16, 13, 1.5, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.catapult]),
            TYPE: exports.catapultMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }]
};
exports.trebutchet = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.075 * base.FOV
    },
    LABEL: "Trebuchet",
    DANGER: 8,
    GUNS: [{
        POSITION: [9, 20, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [16, 17, 1.5, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.catapult]),
            TYPE: exports.trebutchetMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }]
};
exports.twistepult = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.075 * base.FOV
    },
    LABEL: "Twistepult",
    DANGER: 8,
    GUNS: [{
        POSITION: [10.25, 16, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [5, 13, 1.5, 12.5, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.catapult]),
            TYPE: exports.twistepultMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [12.5, 20, 0.75, 0, 0, 0, 0]
    }]
};
exports.onager = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.075 * base.FOV
    },
    LABEL: "Onager",
    DANGER: 8,
    GUNS: [{
        POSITION: [10.5, 16, -.5, 9, 0, 0, 0],
        PROPERTIES: {
            SKIN: 2
        }
    }, {
        POSITION: [16, 13, 1.5, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.catapult]),
            TYPE: exports.onagerMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }]
};
exports.AIM9 = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.075 * base.FOV
    },
    LABEL: "AIM-9",
    DANGER: 8,
    GUNS: [{
        POSITION: [21, 20, 0.75, 0, 0, 0, 0]
    }, {
        POSITION: [9, 16, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [16, 13, 1.5, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.catapult]),
            TYPE: exports.AIM9Missile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }]
};
exports.mangonel = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.075 * base.FOV
    },
    LABEL: "Mangonel",
    DANGER: 8,
    GUNS: [{
        POSITION: [9, 14, -.5, 11, 0, 0, 0]
    }, {
        POSITION: [9, 16, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [16, 13, 1.5, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.catapult]),
            TYPE: exports.mangonelMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }]
};
exports.curator = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.075 * base.FOV
    },
    LABEL: "Curator",
    DANGER: 8,
    GUNS: [{
        POSITION: [9, 16, .5, 9, 0, 0, 0]
    }, {
        POSITION: [16, 13, 1.5, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.catapult]),
            TYPE: exports.curatorMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }]
};
exports.inventory = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.075 * base.FOV
    },
    LABEL: "Inventory",
    DANGER: 8,
    GUNS: [{
        POSITION: [3, 17, 1.5, 13, 0, 0, 0]
    }, {
        POSITION: [9, 16, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [16, 13, 1.5, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.catapult]),
            TYPE: exports.inventoryMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }]
};
exports.shrapnel = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.075 * base.FOV
    },
    LABEL: "Shrapnel",
    DANGER: 7,
    GUNS: [{
        POSITION: [10, 9, -.5, 9, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.shrapnel, g.fake]),
            TYPE: exports.bullet,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [17, 10, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.shrapnel]),
            TYPE: exports.nuke,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [5.5, 10, -1.3, 6.5, 0, 0, 0]
    }]
};
exports.crockett = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.075 * base.FOV
    },
    LABEL: "Crockett",
    DANGER: 8,
    GUNS: [{
        POSITION: [10, 6.5, -.5, 10.5, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.shrapnel, g.fake]),
            TYPE: exports.bullet,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [10, 9, -.5, 9, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.shrapnel, g.fake]),
            TYPE: exports.bullet,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [17, 10, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.shrapnel]),
            TYPE: exports.crockettNuke,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [5.5, 10, -1.3, 6.5, 0, 0, 0]
    }]
};
exports.rpg = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.075 * base.FOV
    },
    LABEL: "RPG",
    DANGER: 8,
    GUNS: [{
        POSITION: [20, 10, 0.75, 0, 0, 0, 0]
    }, {
        POSITION: [7.5, 7.5, 1, 18.5, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.shrapnel]),
            TYPE: exports.rpgRocket,
            STAT_CALCULATOR: gunCalcNames.sustained,
            COLOR: 9,
            SKIN: 3
        }
    }]
};
exports.trapguard = {
    PARENT: [exports.genericTank],
    LABEL: "Trap Guard",
    STAT_NAMES: statnames.generic,
    DANGER: 6,
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.guard]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [13, 8, 1, 0, 0, 180, 0]
    }, {
        POSITION: [4.5, 8, 1.7, 13, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.guardtrap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }]
};
exports.tripleshot = {
    PARENT: [exports.genericTank],
    LABEL: "Triple Shot",
    DANGER: 6,
    GUNS: [{
        POSITION: [19, 8, 1, 0, -2, -20, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 8, 1, 0, 2, 20, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [22, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent]),
            TYPE: exports.bullet
        }
    }]
};
exports.flank = {
    PARENT: [exports.genericTank],
    LABEL: "Flank",
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 120, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 240, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank]),
            TYPE: exports.bullet
        }
    }]
};
exports.hexa = {
    PARENT: [exports.genericTank],
    LABEL: "Hexa",
    DANGER: 6,
    BODY: {
        ACCELERATION: base.ACCEL * .95
    },
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.hexa]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 120, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.hexa]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 240, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.hexa]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 60, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.hexa]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 180, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.hexa]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 300, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.hexa]),
            TYPE: exports.bullet
        }
    }]
};
exports.octo = {
    PARENT: [exports.genericTank],
    LABEL: "Octo",
    DANGER: 7,
    BODY: {
        ACCELERATION: base.ACCEL * .8
    },
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.hexa, g.octo]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 45, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.hexa, g.octo]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.hexa, g.octo]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 135, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.hexa, g.octo]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.hexa, g.octo]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 225, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.hexa, g.octo]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 270, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.hexa, g.octo]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 315, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.hexa, g.octo]),
            TYPE: exports.bullet
        }
    }]
};
exports.arthropoda = {
    PARENT: [exports.genericTank],
    LABEL: "Arthropoda",
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 3, 1, 0, 0, 90, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda]),
            TYPE: exports.bullet,
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 65, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda]),
            TYPE: exports.bullet,
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 115, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda]),
            TYPE: exports.bullet,
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 270, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda]),
            TYPE: exports.bullet,
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 295, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda]),
            TYPE: exports.bullet,
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 245, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda]),
            TYPE: exports.bullet,
        },
    }]
};
exports.myriapoda = {
    PARENT: [exports.genericTank],
    LABEL: "Myriapoda",
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 3, 1, 0, 0, 90, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet,
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 65, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet,
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 115, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet,
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 35, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet,
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 145, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet,
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 270, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet,
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 295, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet,
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 245, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet,
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 320, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet,
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 220, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet,
        },
    }]
};
exports.lightning = {
    PARENT: [exports.genericTank],
    LABEL: 'Lightning',
    STAT_NAMES: statnames.drone,
    DANGER: 6,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    MAX_CHILDREN: 6,
    GUNS: [{
        POSITION: [6, 10, 1.2, 12, 0, 0, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.lightning]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone
        }
    }, {
        POSITION: [6, 10, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.lightning]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone
        }
    }]
};
exports.thunder = {
    PARENT: [exports.genericTank],
    LABEL: 'Thunder',
    STAT_NAMES: statnames.drone,
    DANGER: 6,
    BODY: {
        FOV: base.FOV * 1.15,
    },
    MAX_CHILDREN: 7,
    GUNS: [{
        POSITION: [6, 10, 1.2, 16, 0, 0, .66],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.lightning, g.thunder]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone
        }
    }, {
        POSITION: [6, 10, 1.2, 12, 0, 0, .33],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.lightning, g.thunder]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone
        }
    }, {
        POSITION: [6, 10, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.lightning, g.thunder]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone
        }
    }]
};
exports.swarmguard = {
    PARENT: [exports.genericTank],
    LABEL: 'Swarm Guard',
    DANGER: 6,
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.guard]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [8, 8.5, 0.6, 7, 0, 180, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.swarmguard]),
            TYPE: exports.autoswarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }]
};
exports.minihive = {
    PARENT: [exports.bullet],
    LABEL: 'Mini Hive',
    BODY: {
        RANGE: 90,
        FOV: 0.5
    },
    FACING_TYPE: 'turnWithSpeed',
    INDEPENDENT: true,
    CONTROLLERS: ['alwaysFire', 'nearestDifferentMaster', 'targetSelf'],
    AI: {
        FARMER: true
    },
    GUNS: [{
        POSITION: [7, 9.5, 0.6, 7, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
            TYPE: exports.autobee,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 9.5, 0.6, 7, 0, 120, 1 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
            TYPE: exports.autobee,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 9.5, 0.6, 7, 0, 240, 2 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
            TYPE: exports.autobee,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }]
};
exports.miniswarmer = {
    PARENT: [exports.genericTank],
    DANGER: 6,
    BODY: {
        ACCELERATION: base.ACCEL * .9,
        SPEED: base.SPEED * .95,
    },
    LABEL: 'Mini Swarmer',
    GUNS: [{
        POSITION: [17, 13, -1.2, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.hive]),
            TYPE: exports.minihive
        }
    }, {
        POSITION: [14, 11, 1, 5, 0, 0, 0]
    }]
};
exports.boomerang = {
    LABEL: 'Boomerang',
    PARENT: [exports.trap],
    CONTROLLERS: ['boomerang'],
    MOTION_TYPE: 'motor',
    HITS_OWN_TYPE: 'never',
    SHAPE: -5,
    BODY: {
        SPEED: 1.25,
        RANGE: 120,
        DENSITY: 1.5
    }
};
exports.boomer = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    LABEL: 'Boomer',
    STAT_NAMES: statnames.trap,
    FACING_TYPE: 'locksFacing',
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: base.FOV * 1.15
    },
    GUNS: [{
        POSITION: [5, 10, 1, 14, 0, 0, 0]
    }, {
        POSITION: [6, 10, -1.5, 7, 0, 0, 0]
    }, {
        POSITION: [2, 10, 1.3, 18, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.boomerang]),
            TYPE: exports.boomerang
        }
    }]
};
exports.underseer = {
    PARENT: [exports.genericTank],
    LABEL: "Underseer",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        ACCELERATION: .85 * base.ACCEL,
        SPEED: .95 * base.SPEED,
        FOV: 1.1 * base.FOV
    },
    MAX_CHILDREN: 16,
    SHAPE: 4,
    GUNS: [{
        POSITION: [6, 12, 1.2, 7, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
            TYPE: exports.sunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6, 12, 1.2, 7, 0, 270, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
            TYPE: exports.sunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }]
};
exports.necromancer = {
    PARENT: [exports.genericTank],
    LABEL: "Necromancer",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        ACCELERATION: .8 * base.ACCEL,
        SPEED: .9 * base.SPEED,
        FOV: 1.1 * base.FOV
    },
    MAX_CHILDREN: 16,
    SHAPE: 4,
    GUNS: [{
        POSITION: [6, 12, 1.2, 7, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
            TYPE: exports.sunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6, 12, 1.2, 7, 0, 90, 0.25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
            TYPE: exports.sunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6, 12, 1.2, 7, 0, 180, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
            TYPE: exports.sunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6, 12, 1.2, 7, 0, 270, 0.75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
            TYPE: exports.sunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }]
};
exports.eggmancer = {
    PARENT: [exports.genericTank],
    LABEL: "Eggmancer",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        ACCELERATION: .85 * base.ACCEL,
        SPEED: .95 * base.SPEED,
        FOV: 1.1 * base.FOV
    },
    MAX_CHILDREN: 16,
    GUNS: [{
        POSITION: [6, 12, 1.2, 7, 0, 45, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, g.eggmancer]),
            TYPE: exports.eggchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6, 12, 1.2, 7, 0, -45, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, g.eggmancer]),
            TYPE: exports.eggchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }]
};
exports.trimancer = {
    PARENT: [exports.genericTank],
    LABEL: "Trimancer",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        ACCELERATION: .75 * base.ACCEL,
        SPEED: .85 * base.SPEED,
        FOV: 1.1 * base.FOV
    },
    MAX_CHILDREN: 15,
    FACING_TYPE: "autospin",
    SHAPE: 3,
    GUNS: [{
        POSITION: [6, 13, 1.2, 7, 0, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, g.trimancer]),
            TYPE: exports.dorito,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6, 13, 1.2, 7, 0, 180, 0.334],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, g.trimancer]),
            TYPE: exports.dorito,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6, 13, 1.2, 7, 0, 300, 0.667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, g.trimancer]),
            TYPE: exports.dorito,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }]
};
exports.infestor = {
    PARENT: [exports.genericTank],
    LABEL: "Infestor",
    DANGER: 5,
    GUNS: [{
        POSITION: [18, 8, .8, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet]),
            TYPE: exports.necroBullet
        }
    }, {
        POSITION: [6, 8, 1.3, 6.5, 0, 0, 0]
    }]
};
exports.impostor = {
    PARENT: [exports.genericTank],
    LABEL: "Impostor",
    DANGER: 6,
    GUNS: [{
        POSITION: [20, 8, .8, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet]),
            TYPE: [exports.necroBullet, {
                NECRO_BULLETS: true
            }]
        }
    }, {
        POSITION: [6, 8, 1.3, 9.5, 0, 0, 0]
    }, {
        POSITION: [6, 8, 1.3, 6.5, 0, 0, 0]
    }]
};
exports.spawner = {
    PARENT: [exports.genericTank],
    LABEL: 'Spawner',
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        ACCELERATION: base.ACCEL * 0.75,
        FOV: 1.1
    },
    GUNS: [{
        POSITION: [4.5, 10, 1, 10.5, 0, 0, 0]
    }, {
        POSITION: [1, 12, 1, 15, 0, 0, 0],
        PROPERTIES: {
            MAX_CHILDREN: 5,
            SHOOT_SETTINGS: combineStats([g.spawner]),
            TYPE: exports.minion,
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true
        }
    }, {
        POSITION: [3.5, 12, 1, 8, 0, 0, 0]
    }]
};
exports.factory = {
    PARENT: [exports.genericTank],
    LABEL: 'Factory',
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * .9,
        ACCELERATION: base.ACCEL * 0.65,
        FOV: 1.1
    },
    MAX_CHILDREN: 6,
    GUNS: [{
        POSITION: [5, 11, 1, 10.5, 0, 0, 0]
    }, {
        POSITION: [2, 14, 1, 15.5, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.spawner, g.factory]),
            TYPE: exports.minion,
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true
        }
    }, {
        POSITION: [4, 14, 1, 8, 0, 0, 0]
    }]
};
exports.machine = {
    PARENT: [exports.genericTank],
    LABEL: "Machine Gun",
    GUNS: [{
        POSITION: [12, 10, 1.4, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach]),
            TYPE: exports.bullet
        }
    }]
};
exports.sprayer = {
    PARENT: [exports.genericTank],
    LABEL: "Sprayer",
    GUNS: [{
        POSITION: [23, 7, 1, 0, 0, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 10, 1.4, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach]),
            TYPE: exports.bullet
        }
    }]
};
exports.twinMachine = {
    PARENT: [exports.genericTank],
    LABEL: "Twin Machine",
    DANGER: 6,
    GUNS: [{
        POSITION: [18, 6, 1.5, 0, 5.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.mach, g.twinMachine]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 6, 1.5, 0, -5.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.mach, g.twinMachine]),
            TYPE: exports.bullet
        }
    }]
};
exports.doubleMachine = {
    PARENT: [exports.genericTank],
    LABEL: "Double Machine",
    DANGER: 7,
    GUNS: [{
        POSITION: [18, 6, 1.5, 0, 5.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.mach, g.twinMachine]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 6, 1.5, 0, -5.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.mach, g.twinMachine]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 6, 1.5, 0, 5.5, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.mach, g.twinMachine]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 6, 1.5, 0, -5.5, 180, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.mach, g.twinMachine]),
            TYPE: exports.bullet
        }
    }]
};
exports.bentMachine = {
    PARENT: [exports.genericTank],
    LABEL: "Bent Machine",
    DANGER: 7,
    BODY: {
        SPEED: .9 * base.SPEED
    },
    GUNS: [{
        POSITION: [17, 6, 1.5, 0, -2, -20, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.mach, g.bent, g.twinMachine]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 6, 1.5, 0, 2, 20, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.mach, g.bent, g.twinMachine]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 6, 1.5, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.mach, g.bent, g.twinMachine]),
            TYPE: exports.bullet
        }
    }]
};
exports.taurusPortal = {
    PARENT: [exports.trap],
    LABEL: "Portal",
    FACING_TYPE: "spin",
    SHAPE: 100,
    CONTROLLERS: ["taurusPortal"],
    GUNS: (() => {
        let output = [];
        for (let i = 0; i < 4; i++) output.push({
            POSITION: [1, 8, 1, 0, 0, 360 / 4 * i, Infinity],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.minion]),
                TYPE: [exports.bullet, {
                    PERSISTS_AFTER_DEATH: true
                }],
                SHOOT_ON_DEATH: true
            }
        });
        return output;
    })()
};
exports.taurus2Portal = {
    PARENT: [exports.trap],
    LABEL: "Portal",
    FACING_TYPE: "spin",
    SHAPE: 100,
    CONTROLLERS: ["taurusPortal"],
    GUNS: (() => {
        let output = [];
        for (let i = 0; i < 8; i++) output.push({
            POSITION: [1, 5, 1, 0, 0, 360 / 8 * i, Infinity],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.minion]),
                TYPE: [exports.bullet, {
                    PERSISTS_AFTER_DEATH: true
                }],
                SHOOT_ON_DEATH: true
            }
        });
        return output;
    })()
};
exports.reinforcementsPortal = {
    PARENT: [exports.trap],
    LABEL: "Portal",
    FACING_TYPE: "spin",
    SHAPE: 100,
    CONTROLLERS: ["taurusPortal"],
    GUNS: (() => {
        let output = [];
        for (let i = 0; i < 4; i++) output.push({
            POSITION: [1, 8, 1, 0, 0, 360 / 4 * i, Infinity],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.pound, g.minion]),
                TYPE: [exports.swarm, {
                    PERSISTS_AFTER_DEATH: true
                }],
                SHOOT_ON_DEATH: true
            }
        });
        return output;
    })()
};
exports.taurus = {
    PARENT: [exports.genericTank],
    LABEL: 'Taurus I',
    GUNS: [{
        POSITION: [25, 4, 1, 0, 0, 0, 0]
    }, {
        POSITION: [10, 10, 1, 22.5, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.taurus]),
            TYPE: exports.taurusPortal,
            SKIN: 3,
            COLOR: 12
        }
    }]
};
exports.taurus2 = {
    PARENT: [exports.genericTank],
    LABEL: 'Taurus II',
    GUNS: [{
        POSITION: [32.5, 4, 1, 0, 0, 0, 0]
    }, {
        POSITION: [10, 10, 1, 30, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.taurus]),
            TYPE: exports.taurus2Portal,
            SKIN: 3,
            COLOR: 12
        }
    }]
};
exports.reinforcements = {
    PARENT: [exports.genericTank],
    LABEL: 'Reinforcements',
    GUNS: [{
        POSITION: [25, 4, 2.5, 0, 0, 0, 0]
    }, {
        POSITION: [10, 10, 1, 22.5, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.taurus]),
            TYPE: exports.reinforcementsPortal,
            COLOR: 12
        }
    }]
};
exports.hitScanBullet = {
    PARENT: [exports.bullet],
    LABEL: "Lightning",
    SHAPE: 0
};
exports.hitScanExplosion = {
    PARENT: [exports.bullet],
    LABEL: "Explosion",
    SHAPE: 0,
    MOTION_TYPE: "grow"
};
exports.hitScan = {
    PARENT: [exports.genericTank],
    LABEL: 'Hitscan',
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [10, 9, -1.5, 6.5, 0, 0, 0],
        PROPERTIES: {
            COLOR: 12
        }
    }, {
        POSITION: [22, 9, 0.75, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.hitScanMain]),
            TYPE: exports.bullet,
            ON_SHOOT: "hitScan",
            SHOOT_SETTINGS2: combineStats([g.bullet, g.hitScan])
        }
    }, {
        POSITION: [18, 7, 0.75, 0, 0, 0, 0],
        PROPERTIES: {
            COLOR: 12
        }
    }, {
        POSITION: [6, 10, -1.5, 6.5, 0, 0, 0]
    }]
};
// NPCs
exports.dominationBody = {
    LABEL: "",
    CONTROLLERS: ["dontTurnDominator"],
    COLOR: 9,
    SHAPE: 6,
    INDEPENDENT: true
};
exports.dominator = {
    PARENT: [exports.genericTank],
    LABEL: "Dominator",
    DANGER: 100,
    SKILL: skillSet({
        rld: 1,
        dam: 1,
        pen: 1,
        str: 1,
        spd: 1
    }),
    LEVEL: -1,
    BODY: {
        HEALTH: 300 * base.HEALTH,
        DAMAGE: 3 * base.DAMAGE,
        FOV: 1,
        PUSHABILITY: 0,
        SHIELD: .5 * base.SHIELD,
        REGEN: base.REGEN * 2,
        DENSITY: 100
    },
    SIZE: 25,
    DISPLAY_NAME: false,
    TURRETS: [{
        POSITION: [22, 0, 0, 0, 360, 0],
        TYPE: exports.dominationBody
    }],
    CAN_BE_ON_LEADERBOARD: false,
    GIVE_KILL_MESSAGE: false,
    ACCEPTS_SCORE: false,
    HITS_OWN_TYPE: "pushOnlyTeam"
};
exports.destroyerDominator = {
    PARENT: [exports.dominator],
    GUNS: [{
        POSITION: [15.85, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.destroyerDominator]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5, 8.5, -1.6, 6.25, 0, 0, 0]
    }]
};
exports.gunnerDominator = {
    PARENT: [exports.dominator],
    GUNS: [{
        POSITION: [14.25, 3, 1, 0, -2, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.gunnerDominator]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [14.25, 3, 1, 0, 2, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.gunnerDominator]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15.85, 3, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.gunnerDominator]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5, 8.5, -1.6, 6.25, 0, 0, 0]
    }]
};
exports.trapperDominator = {
    PARENT: [exports.dominator],
    FACING_TYPE: "autospin",
    GUNS: (() => {
        let e = [];
        for (let T = 0; T < 8; T++) e.push({
            POSITION: [4, 3.75, 1, 8, 0, 45 * T, 0]
        }, {
            POSITION: [1.3, 3.75, 1.7, 12, 0, 45 * T, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
                TYPE: exports.trap
            }
        });
        return e
    })()
};
exports.baseSwarmTurret = {
    PARENT: [exports.genericTank],
    LABEL: "Protector",
    COLOR: 16,
    BODY: {
        FOV: 2
    },
    CONTROLLERS: ["nearestDifferentMaster"],
    AI: {
        NO_LEAD: true,
        LIKES_SHAPES: true
    },
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [5, 4.5, .6, 7, 2, 0, .15],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.protectorSwarm]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [5, 4.5, .6, 7, -2, 0, .15],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.protectorSwarm]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [5, 4.5, .6, 7.5, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.protectorSwarm]),
            TYPE: [exports.swarm, {
                INDEPENDENT: true,
                AI: {
                    LIKES_SHAPES: true
                }
            }],
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }]
};
exports.baseGunTurret = {
    PARENT: [exports.genericTank],
    LABEL: "Protector",
    BODY: {
        FOV: 5
    },
    ACCEPTS_SCORE: false,
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true,
    COLOR: 16,
    GUNS: [{
        POSITION: [12, 12, 1, 6, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.destroy]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [11, 13, 1, 6, 0, 0, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.destroy]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [7, 13, -1.3, 6, 0, 0, 0]
    }]
};
exports.baseProtector = {
    PARENT: [exports.genericTank],
    LABEL: "Base",
    SIZE: 64,
    DAMAGE_CLASS: 0,
    ACCEPTS_SCORE: false,
    SKILL: skillSet({
        rld: 1,
        dam: 1,
        pen: 1,
        spd: 1,
        str: 1
    }),
    BODY: {
        HEALTH: 1e4,
        DAMAGE: 10,
        PENETRATION: .25,
        SHIELD: 1e3,
        REGEN: 100,
        FOV: 1,
        PUSHABILITY: 0,
        HETERO: 0
    },
    FACING_TYPE: "autospin",
    TURRETS: [{
        POSITION: [25, 0, 0, 0, 360, 0],
        TYPE: exports.dominationBody
    }, {
        POSITION: [12, 7, 0, 45, 100, 0],
        TYPE: exports.baseSwarmTurret
    }, {
        POSITION: [12, 7, 0, 135, 100, 0],
        TYPE: exports.baseSwarmTurret
    }, {
        POSITION: [12, 7, 0, 225, 100, 0],
        TYPE: exports.baseSwarmTurret
    }, {
        POSITION: [12, 7, 0, 315, 100, 0],
        TYPE: exports.baseSwarmTurret
    }],
    GUNS: [{
        POSITION: [4.5, 11.5, -1.3, 6, 0, 45, 0]
    }, {
        POSITION: [4.5, 11.5, -1.3, 6, 0, 135, 0]
    }, {
        POSITION: [4.5, 11.5, -1.3, 6, 0, 225, 0]
    }, {
        POSITION: [4.5, 11.5, -1.3, 6, 0, 315, 0]
    }, {
        POSITION: [4.5, 8.5, -1.5, 7, 0, 45, 0]
    }, {
        POSITION: [4.5, 8.5, -1.5, 7, 0, 135, 0]
    }, {
        POSITION: [4.5, 8.5, -1.5, 7, 0, 225, 0]
    }, {
        POSITION: [4.5, 8.5, -1.5, 7, 0, 315, 0]
    }],
    HITS_OWN_TYPE: "pushOnlyTeam"
};
exports.mothership = {
    PARENT: [exports.genericTank],
    LABEL: "Mothership",
    DANGER: 100,
    SIZE: 40,
    SHAPE: 16,
    STAT_NAMES: statnames.drone,
    VALUE: 5e5,
    SKILL: skillSet({
        rld: 1,
        dam: 1,
        pen: 1,
        str: 1,
        spd: 1,
        atk: 1,
        hlt: 1,
        shi: 1,
        rgn: 1,
        mob: 1
    }),
    BODY: bossStats({
        body: 1.25,
        damage: 1.25,
        speed: .75
    }),
    GUNS: (() => {
        let e = [],
            T = [1];
        for (let e = 1; e < 8.5; e += .5) {
            let t = e / 16;
            T.push(t)
        }
        for (let t = 0; t < 16; t++) {
            let S = 22.5 * (t + 1),
                E = {
                    MAX_CHILDREN: 2,
                    SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
                    TYPE: exports.drone,
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: gunCalcNames.drone,
                    WAIT_TO_CYCLE: true
                };
            t % 2 == 0 && (E.TYPE = [exports.drone, {
                AI: {
                    skynet: true
                },
                INDEPENDENT: true,
                LAYER: 10,
                BODY: {
                    FOV: 2
                }
            }]);
            let O = {
                POSITION: [4.3, 3.1, 1.2, 8, 0, S, T[t]],
                PROPERTIES: E
            };
            e.push(O)
        }
        return e
    })()
};
exports.arenaCloserParent = {
    PARENT: [exports.genericTank],
    LABEL: "Arena Closer",
    COLOR: 3,
    SIZE: 50,
    GO_THROUGH_WALLS: true,
    GO_THROUGH_BASES: true,
    CAN_GO_OUTSIDE_ROOM: true,
    BODY: {
        HEALTH: 1e100,
        DAMAGE: 1e100,
        SHIELD: 1e100,
        REGEN: 1e100,
        SPEED: 2.5 * base.SPEED
    },
    SKILL: setBuild("9999999999"),
    LAYER: 20
};
exports.arenaCloserBullet = {
    PARENT: [exports.bullet],
    LAYER: 20
};
exports.arenaCloser = {
    PARENT: [exports.arenaCloserParent],
    GUNS: [{
        POSITION: [14, 10, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arenaCloser]),
            TYPE: exports.arenaCloserBullet
        }
    }]
};
exports.twinCloser = {
    PARENT: [exports.arenaCloserParent],
    LABEL: "Twin Closer",
    GUNS: [{
        POSITION: [16, 9, 1, 0, 5.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.arenaCloser]),
            TYPE: exports.arenaCloserBullet
        }
    }, {
        POSITION: [16, 9, 1, 0, -5.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.arenaCloser]),
            TYPE: exports.arenaCloserBullet
        }
    }]
};
exports.machineCloser = {
    PARENT: [exports.arenaCloserParent],
    LABEL: "Machine Closer",
    GUNS: [{
        POSITION: [8, 10, 1.25, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.arenaCloser]),
            TYPE: exports.arenaCloserBullet
        }
    }]
};
exports.sniperCloser = {
    PARENT: [exports.arenaCloserParent],
    LABEL: "Sniper Closer",
    GUNS: [{
        POSITION: [18, 9, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.arenaCloser]),
            TYPE: exports.arenaCloserBullet
        }
    }]
};
exports.flankCloser = {
    PARENT: [exports.arenaCloserParent],
    LABEL: "Flank Closer",
    GUNS: [{
        POSITION: [14, 10, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.arenaCloser]),
            TYPE: exports.arenaCloserBullet
        }
    }, {
        POSITION: [14, 10, 1, 0, 0, 120, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.arenaCloser]),
            TYPE: exports.arenaCloserBullet
        }
    }, {
        POSITION: [14, 10, 1, 0, 0, 240, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.arenaCloser]),
            TYPE: exports.arenaCloserBullet
        }
    }]
};
exports.directorCloser = {
    PARENT: [exports.arenaCloserParent],
    LABEL: "Director Closer",
    GUNS: [{
        POSITION: [4.5, 12, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.arenaCloser]),
            TYPE: [exports.drone, {
                LAYER: 20
            }],
            MAX_CHILDREN: 10
        }
    }]
};
exports.pounderCloser = {
    PARENT: [exports.arenaCloserParent],
    LABEL: "Pounder Closer",
    GUNS: [{
        POSITION: [15, 11.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.arenaCloser]),
            TYPE: exports.arenaCloserBullet
        }
    }]
};
exports.trapperCloser = {
    PARENT: [exports.arenaCloserParent],
    LABEL: "Trapper Closer",
    GUNS: [{
        POSITION: [12, 10, 1, 0, 0, 0, 0]
    }, {
        POSITION: [4, 10, 1.7, 12, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.arenaCloser, [1, 1, 1, 1.3, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: [exports.trap, {
                LABEL: 20
            }],
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }]
};
exports.smasherCloser = {
    PARENT: [exports.arenaCloserParent],
    LABEL: "Smasher Closer",
    BODY: {
        SPEED: 5 * base.SPEED
    },
    TURRETS: [{
        POSITION: [21.5, 0, 0, 0, 360, 0],
        TYPE: exports.smasherBody
    }]
};
exports.crasher = {
    TYPE: 'crasher',
    LABEL: 'Crasher',
    COLOR: 5,
    SHAPE: 3,
    VALUE: 50,
    SIZE: 5,
    VARIES_IN_SIZE: true,
    CONTROLLERS: ['nearestDifferentMaster', 'mapTargetToGoal'],
    AI: {
        NO_LEAD: true
    },
    BODY: crasherStats(),
    MOTION_TYPE: 'motor',
    FACING_TYPE: 'smoothWithMotion',
    HITS_OWN_TYPE: 'hard',
    HAS_NO_MASTER: true,
    DRAW_HEALTH: true,
    HEALTH_WITH_LEVEL: false,
    ACCEPTS_SCORE: false
};
exports.fragment = {
    PARENT: [exports.crasher],
    LABEL: 'Fragment',
    COLOR: 0,
    SHAPE: [
        [1, 0],
        [-0.6, -0.8],
        [-1, 0],
        [-0.6, 0.8]
    ],
    SIZE: 6,
    VALUE: 25,
    BODY: crasherStats({
        health: 0.75,
        speed: 1.5
    })
};
exports.grouper = {
    PARENT: [exports.crasher],
    LABEL: "Grouper",
    COLOR: 2,
    SIZE: 12,
    VALUE: 75,
    SHAPE: shapeConfig.grouper,
    BODY: crasherStats({
        health: 1.25,
        speed: 0.75
    })
};
exports.triBlade = {
    PARENT: [exports.crasher],
    LABEL: "Tri-Blade",
    COLOR: 2,
    SIZE: 12,
    VALUE: 100,
    FACING_TYPE: "autospin",
    SHAPE: shapeConfig.triBlade,
    BODY: crasherStats({
        health: 2,
        damage: 1.5,
        speed: 0.5
    })
};
exports.crusherShard = {
    PARENT: [exports.crasher],
    LABEL: "Shard",
    COLOR: 14,
    SIZE: 8,
    SHAPE: [
        [1, 0],
        [0.5, 0.5],
        [-1, 0],
        [0.5, -0.5]
    ],
    VALUE: 30,
    BODY: crasherStats({
        health: 1,
        damage: 2,
        speed: 2
    })
};
exports.crusher = {
    PARENT: [exports.crasher],
    LABEL: "Crusher",
    COLOR: 14,
    SIZE: 18,
    VALUE: 125,
    SHAPE: shapeConfig.crusher,
    BODY: crasherStats({
        health: 3,
        damage: 2,
        speed: 0.25
    }),
    FRAG_SPAWNS: ["crusherShard", "crusherShard", "crusherShard", "crusherShard"]
};
exports.visDestructia = {
    PARENT: [exports.crasher],
    LABEL: "Vis Destructia",
    COLOR: 12,
    SIZE: 20,
    INVISIBLE: [.08, .03],
    VALUE: 250,
    SHAPE: shapeConfig.visDestructia,
    BODY: crasherStats({
        health: 25,
        damage: 3,
        speed: 0.9
    })
};
exports.sentry = {
    PARENT: [exports.genericTank],
    TYPE: 'crasher',
    LABEL: 'Sentry',
    DANGER: 3,
    COLOR: 5,
    SHAPE: 3,
    SIZE: 10,
    SKILL: skillSet({
        rld: 0.5,
        dam: 0.8,
        pen: 0.8,
        str: 0.1,
        spd: 1,
        atk: 0.5,
        hlt: 0,
        shi: 0,
        rgn: 0.7,
        mob: 0
    }),
    VALUE: 1500,
    VARIES_IN_SIZE: true,
    CONTROLLERS: ['nearestDifferentMaster', 'mapTargetToGoal'],
    AI: {
        NO_LEAD: true
    },
    BODY: bossStats({
        health: 0.05,
        speed: 3
    }),
    MOTION_TYPE: 'motor',
    FACING_TYPE: 'smoothToTarget',
    HITS_OWN_TYPE: 'hard',
    HAS_NO_MASTER: true,
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
};
exports.trapTurret = {
    PARENT: [exports.genericTank],
    LABEL: 'Turret',
    BODY: {
        FOV: 0.5
    },
    INDEPENDENT: true,
    CONTROLLERS: ['nearestDifferentMaster'],
    COLOR: 16,
    AI: {
        SKYNET: true,
        FULL_VIEW: true
    },
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [16, 14, 1, 0, 0, 0, 0]
    }, {
        POSITION: [4, 14, 1.8, 16, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.turret]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap,
            AUTOFIRE: true
        }
    }]
};
exports.sentrySwarm = {
    PARENT: [exports.sentry],
    DANGER: 3,
    GUNS: [{
        POSITION: [7, 14, 0.6, 7, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.sentrySwarm]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }]
};
exports.sentryGun = makeAuto(exports.sentry, 'Sentry', {
    type: exports.heavyTurret,
    size: 12
});
exports.sentryTrap = makeAuto(exports.sentry, 'Sentry', {
    type: exports.trapTurret,
    size: 12
});
exports.nestDefender = {
    PARENT: [exports.genericTank],
    TYPE: 'crasher',
    LABEL: 'Nest Defender',
    DANGER: 7,
    SHAPE: 7,
    SIZE: 25,
    SKILL: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
    VALUE: 75000,
    VARIES_IN_SIZE: true,
    CONTROLLERS: ['nearestDifferentMaster', 'mapTargetToGoal'],
    BODY: bossStats({
        health: 0.2,
        speed: 2
    }),
    FACING_TYPE: 'autospin',
    GIVE_KILL_MESSAGE: true
};
exports.nestDefenderTrapTurret = {
    PARENT: [exports.turretParent],
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [16, 14, 1, 0, 0, 0, 0]
    }, {
        POSITION: [4, 14, 1.8, 16, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.nestDefenderTrapTurret]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap,
            AUTOFIRE: true
        }
    }]
}
exports.nestDefenderKriosLauncher = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [9, 12, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [16, 13, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.turret, g.turret]),
            TYPE: exports.launcherMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }]
};
exports.nestDefenderTethysClicker = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [24, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.click, g.turret, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [24, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.click, g.turret, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [24, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.click, g.turret, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [24, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.click, g.turret, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5, 8.5, -1.6, 8, 0, 0, 0, ],
    }]
};
exports.nestDefenderKriosBody = {
    PARENT: [exports.genericTank],
    LABEL: "Launcher",
    INDEPENDENT: true,
    CONTROLLERS: ["reverseSlowSpin"],
    COLOR: 14,
    SHAPE: 5,
    SKILL: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
    TURRETS: (() => {
        let output = [];
        for (let i = 0; i < 5; i ++) {
            output.push({
                POSITION: [9, 9, 0, 360 / 5 * i + 36, 90, 0],
                TYPE: exports.nestDefenderKriosLauncher
            });
        }
        return output;
    })()
};
exports.nestDefenderTethysBody = {
    PARENT: [exports.genericTank],
    LABEL: "Clicker",
    INDEPENDENT: true,
    CONTROLLERS: ["reverseSlowSpin"],
    COLOR: 1,
    SHAPE: 5,
    SKILL: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
    TURRETS: (() => {
        let output = [];
        for (let i = 0; i < 5; i ++) {
            output.push({
                POSITION: [9, 9, 0, 360 / 5 * i + 36, 90, 0],
                TYPE: exports.nestDefenderTethysClicker
            });
        }
        return output;
    })()
};
exports.nestDefenderKrios = {
    PARENT: [exports.nestDefender],
    NAME: "Krios",
    COLOR: 14,
    TURRETS: (() => {
        let output = [{
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: exports.nestDefenderKriosBody
        }];
        for (let i = 0; i < 7; i ++) {
            output.push({
                POSITION: [6, 9, 0, 360 / 7 * i + 360 / 14, 45, 0],
                TYPE: exports.nestDefenderTrapTurret
            });
        }
        return output;
    })()
};
exports.nestDefenderTethys = {
    PARENT: [exports.nestDefender],
    NAME: "Tethys",
    COLOR: 1,
    TURRETS: (() => {
        let output = [{
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: exports.nestDefenderTethysBody
        }];
        for (let i = 0; i < 7; i ++) {
            output.push({
                POSITION: [6, 9, 0, 360 / 7 * i + 360 / 14, 45, 0],
                TYPE: exports.nestDefenderTrapTurret
            });
        }
        return output;
    })()
};
exports.crasherSpawner = {
    PARENT: [exports.genericTank],
    LABEL: "Spawned",
    STAT_NAMES: statnames.drone,
    CONTROLLERS: ["nearestDifferentMaster"],
    COLOR: 5,
    INDEPENDENT: true,
    AI: {
        chase: true
    },
    MAX_CHILDREN: 4,
    GUNS: [{
        POSITION: [6, 12, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.crasherSpawner]),
            TYPE: [exports.drone, {
                LABEL: "Crasher",
                VARIES_IN_SIZE: true,
                DRAW_HEALTH: true
            }],
            SYNCS_SKILLS: true,
            AUTOFIRE: true,
            STAT_CALCULATOR: gunCalcNames.drone
        }
    }]
};
exports.miniboss = {
    PARENT: [exports.genericTank],
    TYPE: 'miniboss',
    DANGER: 10,
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 0.2,
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 0
    }),
    LEVEL: 60,
    CONTROLLERS: ['nearestDifferentMaster', 'minion', 'canRepel'],
    AI: {
        NO_LEAD: true
    },
    FACING_TYPE: 'autospin',
    HITS_OWN_TYPE: 'hardOnlyBosses',
    DEFEAT_MESSAGE: true
};
exports.serpentAutoTurret = {
    PARENT: [exports.turretParent],
	INDEPENDENT: true,
	AI: { SKYNET: true },
    GUNS: [{
        POSITION: [22, 10, 1, 0, 0, 0, 1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.turret, g.serpentTurret]),
            TYPE: exports.bullet
        }
    }]
};
exports.serpentTrail = {
    PARENT: [exports.bullet],
	LABEL: 'Trail',
	FACING_TYPE: "smoothWithMotion",
	INDEPENDENT: true,
	BODY: {
        ACCELERATION: base.ACCEL * 0.3,
        SPEED: base.SPEED * 1.5,
        HEALTH: base.HEALTH * 1.5,
        DAMAGE: base.DAMAGE * 3.5,
        FOV: base.FOV * 2,
        DENSITY: base.DENSITY * 2,
        PUSHABILITY: 0,
    },
	TURRETS: [{
        POSITION: [21.5, 0, 0, 0, 360, 0],
        TYPE: exports.serpentBody
    }],
};
exports.serpentAuto1Trail = {
    PARENT: [exports.serpentTrail],
	TURRETS: [{
        POSITION: [21.5, 0, 0, 0, 360, 0],
        TYPE: exports.serpentBody
    }, {
        POSITION: [10, 0, 0, 0, 360, 1],
        TYPE: exports.serpentAutoTurret
    }],
};
exports.serpentAuto2Trail = {
    PARENT: [exports.serpentTrail],
	TURRETS: [{
        POSITION: [21.5, 0, 0, 0, 360, 0],
        TYPE: exports.serpentBody
    }, {
        POSITION: [8, 0, 12, 0, 360, 0],
        TYPE: exports.serpentAutoTurret
    }, {
        POSITION: [8, 0, -12, 0, 360, 0],
        TYPE: exports.serpentAutoTurret
    }],
};
exports.skoll = {
    PARENT: [exports.miniboss],
	NAME: 'Sköll',
	LABEL: 'Serpent',
    TYPE: 'miniboss',
	COLOR: 3,
	SIZE: 12,
	BODY: {
        ACCELERATION: base.ACCEL * 0.2,
        SPEED: base.SPEED * 2.1,
        HEALTH: base.HEALTH * 1.5,
        DAMAGE: base.DAMAGE * 3.5,
        FOV: base.FOV * 2,
        DENSITY: base.DENSITY * 2,
        PUSHABILITY: 0,
    },
    CONTROLLERS: ['nearestDifferentMaster', 'mapTargetToGoal'],
    FACING_TYPE: 'smootherToTarget',
    DEFEAT_MESSAGE: true,
	TURRETS: [{
        POSITION: [21.5, 0, 0, 0, 360, 0],
        TYPE: exports.smasherBody
    }],
    GUNS: [{
        POSITION: [0, 0, -1.4, 0, 0, 0, 1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.aifix]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5, 14, -1.4, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.serpent]),
            TYPE: [exports.serpentAuto1Trail, exports.serpentTrail, exports.serpentTrail, exports.serpentTrail, exports.serpentAuto2Trail],
			AUTOFIRE: true,
			RANDOM_TYPE: true,
        }
    }]
};
exports.hati = {
    PARENT: [exports.miniboss],
	NAME: 'Hati',
	LABEL: 'Serpent',
    TYPE: 'miniboss',
	COLOR: 6,
	SIZE: 12,
	BODY: {
        ACCELERATION: base.ACCEL * 0.2,
        SPEED: base.SPEED * 2.1,
        HEALTH: base.HEALTH * 1.5,
        DAMAGE: base.DAMAGE * 3.5,
        FOV: base.FOV * 2,
        DENSITY: base.DENSITY * 2,
        PUSHABILITY: 0,
    },
    CONTROLLERS: ['nearestDifferentMaster', 'mapTargetToGoal'],
    FACING_TYPE: 'smootherToTarget',
    DEFEAT_MESSAGE: true,
	TURRETS: [{
        POSITION: [21.5, 0, 0, 0, 360, 0],
        TYPE: exports.smasherBody
    }],
    GUNS: [{
        POSITION: [0, 0, -1.4, 0, 0, 0, 1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.aifix]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5, 14, -1.4, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.serpent]),
            TYPE: [exports.serpentAuto1Trail, exports.serpentTrail, exports.serpentTrail, exports.serpentTrail, exports.serpentAuto2Trail],
			AUTOFIRE: true,
			RANDOM_TYPE: true,
        }
    }]
};
exports.elite = {
    PARENT: [exports.miniboss],
    LABEL: "Elite Crasher",
    COLOR: 5,
    SHAPE: 3,
    SIZE: 30,
    VARIES_IN_SIZE: true,
    VALUE: 15e4,
    BODY: bossStats()
};
exports.eliteDestroyer = {
    PARENT: [exports.elite],
    LABEL: "Elite Destroyer",
    GUNS: [{
        POSITION: [5, 16, 1, 6, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.pound, g.destroy]),
            TYPE: exports.bullet,
            LABEL: "Devastator"
        }
    }, {
        POSITION: [5, 16, 1, 6, 0, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.pound, g.destroy]),
            TYPE: exports.bullet,
            LABEL: "Devastator"
        }
    }, {
        POSITION: [5, 16, 1, 6, 0, -60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.pound, g.destroy]),
            TYPE: exports.bullet,
            LABEL: "Devastator"
        }
    }],
    TURRETS: [{
        POSITION: [11, 0, 0, 180, 360, 0],
        TYPE: [exports.crasherSpawner]
    }, {
        POSITION: [11, 0, 0, 60, 360, 0],
        TYPE: [exports.crasherSpawner]
    }, {
        POSITION: [11, 0, 0, -60, 360, 0],
        TYPE: [exports.crasherSpawner]
    }, {
        POSITION: [11, 0, 0, 0, 360, 1],
        TYPE: [exports.bigelite4gun, {
            INDEPENDENT: true,
            COLOR: 5
        }]
    }]
};
exports.eliteGunner = {
    PARENT: [exports.elite],
    LABEL: "Elite Gunner",
    FACING_TYPE: "locksFacing",
    GUNS: [{
        POSITION: [14, 16, 1, 0, 0, 180, 0]
    }, {
        POSITION: [4, 16, 1.5, 14, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.eliteGunner]),
            TYPE: [exports.pillbox, {
                INDEPENDENT: true
            }]
        }
    }, {
        POSITION: [6, 14, -2, 2, 0, 60, 0]
    }, {
        POSITION: [6, 14, -2, 2, 0, 300, 0]
    }],
    TURRETS: [{
        POSITION: [14, 8, 0, 60, 180, 0],
        TYPE: [exports.elite4gun]
    }, {
        POSITION: [14, 8, 0, 300, 180, 0],
        TYPE: [exports.elite4gun]
    }]
};
exports.sprayTurret = {
    PARENT: [exports.turretParent],
    LABEL: "Sprayer",
    GUNS: [{
        POSITION: [23, 7, 1, 0, 0, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 10, 1.4, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.turret]),
            TYPE: exports.bullet
        }
    }]
};
exports.sprayTurret2 = {
    PARENT: [exports.turretParent],
    GUNS: exports.sprayTurret.GUNS.map(e => ((e = JSON.parse(JSON.stringify(e))).PROPERTIES.SHOOT_SETTINGS.reload *= 1.75, e))
};
exports.eliteSprayer = {
    PARENT: [exports.elite],
    LABEL: "Elite Sprayer",
    TURRETS: [{
        POSITION: [14, 6, 0, 180, 190, 0],
        TYPE: [exports.sprayTurret, {
            COLOR: 5
        }]
    }, {
        POSITION: [14, 6, 0, 60, 190, 0],
        TYPE: [exports.sprayTurret, {
            COLOR: 5
        }]
    }, {
        POSITION: [14, 6, 0, -60, 190, 0],
        TYPE: [exports.sprayTurret, {
            COLOR: 5
        }]
    }]
};
exports.eliteSprayerTurret = {
    PARENT: [exports.turretParent],
    LABEL: "Machine Gun",
    COLOR: 5,
    FACING_TYPE: "autospin",
    GUNS: [{
        POSITION: [12, 10, 1.4, 8, 0, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 10, 1.4, 8, 0, -60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 10, 1.4, 8, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.turret]),
            TYPE: exports.bullet
        }
    }]
};
exports.eliteSprayer2 = {
    PARENT: [exports.elite],
    LAVEL: "Elite Sprayer",
    TURRETS: [{
        POSITION: [7, 6, -5, 60, 150, 0],
        TYPE: exports.sprayTurret2
    }, {
        POSITION: [7, 6, 5, 60, 150, 0],
        TYPE: exports.sprayTurret2
    }, {
        POSITION: [7, 6, -5, -60, 150, 0],
        TYPE: exports.sprayTurret2
    }, {
        POSITION: [7, 6, 5, -60, 150, 0],
        TYPE: exports.sprayTurret2
    }, {
        POSITION: [7, 6, -5, 180, 150, 0],
        TYPE: exports.sprayTurret2
    }, {
        POSITION: [7, 6, 5, 180, 150, 0],
        TYPE: exports.sprayTurret2
    }, {
        POSITION: [8, 0, 0, 0, 360, 1],
        TYPE: exports.eliteSprayerTurret
    }]
};
exports.eliteHunterGun = {
    PARENT: [exports.turretParent],
    LABEL: "Hunter",
    COLOR: 5,
    GUNS: [{
        POSITION: [24, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, [4, .1, .25, 1, .8, .8, .8, 1.25, 1.25, 1.25, 1, .5, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [21, 12, 1, 0, 0, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, [4, .1, .25, 1, .6, .6, .6, 1.25, 1.25, 1.25, 1, .5, 1]]),
            TYPE: exports.bullet
        }
    }]
};
exports.eliteHunterMegaTurret = {
    PARENT: [exports.turretParent],
    LABEL: "Omega Hunter",
    COLOR: 5,
    GUNS: [{
        POSITION: [18, 6, 1, 0, 5.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, [4, .1, .25, 1, .8, .8, .8, 1.25, 1.25, 1.25, 1, .5, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 8, 1, 0, 5.5, 0, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, [4, .1, .25, 1, 1, 1, 1, 1.25, 1.25, 1.25, 1, .5, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 6, 1, 0, -5.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, [4, .1, .25, 1, .8, .8, .8, 1.25, 1.25, 1.25, 1, .5, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 8, 1, 0, -5.5, 0, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, [4, .1, .25, 1, 1, 1, 1, 1.25, 1.25, 1.25, 1, .5, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [24, 4, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, [4, .1, .25, 1, 1.2, 1.2, 1.2, 1.25, 1.25, 1.25, 1, .5, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [21, 6, 1, 0, 0, 0, .125],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, [4, .1, .25, 1, 1, 1, 1, 1.25, 1.25, 1.25, 1, .5, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, [4, .1, .25, 1, .8, .8, .8, 1.25, 1.25, 1.25, 1, .5, 1]]),
            TYPE: exports.bullet
        }
    }]
};
exports.eliteHunter = {
    PARENT: [exports.elite],
    LABEL: "Elite Hunter",
    TURRETS: [{
        POSITION: [7, 6, -5, 60, 150, 0],
        TYPE: exports.eliteHunterGun
    }, {
        POSITION: [7, 6, 5, 60, 150, 0],
        TYPE: exports.eliteHunterGun
    }, {
        POSITION: [7, 6, -5, -60, 150, 0],
        TYPE: exports.eliteHunterGun
    }, {
        POSITION: [7, 6, 5, -60, 150, 0],
        TYPE: exports.eliteHunterGun
    }, {
        POSITION: [7, 6, -5, 180, 150, 0],
        TYPE: exports.eliteHunterGun
    }, {
        POSITION: [7, 6, 5, 180, 150, 0],
        TYPE: exports.eliteHunterGun
    }, {
        POSITION: [10, 0, 0, 0, 360, 1],
        TYPE: exports.eliteHunterMegaTurret
    }]
};
exports.sentryMinion = {
    PARENT: [exports.minion],
    LABEL: "Sentry",
    SHAPE: 3,
    DRAW_HEALTH: true,
    INDEPENDENT: true,
    VALUE: 12500,
    HEALTH_WITH_LEVEL: false,
    GUNS: [],
    BODY: {
        FOV: 2
    }
};
exports.sentryMinion1 = {
    PARENT: [exports.sentryMinion],
    GUNS: [{
        POSITION: [7, 14, .6, 7, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.sentrySwarm]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }]
};
exports.sentryMinion2 = makeAuto(exports.sentryMinion, 'Sentry', {
    type: exports.pounder,
    size: 12
});
exports.sentryMinion3 = makeAuto(exports.sentryMinion, 'Sentry', {
    type: exports.trapTurret,
    size: 12
});
exports.industry = {
    PARENT: [exports.elite],
    LABEL: 'Industry',
    GUNS: [{
        POSITION: [5, 14, 1, 10.5, 0, 180, 0]
    }, {
        POSITION: [2.5, 17.5, 1.01, 15.25, 0, 180, 2],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.spawner, g.factory, g.industry]),
            TYPE: exports.sentryMinion1,
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            MAX_CHILDREN: 2
        }
    }, {
        POSITION: [6, 17, 1, 6, 0, 180, 0]
    }, {
        POSITION: [5, 14, 1, 10.5, 0, 60, 0]
    }, {
        POSITION: [2.5, 17.5, 1.01, 15.25, 0, 60, 2],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.spawner, g.factory, g.industry]),
            TYPE: exports.sentryMinion2,
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            MAX_CHILDREN: 2
        }
    }, {
        POSITION: [6, 17, 1, 6, 0, 60, 0]
    }, {
        POSITION: [5, 14, 1, 10.5, 0, -60, 0]
    }, {
        POSITION: [2.5, 17.5, 1.01, 15.25, 0, -60, 2],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.spawner, g.factory, g.industry]),
            TYPE: exports.sentryMinion3,
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            MAX_CHILDREN: 2
        }
    }, {
        POSITION: [6, 17, 1, 6, 0, -60, 0]
    }]
};
exports.eliteSkimmerMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: [{
        POSITION: [14, 6, 1, 0, -2, 150, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.eliteSkimmerMissile]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [14, 6, 1, 0, 2, 210, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.eliteSkimmerMissile]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [14, 6, 1, 0, -2, 90, .5],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.eliteSkimmerMissile]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [14, 6, 1, 0, 2, 270, .5],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.eliteSkimmerMissile]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }]
};
exports.eliteSkimmerTurret = {
    PARENT: [exports.turretParent],
    COLOR: 2,
    GUNS: [{
        POSITION: [10, 14, -.5, 9, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.destroy, g.turret, g.eliteSkimmer]),
            TYPE: exports.eliteSkimmerMissile
        }
    }, {
        POSITION: [17, 15, 1, 0, 0, 0, 0]
    }]
};
exports.eliteSkimmer = {
    PARENT: [exports.elite],
    LABEL: "Elite Skimmer",
    COLOR: 2,
    TURRETS: [{
        POSITION: [15, 5, 0, 60, 170, 0],
        TYPE: exports.eliteSkimmerTurret
    }, {
        POSITION: [15, 5, 0, 180, 170, 0],
        TYPE: exports.eliteSkimmerTurret
    }, {
        POSITION: [15, 5, 0, 300, 170, 0],
        TYPE: exports.eliteSkimmerTurret
    }]
};
exports.summoner = {
    PARENT: [exports.miniboss],
    TYPE: "miniboss",
    DANGER: 8,
    SHAPE: 4,
    LABEL: "Summoner",
    COLOR: 3,
    SIZE: 25,
    MAX_CHILDREN: 28,
    FACING_TYPE: "autospin",
    VALUE: 300000,
    BODY: bossStats(),
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [3.5, 8.65, 1.2, 8, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner]),
            TYPE: exports.sunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro,
            WAIT_TO_CYCLE: true,
            COLOR_OVERRIDE: 13
        }
    }, {
        POSITION: [3.5, 8.65, 1.2, 8, 0, 270, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner]),
            TYPE: exports.sunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro,
            WAIT_TO_CYCLE: true,
            COLOR_OVERRIDE: 13
        }
    }, {
        POSITION: [3.5, 8.65, 1.2, 8, 0, 0, 0.25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner]),
            TYPE: [exports.sunchip, {
                INDEPENDENT: true,
                BODY: {
                    FOV: 2
                }
            }],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro,
            WAIT_TO_CYCLE: true,
            COLOR_OVERRIDE: 13
        }
    }, {
        POSITION: [3.5, 8.65, 1.2, 8, 0, 180, 0.75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner]),
            TYPE: [exports.sunchip, {
                INDEPENDENT: true,
                BODY: {
                    FOV: 2
                }
            }],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro,
            WAIT_TO_CYCLE: true,
            COLOR_OVERRIDE: 13
        }
    }]
};
exports.palisade = (() => {
    let e = {
        SHOOT_SETTINGS: combineStats([g.spawner, g.factory, g.pound]),
        TYPE: exports.minion,
        STAT_CALCULATOR: gunCalcNames.drone,
        AUTOFIRE: true,
        MAX_CHILDREN: 1,
        SYNCS_SKILLS: true,
        WAIT_TO_CYCLE: true
    };
    return {
        PARENT: [exports.miniboss],
        LABEL: "Rogue Palisade",
        COLOR: 17,
        SHAPE: 6,
        SIZE: 35,
        VALUE: 5e5,
        BODY: bossStats({
            health: 1.6,
            damage: 1.2,
            speed: 0.1
        }),
        GUNS: [{
            POSITION: [4, 6, -1.6, 8, 0, 0, 0],
            PROPERTIES: e
        }, {
            POSITION: [4, 6, -1.6, 8, 0, 60, 0],
            PROPERTIES: e
        }, {
            POSITION: [4, 6, -1.6, 8, 0, 120, 0],
            PROPERTIES: e
        }, {
            POSITION: [4, 6, -1.6, 8, 0, 180, 0],
            PROPERTIES: e
        }, {
            POSITION: [4, 6, -1.6, 8, 0, 240, 0],
            PROPERTIES: e
        }, {
            POSITION: [4, 6, -1.6, 8, 0, 300, 0],
            PROPERTIES: e
        }],
        TURRETS: [{
            POSITION: [5, 10, 0, 30, 110, 0],
            TYPE: exports.trapTurret
        }, {
            POSITION: [5, 10, 0, 90, 110, 0],
            TYPE: exports.trapTurret
        }, {
            POSITION: [5, 10, 0, 150, 110, 0],
            TYPE: exports.trapTurret
        }, {
            POSITION: [5, 10, 0, 210, 110, 0],
            TYPE: exports.trapTurret
        }, {
            POSITION: [5, 10, 0, 270, 110, 0],
            TYPE: exports.trapTurret
        }, {
            POSITION: [5, 10, 0, 330, 110, 0],
            TYPE: exports.trapTurret
        }]
    }
})();
exports.eggSwarm = {
    PARENT: [exports.swarm],
    LABEL: "Egg",
    SHAPE: 0
};
exports.eggBossCircleProp = {
    PARENT: [exports.genericTank],
    LABEL: "Prop",
    COLOR: 8
};
exports.eggPrinceTier1Turret = {
    PARENT: [exports.turretParent],
    COLOR: 8,
    GUNS: [{
        POSITION: [20, 6, 1.25, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.sniper, g.turret]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [18, 8, 1.25, 0, 0, 0, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.sniper, g.assassin, g.turret]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [6, 15, 0.65, 6, 0, 0, 0]
    }]
};
exports.eggPrinceTier2Turret1 = {
    PARENT: [exports.turretParent],
    COLOR: 8,
    GUNS: [{
        POSITION: [19, 7, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.assassin, g.turret, g.eggPrinceBullet]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [17, 9, 1, 0, 0, 0, 0.25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.assassin, g.turret, g.eggPrinceBullet]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 8
        }
    }]
};
exports.eggPrinceTier2Turret2 = {
    PARENT: [exports.turretParent],
    COLOR: 8,
    GUNS: [{
        POSITION: [22, 4, 1.25, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.sniper, g.turret]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [20, 6, 1.25, 0, 0, 0, 0.334],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.sniper, g.assassin, g.turret]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [18, 8, 1.25, 0, 0, 0, 0.667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.sniper, g.assassin, g.pound, g.turret]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [6, 15, 0.65, 6, 0, 0, 0]
    }]
};
exports.eggPrinceTier3Turret1 = {
    PARENT: [exports.turretParent],
    COLOR: 8,
    GUNS: [{
        POSITION: [21, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.assassin, g.turret, g.eggPrinceBullet]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [19, 7, 1, 0, 0, 0, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.assassin, g.turret, g.eggPrinceBullet]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [17, 9, 1, 0, 0, 0, 0.25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.assassin, g.turret, g.eggPrinceBullet]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 8
        }
    }]
};
exports.eggPrinceTier3Turret2 = {
    PARENT: [exports.turretParent],
    COLOR: 8,
    GUNS: [{
        POSITION: [18, 4, 1, 0, -2, -15, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minion, g.eggPrinceBullet]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [18, 4, 1, 0, 2, 15, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minion, g.eggPrinceBullet]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [22, 4, 1.25, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.sniper, g.turret]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [20, 6, 1.25, 0, 0, 0, 0.334],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.sniper, g.assassin, g.turret]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [18, 8, 1.25, 0, 0, 0, 0.667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.sniper, g.assassin, g.pound, g.turret]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [6, 15, 0.65, 6, 0, 0, 0]
    }]
};
exports.eggPrinceTier4Turret1 = {
    PARENT: [exports.turretParent],
    COLOR: 8,
    GUNS: [{
        POSITION: [18, 4, 1, 0, -1, -10, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minion, g.eggPrinceBullet, g.turret]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [18, 4, 1, 0, 1, 10, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minion, g.eggPrinceBullet, g.turret]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [21, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.assassin, g.turret, g.eggPrinceBullet]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [19, 7, 1, 0, 0, 0, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.assassin, g.turret, g.eggPrinceBullet]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [17, 9, 1, 0, 0, 0, 0.25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.assassin, g.turret, g.eggPrinceBullet]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 8
        }
    }]
};
exports.eggPrinceMissile = {
    PARENT: [exports.bullet],
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    GUNS: (() => {
        let output = [{
            POSITION: [16, 8, 1, 0, 0, 180, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail]),
                TYPE: [exports.bullet, {
                    PERSISTS_AFTER_DEATH: true
                }],
                STAT_CALCULATOR: gunCalcNames.thruster,
                COLOR_OVERRIDE: 8
            }
        }];
        for (let i = 0; i < 4; i++) output.push({
            POSITION: [1, 8, 1, 0, 0, 360 / 4 * i, Infinity],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.minion]),
                TYPE: [exports.bullet, {
                    PERSISTS_AFTER_DEATH: true
                }],
                SHOOT_ON_DEATH: true,
                COLOR_OVERRIDE: 8
            }
        });
        return output;
    })()
};
exports.eggPrinceTier4Turret2 = {
    PARENT: [exports.turretParent],
    COLOR: 8,
    GUNS: [{
        POSITION: [9, 12, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [16, 13, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.turret]),
            TYPE: exports.eggPrinceMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }]
};
exports.eggPrinceTier1 = {
    PARENT: [exports.miniboss],
    LABEL: "EP-1",
    SHAPE: 8,
    DANGER: 7,
    SIZE: 30,
    COLOR: 9,
    VALUE: 300000,
    BODY: bossStats(),
    GUNS: [{
        POSITION: [7, 5, 0.75, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.eggPrinceSwarm]),
            TYPE: exports.eggSwarm,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [7, 5, 0.75, 8, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.eggPrinceSwarm]),
            TYPE: exports.eggSwarm,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [7, 5, 0.75, 8, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.eggPrinceSwarm]),
            TYPE: exports.eggSwarm,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [7, 5, 0.75, 8, 0, 270, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.eggPrinceSwarm]),
            TYPE: exports.eggSwarm,
            COLOR_OVERRIDE: 8
        }
    }],
    TURRETS: [{
        POSITION: [7.5, 9, 0, 45, 90, 0],
        TYPE: exports.autoTurret
    }, {
        POSITION: [7.5, 9, 0, 135, 90, 0],
        TYPE: exports.autoTurret
    }, {
        POSITION: [7.5, 9, 0, 225, 90, 0],
        TYPE: exports.autoTurret
    }, {
        POSITION: [7.5, 9, 0, 315, 90, 0],
        TYPE: exports.autoTurret
    }, {
        POSITION: [16, 0, 0, 0, 0, 1],
        TYPE: exports.eggBossCircleProp
    }, {
        POSITION: [10, 0, 0, 180, 360, 1],
        TYPE: exports.eggPrinceTier1Turret
    }]
};
exports.eggPrinceTier2 = {
    PARENT: [exports.miniboss],
    LABEL: "EP-2",
    SHAPE: 8,
    DANGER: 8,
    SIZE: 50,
    COLOR: 9,
    VALUE: 600000,
    BODY: bossStats({
        health: 1.25,
        speed: 0.9
    }),
    GUNS: [{
        POSITION: [4, 5, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.eggPrinceSwarm, g.mach]),
            TYPE: exports.eggSwarm,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [4, 5, 1.2, 8, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.eggPrinceSwarm, g.mach]),
            TYPE: exports.eggSwarm,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [4, 5, 1.2, 8, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.eggPrinceSwarm, g.mach]),
            TYPE: exports.eggSwarm,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [4, 5, 1.2, 8, 0, 270, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.eggPrinceSwarm, g.mach]),
            TYPE: exports.eggSwarm,
            COLOR_OVERRIDE: 8
        }
    }],
    TURRETS: [{
        POSITION: [7.5, 9, 0, 45, 90, 0],
        TYPE: exports.eggPrinceTier2Turret1
    }, {
        POSITION: [7.5, 9, 0, 135, 90, 0],
        TYPE: exports.eggPrinceTier2Turret1
    }, {
        POSITION: [7.5, 9, 0, 225, 90, 0],
        TYPE: exports.eggPrinceTier2Turret1
    }, {
        POSITION: [7.5, 9, 0, 315, 90, 0],
        TYPE: exports.eggPrinceTier2Turret1
    }, {
        POSITION: [16, 0, 0, 0, 0, 1],
        TYPE: exports.eggBossCircleProp
    }, {
        POSITION: [10, 0, 0, 180, 360, 1],
        TYPE: exports.eggPrinceTier2Turret2
    }]
};
exports.eggPrinceTier3 = {
    PARENT: [exports.miniboss],
    LABEL: "EP-3",
    SHAPE: 16,
    DANGER: 9,
    SIZE: 70,
    COLOR: 9,
    VALUE: 900000,
    BODY: bossStats({
        health: 1.5,
        speed: 0.8
    }),
    GUNS: (() => {
        let output = [];
        for (let i = 0; i < 8; i ++) output.push({
            POSITION: [4, 4, 1, 8, 0, 360 / 8 * i + 360 / 16, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.eggPrinceSwarm, g.eggPrinceTier3Swarm]),
                TYPE: exports.eggSwarm,
                COLOR_OVERRIDE: 8,
                COLOR: 8,
                SKIN: 3
            }
        });
        return output;
    })(),
    TURRETS: (() => {
        let output = [{
            POSITION: [16, 0, 0, 0, 0, 1],
            TYPE: exports.eggBossCircleProp
        }, {
            POSITION: [10, 0, 0, 180, 360, 1],
            TYPE: exports.eggPrinceTier3Turret2
        }];
        for (let i = 0; i < 8; i ++) output.push({
            POSITION: [4.5, 9, 0, 360 / 8 * i, 90, 0],
            TYPE: exports.eggPrinceTier3Turret1
        });
        return output;
    })()
};
exports.eggPrinceTier4 = {
    PARENT: [exports.miniboss],
    LABEL: "EP-4",
    SHAPE: 16,
    DANGER: 10,
    SIZE: 90,
    COLOR: 9,
    VALUE: 1200000,
    BODY: bossStats({
        health: 1.75,
        speed: 0.7
    }),
    GUNS: (() => {
        let output = [];
        for (let i = 0; i < 8; i ++) output.push({
            POSITION: [4, 4, 1, 8, 0, 360 / 8 * i + 360 / 16, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, g.factory, g.pound]),
                TYPE: exports.minion,
                COLOR_OVERRIDE: 8,
                MAX_CHILDREN: 1,
                COLOR: 8,
                SKIN: 2
            }
        });
        return output;
    })(),
    TURRETS: (() => {
        let output = [{
            POSITION: [16, 0, 0, 0, 0, 1],
            TYPE: exports.eggBossCircleProp
        }];
        for (let i = 0; i < 5; i ++) output.push({
            POSITION: [4.5, 4, 0, 360 / 5 * i, 120, 1],
            TYPE: exports.eggPrinceTier4Turret2
        });
        for (let i = 0; i < 8; i ++) output.push({
            POSITION: [4.5, 9, 0, 360 / 8 * i, 90, 0],
            TYPE: exports.eggPrinceTier3Turret1
        });
        return output;
    })()
};
exports.bot = {
    FACING_TYPE: "looseToTarget",
    NAME: "[AI] ",
    CONTROLLERS: ["nearestDifferentMaster", "mapAltToFire", "botMovement", "fleeAtLowHealth"]
};
exports.ramBot = {
    FACING_TYPE: "looseToTarget",
    NAME: "[AI] ",
    CONTROLLERS: ["nearestDifferentMaster", "mapAltToFire", "mapTargetToGoal"]
};
exports.tagMode = {
    PARENT: [exports.bullet],
    LABEL: "Players"
};
// TIER 1
exports.basic.UPGRADES_TIER_1 = [exports.twin, exports.sniper, exports.machine, exports.pounder, exports.flank, exports.trapper, exports.director, exports.grower];
// TIER 2
exports.director.UPGRADES_TIER_2 = [exports.overseer, exports.underseer, exports.cruiser, exports.spawner, exports.lightning, exports.heatseeker];
exports.flank.UPGRADES_TIER_2 = [exports.hexa, exports.arthropoda, exports.trapguard, exports.swarmguard, exports.quadtrapper];
exports.sniper.UPGRADES_TIER_2 = [exports.assassin, exports.minigun, exports.hunter, exports.clicker, exports.lightning];
exports.pounder.UPGRADES_TIER_2 = [exports.destroyer, exports.launcher, exports.miniswarmer, exports.multishot, exports.boxer, exports.botanist];
exports.trapper.UPGRADES_TIER_2 = [exports.builder, exports.trapguard, exports.boomer, exports.quadtrapper, exports.contagion];
exports.twin.UPGRADES_TIER_2 = [exports.double, exports.tripleshot, exports.boxer, exports.hewn, exports.binary, exports.twinMachine];
exports.grower.UPGRADES_TIER_2 = [exports.botanist];
exports.machine.UPGRADES_TIER_2 = [exports.sprayer, exports.minigun, exports.twinMachine];
// WILL GET ADDED AFTER RELEASE
// TIER 3
//Tier 3s that will get released after actual release:
exports.arthropoda.UPGRADES_TIER_3 = [exports.myriapoda];
exports.hexa.UPGRADES_TIER_3 = [exports.octo];
exports.launcher.UPGRADES_TIER_3 = [exports.skimmer, exports.twister, exports.rocketeer, exports.sidewinder, exports.swamper, exports.promenader, exports.catapult, exports.shrapnel];
exports.lightning.UPGRADES_TIER_3 = [exports.thunder, exports.flycatcher];
exports.overseer.UPGRADES_TIER_3 = [exports.overlord];
exports.heatseeker.UPGRADES_TIER_3 = [exports.flycatcher, exports.presser, exports.astronaut];
exports.spawner.UPGRADES_TIER_3 = [exports.factory];
exports.destroyer.UPGRADES_TIER_3 = [exports.superstorm];
exports.underseer.UPGRADES_TIER_3 = [exports.necromancer, exports.eggmancer, exports.trimancer];
exports.botanist.UPGRADES_TIER_3 = [exports.superstorm];
exports.cruiser.UPGRADES_TIER_3 = [exports.carrier];
exports.double.UPGRADES_TIER_3 = [exports.doubleMachine];
exports.tripleshot.UPGRADES_TIER_3 = [exports.bentMachine];
exports.twinMachine.UPGRADES_TIER_3 = [exports.bentMachine, exports.doubleMachine];

// ADD TIER 3 FOR TWIN AND TRAPPER

// TIER 4s
exports.skimmer.UPGRADES_TIER_4 = [exports.hyperskimmer, exports.hovercraft, exports.pather, exports.trebutchet];
exports.twister.UPGRADES_TIER_4 = [exports.demoman, exports.tornado, exports.frontier, exports.twistepult];
exports.rocketeer.UPGRADES_TIER_4 = [exports.speedbump, exports.panzerf, exports.kiev, exports.onager];
exports.sidewinder.UPGRADES_TIER_4 = [exports.attackMissiler, exports.jupiter, exports.saturn, exports.AIM9];
exports.swamper.UPGRADES_TIER_4 = [exports.hovercraft, exports.tornado, exports.panzerf, exports.jupiter, exports.curator];
exports.promenader.UPGRADES_TIER_4 = [exports.pather, exports.frontier, exports.kiev, exports.saturn, exports.inventory];
exports.catapult.UPGRADES_TIER_4 = [exports.trebutchet, exports.twistepult, exports.onager, exports.AIM9, exports.mangonel, exports.curator, exports.inventory];
exports.shrapnel.UPGRADES_TIER_4 = [exports.crockett, exports.rpg];
// TESTBED TANKS
exports.taurus.UPGRADES_TIER_4 = [exports.hitScan, exports.taurus2, exports.reinforcements];
exports.infestor.UPGRADES_TIER_3 = [exports.impostor];
exports.testbed.UPGRADES_TIER_1 = [exports.betaTanks, exports.bosses, exports.arenaClosers, exports.dominators, exports.mothership];
exports.dominators.UPGRADES_TIER_2 = [exports.destroyerDominator, exports.gunnerDominator, exports.trapperDominator];
exports.betaTanks.UPGRADES_TIER_2 = [exports.infestor, exports.taurus];
exports.bosses.UPGRADES_TIER_2 = [exports.eliteDestroyer, exports.eliteGunner, exports.eliteSprayer, exports.eliteSprayer2, exports.eliteHunter, exports.industry, exports.eliteSkimmer, exports.summoner, exports.palisade, exports.skoll, exports.hati];
exports.arenaClosers.UPGRADES_TIER_2 = [];
let closers = ["arenaCloser", "twinCloser", "machineCloser", "sniperCloser", "flankCloser", "directorCloser", "pounderCloser", "trapperCloser", "smasherCloser"];
for (let closer of closers) {
    makeAI(closer);
    exports.arenaClosers.UPGRADES_TIER_2.push(exports[closer]);
};
