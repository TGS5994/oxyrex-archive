const combineStats = function (arr) {
    try { // Build a blank array of the appropiate length
        let data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        arr.forEach(function (component) {
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
            resist: data[12]
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
        mob: 9
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
const modifyGStat = (...data) => { // modifyGStat(index, value); modifyGStat([index, value], [index, value]);
    let output = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    if (typeof data[0] === "number") {
        output[data[0]] = data[1];
    } else {
        for (let set of data) output[set[0]] = set[1];
    }
    return output;
};
/*
 * This function basically can give you a g stat or something
 * The data can modify a certain thing, so you don't have to type it all out
 * Cope this is what I'm using for celestials
 */
const g = {
    // Reload, Recoil, Shudder, Size, Health, Damage, Penetration, Speed, MaxSpeed, Range, Density, Spray, Resist.
    blank: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    fake: [1, 0, 1, 1, 1, 1, 1, .001, .001, .001, 1, 1, 1],
    bullet: [16, 1.4, 0.1, 1, 2, 0.2, 1, 4.5, 1, 1, 1, 15, 1],
    shell: [16, 1, .1, 1, 1, .875, 1.15, 6, 1, 1.1, 1.25, 15, 1],
    explosion: [1, 0, .1, 50, 45, .125, 100, 0, 0, 1.75, 5, 1, 2],
    drone: [66, 0.25, 0.1, 0.6, 3.6, 0.4, 1, 2.5, 1, 1, 1, 0.1, 1],
    trap: [40, 1, 0.1, 0.6, 1, 0.2, 1.1, 5, 1, 1, 1, 15, 3],
    swarm: [36, 0.25, 0.05, 0.4, 1.2, 0.175, 1, 3.5, 1, 1, 1.4, 5, 1.3],
    spawner: [50, 1, 0.1, 0.7, 2, 0.2, 1, 3, 1, 1, 1, 0.1, 1],
    autoDroneTurret: [2.3, 0, 4, 1, .4, .4, 1, 1.4, 1, .6, 1, 3, 1],
    // Level 15 Stats
    twin: [1, .5, .9, 1, .85, .9, .85, 1, 1, 1, 1, 1, 1],
    minishotSmall: [.8, .15, 1.2, 1, .5, .5, 1.15, 1, 1, .875, 1, 1.2, 1],
    minishotMain: [1.3, 1.25, .75, 1, 1.2, 1.2, 1.1, .9, 1.3, 1, 1, .75, 1],
    harasserSmall: [1.1, .7, 1.2, 1, .9, .9, .9, 1, 1, .95, 1, 1.2, .9], // This is supposed to stack, see harasser, mortar and bully for examples
    pound: [2, 2.25, .75, 1, 1.52, 1.52, 1.52, .85, .7, 1, 1, 1, 2],
    sniper: [1.25, 1.1, .5, 1, 1.2, 1, 1.3, 1.2, 1.4, 1.1, 1.2, .25, 1],
    mach: [.55, 1.2, 2, .75, .8, .8, .8, .9, .85, 1, 1, 1.95, 1],
    turret: [1.75, .5, 1, 1, .9, .9, 1.4, 1.1, 1.1, 1.1, 1, 1, 1],
    ceptionTurret: [1.2, .8, 1.2, 1, .8, .8, .8, 1, 1, .9, 1, 1, 1],
    auto2: [1.75, .5, 1, 1, 1, .9, 1.4, 1.1, 1.1, 1.1, 1, 1, 1],
    grower: [1, 1, 1, .75, 1.45, .9, 1, .9, 1, 1, 2, 1, .5],
    pelleter: [.8, .4, 1.5, 1, 1.33, .425, 1.15, .9, .8, .9, 1, 1.5, 1],
    flank: [1, 1, 1, 1, 1, 1, .95, 1, .875, 1, 1, 1, 1],
    thruster: [1, 1.3, 1, 1, .5, .6, .4, 1, 1, 1, .5, 1, 1],
    weak: [1, 1, 1, 1, 1, 1, 1, 1, .95, 1, 1, 1, 1],
    // Level 30 Stats
    tri: [1, .8, 1, 1, .95, .95, 1.1, 1, 1, 1, 1, 1, 1],
    triback: [1, 1.15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    destroy: [2, 2.25, .75, 1, 1.6, 1.6, 1.2, .8, .6, 1, 1, 1, 2],
    redistributor: [16, 6, .1, .5, 5, 5, 5, 1.3, 1, 1.25, 1, .1, 2],
    overseer: [1.33, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    double: [1, .2, 1, 1, .9, .9, .9, 1, 1, 1, 1, 1, 1],
    inferno: [1.1, 1.2, .1, .75, 1.6, 1.6, 1.3, .35, .01, .8, 1, 1.15, 1],
    bent: [1, 1, 1, 1, 1, .95, 1.2, 1, 1, 1, 1, 1, 1],
    quint: [1.25, 0.5, 1, 1, 1, 1, 0.95, 1, 1, 1, 1.1, 1, 1],
    block: [1.2, 2, .1, 1.5, 2, .98, .91, 1.465, 2.65, 1.215, 1.1, 1, 1.5],
    construct: [1.3, 1, 1, 0.9, 1, 1.45, 1, 0.87, 0.95, 1, 1, 1, 1],
    assassin: [1.2, 1, 1, 1, 1, 1.05, 1.05, 1.2, 1, 1, 1.15, 1, 1],
    mini: [1, .6, .25, .8, .6, .5, 1.05, 1.25, 1, 1.25, 1, .6, 1],
    missileTrail: [.6, .25, 2, 1, 1, .9, .7, .4, 1, .5, 1, 1, 1],
    twisterMissileTrail: [1, 1, 1, 1, .8, .6, 1.2, 1, 1, .6, 1, 1, 1],
    sidewinderMissileTrail: [1, 1, 1, 1, 1, 1.2, .75, .5, .5, 1, 3, 1, 1],
    sidewinderMissileTrail2: [1.2, .8, 5, 1, .9, .9, 1.5, .8, .6, .8, 1, 3, 1],
    attackMissileTrail: [1.2, 1, 1, 1, .8, .667, .8, 1, 1, 1, 1, 1.5, 1],
    rocketeerMissileTrail: [.5, 7, 1.5, .8, .8, .7, 1, .9, .8, 1, 1, 5, 1],
    hypermissileTrail: [2, 1, 1, 1, 1.05, 1.05, 1.05, 1.1, .8, .8, 1, 1, 1],
    speedbumpMissileTrail: [4, .75, 1, 1, .5, .6, .5, 1, 1, 1, 1, .75, 1],
    panzerfMissileTrail: [1.5, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1],
    rpgRocket: [1, 1, 3, 1, .4, .6, .3, 1, 1, 1, 1, 4, 1],
    launcher: [1.5, 1.5, .1, .85, 1, .9, 1, .9, 1.2, 1.1, 1, 1, 1.5],
    guard: [1, 1.4, 1, 1, 1, .95, .9, 1, .875, 1, 1.25, 1, 1],
    guardtrap: [1, .5, 1, 1.1, 1.1, 1, 1.1, 1, 1.2, 1.2, 1.1, 1, 1.1],
    arsenal: [.8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    hexa: [1, 1, 1, 1, 1, .95, .95, 1, 1, 1, 1, 1, 1],
    lightning: [1.05, 1, 1.1, 1, .6, 1.02, 1, 1.1, 1.1, 1, 1, 1, 1],
    swarmguard: [1, 1, 1, 1, 1, 1, 1, 1, 1.25, 1.25, 1, 1, 1],
    bee: [1.25, 1, 1.2, 1, .65, .9, .9, .5, 1.15, 1, 1, 1, 1],
    hiveBees: [1.2, 1, 1, 1, .9, .9, .9, .85, 1, 1, 1, 1, 1],
    navyistt: [.25, 3, 2, .9, 1, 0, 1, .9, .85, 0.2, 1, 2.55, 1],
    navyist: [1.1, 1, 1, .95, .8, 1, 1, 1, .75, 1, 1, 1, 1],
    hive: [1.5, 1, 1.05, .834, 1.2, 1, .9, .9, .75, .9, 1, 1, 1],
    boomerang: [1.25, 2, .1, 1.5, 2, .95, .9, 1.465, 2.475, 1.215, 1.1, 1, 1.5],
    sunchip: [3, 0, 1, 1.25, 1.1, .6, 1, .45, 1, 1, 1, 1, 1.5],
    taurus: [1.25, 1, 1, 1.5, 0.25, 0, 2, .001, .001, .2, 1, 1, 1],
    taurusPortalScaling: [1, 1, 0.1, 1, .4, .6, .9, 1, 1, 0.7, 1, 2, 1],
    boxerback: [1, 1.2, 1, 1, .9, .95, .9, 1, 1, .8, 1, 1, 1],
    boxerfront: [1, 1.2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    quadtrap: [1.025, 1, 1, 1, 1, 1, 1, 1, 1, .5, 1, 1, 1],
    hunter: [1.8, 1.2, .8, .8, 1.1, 1.1, 1.1, 1, 1, 1, 1.2, 1, 1.05],
    hunter2: [1, .55, 1, 1, .9, 1.1, .8, 1, 1, 1, 1, 1, 1],
    binary: [1.2, 1.15, 1.05, 1, .8, .7, .95, 1, 1, 1, 1, 1, 1],
    binary2: [1, .55, 1, 1, .875, 1.1, .8, 1, 1, 1, 1, 1, 1],
    hewn: [.85, 0, 1, 1, 1.3, .5, 1, .8, 1, 1.2, .5, 1, 1],
    contagi: [.95, 1, 1, 1, 1.35, .65, .5, 1, 1, 1, 1.5, 1, 1],
    pathogi: [.95, 1, 1, 1, 1.35, .6, .5, 1, 1, 1, 1.5, 1, 1],
    click: [1, .25, .5, 1, .6, .8, .7, .9, .975, 1, .9, .25, 1],
    multishot: [4, 1, 1.1, 1.5, .875, .675, .72, 1.675, .7, 1, 1.2, 2, 1],
    arthropoda: [1.1, 1, 1, 1, 1.5, .3, .8, 1, 1, 1, .5, 1, 1],
    heatseeker: [1.1, 1, 1, 1, 1, 1, 1, .7, 1, 1, 1, 1, 1],
    twinmachine: [1, 1.25, 1.2, 1.35, 1, 1, 1, 1, 1, 1, 1, 1.5, 1],
    botanist: [.9, .9, 1, 1, 1, .9, 1, 1, 1, 1.1, 1, 1, 1],
    spray: [1, 1, 1, 1, .5, 1, .9, 1, 1, 1, .9, 1, 1.1],
    punt: [1.2, 1, 1, 1, .7, .4, .8, 1, 1, 1, 1, 1, 1],
    gunner: [1, 1.1, .2, 1, .9, .65, 1.2, 1, 1.1, 1.1, 1, .2, 1],
    machgunner: [.8, 1.05, 3, 1, .8, 1.2, 1.4, 1, 1, .9, 1, 75, 2],
    screwgun: [1.5, 1.5, .1, 1, 1.2, 1.1, 2, 1.5, 1.1, 1.2, 1, .1, 1],
    minion: [1.25, 1, 1, 1, .55, .55, .55, 1, 1, 1, 1, 1, 1],
    infestor: [1.03, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    naturalist: [.4, 1, 1, 1, 1, 1, 1, 1, .8, 1, 1, 1.15, 1],
    accelerator: [1, 1.3, 1, 1, 1.5, 1.5, 1.3, .4, .875, 1, 1, 2, 1],
    sidekick: [1, 1, 1, 1, 1.5, 1, 1, 1, 1, 1, 1, 1, 1],
    rifle: [.85, .85, 1, 1, .9, .9, 1.1, 1.05, 1.05, .9, 1, 1, 1],
    overbasic: [1.25, 1, 1, 1, 1.2, 1, 1, 1, 1, 1, 1, 1, 1],
    meta: [1.2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    blast: [.88, 1.2, 1.25, 1.05, .9, 1.15, 1.15, .8, .465, .65, .5, 1.5, .8],
    swivel: [.9, .8, 1, 1, .8, .8, .8, 1, 1, 1, 1, 1, 1],
    // Level 45 Stats
    anni: [1.25, 1.5, 1, 1, 1.1, 1.1, 1.1, 1, 1, .9, 1, 1, 1.05],
    eggmancer: [.4, 1, 1, .8, .8, .8, .8, 1.2, 1, 1, 1, 1, 1],
    trimancer: [1.5, 1, 1, .775, 1.25, 1.3, 1, .8, 1, 1, 1, 1, 1.1],
    factory: [1, 1, 1, 1, 1.2, .9, 1, 1.1, 1, 1, .9, 1, .8],
    hitScanMain: [3, 1.5, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    hitScan: [1, 2, 1, .75, 5, 5, 1, 1, 1, .25, 1, 1, 1],
    superlaserMain: [1.5, 1.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    superlaser: [1, 1, 1, 1, 0.5, 0.5, 0.5, 1, 1, 0.75, 1, 1, 1],
    thunder: [1.1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    overlord: [1.33, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    octo: [1, 1, 1, 1, 1, .95, .9, .95, 1, 1, 1, 1, 1],
    myriapoda: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    presser: [.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    carrier: [1.2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    skimmer: [1.1, 1.1, 1, .925, 1.1, 1.1, 1.1, .9, 1, .9, 1, 1, 1.05],
    hyperskimmer: [1.175, 1.1, 1, 1, 1.1, 1.1, 1, .9, 1, .9, 1, 1, 1],
    twister: [1.175, .8, 1, 1.15, 1.3, .8, 1, .8, .7, 1, 1.5, 1, 1],
    sidewinder: [1, 1, 2, 1.05, 1, .9, 1.25, .8, 1, 1, 1, 1, 1],
    rocketeer: [1.4, 1, .9, .9, 1.5, 1.4, 1.4, .3, 1, 1.2, 1, 1, 1.4],
    shrapnel: [3, 1, 1, 1.05, .7, 1.1, 1.1, 1, 1, .5, 1, 1, 1],
    catapult: [1.5, 1, 1, 1, .8, .6, 1, .8, 1, .675, 1, 1, 1],
    catapult2: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //for the small bullet
    catapultMissile: [1.25, .1, 1, 1, .4, .4, 1, 1, 1, .675, 1, 3, 1],
    speedbump: [1.5, 1.1, 1, 1.175, .95, 1.05, .9, 1, 1, .9, 1, 1, 1],
    flycatcher: [1.33, 1.05, .5, 1, .95, .8, 1, 1.2, 1.4, 1, 1, .25, 1],
    heatwave: [.55, 1.2, 2, .75, .8, .8, .8, .9, .85, 1, 1, 3, 1],
    pyramid: [1, .6, 1, .8, .6, .55, 1, 1, .8, 1.25, 1, .6, 1],
    feverDream: [1.6, 0, 1, 1, .3, .8, 1, .4, 1, .7, .5, 1, 1],
    backFlare: [1, 0, .001, 1, 1.2, 1, 1, 0, 1, 2.5, 4, 1, 1],
    flyswatterFlare: [.8, 0, .001, 2.2, 1.2, .2, 3, 0, 1, .7, 4, 1, 1],
    phaserFlare: [1.45, 0, .001, 1.7, 1.2, .2, 3, 0, 1, .7, 4, 1, 1],
    treachery: [1.75, 1, 1, 1.4, 2.3, 1.4, 1, 1, 2, 1, 1, 1, 1],
    treacheryFlare: [0.25, 0, .001, 1.4, 1.2, .2, 3, 0, 1, .15, 4, 1, 1],
    superstorm: [.8, .8, 1, 1, 1, .7, 1, 1, 1, 1.3, 1, 1, 1],
    arrasdrone: [1.8, 1, 1, 1.05, 1.25, 1.4, 1.5, 1, 1.4, 1, 5, 1, 1.5],
    arrasthruster: [0.9, 3, 1, 1, 1, 0.8, 1, 1, 1, 1, 1, 1, 11],
    firestarterturret: [.6, 0, 1, 1, .6, .6, 1, 1, 1.2, 1, 1, 1, 1],
    battle: [1, .5, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1],
    ranger: [1.15, 1, 1, 1, 1, 1.05, 1.05, 1.15, 1, 1, 1.1, 1, 1],
    warden: [1.30, 1, 1, 1, 1, 1.10, 1.10, 1.15, 1, 1, 1.1, 1, 1],
    dual: [1.3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.1, 1, .95],
    shotgun: [1.5, .975, 1, 1, .9, .875, .9, 1, 1, 1, 1, 2, 1.1],
    musketeer: [.55, 1, 1.2, 1, .8, 1, 1.2, .8, 1, 1, 1, 8, 1],
    stream: [1.15, 1, 1, 1, .95, .95, 1, 1, 1, 1, 1, 1, 1],
    punch: [1, 1, 1, 1, 1.2, .9, 1.1, 1, 1, 1, 2, 1, 1],
    engine: [1.1, .65, 1, 1, .8, 1.2, .8, 1, 1, 1, 1, 1, 1],
    swarmer: [1.05, 1, 1, 1, 1.2, 1, 1, 1, 1, .9, 1, 1, 1],
    nailgun: [1.2, 1, 1, 1, 1, .7, 1.5, 1.2, 1, 1.2, 2, 1, 1],
    bandolier: [2, .8, 1, 1, .667, .8, .667, 1, .9, .8, 1, 1, 1],
    surfer: [1.025, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    virus: [1, 1.1, .5, 1, 1.1, 1, 1.3, 1.2, 1.4, 1.1, 1.2, .25, 1],
    twinigun: [.95, 1, 1, 1, .9, 1, 1, 1, 1, 1, 1, 1, 1],
    steamengine: [1, 1, 1, 1, 1, .85, 1, 1, 1, 1, 1, 1, 1],
    guntrap: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1.1, 1, 1, 1],
    skimmertrail: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    tornadotrail: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    frontiertrail: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    swampertrail: [1, 1.2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    swamper: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    saturntrail: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    promenadertrail: [1.1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    predator: [1.35, 1, 1, 1, .9, .9, .9, 1, 1, 1, 1, 1, 1],
    aggressor: [1, 2 / 3, .25, 1, .85, .85, .9, 1, 1, 1, 1, .25, 1],
    penta: [1.2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    triplet: [1.1, 1, 1, .9, 1, .9, 1, 1, 1, 1, 1, 1, 1],
    tricruiser: [1.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    hewntwin: [1, .95, 1, 1, .975, 1, .9, 1, 1, 1, 1, 1, 1],
    pillbox: [3, 0, 1, 1, .5, .5, .5, 1, 1, 1, 1, 1, 1],
    trapboxT: [3, 0, 1, 1, .4, .3, .4, 1, 1, 1, 1, 1, 1],
    engineer: [1, 1, .9, 1, 1, 1, 1, 1, 1, .5, 1, 1, 1],
    cutter: [1, .9, 1, 1, 1, 1, .9, 1, 1, 1, 1, 1, 1],
    pistonfront: [.8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    pistonback: [1, 1.4, 1, 1, .9, .9, .9, 1, 1, 1, 1, 1, 1],
    pistontrap: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    railgun: [1.1, .25, 1, 1, 1.1, .95, .95, 1.2, 1.05, 1, 2, 1, 1],
    promenader: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    fighter: [1, 1, 1, 1, .95, 1, 1, 1, 1, 1, 1, 1, 1],
    fighter2: [1, .6, 1, 1, .7, .7, .7, 1, 1, 1, 1, 1, 1],
    booster: [1.15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    heptatrap: [1, .6, 1, 1, 1, 1, 1, 1, 1, .85, 1, 1, 1],
    traphive: [1.5, 1, 1, 1, 1, .95, .95, 1, .875, 1, 1, 1, 1],
    trapswarmer: [1.1, 1, 1, 1, 1.2, 1, 1, 1, 1, .9, 1, 1, 1],
    bentboomerang: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1.25, 1, 1, 1],
    imposter: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    diploid: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    scattercannon: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    entomologist: [.85, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    forestfire: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    cleanser: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.05, 1],
    coingun: [.9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    musket: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    blunderbuss: [1, .1, .5, 1, .4, .2, .4, 1, 1, 1, 1, .5, 1],
    wagner: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    triple: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    flankcruiser: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    manager: [.9, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    hybrado: [.8, 1, 1, .5, .7, 1, 1, 1, 1, 1, 1, 1, 1],
    hybradoswarm: [1, 1, 1, 1, 1, 1, 1, 1, .8, 1, 1, 1, 1],
    moderator: [1.1, 1, 1, 1, 1, .8, 1, 1, 1, 1, 1, 1, 1],
    jump: [10, 16, 0, .1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    colony: [1, 1, 1, 1, .6, .6, 1, .9, 1, 1, 1, 1, 1],
    miniMothership: [2, 1, 1, 1, .8, .8, 1, 1, 1, 1, 1, 1, 1],
    omissionTurret: [2.5, .1, 1, 1, .5, .5, .4, 1.2, .8, .9, 1, 2, 1],
    barricade: [0.475, 1, 1, 1, 0.9, 1, 0.9, 1.1, 1, 0.5, 1, 1, 1],
    taser: [0.8, 0.2, 1, 1, 1.6, 1, 1, 1, 1, 0.15, 1, 1, 1],
    master: [1, 1, 1, .8, .8, .8, 1, 1.2, 1.2, 1, 1, 1, 1],
    spread: [1.2, .5, .7, 1, .7, .6, 1, 1, 1, 1, 1, .5, 1.2],
    spreadMain: [1.2, 1.5, .7, 1, 1.2, 1.2, 1.2, 1, 1, 1, 1, .5, 1.2],
    split: [1.2, 1, 1, 1, .9, .9, .9, 1, 1, 1, 1, 1, 1],
    splitMini: [1, .1, 2, 1, .334, .334, .667, 1, 1, 1, 1, 2, 1],
    cyclone: [1, 1, 1, 1, 1.3, 1.3, 1.1, 1.5, 1.15, 1, 1, 1, 1],
    vulc: [1.25, .1, .0001, .8, .65, .25, 1, 1.3, 1, 1, 1.25, .001, 1.1],
    gust: [1.25, 1, .1, 1, 1.4, 1.4, 1.1, 1.5, 1.2, 1.1, 1, .1, 1],
    emplace: [60, 0, 0, .75, 1.2, .5, .9, 0, 0, 1.2, 1.2, 1, 1.1],
    emplaceblock: [2, 0, 1, 1, 1, .8, .9, .9, 1, .8, 1, 1, 1],
    enforce: [90, 2, .2, .75, 1.2, .5, .9, 2, 1, 1.2, .8, 16, 1.1],
    // LEVEL 60
    cartographer: [1.2, 1, 1, 1, .8, 1, 1, 1, 1, 1, 1, 1, 1],
    producer: [1.1, 1, 1, 1, 1, 1, 1, 1.2, 1.2, 1, 1, 1, 1],
    hovercraft: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    hovertrail: [1.1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    pather: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    pathertrail: [1.2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    trebutchet: [1.1, 1, 1, 1, 1.2, 1, 1, 1, 1, 1, 1, 1, 1],
    trebutchetMissile: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    trebutchet2: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    demomantrail: [1.2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    demoman: [1, 1, 1, 1, 1.05, 1, 1, 1, 1, 1, 1, 1, 1],
    haploid: [1.2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    kinematic: [.875, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    biohazard: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    battlecarrier: [1, 1, 1, 1, 1, .75, 1, 1, 1, 1, 1, 1, 1],
    viper: [2.5, 1, 1, 1, 1.8, 1, 1, .7, .5, 1, 1, 1, 1],
    vipersnake: [1.6, .85, 1, 1, .9, .9, .9, 1, 1, 1, 1, 1, 1],
    foamBullet: [4, 0, 3, 1, .45, .45, .5, .6, .6, .4, 1, 3, 1],
    foamGun: [2, 1.334, 1, .85, 1.25, 1.5, 1.2, .8, .3, 1.3, 1, 1, 2],
    bubbleGun: [.6, .6, 2, 1.15, .8, .7, 1, 1, 1.2, .8, 1, 2, 1],
    corroderExplosion: [.9, 0, .1, 1, 1.2, 1, 1, 1, 1, 1, 1, .1, 2],
    corroderBullet: [2, 0, .1, .9, 1, 1, 1, .5, 1, .6, 1, .1, 2],
    corroder: [4, 1, .1, 1, 2, 2, 2, 1.2, 1, 1.2, 1, 1, 1],
    bomb: [4, 2, 1, 1.1, 2, 1, 2, 1.2, 1.5, 1, 1, 1, 1],
    nuclearBomb: [1.75, 1, 1, 1, 1.2, 1.2, 1.2, 1, 1, 1.2, 1, 1, 1],
    sparklerBullet: [2, 2, 4, 1, .65, .65, 1, .6, 1, .45, 1, 3, 1],
    sparkler: [5, 1.5, 1, 1.2, 2.25, 1.175, 1, .8, 1, 3, 1, 1, 2],
    crackler: [1.4, 1, 1, 1, .9, .9, 1, 1, 1, .9, 1, 2, 1],
    flamethrower: [.075, 0, 2.5, .65, .575, .25, 1, 1.4, 2, .24, .3, 2.25, 1],
    course: [2.5, 0, 1, 1, .25, .25, .6, 1.4, 1.4, .25, .3, 1, .3],
    jab: [1, 1, 1, 1, 1.3, 1, 1.1, 1, 1, 1, 1.2, 1, 1],
    gondola: [1.5, 1, 1, 1.5, 1.3, 1.3, 1, .7, .7, 1, 1, 1, 1.2],
    deluge: [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    decim:  [1.5, 1.75, 1, 1, 1.2, 1.2, 1.3, .8, .8, .9, 1.2, 1, 1.15],
    // NPCs
    protectorSwarm: [3, 0, 2, 1, 2, 2, 2, 2, 1, .75, 2, 1, 1],
    destroyerDominator: [3.75, 0, 1, 1, 4, 4, .8, .5, .6, 1, 1, 1, 1],
    gunnerDominator: [.5, 0, 2.5, .4, 1, .1, 1.2, .9, .8, 1, 2, 1.5, 1],
    trapperDominator: [.9, 0, .1, 1, 1, 1, 1, .4, .6, .9, 1, 1, 1],
    droneDominator: [1, 0, 1, 1, .6, .6, 2, 1.2, 1.2, 1, 1, 2, 1],
    steamrollerDominator: [2, 0, 1, .9, .5, 1.25, 2, 2, 1, 1, 1, 1, 1],
    crockettDominator: [5, 0, .1, .8, 3, 2, 2, .6, 1.3, 1, 1, 1, 2],
    mothership: [2, 1, 1, 1, .5, .75, .75, 1, 1, 1, 2, 1, 1],
    arenaCloser: [.825, .5, 1, 1, 2, 2, 2, 1.5, 1.5, 1, 1, 1, 1],
    sentrySwarm: [1.5, 2, 1, 1, 1.5, 1.5, 1.5, 1.2, 1, 1, 1, 1, 1],
    nestDefenderTrapTurret: [5, 1, .5, 1, 2, 2, 1, .6, 1, .8, 1.2, 1, 1.5],
    crasherSpawner: [2, 1, 1, 1, .25, .25, .25, .5, 1, 1, 1, 1, 1],
    eliteGunner: [2.25, 2, 2, .8, 1.25, 1.25, 1.25, 1.1, 1.1, .8, 2, 5, 1],
    industry: [.8, 1, 1, .275, 1.75, 1, .25, .9, 1, 1, 3, 1, 1],
    summoner: [.1, 1, 1, 0.9, .325, .155, 23, 1, 0.8, 1, 20, 1, 1],
    fallenOverlord: [.1, 1, 1, .45, .2, .2, 1, 2, 1.1, 1, 1, 3, .8],
    eliteSkimmer: [1.75, 0, 1, .6, 1.75, .8, 1, .8, 1, 1.2, 1, 1, 1.5],
    eliteSkimmerMissile: [2, .9, 1, 1, 1.25, 1.25, 1.25, .5, .5, 1, 1, 1, 1],
    eggPrinceSwarm: [1.5, 1, 1, 1, .5, 2, 1, 3, 1.5, .9, 1, 1, 1],
    eggPrinceTier3Swarm: [.8, 1, 1, .6, .9, .8, 1, 1, .9, 1, 1, 1, 1],
    eggPrinceBullet: [1, 0, .1, 1, .5, .5, 1.5, 1.5, 1, .9, 1, .1, 1],
    aifix: [10000000, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    aifix2: [1, 1, 1, 1, 1, 1, 1, 1, 1000, 1, 1, 1, 1],
    serpent: [8, 0, .000001, 1.2, 1, 1, 1, .1, 0, 2, 1, 1, 1],
    jormun: [4, 0, .000001, 1.2, 1, 1, 1, .1, 0, 2, 1, 1, 1],
    serpentTurret: [3, 0, 1, 1, 1, 1, 1, 1.1, 1.8, .8, 1, 1, 1],
    // ALIENS
    start: [1.5, .5, 1.5, .9, .9, .9, .9, .5, .7 / 1, 1.1, 1.03, 1, 1.03],
    basic: [18, 1.4, .1, 1, 1, .75, 1, 4.5, 1, 1.01, 1, 15, 1],
    //  EXTRA
    norecoil: [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    threeQuartSize: modifyGStat(3, .75),
    threeQuartSlow: modifyGStat([7, .75], [8, .75]),
    oneQuartMoreReload: modifyGStat(0, 1.25),
    doubleReload: modifyGStat(0, 2),
    doubleSize: modifyGStat(3, 2),
    evenBigger: modifyGStat(3, 1.5),
    bigger: modifyGStat(3, 1.25),
    oneQuartMoreHealth: modifyGStat(4, 1.25),
    oneQuartMoreDamage: modifyGStat(5, 1.25),
    basedrone: [.5, 0, 1, .75, 10, .25, .75, 1.1, 1.1, 1, 1.5, 1, 10],
    celestialHeavyWeapon: [2, 1, 1, 1, 1.5, 1, 1, 1, 1, 1, 2, 1, 2],
    celestialTrapTurret: [5, 1, 1, 1, 1.5, .75, 1, 1, 1, .65, 1, 1, 1],
    apolloSprayer: [1.5, 1, 1, 1, 1, 1, 1, 1, .75, .9, 1, 1.5, 1.25],
    demeterSwarmer: [1.5, 1, 2, .875, 4, .4, .5, 2.25, .01, 1.25, 1, 1, 1],
    demeterSwarm: [4, 1, 1, 1, 1.5, 1.5, 1.5, 2, 1.5, 0.4, 1, 1, 2],
    athenaQuint: [2.2, .5, .2, 1, 1.1, 1.1, 1.1, 1.1, 1.1, 1, 1, .5, 2],
    athenaCrasher: [0.3, 1, 1, 1, .25, 1.6, 1.5, 1.5, 1.4, 1, 2, 1, 5],
    aresSwarm: [1.8, 1, 1, .75, .9, .875, 1, 2, 1, .8, 1, 3, 1.1],
    rheaMinion: [1.6, 1, 1, .6, 1.4, .5, .9, .7, .6, 1, 1.1, 1, 1.2],
    hivemindMinion: [1, .5, 1, 1.2 + (1 / .75), .1, .7, 3, 1 / 3, 1 / 3, 1, .8, 2, 1],
    hivemindMinionAmmo: [1.334, .8, 1.2, 1, .5, .5, .8, 1.1, 1, .9, 1, 2, 1],
    hivemindTankAmmo: [1.125, 1.05, 1.05, 1, .8, .8, .8, 1, 1, .9, 1, 1, 1]
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
    lancer: 7
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
exports.statnames = statnames;
exports.gunCalcNames = gunCalcNames;
const shapeScoreScale = c.SHAPE_SCORE_SCALE || 1;
const wepHealthFactor = 0.5;
const wepDamageFactor = 1.5;
const basePolygonDamage = 1;
const basePolygonHealth = 2;
const base = {
    ACCELERATION: 1.6,
    ACCEL: 1.6,
    SPEED: 6.5,
    HEALTH: 20,
    DAMAGE: 3,
    RESIST: 1,
    PENETRATION: 1.05,
    SHIELD: 3,
    REGEN: 0.025,
    FOV: 1,
    DENSITY: 0.9,
};
const shapeConfig = require("./definitionsHelpers/shapeConfig.js");

function shootSettingsToGStat(settings) {
    const {
        reload,
        recoil,
        shudder,
        size,
        health,
        damage,
        pen,
        speed,
        maxSpeed,
        range,
        density,
        spray,
        resist
    } = settings;
    return [reload, recoil, shudder, size, health, damage, pen, speed, maxSpeed, range, density, spray, resist];
}

// tank1 is the dominant.
function combine(tank1, tank2, keys = ["GUNS"], name = -1, options = {}) {
    const output = JSON.parse(JSON.stringify(exports.genericTank));
    if (typeof keys === "string") keys = [keys];
    if (options.GUNS == null) options.GUNS = [];
    if (options.TURRETS == null) options.TURRETS = [];
    if (options.ROTATIONS == null) options.ROTATIONS = {};
    output.GUNS = options.GUNS;
    output.TURRETS = options.TURRETS;
    keys.forEach(key => {
        if (key === "GUNS") {
            for (let i = 0; i < (tank1.GUNS || []).length; i++) {
                const gun = JSON.parse(JSON.stringify(tank1.GUNS[i]));
                if (gun.PROPERTIES && gun.PROPERTIES.TYPE) {
                    gun.PROPERTIES.TYPE = tank1.GUNS[i].PROPERTIES.TYPE;
                }
                if (options.ROTATIONS.GUNS_TANK_1) {
                    gun.POSITION[5] += options.ROTATIONS.GUNS_TANK_1;
                }
                output.GUNS.push(gun);
            }
            for (let i = 0; i < (tank2.GUNS || []).length; i++) {
                const gun = JSON.parse(JSON.stringify(tank2.GUNS[i]));
                if (gun.PROPERTIES && gun.PROPERTIES.TYPE) {
                    gun.PROPERTIES.TYPE = tank2.GUNS[i].PROPERTIES.TYPE;
                }
                if (options.ROTATIONS.GUNS_TANK_2) {
                    gun.POSITION[5] += options.ROTATIONS.GUNS_TANK_2;
                }
                output.GUNS.push(gun);
            }
        }
        if (key === "TURRETS") {
            for (let i = 0; i < (tank1.TURRETS || []).length; i++) {
                const turret = JSON.parse(JSON.stringify(tank1.TURRETS[i]));
                turret.TYPE = tank1.TURRETS[i].TYPE;
                if (options.ROTATIONS.TURRETS_TANK_1) {
                    turret.POSITION[3] += options.ROTATIONS.TURRETS_TANK_1;
                }
                output.TURRETS.push(turret);
            }
            for (let i = 0; i < (tank2.TURRETS || []).length; i++) {
                const turret = JSON.parse(JSON.stringify(tank2.TURRETS[i]));
                turret.TYPE = tank2.TURRETS[i].TYPE;
                if (options.ROTATIONS.TURRETS_TANK_2) {
                    turret.POSITION[3] += options.ROTATIONS.TURRETS_TANK_2;
                }
                output.TURRETS.push(turret);
            }
        }
    });
    output.DANGER = (tank1.DANGER || 1) + (tank2.DANGER || 1);
    output.LABEL = ((name === -1) ? [tank1.LABEL, tank2.LABEL].join(" ") : name);
    if (tank1.FACING_TYPE != null) {
        output.FACING_TYPE = tank1.FACING_TYPE;
    }
    return output;
}

function makeAuto(type, name = -1, options = {}) {
    let turret = {
        type: exports.autoTurret,
        size: 10,
        independent: true
    };
    if (options.type != null) turret.type = options.type;
    if (options.size != null) turret.size = options.size;
    if (options.independent != null) turret.independent = options.independent;

    if (options.color != null) turret.color = options.color;
    let output = JSON.parse(JSON.stringify(type));
    const autogun = {
        POSITION: [turret.size, 0, 0, 180, 360, 1],
        TYPE: [turret.type, {
            CONTROLLERS: ['nearestDifferentMaster'],
            INDEPENDENT: turret.independent,
            COLOR: turret.color
        }]
    };
    if (type.GUNS != null) output.GUNS = type.GUNS;
    output.TURRETS = [...(type.TURRETS || []), autogun];
    if (name == -1) output.LABEL = 'Auto-' + type.LABEL;
    else output.LABEL = name;
    output.DANGER = type.DANGER ? (type.DANGER + 1) : 7;
    return output;
};

const makePara = (x, yy, name = -1, options = {}) => {
    if (options.c == null) options.c = 50;
    if (options.mul == null) options.mul = 2;
    if (options.cycle == null) options.cycle = 360;
    if (options.color == null) options.color = 25;
    if (options.stat == null) options.stat = g.blank;
    let bullet = JSON.parse(JSON.stringify(exports.bullet)),
        output = JSON.parse(JSON.stringify(exports.genericTank));
    bullet.GUNS = [];
    bullet.MOTION_TYPE = 'stopOnDeath';
    for (let i = 0; i < options.cycle; i += options.cycle / options.c) {
        let ex = eval(x),
            ey = eval(yy),
            spd = Math.hypot(ex, ey) * options.mul;
        bullet.GUNS.push({
            POSITION: [0, 18, 1, 10, 0, Math.atan2(ey, ex) * (180 / Math.PI), 1e99],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [66, 1, .0000001, .25, 1, .07, 5, spd, spd, 2, 1, .0000001, 1], options.stat
                ]),
                TYPE: [exports.bullet, {
                    PERSISTS_AFTER_DEATH: true
                }],
                LABEL: gunCalcNames.thruster,
                SHOOT_ON_DEATH: true
            }
        })
    };
    output.LABEL = name === -1 ? 'Parameti���c' : name;
    output.GUNS.push({
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
                [66, 0, .1, 1, .0002, .2, 1, .000045, 2, 0, 1, 15, 1]
            ]),
            TYPE: bullet
        }
    }, {
        POSITION: [19, 3, 1, 0, 0, 0, 0],
        PROPERTIES: {
            COLOR: options.color
        }
    });
    return output;
};

function createTurret(type, stats = []) {
    const output = {
        PARENT: [exports.turretParent],
        LABEL: type.LABEL,
        GUNS: []
    };
    for (const key of [
        "TURRETS",
        "SHAPE",
        "COLOR",
        "MAX_CHILDREN"
    ]) {
        if (type[key] != null) {
            output[key] = type[key];
        }
    }
    if (type.GUNS) {
        for (let i = 0; i < type.GUNS.length; i++) {
            const gun = JSON.parse(JSON.stringify(type.GUNS[i]));
            if (type.GUNS[i].PROPERTIES && type.GUNS[i].PROPERTIES.SHOOT_SETTINGS) {
                gun.PROPERTIES.SHOOT_SETTINGS = combineStats([shootSettingsToGStat(type.GUNS[i].PROPERTIES.SHOOT_SETTINGS), g.turret, ...stats]);
                gun.PROPERTIES.TYPE = type.GUNS[i].PROPERTIES.TYPE;
            }
            output.GUNS.push(gun);
        }
    }
    return output;
}

function createMinion(type, stats = []) {
    const output = JSON.parse(JSON.stringify(type));
    output.PARENT = [exports.minion];
    if (type.TURRETS != null) {
        output.TURRETS = type.TURRETS;
    }
    if (type.GUNS != null) {
        for (let i = 0; i < type.GUNS.length; i++) {
            const gun = JSON.parse(JSON.stringify(type.GUNS[i]));
            if (gun.PROPERTIES && gun.PROPERTIES) {
                gun.PROPERTIES.SHOOT_SETTINGS = combineStats([shootSettingsToGStat(gun.PROPERTIES.SHOOT_SETTINGS), g.minion, ...stats]);
                gun.PROPERTIES.TYPE = type.GUNS[i].PROPERTIES.TYPE;
            }
            output.GUNS[i] = gun;
        }
    } else output.GUNS = [];
    return output;
}

const makeCeption = (function () {
    let index = 0;

    function createTurret(type, options) {
        exports[`ceptionTurret${index}`] = {
            PARENT: [...(Array.isArray(type.PARENT) ? type.PARENT : [type.PARENT]), exports.turretParent],
            LABEL: type.LABEL + " Turret",
            INDEPENDENT: options.independent,
            GUNS: []
        };
        for (const key of [
            "TURRETS",
            "SHAPE",
            "COLOR",
            "MAX_CHILDREN"
        ]) {
            if (type[key] != null) {
                exports[`ceptionTurret${index}`][key] = type[key];
            }
        }
        if (type.GUNS) {
            for (let i = 0; i < type.GUNS.length; i++) {
                const gun = JSON.parse(JSON.stringify(type.GUNS[i]));
                if (type.GUNS[i].PROPERTIES && type.GUNS[i].PROPERTIES.SHOOT_SETTINGS) {
                    gun.PROPERTIES.SHOOT_SETTINGS = combineStats([shootSettingsToGStat(type.GUNS[i].PROPERTIES.SHOOT_SETTINGS), g.turret, g.ceptionTurret, ...options.stats.turret]);
                    gun.PROPERTIES.TYPE = type.GUNS[i].PROPERTIES.TYPE;
                }
                exports[`ceptionTurret${index}`].GUNS.push(gun);
            }
        }
        return `ceptionTurret${index}`;
    }
    return function (type, name = -1, options = {}) {
        if (options.stats == null) {
            options.stats = {
                tank: [],
                turret: []
            };
        }
        if (options.size == null) {
            options.size = 11;
        }
        if (options.danger == null) {
            options.danger = Math.floor((type.DANGER || 7) * 1.5);
        }
        if (options.independent == null) {
            options.independent = true;
        }
        const output = JSON.parse(JSON.stringify(type));
        const turretExport = createTurret(type, options);
        if (type.GUNS != null) {
            output.GUNS = type.GUNS;
        }
        if (type.TURRETS == null) {
            output.TURRETS = [{
                POSITION: [options.size, 0, 0, 180, 360, 1],
                TYPE: exports[turretExport]
            }];
        } else {
            output.TURRETS = [...type.TURRETS, {
                POSITION: [options.size, 0, 0, 180, 360, 1],
                TYPE: exports[turretExport]
            }];
        }
        if (name == -1) {
            output.LABEL = type.LABEL + " Ception";
        } else {
            output.LABEL = name;
        }
        output.DANGER = options.danger;
        index++;
        return output;
    }
})();

// makeCeptionist by Clarise :)
const ceptionistVars = {
    ceptionistClone: 0,
    ceptionistBullet: 0,
    ceptionistProp: 0
};
const makeCeptionist = (type, name = -1, options = {}) => { // Doesn't work for tanks with auto turrets
    if (options.type == null) options.type = exports.basic2;
    if (options.tankStats == null || options.tankStats === []) options.tankStats = [g.blank];
    if (options.bulletStats == null || options.bulletStats === []) options.bulletStats = [g.blank];
    let output = JSON.parse(JSON.stringify(type));
    exports['ceptionistClone' + ceptionistVars.ceptionistClone] = JSON.parse(JSON.stringify(options.type));
    let bullet = exports['ceptionistClone' + ceptionistVars.ceptionistClone];
    bullet.TURRETS = type.TURRETS;
    if (!output.GUNS.length || !bullet.GUNS.length) throw ('The selected tank (' + type.LABEL + ') has no GUNS property to apply to.');
    else
        for (let i = 0; i < bullet.GUNS.length; i++) try {
            let gun = bullet.GUNS[i].PROPERTIES.SHOOT_SETTINGS,
                stats = [
                    [gun.reload, gun.recoil, gun.shudder, gun.size, gun.health, gun.damage, gun.pen, gun.speed, gun.maxSpeed, gun.range, gun.density, gun.spray, gun.resist],
                    [1.75, 1, 1, 1, .25, .25, .7, 1.25, 1.25, 1, 1, 1.15, 1]
                ];
            for (let component of options.bulletStats) stats.push(component);
            bullet.GUNS[i].PROPERTIES.SHOOT_SETTINGS = combineStats(stats);
            bullet.GUNS[i].POSITION[6] = .2;
            bullet.GUNS[i].PROPERTIES.AUTOFIRE = true;
            bullet.GUNS[i].PROPERTIES.COLOR = 17;
        } catch (e) { }
    // Required bullet stuff, could be reworked
    bullet.LABEL = 'Ceptionist Bullet';
    bullet.TYPE = 'bullet';
    bullet.ACCEPTS_SCORE = false;
    bullet.BODY = {
        PENETRATION: 1,
        SPEED: 3.75,
        RANGE: 90,
        DENSITY: 1.25,
        HEALTH: .165,
        DAMAGE: 6,
        PUSHABILITY: .3
    };
    bullet.FACING_TYPE = 'smoothWithMotion';
    bullet.CAN_GO_OUTSIDE_ROOM = true;
    bullet.HITS_OWN_TYPE = 'never';
    bullet.DIE_AT_RANGE = true;
    bullet.MOTION_TYPE = 'glide';
    bullet.DAMAGE_CLASS = 0;
    bullet.DRAW_HEALTH = false;
    bullet.HAS_NO_RECOIL = true;
    bullet.GIVE_KILL_MESSAGE = false;
    if (type.IS_ARENA_CLOSER) {
        bullet.DIES_TO_TEAM_BASE = false;
        bullet.GO_THRU_OBSTACLES = true;
        bullet.LAYER = 12;
    }
    exports['ceptionistBullet' + ceptionistVars.ceptionistBullet] = bullet;
    exports['ceptionistBullet' + ceptionistVars.ceptionistBullet].TURRETS = bullet.TURRETS;
    for (let i = 0; i < output.GUNS.length; i++) try {
        let gun = output.GUNS[i].PROPERTIES.SHOOT_SETTINGS,
            stats = [
                [gun.reload, gun.recoil, gun.shudder, gun.size, gun.health, gun.damage, gun.pen, gun.speed, gun.maxSpeed, gun.range, gun.density, gun.spray, gun.resist],
                [1.25, 1, 1, 1, 1, .6, 1, .8, 1, 1, 1, 1, 1]
            ];
        for (let component of options.tankStats) stats.push(component);
        output.GUNS[i].PROPERTIES.SHOOT_SETTINGS = combineStats(stats);
        output.GUNS[i].PROPERTIES.TYPE = exports['ceptionistBullet' + ceptionistVars.ceptionistBullet];
    } catch (e) { }
    ceptionistVars.ceptionistBullet++;
    exports['ceptionistProp' + ceptionistVars.ceptionistProp] = JSON.parse(JSON.stringify(options.type));
    let prop = exports['ceptionistProp' + ceptionistVars.ceptionistProp];
    prop.DANGER = 0;
    for (let i = 0; i < prop.GUNS.length; i++) try {
        prop.GUNS[i].PROPERTIES = {
            COLOR: 17
        };
    } catch (e) { }
    let turret = {
        POSITION: [9, 0, 0, 0, 0, 1],
        TYPE: [prop, {
            COLOR: 17
        }]
    };
    if (type.DANGER != null) output.DANGER = type.DANGER < 7 ? type.DANGER + 1 : 7;
    output.TURRETS = type.TURRETS == null ? [turret] : [...type.TURRETS, turret];
    output.LABEL = name === -1 ? output.LABEL + ' Ceptionist' : name;
    if (type.LABEL === options.type.LABEL && options.type.LABEL !== 'Basic Basic') output.LABEL += '\xB2'; // Squared Symbol
    ceptionistVars.ceptionistClone++;
    ceptionistVars.ceptionistProp++;
    return output;
}

let counters = {
    flank: 0,
    autoNClone: 0,
    autoNTurret: 0
};

function makeAutoN(type, sides = 3, name = -1, options = {}) {
    if (options.swivel == null) options.swivel = false;
    if (options.color == null) options.color = 16;
    if (options.size == null) options.size = options.swivel ? 8 * (Math.pow(Math.sqrt(.625, 4), sides - (sides === 2 ? 2 : 3))) + 1 : 10;
    if (options.stats == null || options.stats === []) options.stats = [g.blank];
    if (options.x == null) options.x = options.swivel ? 7 : 9;
    if (options.template == null) options.template = exports.genericTank;
    let output = JSON.parse(JSON.stringify(options.template));
    exports['autoNClone' + counters.autoNClone] = JSON.parse(JSON.stringify(type));
    let tank = exports['autoNClone' + counters.autoNClone];
    exports['autoNClone' + counters.autoNClone].TURRETS = type.TURRETS;
    if (type.GUNS)
        for (let i = 0; i < type.GUNS.length; i++) {
            let a = exports['autoNClone' + counters.autoNClone].GUNS[i];
            if (!options.swivel) {
                if (type === exports.basic) {
                    a.POSITION[0] += 2 + sides / 2;
                    a.POSITION[1] += 0.8 + sides / 2;
                } else {
                    a.POSITION[0] += !a.POSITION[4] == 0 || !(type === exports.pelleter && i === exports.pelleter.GUNS.length) ? 0 : 2 + sides / 10;
                    a.POSITION[1] += a.POSITION[4] == 0 ? 1.7 : 0;
                }
            }
            try {
                if (!exports['autoNClone' + counters.autoNClone].GUNS[i].PROPERTIES.SHOOT_SETTING && !exports['autoNClone' + counters.autoNClone].GUNS[i].PROPERTIES.TYPE) continue;
                if (type.GUNS[i].PROPERTIES.SKIN == 3) {
                    exports['autoNClone' + counters.autoNClone].GUNS[i].POSITION[3] += 2 + sides / 10
                }
                let gun = exports['autoNClone' + counters.autoNClone].GUNS[i].PROPERTIES.SHOOT_SETTINGS,
                    stats = [
                        [gun.reload, gun.recoil, gun.shudder, gun.size, gun.health, gun.damage, gun.pen, gun.speed, gun.maxSpeed, gun.range, gun.density, gun.spray, gun.resist],
                        g.auto2, options.swivel ? g.swivel : [1, .1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
                    ];
                if (type === exports.autoTurret) stats = [
                    [gun.reload, gun.recoil, gun.shudder, gun.size, gun.health, gun.damage, gun.pen, gun.speed, gun.maxSpeed, gun.range, gun.density, gun.spray, gun.resist]
                ];
                for (let component of options.stats) stats.push(component);
                for (let i = 0; i < sides; i++) stats.push([1.075, 1, 1, 1, .925, .925, .925, 1, 1, 1, 1, 1, 1]);
                //exports['autoNClone' + counters.autoNClone];GUNS[i].PROPERTIES = type.GUNS[i].PROPERTIES;
                exports['autoNClone' + counters.autoNClone].GUNS[i].PROPERTIES.TYPE = type.GUNS[i].PROPERTIES.TYPE;
                exports['autoNClone' + counters.autoNClone].GUNS[i].PROPERTIES.SHOOT_SETTINGS = combineStats(stats);
                counters.autoNTurret++;
            } catch (e) {
                //console.log(e);
            };
        }
    let a = 0;
    output.TURRETS = [];
    for (let i = 0; i < sides; i++) {
        output.TURRETS.push({
            POSITION: [options.size, options.swivel ? 7 : 8, 0, 360 / sides * i, options.swivel ? 360 : (360 / sides) + 100, options.swivel ? 1 : 0],
            TYPE: [exports['autoNClone' + counters.autoNClone], {
                LABEL: '',
                BODY: {
                    FOV: 2.5
                },
                CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'],
                COLOR: options.color,
                INDEPENDENT: false,
            }]
        })
    }
    if (type.DANGER != null) output.DANGER = (type.DANGER >= 7 || type.DANGER + sides - 1 >= 7) ? 7 : type.DANGER + sides - 1;
    output.LABEL = name === -1 ? output.LABEL + '-' + sides : name;
    output.FACING_TYPE = 'autospin';
    output.GUNS = [];
    output.BODY = {
        SPEED: base.SPEED * (1 - sides * 0.01)
    };
    counters.autoNClone++;
    return output;
}
const makeHivemind = (function () { // Rewriting this so it's nicer
    let index = 0;
    const minionData = { // Data applied to the created minions
        CONTROLLERS: ["nearestDifferentMaster", "mapAltToFire", "minion", "canRepel", "hangOutNearMaster"],
        CLEAR_ON_MASTER_UPGRADE: true,
        PERSISTS_AFTER_DEATH: true,
        TYPE: "minion",
        HITS_OWN_TYPE: "hardWithBuffer",
        GIVE_KILL_MESSAGE: false
    };

    function nerf(gun, stats, type) { // Apply balancing @type as integer, 1 = used on minion, 0 = used on base tank
        const output = JSON.parse(JSON.stringify(gun));
        if (gun.PROPERTIES && gun.PROPERTIES.TYPE) {
            const s = gun.PROPERTIES.SHOOT_SETTINGS || {};
            output.PROPERTIES.SHOOT_SETTINGS = combineStats([
                [s.reload, s.recoil, s.shudder, s.size, s.health, s.damage, s.pen, s.speed, s.maxSpeed, s.range, s.density, s.spray, s.resist],
                type ? g.hivemindMinionAmmo : g.hivemindTankAmmo,
                ...stats
            ]);
            output.PROPERTIES.TYPE = gun.PROPERTIES.TYPE;
        }
        return output;
    }

    function createMinion(type, stats) {
        exports[`hivemindMinionCode${index}`] = JSON.parse(JSON.stringify(type));
        if (exports[`hivemindMinionCode${index}`].GUNS) {
            for (let i = 0; i < exports[`hivemindMinionCode${index}`].GUNS.length; i++) {
                exports[`hivemindMinionCode${index}`].GUNS[i] = nerf(type.GUNS[i], stats, 1);
            }
        }
        exports[`hivemindMinionCode${index}`].TURRETS = type.TURRETS;
        for (const key in minionData) {
            exports[`hivemindMinionCode${index}`][key] = minionData[key];
        }
        return exports[`hivemindMinionCode${index}`];
    }
    return function (type, amount = 2, name = -1, options = {}) {
        if (options.minionStats == null) {
            options.minionStats = [];
        }
        if (options.size == null) {
            options.size = 1;
        }
        const output = JSON.parse(JSON.stringify(type));
        output.PARENT = type.PARENT;
        const minionExport = createMinion(type, options.minionStats);
        const base = {
            POSITION: [23, 0, 0, 0, 360, 0],
            TYPE: [exports.genericTank, {
                COLOR: 9
            }]
        };
        const spawner = {
            POSITION: [1, 10 * options.size, 1, 0, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, g.factory, g.hivemindMinion]),
                TYPE: minionExport,
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                WAIT_TO_CYCLE: false,
                MAX_CHILDREN: amount
            }
        };
        if (output.GUNS) {
            for (let i = 0; i < output.GUNS.length; i++) {
                output.GUNS[i] = nerf(type.GUNS[i], [], 0);
            }
            output.GUNS.push(spawner);
        } else {
            output.GUNS = [spawner];
        }
        if (output.TURRETS) {
            for (let i = 0; i < output.TURRETS.length; i++) {
                output.TURRETS[i].TYPE = type.TURRETS[i].TYPE;
            }
            output.TURRETS.push(base);
        } else {
            output.TURRETS = [base];
        }
        output.LABEL = (name === -1 ? type.LABEL + "mind" : name);
        output.DANGER = (type.DANGER || 6) + 1;
        index++;
        return output;
    }
})();

const makeFlank = (function () {
    function changeGunDirection(type, length, width, direction, delay) {
        let output = JSON.parse(JSON.stringify(type));
        if (type.PROPERTIES != null) {
            output.PROPERTIES.TYPE = type.PROPERTIES.TYPE;
        }
        output.POSITION[0] *= length;
        output.POSITION[1] *= width;
        output.POSITION[3] *= length;
        output.POSITION[5] = direction;
        output.POSITION[6] = delay
        return output;
    }
    return function (type, sides = 3, name = -1, options = {}) {
        if (options.reload_delay == null) {
            options.reload_delay = [];
        }
        if (options.stats == null || options.stats === []) {
            options.stats = [g.blank];
        }
        if (options.angles == null) options.angles = [];
        if (options.type == null) options.type = null;
        if (options.length == null) options.length = 1;
        if (options.width == null) options.width = 1;
        let output = JSON.parse(JSON.stringify(type));
        output.GUNS = [];
        for (let i = 0; i < sides; i++) {
            for (let j = 0; j < type.GUNS.length; j++) {
                let k = 360 / sides * i
                let l = type.GUNS[j].POSITION[6] + (options.reload_delay[i] == undefined ? 0 : options.reload_delay[i])
                if (options.angles != []) {
                    if (options.angles[i] != undefined) {
                        k = options.angles[i]
                    }
                }
                output.GUNS.push(changeGunDirection(type.GUNS[j], options.length, options.width, k, l));
            }
        }
        for (let i = 0; i < output.GUNS.length; i++) try {
            let gun = output.GUNS[i].PROPERTIES.SHOOT_SETTINGS,
                stats = [
                    [gun.reload, gun.recoil, gun.shudder, gun.size, gun.health, gun.damage, gun.pen, gun.speed, gun.maxSpeed, gun.range, gun.density, gun.spray, gun.resist], g.flank
                ];
            for (let component of options.stats) stats.push(component);
            output.GUNS[i].PROPERTIES.SHOOT_SETTINGS = combineStats(stats);
            if (options.type) {
                output.GUNS[i].PROPERTIES.TYPE = options.type;
            }
        } catch (e) { }
        output.DANGER = (type.DANGER || 7) + 1;
        output.LABEL = name === -1 ? 'Flank ' + type.LABEL : name;
        if (type.PARENT) output.PARENT = type.PARENT;
        return output;
    }
})();

function makeFallen(type, name = -1, options = {}) {
    if (options.bodyStats == null) {
        options.bodyStats = {};
    }
    if (options.universalGunStats == null) {
        options.universalGunStats = [];
    }
    if (options.specificGunStats == null) {
        options.specificGunStats = {};
        // { 0: [g.pounder, g.sniper], 3: [g.twin, g.drone] }
    }
    if (options.properties == null) {
        options.properties = {};
    }
    const output = JSON.parse(JSON.stringify(type));
    output.PARENT = [...(type.PARENT || []), exports.miniboss].filter(parent => !!parent);
    output.LABEL = (name === -1 ? `Fallen ${type.LABEL}` : name);
    output.DANGER = 9;
    output.SIZE = 30;
    output.COLOR = 18;
    output.BODY = bossStats(options.bodyStats);
    for (const key in options.properties) {
        output[key] = options.properties[key];
    }
    output.TURRETS = type.TURRETS;
    if (type.GUNS) {
        for (let i = 0; i < type.GUNS.length; i++) {
            const gun = type.GUNS[i];
            if (gun.PROPERTIES && gun.PROPERTIES.SHOOT_SETTINGS) {
                output.GUNS[i].PROPERTIES.SHOOT_SETTINGS = combineStats([shootSettingsToGStat(type.GUNS[i].PROPERTIES.SHOOT_SETTINGS), ...options.universalGunStats, ...(options.specificGunStats[i] || [])]);
                output.GUNS[i].PROPERTIES.TYPE = gun.PROPERTIES.TYPE;
            }
        }
    }
    return output;
}

function makeHybrid(type, name = -1) {
    let output = JSON.parse(JSON.stringify(type));
    let spawner = {
        POSITION: [7, 12, 1.2, 8, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.weak]),
            TYPE: exports.autodrone,
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

function makeOver(type, name = -1, options = {}) {
    let output = JSON.parse(JSON.stringify(type));
    if (options.amount == null) {
        options.amount = 3;
    } else {
        options.amount = Math.floor(options.amount / 2);
    }
    if (options.stats == null) {
        options.stats = [];
    }
    if (type.GUNS == null) {
        output.GUNS = [{
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [6, 11, 1.2, 8, 0, 125, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.meta, ...options.stats]),
                TYPE: exports.drone,
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.drone,
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: options.amount
            }
        }, {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [6, 11, 1.2, 8, 0, 235, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.meta, ...options.stats]),
                TYPE: exports.drone,
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.drone,
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: options.amount
            }
        }];
    } else {
        output.GUNS = [...type.GUNS, {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [6, 11, 1.2, 8, 0, 125, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.meta, ...options.stats]),
                TYPE: exports.drone,
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.drone,
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: options.amount
            }
        }, {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [6, 11, 1.2, 8, 0, 235, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.meta, ...options.stats]),
                TYPE: exports.drone,
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.drone,
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: options.amount
            }
        }];
    }
    if (name == -1) {
        output.LABEL = "Over-" + type.LABEL;
    } else {
        output.LABEL = name;
    }
    output.DANGER = (type.DANGER || 6) + 1;
    return output;
}

function makeSwarmSpawner(guntype, bulletType = -1, color = null) {
    return {
        PARENT: [exports.turretParent],
        AI: {
            NO_LEAD: true,
            SKYNET: true,
            FULL_VIEW: true,
        },
        GUNS: [{
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [14, 13, 0.6, 3, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: guntype,
                TYPE: bulletType === -1 ? exports.swarm : bulletType,
                STAT_CALCULATOR: gunCalcNames.swarm,
                COLOR_OVERRIDE: color
            }
        }]
    };
};

function makeLancer(name, length = 1, width = 1, damage = 1, options = {
    speed: 1,
    guns: []
}) {
    exports[`${name}Collision`] = {
        PARENT: [exports.genericTank],
        TYPE: "tank",
        LABEL: "Collision",
        DANGER: 0,
        BODY: {
            PUSHABILITY: 2.5,
            HEALTH: 1e10,
            REGEN: 1e10,
            DAMAGE: ((wepDamageFactor * wepHealthFactor) * .045) * damage,
            RESIST: base.RESIST,
            DENSITY: base.DENSITY
        },
        HITS_OWN_TYPE: 'everything',
        GIVE_KILL_MESSAGE: false,
        ACCEPTS_SCORE: false,
        LEVEL: 0,
        SCORE: 0,
        SHAPE: [
            [0.25, 0.25],
            [-0.25, 0.25],
            [-0.25, -0.25],
            [0.25, -0.25]
        ],
        DAMAGE_TURRET: true
    };
    let turrets = [];
    let amount = Math.round(8 * length);
    let gunL = 25 * length;
    for (let j = 1; j > 0.26; j -= 0.25) {
        for (let i = amount - 1, k = 0; i > -1; i--) {
            turrets.push({
                POSITION: [(.2) * width * length * 2, 5 / j + (k) + 5, -(0.9 * i) * (width), 0, 1, -1],
                TYPE: exports[`${name}Collision`]
            }, {
                POSITION: [(.2) * width * length * 2, 5 / j + (k) + 5, (0.9 * i) * (width), 0, 1, -1],
                TYPE: exports[`${name}Collision`]
            });
            k += (gunL - 5) / (amount) * j;
        };
        amount /= 1.5;
    }
    return {
        PARENT: [exports.genericTank],
        LABEL: name,
        DANGER: 7,
        STAT_NAMES: statnames.lancer,
        BODY: {
            SPEED: base.SPEED * 1.25 * options.speed,
            ACCEL: base.ACCEL * 0.95
        },
        GUNS: [{
            POSITION: [gunL, 0.275 * width, -55, 0, 0, 0, 0]
        }, ...options.guns || []],
        TURRETS: turrets,
        IS_SMASHER: true
    }
}

function makeFlail(name, length, damage = 1, size = 40, shell = exports.smasherBody, sides = 1, guns = []) {
    exports[`${name}FlailBall`] = {
        PARENT: [exports.genericTank],
        TYPE: "tank",
        LABEL: "Collision",
        DANGER: 0,
        BODY: {
            PUSHABILITY: 2.5,
            HEALTH: 1e10,
            REGEN: 1e10,
            DAMAGE: ((wepDamageFactor * wepHealthFactor) * 1.4) * damage,
            RESIST: base.RESIST,
            DENSITY: base.DENSITY
        },
        HITS_OWN_TYPE: 'everything',
        GIVE_KILL_MESSAGE: false,
        ACCEPTS_SCORE: false,
        LEVEL: 0,
        SCORE: 0,
        DAMAGE_TURRET: true,
        STAT_NAMES: statnames.smasher,
        TURRETS: [{
            POSITION: [20.5, 0, 0, 0, 360, 0],
            TYPE: shell
        }]
    };
    for (let i = 0; i < length; i++) {
        exports[`${name}ChainPart${i}`] = {
            PARENT: [exports.genericTank],
            LABEL: "",
            COLOR: 16,
            TYPE: "Flail Chain",
            GUNS: [{
                POSITION: [40, 4, 1, 0, 0, 0, 0]
            }],
            TURRETS: []
        };
        exports[`${name}ChainPart${i}`].TURRETS.push({
            POSITION: [i === 0 ? size : 20, 40, 0, 0, 1, 1],
            TYPE: (i === 0 ? exports[`${name}FlailBall`] : exports[`${name}ChainPart${i - 1}`])
        });
    };
    let tt = [];
    for (let i = 0; i < sides; i++) tt.push({
        POSITION: [5, 10, 0, (360 / sides) * i, 1, 0],
        TYPE: exports[`${name}ChainPart${length - 1}`]
    });
    return {
        PARENT: [exports.genericTank],
        LABEL: name,
        BODY: {
            SPEED: base.SPEED * .9,
        },
        TURRETS: tt,
        GUNS: guns,
        IS_SMASHER: true,
        STAT_NAMES: 8,
    };
}

function makeAka(name, segment = 5, width = 6, damage = 1, angle = 0, options = {}) {
    if (options.offset == null) {
        options.offset = 1;
    }
    if (options.offset2 == null) {
        options.offset2 = 0;
    }
    let turrets = [];
    if (exports[`${name}Collision`] == null && !options.turrets) {
        exports[`${name}Collision`] = {
            PARENT: [exports.genericTank],
            TYPE: "tank",
            LABEL: "Collision",
            DANGER: 0,
            BODY: {
                PUSHABILITY: 2.5,
                HEALTH: 1e10,
                REGEN: 1e10,
                DAMAGE: ((wepDamageFactor * wepHealthFactor) * .045) * damage,
                RESIST: base.RESIST,
                DENSITY: base.DENSITY
            },
            HITS_OWN_TYPE: 'everything',
            GIVE_KILL_MESSAGE: false,
            ACCEPTS_SCORE: false,
            LEVEL: 0,
            SCORE: 0,
            SHAPE: [
                [0.25, 0.25],
                [-0.25, 0.25],
                [-0.25, -0.25],
                [0.25, -0.25]
            ],
            DAMAGE_TURRET: true
        };
    }
    width *= 0.75;
    segment /= 0.75;
    for (let i = 0; i < Math.floor(segment - 2); i++) {
        turrets.push({
            POSITION: [width / 2, 10 + width * 0.55 * i, width * (0.825 - options.offset2), angle, 0, -1],
            TYPE: exports[`${name}Collision`]
        });
        turrets.push({
            POSITION: [width / 2, 10 + width * 0.55 * i, -width * (0.825 - options.offset2), -angle, 0, -1],
            TYPE: exports[`${name}Collision`]
        });
    };
    for (let i = 0; i < segment; i++) {
        turrets.push({
            POSITION: [width / 2, 10 + width * 0.55 * i, width * (0.325 - options.offset2), angle, 0, -1],
            TYPE: exports[`${name}Collision`]
        });
        turrets.push({
            POSITION: [width / 2, 10 + width * 0.55 * i, -width * (0.325 - options.offset2), -angle, 0, -1],
            TYPE: exports[`${name}Collision`]
        });
    };
    let guns = [];
    if (options.guns) {
        for (let o of options.guns) {
            guns.push(o)
        }
    }
    guns.push({
        POSITION: [width / 2 * segment, width, 1, 0, (width * 2 / 3) * options.offset, angle, 0],
        PROPERTIES: {
            SKIN: 9
        }
    }, {
        POSITION: [width / 2 * segment, width, 1, 0, (-width * 2 / 3) * options.offset, -angle, 0],
        PROPERTIES: {
            SKIN: 10
        }
    });
    return {
        PARENT: [exports.genericTank],
        LABEL: name,
        GUNS: guns,
        TURRETS: options.turrets == null ? turrets : []
    };
}

function createAnimationTankFrame(i, maxFrames, tank1, tank2) {
    return {
        PARENT: [exports.genericTank],
        LABEL: "...",
        DANGER: 3,
        GUNS: (function () {
            const output = [];
            for (let j = 0; j < tank1.GUNS.length; j++) {
                const gun = JSON.parse(JSON.stringify(tank1.GUNS[j]));
                if (gun.PROPERTIES) {
                    gun.PROPERTIES.SHOOT_SETTINGS = null;
                    gun.PROPERTIES.TYPE = null;
                }
                for (let h = 0; h < gun.POSITION.length - 1; h++) {
                    gun.POSITION[h] *= (maxFrames - i) / maxFrames;
                }
                output.push(gun, {
                    POSITION: [gun.POSITION[0] * .8, gun.POSITION[1] * .8, gun.POSITION[2], gun.POSITION[3], gun.POSITION[4], gun.POSITION[5], 0],
                    PROPERTIES: {
                        SKIN: (gun.PROPERTIES || {}).SKIN || 0,
                        COLOR: 150
                    }
                });
            }
            for (let j = 0; j < tank2.GUNS.length; j++) {
                const gun = JSON.parse(JSON.stringify(tank2.GUNS[j]));
                if (gun.PROPERTIES) {
                    gun.PROPERTIES.SHOOT_SETTINGS = null;
                    gun.PROPERTIES.TYPE = null;
                }
                for (let h = 0; h < gun.POSITION.length - 1; h++) {
                    gun.POSITION[h] *= i / maxFrames;
                }
                output.push(gun, {
                    POSITION: [gun.POSITION[0] * .8, gun.POSITION[1] * .8, gun.POSITION[2], gun.POSITION[3], gun.POSITION[4], gun.POSITION[5], 0],
                    PROPERTIES: {
                        SKIN: (gun.PROPERTIES || {}).SKIN || 0,
                        COLOR: 180
                    }
                });
            }
            return output;
        })()
    }
}
function createAnimationTank(exportName, name, tank1, tank2, options = {}) {
    if (options.frames == null) {
        options.frames = 30;
    }
    { // Create the first frame
        exports[`${exportName}0`] = JSON.parse(JSON.stringify(tank1));
        if (tank1.GUNS) {
            exports[`${exportName}0`].GUNS = tank1.GUNS.map(gun => [gun, {
                POSITION: [gun.POSITION[0] * .8, gun.POSITION[1] * .8, gun.POSITION[2], gun.POSITION[3], gun.POSITION[4], gun.POSITION[5], 0],
                PROPERTIES: {
                    SKIN: (gun.PROPERTIES || {}).SKIN || 0,
                    COLOR: 150
                }
            }]).flat();
        }
        exports[`${exportName}0`].GUNS = [...(exports[`${exportName}0`].GUNS || []), {
            POSITION: [1, 1, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTING: combineStats([g.bullet, g.fake, g.norecoil]),
                TYPE: exports.bullet,
                ALT_FIRE: true,
                ON_SHOOT: {
                    animation: true,
                    end: false,
                    exportName: exportName,
                    frames: options.frames
                }
            }
        }];
        if (tank1.TURRETS) {
            exports[`${exportName}0`].TURRETS = tank1.TURRETS.map(turret => turret);
        }
        exports[`${exportName}0`].DANGER = (exports[`${exportName}0`].DANGER || 7) + 1;
        exports[`${exportName}0`].LABEL = name;
    }
    for (let i = 1; i < options.frames; i++) {
        exports[`${exportName}${i}`] = createAnimationTankFrame(i, options.frames, tank1, tank2);
    }
    { // Create the final frame
        exports[`${exportName}${options.frames}`] = JSON.parse(JSON.stringify(tank2));
        if (tank2.GUNS) {
            exports[`${exportName}${options.frames}`].GUNS = tank2.GUNS.map(gun => [gun, {
                POSITION: [gun.POSITION[0] * .8, gun.POSITION[1] * .8, gun.POSITION[2], gun.POSITION[3], gun.POSITION[4], gun.POSITION[5], 0],
                PROPERTIES: {
                    SKIN: (gun.PROPERTIES || {}).SKIN || 0,
                    COLOR: 180
                }
            }]).flat();
        }
        exports[`${exportName}${options.frames}`].GUNS = [...(exports[`${exportName}${options.frames}`].GUNS || []), {
            POSITION: [1, 1, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTING: combineStats([g.bullet, g.fake, g.norecoil]),
                TYPE: exports.bullet,
                ALT_FIRE: true,
                ON_SHOOT: {
                    animation: true,
                    end: true,
                    exportName: exportName,
                    frames: options.frames
                }
            }
        }];
        if (tank2.TURRETS) {
            exports[`${exportName}${options.frames}`].TURRETS = tank2.TURRETS.map(turret => turret);
        }
        exports[`${exportName}${options.frames}`].DANGER = (exports[`${exportName}${options.frames}`].DANGER || 7) + 1;
        exports[`${exportName}${options.frames}`].LABEL = name;
    }
}

function bossStats(options = {}) {
    if (options.health == null) options.health = 1;
    if (options.damage == null) options.damage = 1;
    if (options.speed == null) options.speed = 1;
    if (options.fov == null) options.fov = 1;
    return {
        HEALTH: (base.HEALTH * 15) * options.health,
        DAMAGE: (base.DAMAGE * 7.5) * options.damage,
        SPEED: (base.SPEED * .15) * options.speed,
        DENSITY: base.DENSITY * 1.5,
        FOV: (base.FOV * 1.25) * options.fov,
        SHIELD: 0,
        REGEN: 0
    };
}

function crasherStats(options = {}) {
    if (!options.health) options.health = 1;
    if (!options.damage) options.damage = 1;
    if (!options.speed) options.speed = 1;
    if (!options.fov) options.fov = 1;
    return {
        HEALTH: (base.HEALTH * .075) * options.health,
        DAMAGE: (base.DAMAGE * 3) * options.damage,
        SPEED: (base.SPEED * 2) * options.speed,
        FOV: (base.FOV * 1.25) * options.fov,
        PENETRATION: 2,
        DENSITY: .5,
        PUSHABILITY: 2
    };
}

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
        ACCELERATION: base.ACCELERATION,
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
exports.poisonHue = {
    PARENT: [exports.genericTank],
    LABLE: "Hue",
    SHAPE: 1001
};
exports.poisonParent = {
    PARENT: [exports.genericTank],
    TURRETS: [{
        POSITION: [25, 0, 0, 0, 360, 0],
        TYPE: exports.poisonHue
    }]
};
exports.iceHue = {
    PARENT: [exports.genericTank],
    LABLE: "Hue",
    SHAPE: 1002
};
exports.confusHue = {
    PARENT: [exports.genericTank],
    LABLE: "Hue",
    SHAPE: 1002
};
exports.iceParent = {
    PARENT: [exports.genericTank],
    TURRETS: [{
        POSITION: [25, 0, 0, 0, 360, 0],
        TYPE: exports.iceHue
    }]
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
        SPEED: 4.5,
        RANGE: 90,
        DENSITY: 1.25,
        HEALTH: .33 * wepHealthFactor,
        DAMAGE: 4 * wepDamageFactor,
        PUSHABILITY: .3
    },
    FACING_TYPE: "smoothWithMotion",
    CAN_GO_OUTSIDE_ROOM: true,
    HITS_OWN_TYPE: "never",
    DIE_AT_RANGE: true
};
exports.hemisphere = {
    PARENT: [exports.genericTank],
    SHAPE: ["M 1 0 A 0.5 0.5 90 0 0 -1 0 Z", 1]
};
let effectIndex = 0;
function createEffectBullet(type, stats = {}) {
    if (stats.time == null) {
        stats.time = 75;
    }
    if (stats.amplification == null) {
        stats.amplification = 1;
    }
    if (stats.parent == null) {
        stats.parent = exports.bullet;
    }
    exports[`effectBulletProp${effectIndex}`] = {
        SHAPE: stats.shape == null ? (stats.parent.SHAPE || 0) : stats.shape
    };
    return {
        PARENT: [stats.parent],
        [type.toUpperCase()]: {
            STATUS: true,
            TIME: stats.time,
            AMPLIFY: stats.amplification
        },
        TURRETS: [{
            POSITION: [25, 0, 0, 0, 360, 0],
            TYPE: [exports[type.toLowerCase() + "Hue"], {
                CAN_GO_OUTSIDE_ROOM: true
            }]
        }, {
            POSITION: [10, 0, 0, 0, 0, 1],
            TYPE: [exports[`effectBulletProp${effectIndex ++}`], {
                INDEPENDENT: true,
                COLOR: type.toLowerCase() === "confus" ? 17 : (25 + (type.toLowerCase() === "ice")),
                CAN_GO_OUTSIDE_ROOM: true
            }]
        }]
    }
}
exports.acidBullet = createEffectBullet("poison");
exports.strongAcidBullet = createEffectBullet("poison", {
    amplification: 2,
    time: 50
});
exports.longAcidBullet = createEffectBullet("poison", {
    amplification: .8,
    time: 150
});
exports.freezeBullet = createEffectBullet("ice");
exports.confusBullet = createEffectBullet("confus", {
    time: 400
});
exports.strongFreezeBullet = createEffectBullet("ice", {
    amplification: 2,
    time: 50
});
exports.longFreezeBullet = createEffectBullet("ice", {
    amplification: .8,
    time: 150
});
exports.acidFreezeBullet = {
    PARENT: [exports.bullet],
    POISON: {
        STATUS: true,
        TIME: 75,
        AMPLIFY: 1
    },
    ICE: {
        STATUS: true,
        TIME: 75,
        AMPLIFY: 1
    },
    TURRETS: [{
        POSITION: [25, 0, 0, 0, 360, 0],
        TYPE: exports.poisonHue
    }, {
        POSITION: [25, 0, 0, 0, 360, 0],
        TYPE: exports.iceHue
    }, {
        POSITION: [10, 0, -1, 180, 360, 1],
        TYPE: [exports.hemisphere, {
            INDEPENDENT: true,
            COLOR: 25
        }]
    }, {
        POSITION: [10, 0, -1, 0, 360, 1],
        TYPE: [exports.hemisphere, {
            INDEPENDENT: true,
            COLOR: 26
        }]
    }]
};
exports.iceFlareBullet = {
    PARENT: [exports.freezeBullet],
    SHAPE: 4,
    PERSISTS_AFTER_DEATH: true
};
exports.necroBullet = {
    PARENT: [exports.bullet],
    NECRO: true,
    HITS_OWN_TYPE: "hard"
};
exports.growBullet = {
    PARENT: [exports.bullet],
    MOTION_TYPE: 'grower'
};
exports.flareBullet = {
    PARENT: [exports.bullet],
    SHAPE: 4,
    PERSISTS_AFTER_DEATH: true
};
exports.infernoFlare = {
    PARENT: [exports.bullet],
    SHAPE: 4,
    MOTION_TYPE: 'flare',
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
        PENETRATION: 1.2,
        PUSHABILITY: .6,
        ACCELERATION: .05,
        HEALTH: .6 * wepHealthFactor,
        DAMAGE: 1.25 * wepDamageFactor,
        SPEED: 4,
        RANGE: 200,
        DENSITY: .03,
        RESIST: 1.5,
        FOV: .5
    },
    HITS_OWN_TYPE: "hard",
    DRAW_HEALTH: false,
    CLEAR_ON_MASTER_UPGRADE: true,
    BUFF_VS_FOOD: true
};
exports.autodrone = {
    PARENT: [exports.drone],
    INDEPENDENT: true
};
exports.sunchip = {
    PARENT: [exports.drone],
    LABEL: "Square",
    SHAPE: 4,
    NECRO: true
};
exports.summonersunchip = {
    PARENT: [exports.drone],
    LABEL: "Square",
    SHAPE: 4,
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [0, 0, -1.4, 0, 0, 0, 1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.aifix, g.aifix2]),
            TYPE: exports.bullet
        }
    }]
};
exports.navyistdrone = {
    PARENT: [exports.drone],
    LABEL: "Speed Drone",
    GUNS: [{
        POSITION: [8, 12, 1.8, 8, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.navyistt]),
            TYPE: exports.bullet
        }
    }]
};
exports.sidewinderDrone = {
    PARENT: [exports.drone],
    LABEL: "Snake",
    GUNS: [{
        POSITION: [6, 12, 1.4, 8, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            STAT_CALCULATOR: gunCalcNames.thruster,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.sidewinderMissileTrail, g.arrasthruster]),
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.sidewinderMissileTrail, g.sidewinderMissileTrail2, g.arrasthruster]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }]
};
exports.vipersnake = {
    PARENT: [exports.bullet],
    LABEL: "Snake",
    GUNS: [{
        POSITION: [6, 12, 1.4, 8, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            STAT_CALCULATOR: gunCalcNames.thruster,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.sidewinderMissileTrail, g.arrasthruster, g.vipersnake]),
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.sidewinderMissileTrail, g.sidewinderMissileTrail2, g.arrasthruster, g.vipersnake]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }]
};
exports.phaserdrone = {
    PARENT: [exports.drone],
    LABEL: "Flare Drone",
    GUNS: [{
        POSITION: [8, 12, 1.8, 0, 0, 180, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.phaserFlare]),
            TYPE: exports.flareBullet
        }
    }, {
        POSITION: [8, 22, 1.4, 8, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.fake, g.navyistt]),
            TYPE: exports.bullet
        }
    }]
};
exports.treacherydrone = {
    PARENT: [exports.drone],
    LABEL: "Mini Serpent",
    SHAPE: 6,
    FACING_TYPE: 'turnWithSpeed',
    GUNS: [{
        POSITION: [8, 12, 1, 0, 0, 180, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.treacheryFlare]),
            TYPE: exports.bullet,
            STAT_CALCULATOR: gunCalcNames.fixedReload
        }
    }, {
        POSITION: [0, 0, 1.4, 8, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.fake, g.navyistt]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [0, 0, 1.4, 8, 0, 180, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.fake, g.navyistt]),
            TYPE: exports.bullet
        }
    }]
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
exports.baseMinion = {
    PARENT: [exports.genericTank],
    LABEL: 'Minion',
    TYPE: 'minion',
    DAMAGE_CLASS: 0,
    HITS_OWN_TYPE: 'hardWithBuffer',
    FACING_TYPE: 'smoothToTarget',
    BODY: {
        FOV: .6,
        SPEED: 3,
        ACCELERATION: .4,
        HEALTH: 5,
        SHIELD: 0,
        DAMAGE: 1.2,
        RESIST: 1,
        PENETRATION: 1,
        DENSITY: .4
    },
    AI: {
        BLIND: true
    },
    DRAW_HEALTH: false,
    CLEAR_ON_MASTER_UPGRADE: true,
    GIVE_KILL_MESSAGE: false,
    CONTROLLERS: ['nearestDifferentMaster', 'mapAltToFire', 'minion', 'canRepel', 'hangOutNearMaster'],
};
exports.minion = {
    PARENT: [exports.baseMinion],
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
        HEALTH: 1 * wepHealthFactor,
        DAMAGE: 2 * wepDamageFactor,
        RANGE: 450,
        DENSITY: 2.5,
        RESIST: 2.5,
        SPEED: .005
    }
};
exports.emplacetrap = {
    LABEL: "Emplacement Trap",
    TYPE: "trap",
    ACCEPTS_SCORE: false,
    SHAPE: 6,
    MOTION_TYPE: "glide",
    FACING_TYPE: "turnWithSpeed",
    HITS_OWN_TYPE: "push",
    DIE_AT_RANGE: true,
    BODY: {
        HEALTH: 1 * wepHealthFactor,
        DAMAGE: 2 * wepDamageFactor,
        RANGE: 450,
        DENSITY: 2.5,
        RESIST: 2.5,
        SPEED: .005
    }
};
exports.acidTrap = createEffectBullet("poison", {
    parent: exports.trap
});
exports.block = {
    LABEL: "Set Trap",
    PARENT: [exports.trap],
    SHAPE: -4,
    MOTION_TYPE: "motor",
    CONTROLLERS: ["goToMasterTarget"],
    BODY: {
        SPEED: 1,
        DENSITY: 5
    }
};
exports.pillboxTurret = {
    PARENT: [exports.genericTank],
    LABEL: "",
    COLOR: 16,
    BODY: {
        FOV: 2
    },
    DANGER: 0,
    GUNS: [{
        POSITION: [22, 11, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pillbox]),
            TYPE: exports.bullet
        }
    }]
};
exports.trapboxTurret = {
    PARENT: [exports.genericTank],
    LABEL: "",
    COLOR: 16,
    BODY: {
        FOV: 2
    },
    DANGER: 0,
    GUNS: [{
        POSITION: [22, 11, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.trapboxT]),
            TYPE: exports.bullet
        }
    }]
};
exports.pillbox = {
    LABEL: "Pillbox",
    PARENT: [exports.block],
    DANGER: 0,
    CONTROLLERS: ['goToMasterTarget', 'nearestDifferentMaster'],
    INDEPENDENT: true,
    TURRETS: [{
        POSITION: [11, 0, 0, 0, 360, 1],
        TYPE: exports.pillboxTurret
    }]
};
exports.trapbox = {
    LABEL: "Trap Pillbox",
    PARENT: [exports.trap],
    DANGER: 0,
    CONTROLLERS: ['goToMasterTarget', 'nearestDifferentMaster'],
    INDEPENDENT: true,
    TURRETS: [{
        POSITION: [11, 0, 0, 0, 360, 1],
        TYPE: exports.trapboxTurret
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
        FOV: 1.6
    },
    DIE_AT_RANGE: true,
    BUFF_VS_FOOD: true
};
exports.autoswarm = {
    PARENT: [exports.swarm],
    AI: {
        FARMER: true
    },
    INDEPENDENT: true,
    BODY: {
        FOV: 7.5
    },
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
    DANGER: 0,
    CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"]
};
exports.firestarterTurret = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [22, 10, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.turret, g.firestarterturret]),
            TYPE: exports.bullet
        }
    }]
};
exports.firestarterTip = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [22, 10, 1, 0, 0, 0, 0],
    }]
};
exports.firestarterDrone = {
    PARENT: [exports.drone],
    LABEL: "Speed Drone",
    GUNS: [{
        POSITION: [1, 1, 1.8, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.navyistt, g.fake]),
            TYPE: exports.bullet
        }
    }],
    TURRETS: [{
        POSITION: [11, 10, 0, 180, 120, 0],
        TYPE: exports.firestarterTurret
    }]
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
exports.bulletLayer6 = {
    PARENT: [exports.bullet],
    LAYER: 6
}
exports.autoTurretLayer6 = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [22, 10, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.turret]),
            TYPE: exports.bulletLayer6
        }
    }]
};
exports.autoNTurret = {
    PARENT: [exports.turretParent],
    GUNS: [{
        /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
        POSITION: [22, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.turret]),
            TYPE: exports.bullet
        }
    }]
};
exports.swivelNTurret = {
    PARENT: [exports.turretParent],
    GUNS: [{
        /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
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
exports.emplacementBlock = {
    PARENT: [exports.emplacetrap],
    LABEL: 'Emplacement Block',
    SHAPE: 6,
    FACING_TYPE: 'autospin',
    GUNS: [{
        POSITION: [7, 7.5, .6, 7, 0, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.emplaceblock]),
            TYPE: [exports.swarm, {
                PERSISTS_AFTER_DEATH: true,
                CONTROLLERS: ['canRepel']
            }],
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 7.5, .6, 7, 0, 180, 1 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.emplaceblock]),
            TYPE: [exports.swarm, {
                PERSISTS_AFTER_DEATH: true,
                CONTROLLERS: ['canRepel']
            }],
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 7.5, .6, 7, 0, 300, 2 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.emplaceblock]),
            TYPE: [exports.swarm, {
                PERSISTS_AFTER_DEATH: true,
                CONTROLLERS: ['canRepel']
            }],
            STAT_CALCULATOR: gunCalcNames.swarm
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
exports.ligma = {
    PARENT: [exports.genericTank],
    LABEL: "Ligma",
    GUNS: [{
        POSITION: [64, .1, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet]),
            TYPE: exports.bullet
        }
    }]
};
exports.basic2 = {
    PARENT: [exports.genericTank],
    LABEL: 'Basic Basic',
    DANGER: 4,
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
    LABEL: "dev",
    VALUE: 59212,
    GUNS: [{
        POSITION: [18, 10, -1.4, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet]),
            TYPE: exports.bullet
        }
    }]
};

function branch(exportName, name, tanks) {
    const splits = [
        []
    ];
    for (let i = 0; i < tanks.length; i++) {
        if (!tanks[i]) {
            console.log("Branch", name, "found undefined at index", i);
            continue;
        }
        splits[splits.length - 1].push(tanks[i]);
        if (splits[splits.length - 1].length >= 14 && splits.flat().length < tanks.length) {
            splits.push([]);
        }
    }
    for (let i = 0; i < splits.length; i++) {
        exports[`${exportName}${i === 0 ? "" : i}`] = {
            PARENT: [exports.testbedParent],
            LABEL: name + (i > 0 ? ` Page ${i + 1}` : ""),
            UPGRADES_TIER_1: splits[i]
        }
    }
    for (let i = 0; i < splits.length; i++) {
        if (exports[`${exportName}${i + 1}`] != null) {
            exports[`${exportName}${i === 0 ? "" : i}`].UPGRADES_TIER_1.push(exports[`${exportName}${i + 1}`]);
        }
    }
}
exports.resetSkills = {
    PARENT: [exports.genericTank],
    RESET_UPGRADES: true,
    ALPHA: 1,
    SKILL: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    LEVEL: -1
};
exports.testbed = {
    PARENT: [exports.testbedParent],
    LABEL: "Developer"
};
exports.betaTester = {
    PARENT: [exports.testbedParent],
    LABEL: "Beta Tester"
};
exports.seniorTester = {
    PARENT: [exports.testbedParent],
    LABEL: "Senior Tester"
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
    HEALTH_WITH_LEVEL: false,
    DANGER: 4
};
/*exports.icosagon = {
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
        HEALTH: 3000 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        SHIELD: 30 * basePolygonHealth,
        REGEN: .1
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
        HEALTH: 1500 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        SHIELD: 40 * basePolygonHealth,
        REGEN: .1
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
        HEALTH: 1000 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        SHIELD: 40 * basePolygonHealth,
        REGEN: .1
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
        HEALTH: 750 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        SHIELD: 40 * basePolygonHealth,
        REGEN: .1
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
        HEALTH: 500 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        SHIELD: 40 * basePolygonHealth,
        REGEN: .1
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
        HEALTH: 250 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        SHIELD: 40 * basePolygonHealth,
        REGEN: .1
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
};*/
exports.hugePentagon = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 5
    },
    LABEL: "Alpha Pentagon",
    VALUE: 15e3 * shapeScoreScale,
    SHAPE: 5,
    SIZE: 58,
    COLOR: 14,
    BODY: {
        DAMAGE: 2 * basePolygonDamage,
        DENSITY: 80,
        HEALTH: 300 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        SHIELD: 40 * basePolygonHealth,
        REGEN: .6
    },
    DRAW_HEALTH: !0,
    GIVE_KILL_MESSAGE: !0
}, exports.bigPentagon = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 4
    },
    LABEL: "Beta Pentagon",
    VALUE: 2500 * shapeScoreScale,
    SHAPE: 5,
    SIZE: 30,
    COLOR: 14,
    BODY: {
        DAMAGE: 2 * basePolygonDamage,
        DENSITY: 30,
        HEALTH: 50 * basePolygonHealth,
        RESIST: Math.pow(1.25, 2),
        SHIELD: 20 * basePolygonHealth,
        REGEN: .2
    },
    DRAW_HEALTH: !0,
    GIVE_KILL_MESSAGE: !0
}, exports.pentagon = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 3
    },
    LABEL: "Pentagon",
    VALUE: 400 * shapeScoreScale,
    SHAPE: 5,
    SIZE: 16,
    COLOR: 14,
    BODY: {
        DAMAGE: 1.5 * basePolygonDamage,
        DENSITY: 8,
        HEALTH: 10 * basePolygonHealth,
        RESIST: 1.25,
        PENETRATION: 1.1
    },
    DRAW_HEALTH: !0
}, exports.triangle = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 2
    },
    LABEL: "Triangle",
    VALUE: 120 * shapeScoreScale,
    SHAPE: 3,
    SIZE: 9,
    COLOR: 2,
    BODY: {
        DAMAGE: basePolygonDamage,
        DENSITY: 6,
        HEALTH: 3 * basePolygonHealth,
        RESIST: 1.15,
        PENETRATION: 1.5
    },
    DRAW_HEALTH: !0
}, exports.square = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 1
    },
    LABEL: "Square",
    VALUE: 30 * shapeScoreScale,
    SHAPE: 4,
    SIZE: 10,
    COLOR: 13,
    BODY: {
        DAMAGE: basePolygonDamage,
        DENSITY: 4,
        HEALTH: basePolygonHealth,
        PENETRATION: 2
    },
    DRAW_HEALTH: !0,
    INTANGIBLE: !1
}, exports.egg = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 0
    },
    LABEL: "Egg",
    VALUE: 10 * shapeScoreScale,
    SHAPE: 0,
    SIZE: 5,
    COLOR: 6,
    INTANGIBLE: !0,
    BODY: {
        DAMAGE: 0,
        DENSITY: 2,
        HEALTH: .0011,
        PUSHABILITY: 0
    },
    DRAW_HEALTH: !1
}, exports.greenpentagon = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 3,
        SHINY: !0
    },
    LABEL: "Pentagon",
    VALUE: 3e4 * shapeScoreScale,
    SHAPE: 5,
    SIZE: 16,
    COLOR: 1,
    BODY: {
        DAMAGE: 3,
        DENSITY: 8,
        HEALTH: 200,
        RESIST: 1.25,
        PENETRATION: 1.1,
        ACCELERATION: .00375
    },
    DRAW_HEALTH: !0
}, exports.greentriangle = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 2,
        SHINY: !0
    },
    LABEL: "Triangle",
    VALUE: 7e3 * shapeScoreScale,
    SHAPE: 3,
    SIZE: 9,
    COLOR: 1,
    BODY: {
        DAMAGE: 1,
        DENSITY: 6,
        HEALTH: 60,
        RESIST: 1.15,
        PENETRATION: 1.5,
        ACCELERATION: .0075
    },
    DRAW_HEALTH: !0
}, exports.greensquare = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 1,
        SHINY: !0
    },
    LABEL: "Square",
    VALUE: 2e3 * shapeScoreScale,
    SHAPE: 4,
    SIZE: 10,
    COLOR: 1,
    BODY: {
        DAMAGE: .5,
        DENSITY: 4,
        HEALTH: 20,
        PENETRATION: 2,
        ACCELERATION: .005
    },
    DRAW_HEALTH: !0,
    INTANGIBLE: !1
}, exports.gem = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 0,
        SHINY: !0
    },
    LABEL: "Gem",
    VALUE: 1e3 * shapeScoreScale,
    SHAPE: 6,
    SIZE: 5,
    COLOR: 0,
    BODY: {
        DAMAGE: basePolygonDamage / 4,
        DENSITY: 4,
        HEALTH: 10,
        PENETRATION: 2,
        RESIST: 2,
        PUSHABILITY: .25,
        ACCELERATION: .015
    },
    DRAW_HEALTH: !0,
    INTANGIBLE: !1
}
exports.scaleneTriangle = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 2
    },
    LABEL: "Scalene Triangle",
    VALUE: 260,
    SHAPE: [
        [-1, -0.5],
        [1, -0.5],
        [0.4, 1]
    ],
    SIZE: 9,
    COLOR: 24,
    BODY: {
        DAMAGE: 1.2 * basePolygonDamage,
        HEALTH: 3 * basePolygonHealth,
        RESIST: 1
    },
    DRAW_HEALTH: true
};
exports.rhombus = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 1
    },
    LABEL: "Rhombus",
    VALUE: 30,
    SHAPE: [
        [-1.02, 0],
        [0, -1.5],
        [1, 0],
        [0, 1.5]
    ],
    SIZE: 10,
    COLOR: 24,
    BODY: {
        DAMAGE: .7 * basePolygonDamage,
        HEALTH: basePolygonHealth / .7
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false
};
exports.pumpkin = {
    PARENT: [exports.food],
    SHAPE: 1000,
    LABEL: "Pumpkin",
    VALUE: 1000000,
    SIZE: 10,
    COLOR: 2,
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
        LEVEL: 1
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
exports.pebbleObstacle = {
    PARENT: [exports.obstacle],
    SIZE: 25,
    SHAPE: -6,
    LABEL: "Pebble"
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
exports.buttonBody = {
    LABEL: "",
    COLOR: 9,
    SHAPE: -5,
    INDEPENDENT: true
};
exports.button = {
    PARENT: [exports.genericEntity],
    LABEL: "Button",
    DANGER: 0,
    GIVE_KILL_MESSAGE: false,
    DRAW_HEALTH: false,
    ACCEPTS_SCORE: false,
    BODY: {
        SPEED: 0,
        DENSITY: base.DENSITY * 1000,
        HEALTH: base.HEALTH * 25,
        DAMAGE: base.DAMAGE * 3,
        PUSHABILITY: 0,
        PENETRATION: base.PENETRATION * .75
    },
    SIZE: 36,
    TURRETS: [{
        /** SIZE     X       Y     ANGLE    ARC */
        POSITION: [21.5, 0, 0, 0, 360, 0],
        TYPE: [exports.buttonBody, {
            CONTROLLERS: ["spin"]
        }]
    }, {
        POSITION: [21.5, 0, 0, 0, 360, 0],
        TYPE: [exports.buttonBody, {
            CONTROLLERS: ["reversespin"]
        }]
    }]
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
    ALPHA: 0.15,
    DANGER: -5,
    BODY: {
        ACCELERATION: 2 * base.ACCEL,
        SPEED: 2 * base.SPEED,
        FOV: 2,
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
        POSITION: [19, 8.5, 1, 0, 5.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 8.5, 1, 0, -5.5, 0, .5],
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
            TYPE: exports.growBullet,
        },
    }, {
        POSITION: [2, 10, 1, 14, 0, 0, 0],
    }]
};
exports.machGrower = {
    PARENT: [exports.genericTank],
    LABEL: "Machine Grower",
    GUNS: [{
        POSITION: [18, 8, 1.25, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.grower]),
            TYPE: exports.growBullet,
        },
    }, {
        POSITION: [2, 10, 1.25, 14, 0, 0, 0],
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.grower, g.botanist]),
            TYPE: exports.growBullet,
        },
    }, {
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.destroy, g.grower, g.botanist, g.superstorm]),
            TYPE: exports.growBullet,
        },
    }, {
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.hewntwin]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 8, 1, 0, -5.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.hewntwin]),
            TYPE: exports.bullet
        }
    }]
};
exports.cutter = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    LABEL: 'Cutter',
    BODY: {
        ACCELERATION: 1.25 * base.ACCEL,
        SPEED: 1.05 * base.SPEED
    },
    GUNS: [, {
        POSITION: [19, 8, 1, 0, 5.5, 20, 0.25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.hewntwin, g.cutter]),
            TYPE: exports.bullet
        }
    }, {
            POSITION: [19, 8, 1, 0, -5.5, -20, .75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.hewntwin, g.cutter]),
                TYPE: exports.bullet
            }
        }, {
            POSITION: [19, 8, 1, 0, 5.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.hewntwin, g.cutter]),
                TYPE: exports.bullet
            }
        }, {
            POSITION: [19, 8, 1, 0, -5.5, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.hewntwin, g.cutter]),
                TYPE: exports.bullet
            }
        }]
};
exports.hewndouble = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    LABEL: 'Hewn Double',
    BODY: {
        ACCELERATION: 1.3 * base.ACCEL,
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
    }, {
        POSITION: [19, 8, 1, 0, 5.5, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.norecoil]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 8, 1, 0, -5.5, 180, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.norecoil]),
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
exports.colony = {
    PARENT: [exports.genericTank],
    LABEL: "Colony",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    SHAPE: 6,
    GUNS: [{
        POSITION: [6, 7, 1.2, 8, 0, 0, .123],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: exports.drone,
            AUTOFIRE: !0,
            MAX_CHILDREN: 2,
            SYNCS_SKILLS: !0,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, 60, .234],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: [exports.drone, {
                INDEPENDENT: !0
            }],
            AUTOFIRE: !0,
            MAX_CHILDREN: 2,
            SYNCS_SKILLS: !0,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, 120, .345],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: exports.drone,
            AUTOFIRE: !0,
            MAX_CHILDREN: 2,
            SYNCS_SKILLS: !0,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, -60, .456],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: [exports.drone, {
                INDEPENDENT: !0
            }],
            AUTOFIRE: !0,
            MAX_CHILDREN: 2,
            SYNCS_SKILLS: !0,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, -120, .567],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: exports.drone,
            AUTOFIRE: !0,
            MAX_CHILDREN: 2,
            SYNCS_SKILLS: !0,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, 180, .678],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: [exports.drone, {
                INDEPENDENT: !0
            }],
            AUTOFIRE: !0,
            MAX_CHILDREN: 2,
            SYNCS_SKILLS: !0,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }]
};
exports.panopoly = makeAuto(exports.colony, "Panopoly");
exports.colonyCeption = makeCeption(exports.colony);
exports.omissionTurret = {
    PARENT: [exports.turretParent],
    LABEL: "Omissionary",
    GUNS: [{
        POSITION: [12, 3.5, 1, 0, 7.25, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.omissionTurret, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 3.5, 1, 0, -7.25, 0, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.omissionTurret, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 2.5, 1, 0, 3.75, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.omissionTurret, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 2.5, 1, 0, -3.75, 0, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.omissionTurret, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 3, 1, 0, 3.75, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.omissionTurret, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 3, 1, 0, -3.75, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.omissionTurret, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 3.5, 1, 0, 3.75, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.omissionTurret, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 3.5, 1, 0, -3.75, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.omissionTurret, g.turret]),
            TYPE: exports.bullet
        }
    }]
};
exports.omission = makeAuto(exports.colony, "Omission", {
    type: exports.omissionTurret
});
exports.flankColony = {
    PARENT: [exports.genericTank],
    LABEL: "Flank Colony",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    SHAPE: 6,
    GUNS: [{
        POSITION: [18, 7, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, 60, .234],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: [exports.drone, {
                INDEPENDENT: !0
            }],
            AUTOFIRE: !0,
            MAX_CHILDREN: 2,
            SYNCS_SKILLS: !0,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, 120, .345],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: exports.drone,
            AUTOFIRE: !0,
            MAX_CHILDREN: 2,
            SYNCS_SKILLS: !0,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, -60, .456],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: [exports.drone, {
                INDEPENDENT: !0
            }],
            AUTOFIRE: !0,
            MAX_CHILDREN: 2,
            SYNCS_SKILLS: !0,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, -120, .567],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: exports.drone,
            AUTOFIRE: !0,
            MAX_CHILDREN: 2,
            SYNCS_SKILLS: !0,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, 180, .678],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: [exports.drone, {
                INDEPENDENT: !0
            }],
            AUTOFIRE: !0,
            MAX_CHILDREN: 2,
            SYNCS_SKILLS: !0,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }]
};
exports.bactirialColony = {
    PARENT: [exports.genericTank],
    LABEL: "Bactirial Colony",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    SHAPE: 6,
    GUNS: [{
        POSITION: [18, 7, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, 60, .234],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: [exports.drone, {
                INDEPENDENT: !0
            }],
            AUTOFIRE: !0,
            MAX_CHILDREN: 2,
            SYNCS_SKILLS: !0,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, 120, .345],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: exports.drone,
            AUTOFIRE: !0,
            MAX_CHILDREN: 2,
            SYNCS_SKILLS: !0,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, -60, .456],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: [exports.drone, {
                INDEPENDENT: !0
            }],
            AUTOFIRE: !0,
            MAX_CHILDREN: 2,
            SYNCS_SKILLS: !0,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, -120, .567],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: exports.drone,
            AUTOFIRE: !0,
            MAX_CHILDREN: 2,
            SYNCS_SKILLS: !0,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [15, 7, 1, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank]),
            TYPE: exports.bullet
        }
    }]
};
exports.stovepipe = {
    PARENT: [exports.genericTank],
    LABEL: "Stovepipe",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    SHAPE: 8,
    GUNS: [{
        POSITION: [6, 7, 1.2, 8, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: exports.drone,
            AUTOFIRE: !0,
            SYNCS_SKILLS: !0,
            MAX_CHILDREN: 2,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: [exports.drone, {
                INDEPENDENT: !0
            }],
            AUTOFIRE: !0,
            SYNCS_SKILLS: !0,
            MAX_CHILDREN: 2,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, 270, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: exports.drone,
            AUTOFIRE: !0,
            SYNCS_SKILLS: !0,
            MAX_CHILDREN: 2,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: [exports.drone, {
                INDEPENDENT: !0
            }],
            AUTOFIRE: !0,
            SYNCS_SKILLS: !0,
            MAX_CHILDREN: 2,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, 45, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: exports.drone,
            AUTOFIRE: !0,
            SYNCS_SKILLS: !0,
            MAX_CHILDREN: 2,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, 135, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: [exports.drone, {
                INDEPENDENT: !0
            }],
            AUTOFIRE: !0,
            SYNCS_SKILLS: !0,
            MAX_CHILDREN: 2,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, -45, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: exports.drone,
            AUTOFIRE: !0,
            SYNCS_SKILLS: !0,
            MAX_CHILDREN: 2,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, -135, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: [exports.drone, {
                INDEPENDENT: !0
            }],
            AUTOFIRE: !0,
            SYNCS_SKILLS: !0,
            MAX_CHILDREN: 2,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }]
};
exports.flankStovepipe = {
    PARENT: [exports.genericTank],
    LABEL: "Flank Stovepipe",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    SHAPE: 8,
    GUNS: [{
        POSITION: [18, 7, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: exports.drone,
            AUTOFIRE: !0,
            SYNCS_SKILLS: !0,
            MAX_CHILDREN: 2,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: exports.drone,
            AUTOFIRE: !0,
            SYNCS_SKILLS: !0,
            MAX_CHILDREN: 2,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, 270, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: exports.drone,
            AUTOFIRE: !0,
            SYNCS_SKILLS: !0,
            MAX_CHILDREN: 2,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, 45, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: exports.drone,
            AUTOFIRE: !0,
            SYNCS_SKILLS: !0,
            MAX_CHILDREN: 2,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, 135, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: [exports.drone, {
                INDEPENDENT: !0
            }],
            AUTOFIRE: !0,
            SYNCS_SKILLS: !0,
            MAX_CHILDREN: 2,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, -45, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: exports.drone,
            AUTOFIRE: !0,
            SYNCS_SKILLS: !0,
            MAX_CHILDREN: 2,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, -135, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: [exports.drone, {
                INDEPENDENT: !0
            }],
            AUTOFIRE: !0,
            SYNCS_SKILLS: !0,
            MAX_CHILDREN: 2,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }]
};
exports.turtle = {
    PARENT: [exports.genericTank],
    LABEL: "Turtle",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        HEALTH: 1.5 * base.HEALTH,
        SPEED: .75 * base.SPEED
    },
    SHAPE: 6,
    GUNS: [{
        POSITION: [18, 7, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, 60, .234],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: [exports.drone, {
                INDEPENDENT: !0
            }],
            AUTOFIRE: !0,
            MAX_CHILDREN: 2,
            SYNCS_SKILLS: !0,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, 120, .345],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: exports.drone,
            AUTOFIRE: !0,
            MAX_CHILDREN: 2,
            SYNCS_SKILLS: !0,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, -60, .456],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: [exports.drone, {
                INDEPENDENT: !0
            }],
            AUTOFIRE: !0,
            MAX_CHILDREN: 2,
            SYNCS_SKILLS: !0,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [6, 7, 1.2, 8, 0, -120, .567],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
            TYPE: exports.drone,
            AUTOFIRE: !0,
            MAX_CHILDREN: 2,
            SYNCS_SKILLS: !0,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: !0
        }
    }, {
        POSITION: [13, 8, 1, 0, 0, 180, 0]
    }, {
        POSITION: [3, 8, 1.6, 13, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.flank]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }]
};
exports.miniMothership = {
    PARENT: [exports.genericTank],
    LABEL: "Mothership",
    DANGER: 9,
    SHAPE: 16,
    BODY: {
        HEALTH: base.HEALTH * 1.15,
        DAMAGE: base.DAMAGE * 1.15,
        SPEED: base.SPEED * .85
    },
    GUNS: (function () {
        const output = [];
        for (let i = 0; i < 16; i++) {
            output.push({
                POSITION: [4.3, 3.1, 1.2, 8, 0, i / 16 * 360, i / 16],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.colony, g.miniMothership]),
                    TYPE: [exports.drone, {
                        INDEPENDENT: i % 2 === 0
                    }],
                    MAX_CHILDREN: 2,
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: gunCalcNames.drone,
                    WAIT_TO_CYCLE: true
                }
            });
        }
        return output;
    })()
};
exports.colony.UPGRADES_TIER_3 = [exports.panopoly, exports.flankColony, exports.stovepipe];
exports.panopoly.UPGRADES_TIER_4 = [exports.colonyCeption, exports.omission];
exports.flankColony.UPGRADES_TIER_4 = [exports.bactirialColony, exports.flankStovepipe, exports.turtle];
exports.stovepipe.UPGRADES_TIER_4 = [exports.flankColony, exports.miniMothership];
exports.manager = {
    PARENT: [exports.genericTank],
    LABEL: "Manager",
    STAT_NAMES: statnames.drone,
    DANGER: 6,
    BODY: {
        ACCELERATION: .75 * base.ACCEL,
        SPEED: .9 * base.SPEED
    },
    MAX_CHILDREN: 8,
    INVISIBLE: [.2, .05],
    TOOLTIP: "Stay still to turn invisible",
    GUNS: [{
        POSITION: [6, 12, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.manager]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            SKIN: 4
        }
    }]
};
exports.moderatordrone = {
    LABEL: "Drone",
    TYPE: "drone",
    ACCEPTS_SCORE: false,
    DANGER: 2,
    CONTROL_RANGE: 0,
    SHAPE: 3,
    MOTION_TYPE: "chase",
    FACING_TYPE: "smoothToTarget",
    CONTROLLERS: ["nearestDifferentMaster", "canRepel", "mapTargetToGoal"],
    AI: {
        BLIND: true
    },
    BODY: {
        PENETRATION: .5,
        PUSHABILITY: .85,
        ACCELERATION: .08,
        HEALTH: 1.5 * wepHealthFactor,
        DAMAGE: 2.65 * wepDamageFactor,
        SPEED: 4.5,
        RANGE: 90,
        DENSITY: 0.5,
        RESIST: 1.5,
        FOV: 1.25
    },
    HITS_OWN_TYPE: "hard",
    INVISIBLE: [.06, .03],
    DRAW_HEALTH: false,
    CLEAR_ON_MASTER_UPGRADE: true,
    BUFF_VS_FOOD: true
};
exports.moderator = {
    PARENT: [exports.genericTank],
    LABEL: "Moderator",
    STAT_NAMES: statnames.drone,
    DANGER: 7,
    BODY: {
        ACCELERATION: .75 * base.ACCEL,
        SPEED: .9 * base.SPEED
    },
    MAX_CHILDREN: 8,
    INVISIBLE: [.2, .05],
    TOOLTIP: "Stay still to turn invisible",
    GUNS: [{
        POSITION: [7, 11, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.manager, g.moderator]),
            TYPE: exports.moderatordrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            SKIN: 4
        }
    }]
};
exports.navyist = {
    PARENT: [exports.genericTank],
    LABEL: "Navyist",
    STAT_NAMES: statnames.drone,
    DANGER: 6,
    SKILL_CAP: [10, 10, 10, 10, 0, 10, 10, 10, 10, 10],
    BODY: {
        ACCELERATION: .75 * base.ACCEL
    },
    MAX_CHILDREN: 5,
    GUNS: [{
        POSITION: [6, 12, 1.2, 10, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.navyist]),
            TYPE: exports.navyistdrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone
        }
    }, {
        POSITION: [6, 14, 0.9, 6, 0, 0, 0],
    }]
};
exports.firestarter = {
    PARENT: [exports.genericTank],
    LABEL: "Firestarter",
    STAT_NAMES: statnames.drone,
    DANGER: 7,
    SKILL_CAP: [10, 10, 10, 10, 0, 10, 10, 10, 10, 10],
    BODY: {
        ACCELERATION: .75 * base.ACCEL
    },
    MAX_CHILDREN: 4,
    GUNS: [{
        POSITION: [6, 12, 1.2, 10, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.navyist]),
            TYPE: exports.firestarterDrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone
        }
    }, {
        POSITION: [6, 14, 0.9, 6, 0, 0, 0],
    }],
    TURRETS: [{
        POSITION: [8, 15, 0, 0, 0, 0],
        TYPE: exports.firestarterTip
    }]
};
exports.arras = {
    PARENT: [exports.genericTank],
    LABEL: "Arras",
    STAT_NAMES: statnames.drone,
    DANGER: 7,
    SKILL_CAP: [10, 10, 10, 10, 0, 10, 10, 10, 10, 10],
    BODY: {
        ACCELERATION: .75 * base.ACCEL
    },
    MAX_CHILDREN: 3,
    GUNS: [{
        POSITION: [6, 14, 1.2, 10, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.navyist, g.arrasdrone]),
            TYPE: exports.sidewinderDrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone
        }
    }, {
        POSITION: [6, 16, 0.9, 6, 0, 0, 0],
    }, {
        POSITION: [6, 18, 0.9, 5, 0, 0, 0],
    }]
};
exports.phaser = {
    PARENT: [exports.genericTank],
    LABEL: "Phaser",
    STAT_NAMES: statnames.drone,
    DANGER: 7,
    SKILL_CAP: [10, 10, 10, 10, 0, 10, 10, 10, 10, 10],
    BODY: {
        ACCELERATION: .75 * base.ACCEL
    },
    MAX_CHILDREN: 5,
    GUNS: [{
        POSITION: [4, 9, 0.5, 16, 0, 0, 0],
    }, {
        POSITION: [6, 12, 1.2, 10, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.navyist]),
            TYPE: exports.phaserdrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone
        }
    }, {
        POSITION: [6, 14, 0.9, 6, 0, 0, 0],
    }]
};
exports.treacheryBody1 = {
    LABEL: "",
    CONTROLLERS: ["reverseSlowSpin"],
    COLOR: 3,
    SHAPE: -6,
    INDEPENDENT: true
};
exports.treacheryBody2 = {
    LABEL: "",
    CONTROLLERS: ["spin"],
    COLOR: 6,
    SHAPE: -6,
    INDEPENDENT: true
};
exports.treachery = {
    PARENT: [exports.genericTank],
    LABEL: "Treachery",
    STAT_NAMES: statnames.drone,
    FACING_TYPE: "autospin",
    DANGER: 7,
    SKILL_CAP: [10, 10, 10, 10, 0, 10, 10, 10, 10, 10],
    BODY: {
        HEALTH: base.HEALTH * 1.1,
        ACCELERATION: .45 * base.ACCEL
    },
    MAX_CHILDREN: 3,
    GUNS: [{
        POSITION: [6, 12, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.navyist, g.treachery]),
            TYPE: exports.treacherydrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone
        }
    }, {
        POSITION: [6, 14, 0.9, 4, 0, 0, 0],
    }, {
        POSITION: [6, 12, 1.2, 8, 0, 120, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.navyist, g.treachery]),
            TYPE: exports.treacherydrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone
        }
    }, {
        POSITION: [6, 14, 0.9, 4, 0, 120, 0],
    }, {
        POSITION: [6, 12, 1.2, 8, 0, 240, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.navyist, g.treachery]),
            TYPE: exports.treacherydrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone
        }
    }, {
        POSITION: [6, 14, 0.9, 4, 0, 240, 0],
    }],
    TURRETS: [{
        POSITION: [21.5, 0, 0, 0, 360, 0],
        TYPE: exports.treacheryBody1
    }, {
        POSITION: [21.5, 0, 0, 0, 360, 0],
        TYPE: exports.treacheryBody2
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
exports.dualtrapper = {
    PARENT: [exports.genericTank],
    DANGER: 5,
    LABEL: "Dual Trapper",
    STAT_NAMES: statnames.trap,
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0]
    }, {
        POSITION: [4, 8, 1.3, 18, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [4, 8, 1.3, 14, 0, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }]
};
exports.minitrap = {
    PARENT: [exports.genericTank],
    DANGER: 6,
    LABEL: "Barricade",
    STAT_NAMES: statnames.trap,
    BODY: {
        FOV: 1.15
    },
    GUNS: [{
        POSITION: [24, 8, 1, 0, 0, 0, 0]
    }, {
        POSITION: [4, 8, 1.3, 22, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.barricade]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [4, 8, 1.3, 18, 0, 0, .333],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.barricade]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [4, 8, 1.3, 14, 0, 0, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.barricade]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }]
};
exports.biocontain = {
    PARENT: [exports.poisonParent],
    DANGER: 6,
    LABEL: "Biocontainment",
    STAT_NAMES: statnames.trap,
    BODY: {
        FOV: 1.15
    },
    GUNS: [{
        POSITION: [24, 8, 1, 0, 0, 0, 0]
    }, {
        POSITION: [24, 6.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            COLOR: 25
        }
    }, {
        POSITION: [4, 8, 1.3, 22, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.barricade]),
            TYPE: exports.acidTrap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [4, 8, 1.3, 18, 0, 0, .333],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.barricade]),
            TYPE: exports.acidTrap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [4, 8, 1.3, 14, 0, 0, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.barricade]),
            TYPE: exports.acidTrap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }]
};
exports.deluge = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    LABEL: "Deluge",
    STAT_NAMES: statnames.trap,
    BODY: {
        FOV: 1.15
    },
    GUNS: [{
        POSITION: [24, 8, 1, 0, 0, 0, 0]
    }, {
        POSITION: [11, 10, 1, 0, 0, 0, 0]
    }, {
        POSITION: [4, 8, 1.3, 22, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.barricade, g.deluge]),
            TYPE: exports.trapbox,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [4, 8, 1.3, 18, 0, 0, .333],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.barricade, g.deluge]),
            TYPE: exports.trapbox,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [4, 8, 1.3, 14, 0, 0, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.barricade, g.deluge]),
            TYPE: exports.trapbox,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }]
};
exports.twintrap = {
    PARENT: [exports.genericTank],
    LABEL: "Bulwark",
    STAT_NAMES: statnames.generic,
    DANGER: 7,
    GUNS: [{
        POSITION: [20, 8, 1, 0, 5.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.flank]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [13, 8, 1, 0, 5.5, 190, 0]
    }, {
        POSITION: [4, 8, 1.7, 13, 5.5, 190, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.flank]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [20, 8, 1, 0, -5.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.flank]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [13, 8, 1, 0, -5.5, 170, .5]
    }, {
        POSITION: [4, 8, 1.7, 13, -5.5, 170, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.flank]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }]
};
exports.bushwhack = {
    PARENT: [exports.genericTank],
    LABEL: "Bushwhacker",
    BODY: {
        ACCELERATION: .7 * base.ACCEL,
        FOV: 1.2 * base.FOV
    },
    DANGER: 7,
    GUNS: [{
        POSITION: [24, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.flank]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [13, 8.5, 1, 0, 0, 180, 0]
    }, {
        POSITION: [4, 8.5, 1.7, 13, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.flank]),
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
        POSITION: [18, 5, 1, 0, 0, 0, 0,],
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
exports.virus = {
    PARENT: [exports.genericTank],
    LABEL: "Virus",
    DANGER: 7,
    GUNS: [{
        POSITION: [20, 5, 1, 0, 0, 0, 0,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.contagi, g.virus]),
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
exports.fortress = {
    PARENT: [exports.genericTank],
    LABEL: "Fortress",
    DANGER: 7,
    STAT_NAMES: statnames.generic,
    BODY: {
        SPEED: .8 * base.SPEED,
        FOV: 1.2 * base.FOV
    },
    GUNS: [{
        POSITION: [7, 7.5, .6, 7, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.flank]),
            TYPE: [exports.swarm, {
                CONTROLLERS: ["canRepel"]
            }],
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 7.5, .6, 7, 0, 120, 1 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.flank]),
            TYPE: [exports.swarm, {
                CONTROLLERS: ["canRepel"]
            }],
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 7.5, .6, 7, 0, 240, 2 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.flank]),
            TYPE: [exports.swarm, {
                CONTROLLERS: ["canRepel"]
            }],
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [14, 9, 1, 0, 0, 60, 0]
    }, {
        POSITION: [4, 9, 1.5, 14, 0, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.quadtrap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [14, 9, 1, 0, 0, 180, 0]
    }, {
        POSITION: [4, 9, 1.5, 14, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.quadtrap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [14, 9, 1, 0, 0, 300, 0]
    }, {
        POSITION: [4, 9, 1.5, 14, 0, 300, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.quadtrap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }]
};
exports.palisadeTank = {
    PARENT: [exports.genericTank],
    LABEL: "Palisade",
    DANGER: 7,
    SHAPE: 6,
    STAT_NAMES: statnames.generic,
    BODY: {
        SPEED: .8 * base.SPEED,
        FOV: 1.2 * base.FOV
    },
    FACING_TYPE: "autospin",
    GUNS: [{
        POSITION: [7, 7.5, 1.6, 7, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.spawner, g.flank]),
            TYPE: exports.minion,
            MAX_CHILDREN: 2,
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true
        }
    }, {
        POSITION: [7, 7.5, 1.6, 7, 0, 120, 1 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.spawner, g.flank]),
            TYPE: exports.minion,
            MAX_CHILDREN: 2,
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true
        }
    }, {
        POSITION: [7, 7.5, 1.6, 7, 0, 240, 2 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.spawner, g.flank]),
            TYPE: exports.minion,
            MAX_CHILDREN: 2,
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true
        }
    }, {
        POSITION: [14, 9, 1, 0, 0, 60, 0]
    }, {
        POSITION: [4, 9, 1.5, 14, 0, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.quadtrap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [14, 9, 1, 0, 0, 180, 0]
    }, {
        POSITION: [4, 9, 1.5, 14, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.quadtrap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [14, 9, 1, 0, 0, 300, 0]
    }, {
        POSITION: [4, 9, 1.5, 14, 0, 300, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.quadtrap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }]
};
exports.heptatrapper = {
    PARENT: [exports.genericTank],
    LABEL: "Hepta Trapper",
    DANGER: 7,
    BODY: {
        ACCELERATION: .9 * base.ACCEL
    },
    GUNS: [{
        POSITION: [13, 8, 1, 0, 0, 0, 0]
    }, {
        POSITION: [3, 8, 1.7, 13, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.quadtrap, g.heptatrap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [13, 8, 1, 0, 0, 1 / 7 * 360, 0]
    }, {
        POSITION: [3, 8, 1.7, 13, 0, 1 / 7 * 360, 1 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.quadtrap, g.heptatrap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [13, 8, 1, 0, 0, 2 / 7 * 360, 0]
    }, {
        POSITION: [3, 8, 1.7, 13, 0, 2 / 7 * 360, 2 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.quadtrap, g.heptatrap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [13, 8, 1, 0, 0, 3 / 7 * 360, 0]
    }, {
        POSITION: [3, 8, 1.7, 13, 0, 3 / 7 * 360, 3 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.quadtrap, g.heptatrap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [13, 8, 1, 0, 0, 4 / 7 * 360, 0]
    }, {
        POSITION: [3, 8, 1.7, 13, 0, 4 / 7 * 360, 4 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.quadtrap, g.heptatrap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [13, 8, 1, 0, 0, 5 / 7 * 360, 0]
    }, {
        POSITION: [3, 8, 1.7, 13, 0, 5 / 7 * 360, 5 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.quadtrap, g.heptatrap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [13, 8, 1, 0, 0, 6 / 7 * 360, 0]
    }, {
        POSITION: [3, 8, 1.7, 13, 0, 6 / 7 * 360, 6 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.quadtrap, g.heptatrap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }]
};
exports.minishot = {
    PARENT: [exports.genericTank],
    LABEL: "Minishot",
    DANGER: 5,
    BODY: {
        SPEED: .95 * base.SPEED
    },
    GUNS: [{
        POSITION: [16, 2, 1, 0, -4, -7, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 2, 1, 0, 4, 7, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotMain]),
            TYPE: exports.bullet
        }
    }]
};
exports.artillery = {
    PARENT: [exports.genericTank],
    LABEL: "Artillery",
    DANGER: 6,
    BODY: {
        ACCELERATION: .95 * base.ACCEL,
        SPEED: .95 * base.SPEED
    },
    GUNS: [{
        POSITION: [17, 3, 1, 0, -6, -7, .334],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 3, 1, 0, 6, 7, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotMain, g.pound]),
            TYPE: exports.bullet
        }
    }]
};
exports.ordnance = {
    PARENT: [exports.genericTank],
    LABEL: "Ordnance",
    DANGER: 7,
    BODY: {
        ACCELERATION: .95 * base.ACCEL,
        SPEED: .95 * base.SPEED
    },
    GUNS: [{
        POSITION: [17, 3, 1, 0, -4.5, -7, .334],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 3, 1, 0, 4.5, 7, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [24, 7, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.hunter2]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [21, 10, 1, 0, 0, 0, 0.2],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter]),
            TYPE: exports.bullet
        },
    }]
};
exports.beekeeper = {
    PARENT: [exports.genericTank],
    LABEL: "Beekeeper",
    DANGER: 7,
    BODY: {
        ACCELERATION: .95 * base.ACCEL,
        SPEED: .95 * base.SPEED
    },
    GUNS: [{
        POSITION: [14, 3, 1, 0, -6, -7, .334],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.minishotSmall]),
            TYPE: exports.bee
        }
    }, {
        POSITION: [14, 3, 1, 0, 6, 7, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.minishotSmall]),
            TYPE: exports.bee
        }
    }, {
        POSITION: [19, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotMain, g.pound]),
            TYPE: exports.bullet
        }
    }]
};
exports.mortar = {
    PARENT: [exports.genericTank],
    LABEL: "Mortar",
    DANGER: 7,
    BODY: {
        ACCELERATION: .85 * base.ACCEL,
        SPEED: .85 * base.SPEED
    },
    GUNS: [{
        POSITION: [13, 3, 1, 0, -8, -7, .6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall, g.harasserSmall]),
            TYPE: exports.bullet,
            LABEL: "Secondary"
        }
    }, {
        POSITION: [13, 3, 1, 0, 8, 7, .8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall, g.harasserSmall]),
            TYPE: exports.bullet,
            LABEL: "Secondary"
        }
    }, {
        POSITION: [17, 3, 1, 0, -6, -7, .2],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall, g.harasserSmall]),
            TYPE: exports.bullet,
            LABEL: "Secondary"
        }
    }, {
        POSITION: [17, 3, 1, 0, 6, 7, .4],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall, g.harasserSmall]),
            TYPE: exports.bullet,
            LABEL: "Secondary"
        }
    }, {
        POSITION: [19, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.minishotMain, g.pound]),
            TYPE: exports.bullet,
            LABEL: "Heavy"
        }
    }]
};
exports.harasser = {
    PARENT: [exports.genericTank],
    LABEL: "Harasser",
    DANGER: 6,
    BODY: {
        SPEED: .95 * base.SPEED
    },
    GUNS: [{
        POSITION: [13, 2, 1, 0, -5.5, -7, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall, g.harasserSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [13, 2, 1, 0, 5.5, 7, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall, g.harasserSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 2, 1, 0, -4, -7, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall, g.harasserSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 2, 1, 0, 4, 7, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall, g.harasserSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotMain]),
            TYPE: exports.bullet
        }
    }]
};
exports.bully = {
    PARENT: [exports.genericTank],
    LABEL: "Bully",
    DANGER: 7,
    BODY: {
        SPEED: .775 * base.SPEED
    },
    GUNS: [{
        POSITION: [9, 2, 1, 0, -8, -7, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall, g.harasserSmall, g.harasserSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [9, 2, 1, 0, 8, 7, 1 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall, g.harasserSmall, g.harasserSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [13, 2, 1, 0, -6, -7, 2 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall, g.harasserSmall, g.harasserSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [13, 2, 1, 0, 6, 7, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall, g.harasserSmall, g.harasserSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 2, 1, 0, -4, -7, 4 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall, g.harasserSmall, g.harasserSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 2, 1, 0, 4, 7, 5 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall, g.harasserSmall, g.harasserSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotMain]),
            TYPE: exports.bullet
        }
    }]
};
exports.recruit = {
    PARENT: [exports.genericTank],
    LABEL: "Recruit",
    DANGER: 6,
    BODY: {
        SPEED: .95 * base.SPEED
    },
    GUNS: [{
        POSITION: [16, 2, 1, 0, -5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 2, 1, 0, 5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotMain]),
            TYPE: exports.bullet
        }
    }]
};
exports.gunnary = {
    PARENT: [exports.genericTank],
    LABEL: "Gunnary",
    DANGER: 7,
    BODY: {
        SPEED: .85 * base.SPEED
    },
    GUNS: [{
        POSITION: [17, 3, 1, 0, -7, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 3, 1, 0, 7, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotMain, g.pound]),
            TYPE: exports.bullet
        }
    }]
};
exports.militia = {
    PARENT: [exports.genericTank],
    LABEL: "Militia",
    DANGER: 7,
    BODY: {
        SPEED: .85 * base.SPEED
    },
    GUNS: [{
        POSITION: [13, 2, 1, 0, -7, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall, g.harasserSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [13, 2, 1, 0, 7, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall, g.harasserSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 2, 1, 0, -5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall, g.harasserSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 2, 1, 0, 5, 0, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotSmall, g.harasserSmall]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minishotMain]),
            TYPE: exports.bullet
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
exports.anni = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    BODY: {
        ACCELERATION: .8 * base.ACCEL
    },
    LABEL: "Annihilator",
    GUNS: [{
        POSITION: [20, 20, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.destroy, g.anni]),
            TYPE: exports.bullet
        }
    }]
};
exports.decimator = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    BODY: {
        ACCELERATION: .8 * base.ACCEL
    },
    LABEL: "Decimator",
    GUNS: [{
        POSITION: [10, 26, .5, -4, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.destroy, g.anni, g.decim, g.fake]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 26, 1, 4, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.destroy, g.anni, g.decim]),
            TYPE: exports.bullet
        }
    }]
};
exports.supremeAnni = {
    PARENT: [exports.genericTank],
    LABEL: 'Thot Destroyer',
    DANGER: 7,
    BODY: {
        ACCELERATION: base.ACCEL * .6,
        SPEED: base.SPEED * .9
    },
    GUNS: [{
        POSITION: [42, 19.5, 3, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.destroyerDominator, [1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }]
};
exports.boxer = {
    PARENT: [exports.genericTank],
    LABEL: "Boxer",
    DANGER: 6,
    GUNS: [{
        POSITION: [19, 11, 1, 0, 0, 0, 0],
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
exports.eagle = {
    PARENT: [exports.genericTank],
    LABEL: "Eagle",
    DANGER: 7,
    BODY: {
        SPEED: .8 * base.SPEED
    },
    GUNS: [{
        POSITION: [19, 11, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.boxerfront]),
            TYPE: exports.bullet,
            ALT_FIRE: true
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 150, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.accelerator]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 210, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.accelerator]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 180, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.accelerator]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }]
};
exports.falcon = {
    PARENT: [exports.genericTank],
    LABEL: "Falcon",
    DANGER: 7,
    BODY: {
        ACCELERATION: .8 * base.ACCEL,
        FOV: 1.2 * base.FOV
    },
    GUNS: [{
        POSITION: [27, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.assassin, g.boxerfront]),
            TYPE: exports.bullet,
            LABEL: "Assassin",
            ALT_FIRE: true
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 150, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.accelerator]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 210, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.accelerator]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 180, .6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.accelerator]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }]
};
exports.taser = {
    PARENT: [exports.genericTank],
    LABEL: "Taser",
    DANGER: 7,
    BODY: {
        ACCELERATION: .9 * base.ACCEL,
        FOV: 1.2 * base.FOV
    },
    GUNS: [{
        POSITION: [22, 7.5, -1.5, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.taser]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 8, -1.5, 0, 0, 0, .333],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.taser]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8.5, -1.5, 0, 0, 0, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.taser]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 150, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.accelerator]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 210, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.accelerator]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 180, .6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.accelerator]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }]
}
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
    }, {
        POSITION: [19, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.fake, g.norecoil]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5, 12, -1.2, 7.5, 0, 0, 0,],
    }]
};
exports.shotgun = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    LABEL: 'Shotgun',
    BODY: {
        ACCELERATION: base.ACCEL * 0.75,
    },
    GUNS: [{
        POSITION: [4, 3, 1, 11, -3, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [4, 3, 1, 11, 3, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [4, 4, 1, 13, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [1, 4, 1, 12, -1, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [1, 4, 1, 11, 1, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [1, 3, 1, 13, -1, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [1, 3, 1, 13, 1, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [1, 2, 1, 13, 2, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [1, 2, 1, 13, -2, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [15, 14, 1, 6, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun, g.fake, g.norecoil]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [8, 14, -1.3, 4, 0, 0, 0],
    }]
};
exports.heavyShotgun = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    LABEL: 'Heavy Shotgun',
    BODY: {
        ACCELERATION: base.ACCEL * 0.75,
    },
    GUNS: [{
        POSITION: [4, 3, 1, 11, -3, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [4, 3, 1, 11, 3, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [4, 3, 1, 11, -3, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [4, 4, 1, 13, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [1, 4, 1, 12, -1, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [1, 4, 1, 11, 1, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [4, 4, 1, 13, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [1, 3, 1, 13, -1, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [1, 3, 1, 13, 1, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [1, 2, 1, 13, 2, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [1, 2, 1, 13, -2, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [1, 2, 1, 13, 2, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [1, 2, 1, 13, -2, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [16, 14, 1, 6, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun, g.fake, g.norecoil]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [10, 14, -1.3, 4, 0, 0, 0],
    }]
};
exports.musketeer = {
    PARENT: [exports.genericTank],
    LABEL: 'Musketeer',
    GUNS: [{
        POSITION: [18, 4, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.multishot, g.musketeer]),
            TYPE: exports.trap
        }
    }, {
        POSITION: [18, 4.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.multishot, g.musketeer]),
            TYPE: exports.trap
        }
    }, {
        POSITION: [18, 2.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.multishot, g.musketeer]),
            TYPE: exports.trap
        }
    }, {
        POSITION: [18, 3, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.multishot, g.musketeer]),
            TYPE: exports.trap
        }
    }, {
        POSITION: [18, 3.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.multishot, g.musketeer]),
            TYPE: exports.trap
        }
    }, {
        POSITION: [18, 2, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.multishot, g.musketeer]),
            TYPE: exports.trap
        }
    }, {
        POSITION: [16, 4, 1, 0, -3, 0, 0]
    }, {
        POSITION: [16, 4, 1, 0, 3, 0, 0]
    }, {
        POSITION: [7.5, 6, -1.4, 7, 0, 180, 0]
    }, {
        POSITION: [4, 13, 1.5, 16, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.multishot, g.musketeer, g.fake]),
            TYPE: exports.trap
        }
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
exports.master = {
    PARENT: [exports.genericTank],
    LABEL: "Master",
    STAT_NAMES: statnames.drone,
    DANGER: 7,
    BODY: {
        ACCELERATION: base.ACCEL * 0.75,
        FOV: base.FOV * 1.15
    },
    FACING_TYPE: 'autospin',
    GUNS: [{
        POSITION: [6, 12, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.master]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            MAX_CHILDREN: 6
        }
    }, {
        POSITION: [6, 12, 1.2, 8, 0, 120, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.master]),
            TYPE: exports.autodrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            MAX_CHILDREN: 6
        }
    }, {
        POSITION: [6, 12, 1.2, 8, 0, 240, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.master]),
            TYPE: exports.autodrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            MAX_CHILDREN: 6
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.fake, g.norecoil]),
            TYPE: exports.homingBullet
        }
    }]
};
exports.heatwave = {
    PARENT: [exports.genericTank],
    LABEL: "Heatwave",
    DANGER: 6,
    GUNS: [{
        POSITION: [12, 10, 1.4, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.heatwave]),
            TYPE: exports.homingBullet
        }
    }, {
        POSITION: [3, 15, 1.3, 18, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.heatwave, g.fake, g.norecoil]),
            TYPE: exports.homingBullet
        }
    }]
};
exports.feverGear = {
    PARENT: [exports.turretParent],
    LABEL: "Gear",
    INDEPENDENT: true,
    CONTROLLERS: ['spin'],
    DANGER: -1,
    GUNS: []
};
for (let i = 0; i < 4; i++) exports.feverGear.GUNS.push({
    POSITION: [15, 8, 1, 0, 0, 90 * i, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.feverDream]),
        TYPE: [exports.homingBullet, {
            PERSISTS_AFTER_DEATH: true
        }],
        AUTOFIRE: true,
    }
}, {
    POSITION: [2, 11, 1.3, 15, 0, 90 * i, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.feverDream, g.fake, g.norecoil]),
        TYPE: [exports.homingBullet, {
            PERSISTS_AFTER_DEATH: true
        }],
        AUTOFIRE: true,
    },
});
exports.feverDream = {
    PARENT: [exports.genericTank],
    LABEL: "Fever Dream",
    DANGER: 7,
    GUNS: [{
        POSITION: [12, 10, 1.4, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.heatwave]),
            TYPE: exports.homingBullet
        }
    }, {
        POSITION: [3, 15, 1.3, 18, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.heatwave, g.fake, g.norecoil]),
            TYPE: exports.homingBullet
        }
    }],
    TURRETS: [{
        POSITION: [10, 0, 0, 0, 360, 1],
        TYPE: exports.feverGear
    }],
};
exports.flycatcher = {
    PARENT: [exports.genericTank],
    LABEL: "Flycatcher",
    DANGER: 6,
    GUNS: [{
        POSITION: [24, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.flycatcher]),
            TYPE: exports.homingBullet
        }
    }, {
        POSITION: [3, 15, 1.3, 24, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.flycatcher, g.fake, g.norecoil]),
            TYPE: exports.homingBullet
        }
    }]
};
exports.homingFlareBullet = {
    PARENT: [exports.homingBullet],
    GUNS: [{
        POSITION: [0, 10, 1, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flyswatterFlare]),
            AUTOFIRE: true,
            TYPE: exports.flareBullet
        }
    },],
};
exports.flyswatter = {
    PARENT: [exports.genericTank],
    LABEL: "Flyswatter",
    DANGER: 7,
    GUNS: [{
        POSITION: [12, 8, 1.4, 0, 3, 0, 0],
    }, {
        POSITION: [24, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.flycatcher]),
            TYPE: exports.homingFlareBullet
        }
    }, {
        POSITION: [4, 13, 0.5, 26, 0, 0, 0],
    }, {
        POSITION: [3, 15, 1.3, 24, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.flycatcher, g.fake, g.norecoil]),
            TYPE: exports.homingBullet
        }
    },]
};
exports.pyramid = {
    PARENT: [exports.genericTank],
    LABEL: "Pyramid",
    DANGER: 7,
    GUNS: [{
        POSITION: [24, 7.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.pyramid]),
            TYPE: exports.homingBullet
        }
    }, {
        POSITION: [3, 9, 1.3, 24, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.pyramid, g.fake, g.norecoil]),
            TYPE: exports.homingBullet
        }
    }, {
        POSITION: [18, 7.5, 1, 0, 0, 0, 0.25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.pyramid]),
            TYPE: exports.homingBullet
        }
    }, {
        POSITION: [3, 12, 1.3, 18, 0, 0, 0.25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.pyramid, g.fake, g.norecoil]),
            TYPE: exports.homingBullet
        }
    }, {
        POSITION: [12, 7.5, 1, 0, 0, 0, 0.50],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.pyramid]),
            TYPE: exports.homingBullet
        }
    }, {
        POSITION: [3, 15, 1.3, 12, 0, 0, 0.50],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.pyramid, g.fake, g.norecoil]),
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.twin, g.presser, g.fake, g.norecoil]),
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.pound, g.fake, g.norecoil]),
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
exports.mindController = {
    PARENT: [exports.genericTank],
    LABEL: "Mind Controller",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        ACCELERATION: .75 * base.ACCEL,
        SPEED: .9 * base.SPEED
    },
    TOOLTIP: "Right-Click to extend your drones' operational range",
    GUNS: [{
        POSITION: [6, 12, 1.2, 8, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overlord]),
            TYPE: exports.autodrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 2
        }
    }, {
        POSITION: [6, 12, 1.2, 8, 0, 270, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overlord]),
            TYPE: exports.autodrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 2
        }
    }, {
        POSITION: [6, 12, 1.2, 8, 0, 0, 0],
        LAUNCH_SQUADRON: "yes",
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overlord]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 6
        }
    }, {
        POSITION: [0, 0, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.fake]),
            TYPE: exports.bullet,
            ALT_FIRE: true,
            ON_SHOOT: "mindController"
        }
    }]
};
exports.cartographer = {
    PARENT: [exports.genericTank],
    LABEL: "Cartographer",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        ACCELERATION: .75 * base.ACCEL,
        SPEED: .85 * base.SPEED
    },
    MAX_CHILDREN: 12,
    GUNS: [{
        POSITION: [6, 12, 1.2, 8, 0, 60, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overlord, g.cartographer]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6, 12, 1.2, 8, 0, 180, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overlord, g.cartographer]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6, 12, 1.2, 8, 0, 300, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overlord, g.cartographer]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6, 12, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overlord, g.cartographer]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6, 12, 1.2, 8, 0, 120, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overlord, g.cartographer]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6, 12, 1.2, 8, 0, 240, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overlord, g.cartographer]),
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
exports.triple = {
    PARENT: [exports.genericTank],
    LABEL: "Triple",
    DANGER: 7,
    GUNS: [{
        POSITION: [20, 8, 1, 0, 5.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.double, g.triple]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 8, 1, 0, -5.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.double, g.triple]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 8, 1, 0, 5.5, 120, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.double, g.triple]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 8, 1, 0, -5.5, 120, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.double, g.triple]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 8, 1, 0, 5.5, 240, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.double, g.triple]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 8, 1, 0, -5.5, 240, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.double, g.triple]),
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
exports.caltrop = makeFlank(exports.builder, 4, "Caltrop", {
    stats: [g.quadtrap],
    length: .75,
    width: .6
});
exports.conq = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    LABEL: "Conqueror",
    STAT_NAMES: statnames.trap,
    BODY: {
        SPEED: .85 * base.SPEED
    },
    TOOLTIP: "Right-Click to fire your rear barrel",
    GUNS: [{
        POSITION: [21, 14, 1, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.destroy]),
            TYPE: exports.bullet,
            ALT_FIRE: true
        }
    }, {
        POSITION: [18, 12, 1, 0, 0, 0, 0]
    }, {
        POSITION: [2, 12, 1.1, 18, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block]),
            TYPE: exports.block
        }
    }]
}
exports.engineer = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    LABEL: 'Engineer',
    STAT_NAMES: statnames.trap,
    BODY: {
        SPEED: base.SPEED * 0.75,
        FOV: base.FOV * 1.15,
    },
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [5, 11, 1, 10.5, 0, 0, 0,],
    }, {
        POSITION: [3, 14, 1, 15.5, 0, 0, 0,],
    }, {
        POSITION: [2, 14, 1.3, 18, 0, 0, 0,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.engineer]),
            TYPE: exports.pillbox,
            SYNCS_SKILLS: true,
            DESTROY_OLDEST_CHILD: true,
            MAX_CHILDREN: 8
        },
    }, {
        POSITION: [4, 14, 1, 8, 0, 0, 0,]
    }],
};
exports.construct = {
    PARENT: [exports.genericTank],
    LABEL: "Constructor",
    STAT_NAMES: statnames.trap,
    DANGER: 7,
    BODY: {
        ACCELERATION: .6 * base.ACCEL,
        SPEED: .8 * base.SPEED,
        FOV: 1.15 * base.FOV
    },
    GUNS: [{
        POSITION: [18, 18, 1, 0, 0, 0, 0]
    }, {
        POSITION: [2, 18, 1.2, 18, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.construct]),
            TYPE: exports.block
        }
    }]
};
exports.producer = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    LABEL: "Producer",
    STAT_NAMES: statnames.trap,
    BODY: {
        SPEED: .8 * base.SPEED,
        FOV: 1.25 * base.FOV
    },
    GUNS: [{
        POSITION: [20, 12, 1, 0, 0, 0, 0]
    }, {
        POSITION: [2, 12, 1.1, 20, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.producer]),
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
exports.acid = {
    PARENT: [exports.poisonParent],
    LABEL: "Acid",
    BODY: {
        ACCELERATION: base.ACCEL * 0.7,
        FOV: base.FOV * 1.2
    },
    GUNS: [{
        POSITION: [24, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper]),
            TYPE: exports.acidBullet,
        }
    }, {
        POSITION: [14, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            COLOR: 25
        }
    }]
};
exports.acidTrapper = {
    PARENT: [exports.poisonParent],
    LABEL: "Acid Trapper",
    DANGER: 5,
    GUNS: [{
        POSITION: [13, 8, 1, 0, 0, 0, 0]
    }, {
        POSITION: [14, 6.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            COLOR: 25
        }
    }, {
        POSITION: [3, 8, 1.7, 13, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap]),
            TYPE: exports.acidTrap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }]
};
exports.coronavirus = {
    PARENT: [exports.poisonParent],
    LABEL: "Coronavirus",
    DANGER: 7,
    GUNS: [{
        POSITION: [22, 5, 1, 0, 0, 0, 0,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.contagi, g.virus]),
            TYPE: exports.acidBullet
        }
    }, {
        POSITION: [18, 3, 1, 0, 0, 0, 0,],
        PROPERTIES: {
            COLOR: 25
        }
    }, {
        POSITION: [13, 8, 1, 0, 0, 0, 0]
    } ,{
        POSITION: [14, 6.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            COLOR: 25
        }
    } ,{
        POSITION: [3, 8, 1.7, 13, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap]),
            TYPE: exports.acidTrap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }]
};
exports.disintegrator = {
    PARENT: [exports.poisonParent],
    LABEL: "Disintegrator",
    BODY: {
        ACCELERATION: base.ACCEL * 0.7,
        FOV: base.FOV * 1.2
    },
    GUNS: [{
        POSITION: [24, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper]),
            TYPE: exports.strongAcidBullet,
        }
    }, {
        POSITION: [16, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            COLOR: 25
        }
    }, {
        POSITION: [13, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            COLOR: 25
        }
    }]
};
exports.mercury = {
    PARENT: [exports.poisonParent],
    LABEL: "Mercury",
    BODY: {
        ACCELERATION: base.ACCEL * 0.7,
        FOV: base.FOV * 1.2
    },
    GUNS: [{
        POSITION: [24, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper]),
            TYPE: exports.longAcidBullet,
        }
    }, {
        POSITION: [17, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            COLOR: 25
        }
    }]
};
exports.chiller = {
    PARENT: [exports.iceParent],
    LABEL: "Chiller",
    BODY: {
        ACCELERATION: base.ACCEL * 0.7,
        FOV: base.FOV * 1.2
    },
    GUNS: [{
        POSITION: [24, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper]),
            TYPE: exports.freezeBullet,
        }
    }, {
        POSITION: [14, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            COLOR: 26
        }
    }]
};
exports.chillbrid = {
    PARENT: [exports.iceParent],
    LABEL: "Chillbrid",
    BODY: {
        ACCELERATION: base.ACCEL * 0.7,
        FOV: base.FOV * 1.2
    },
    GUNS: [{
        POSITION: [24, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper]),
            TYPE: exports.freezeBullet,
        }
    }, {
        POSITION: [6, 11, 1.2, 7, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.weak]),
            TYPE: exports.autodrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 2
        }
    }, {
        POSITION: [14, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            COLOR: 26
        }
    }]
};
exports.autochilldrone = createEffectBullet("ice", {
    parent: exports.autodrone
});
exports.mortalChill = {
    PARENT: [exports.iceParent],
    LABEL: "Mortal Chill",
    BODY: {
        ACCELERATION: base.ACCEL * 0.7,
        FOV: base.FOV * 1.2
    },
    GUNS: [{
        POSITION: [24, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper]),
            TYPE: exports.freezeBullet,
        }
    }, {
        POSITION: [6, 11, 1.2, 7, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.weak]),
            TYPE: exports.autochilldrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 2
        }
    }, {
        POSITION: [14, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            COLOR: 26
        }
    }, {
        POSITION: [14, 5, 1, 0, 0, 180, 0],
        PROPERTIES: {
            COLOR: 26
        }
    }]
};
exports.overchiller = {
    PARENT: [exports.iceParent],
    LABEL: "Overchill",
    BODY: {
        ACCELERATION: base.ACCEL * 0.7,
        FOV: base.FOV * 1.2
    },
    GUNS: [{
        POSITION: [24, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper]),
            TYPE: exports.freezeBullet,
        }
    }, {
        POSITION: [14, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            COLOR: 26
        }
    }, {
        POSITION: [6, 11, 1.2, 7, 0, 125, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.weak]),
            TYPE: exports.autodrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 2
        }
    }, {
        POSITION: [6, 11, 1.2, 7, 0, 235, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.weak]),
            TYPE: exports.autodrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 2
        }
    }]
};
exports.enigma = {
    PARENT: [exports.iceParent],
    LABEL: "Enigma",
    BODY: {
        ACCELERATION: base.ACCEL * 0.7,
        FOV: base.FOV * 1.2
    },
    GUNS: [{
        POSITION: [24, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper]),
            TYPE: exports.confusBullet,
        }
    }, {
        POSITION: [14, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            COLOR: 17
        }
    }]
};
exports.paralyzer = {
    PARENT: [exports.iceParent],
    LABEL: "Paralyzer",
    BODY: {
        ACCELERATION: base.ACCEL * 0.7,
        FOV: base.FOV * 1.2
    },
    GUNS: [{
        POSITION: [24, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper]),
            TYPE: exports.strongFreezeBullet,
        }
    }, {
        POSITION: [16, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            COLOR: 26
        }
    }, {
        POSITION: [13, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            COLOR: 26
        }
    }]
};
exports.blizzard = {
    PARENT: [exports.iceParent],
    LABEL: "Blizzard",
    BODY: {
        ACCELERATION: base.ACCEL * 0.7,
        FOV: base.FOV * 1.2
    },
    GUNS: [{
        POSITION: [24, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper]),
            TYPE: exports.longFreezeBullet,
        }
    }, {
        POSITION: [17, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            COLOR: 26
        }
    }]
};
exports.frostbite = {
    PARENT: [exports.genericTank],
    LABEL: "Frostbite",
    BODY: {
        ACCELERATION: base.ACCEL * 0.7,
        FOV: base.FOV * 1.2
    },
    GUNS: [{
        POSITION: [24, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper]),
            TYPE: exports.acidFreezeBullet,
        }
    }, {
        POSITION: [16, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            COLOR: 26
        }
    }, {
        POSITION: [13, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            COLOR: 25
        }
    }],
    TURRETS: [{
        POSITION: [25, 0, 0, 0, 360, 0],
        TYPE: exports.poisonHue
    }, {
        POSITION: [25, 0, 0, 0, 360, 0],
        TYPE: exports.iceHue
    }]
};
exports.sniperFlareBullet = {
    PARENT: [exports.bullet],
    GUNS: [{
        POSITION: [0, 10, 1, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flyswatterFlare]),
            AUTOFIRE: true,
            TYPE: exports.flareBullet
        }
    },],
};
exports.fume = {
    PARENT: [exports.genericTank],
    LABEL: "Fume",
    DANGER: 5,
    BODY: {
        ACCELERATION: .8 * base.ACCEL,
        FOV: 1.25 * base.FOV
    },
    GUNS: [ {
        POSITION: [34, 8.5, 1, -12, -1.5, 0, 0],
    }, {
        POSITION: [8, 8, 1.4, 8, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.backFlare]),
            TYPE: exports.flareBullet
        }
    }, {
        POSITION: [24, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper]),
            TYPE: exports.sniperFlareBullet
        }
    }]
};
exports.fumigator = {
    PARENT: [exports.genericTank],
    LABEL: "Fumigator",
    DANGER: 5,
    BODY: {
        ACCELERATION: .8 * base.ACCEL,
        FOV: 1.25 * base.FOV
    },
    GUNS: [ {
        POSITION: [34, 8.5, 1, -12, -1.5, 0, 0],
    }, {
        POSITION: [7, 8, 1.4, 0, -15, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.backFlare]),
            TYPE: exports.flareBullet
        }
    }, {
        POSITION: [7, 8, 1.4, 0, 15, -90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.backFlare]),
            TYPE: exports.flareBullet
        }
    }, {
        POSITION: [8, 8, 1.4, 8, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.backFlare]),
            TYPE: exports.flareBullet
        }
    }, {
        POSITION: [24, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper]),
            TYPE: exports.sniperFlareBullet
        }
    }]
};
exports.zamboni = {
    PARENT: [exports.iceParent],
    LABEL: "Zamboni",
    DANGER: 5,
    BODY: {
        ACCELERATION: .8 * base.ACCEL,
        FOV: 1.25 * base.FOV
    },
    GUNS: [ {
        POSITION: [15, 8.5, 1, -12, -1.5, 0, 0],
    }, {
        POSITION: [8, 8, 1.4, 8, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.backFlare]),
            TYPE: exports.iceFlareBullet
        }
    }, {
        POSITION: [20, 10.5, 1, 0, 0, 0, 0]
    }, {
        POSITION: [24, 7, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.rifle]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [14, 5, 1, 0, 0, 180, 0],
        PROPERTIES: {
            COLOR: 26
        }
    }]
};
exports.acidFlareBullet = {
    PARENT: [exports.acidBullet],
    GUNS: [{
        POSITION: [0, 10, 1, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flyswatterFlare]),
            AUTOFIRE: true,
            TYPE: exports.flareBullet
        }
    },],
};
exports.smoker = {
    PARENT: [exports.poisonParent],
    LABEL: "Smoker",
    DANGER: 6,
    BODY: {
        ACCELERATION: .8 * base.ACCEL,
        FOV: 1.25 * base.FOV
    },
    GUNS: [ {
        POSITION: [34, 8.5, 1, -12, -1.5, 0, 0],
    }, {
        POSITION: [8, 8, 1.4, 8, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.backFlare]),
            TYPE: exports.flareBullet
        }
    }, {
        POSITION: [24, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper]),
            TYPE: exports.acidFlareBullet
        }
    }, {
        POSITION: [14, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            COLOR: 25
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
exports.stalker = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    LABEL: "Stalker",
    BODY: {
        ACCELERATION: .75 * base.ACCEL,
        FOV: 1.4 * base.FOV
    },
    INVISIBLE: [.2, .05],
    TOOLTIP: "Stay still to turn invisible",
    GUNS: [{
        POSITION: [28, 8.5, -1.5, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.assassin, [1, .5, 1, .9, 1, 1, 1.1, 1.1, 1, 1, 1, 1, 1.2]]),
            TYPE: exports.bullet,
            SKIN: 4
        }
    }]
};
exports.ranger = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    LABEL: "Ranger",
    BODY: {
        ACCELERATION: .75 * base.ACCEL,
        FOV: 1.5 * base.FOV
    },
    GUNS: [{
        POSITION: [27, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.assassin, g.ranger]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6, 8.5, -1.6, 7.8, 0, 0, 0,],
    }]
};
exports.warden = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    LABEL: "Warden",
    BODY: {
        ACCELERATION: .75 * base.ACCEL,
        FOV: 1.8 * base.FOV
    },
    GUNS: [{
        POSITION: [31, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.assassin, g.warden]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6, 8.5, -1.6, 7.8, 0, 0, 0,],
    }]
};
exports.railgun = {
    PARENT: [exports.genericTank],
    DANGER: 6,
    LABEL: 'Railgun',
    BODY: {
        ACCELERATION: base.ACCEL * .6,
        SPEED: base.SPEED * .85,
        FOV: base.FOV * 1.35,
    },
    GUNS: [{
        POSITION: [35, 1.8, 1.01, 0, 5, 0, 0],
    }, {
        POSITION: [35, 1.8, 1.01, 0, -5, 0, 0],
    }, {
        POSITION: [0.9, 8, 1.01, 12, 0, 0, 0.05],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.assassin, g.railgun, g.fake]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [0.9, 8, 1.01, 16, 0, 0, 0.1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.assassin, g.railgun, g.fake]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [0.9, 8, 1.01, 20, 0, 0, 0.15],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.assassin, g.railgun, g.fake]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [0.9, 8, 1.01, 24, 0, 0, 0.2],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.assassin, g.railgun, g.fake]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [0.9, 8, 1.01, 28, 0, 0, 0.25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.assassin, g.railgun, g.fake]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [0.9, 8, 1.01, 32, 0, 0, 0.3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.assassin, g.railgun, g.fake]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [0.9, 8, 1.01, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.assassin, g.railgun]),
            TYPE: exports.bullet
        },
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
        POSITION: [5, 8.5, -1.6, 7.8, 0, 0, 0,],
    }]
};
exports.puncher = {
    PARENT: [exports.genericTank],
    LABEL: "Puncher",
    DANGER: 7,
    BODY: {
        ACCELERATION: .825 * base.ACCEL,
        FOV: 1.175 * base.FOV
    },
    GUNS: [{
        POSITION: [24, 5.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.click, g.punch]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [24, 5.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.click, g.punch]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [24, 5.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.click, g.punch]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [24, 5.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.click, g.punch]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6, 8.5, -1.6, 7.8, 0, 0, 0,],
    }]
};
exports.jabber = {
    PARENT: [exports.genericTank],
    LABEL: "Jabber",
    DANGER: 7,
    BODY: {
        ACCELERATION: .825 * base.ACCEL,
        FOV: 1.175 * base.FOV
    },
    GUNS: [{
        POSITION: [24, 6, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.click, g.punch, g.jab]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [24, 6, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.click, g.punch, g.jab]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [24, 6, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.click, g.punch, g.jab]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [24, 6, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.click, g.punch, g.jab]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [7, 9, -1.6, 7.3, 0, 0, 0, ],
    }]
};
exports.hunter = {
    PARENT: [exports.genericTank],
    LABEL: 'Hunter',
    DANGER: 6,
    BODY: {
        ACCELERATION: base.ACCEL * .9,
        FOV: base.FOV * 1.3
    },
    GUNS: [{
        POSITION: [24, 7, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.hunter2]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [21, 10, 1, 0, 0, 0, 0.2],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter]),
            TYPE: exports.bullet
        },
    }]
};
exports.predator = {
    PARENT: [exports.genericTank],
    LABEL: 'Predator',
    DANGER: 7,
    BODY: {
        ACCELERATION: base.ACCEL * .9,
        FOV: base.FOV * 1.4
    },
    SCOPE: true,
    TOOLTIP: "Right-Click to move your camera to your mouse",
    GUNS: [{
        POSITION: [24, 7, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.hunter2, g.predator]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [21, 10, 1, 0, 0, 0, 0.15],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.hunter2, g.predator]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [18, 13, 1, 0, 0, 0, 0.3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.predator]),
            TYPE: exports.bullet
        },
    }]
};
exports.aggressor = {
    PARENT: [exports.genericTank],
    LABEL: 'Aggressor',
    DANGER: 7,
    BODY: {
        ACCELERATION: base.ACCEL * .9,
        FOV: base.FOV * 1.4
    },
    SCOPE: true,
    TOOLTIP: "Right-Click to move your camera to your mouse",
    GUNS: [{
        POSITION: [22, 3, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.hunter2, g.predator, g.aggressor]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20.5, 5.5, 1, 0, 0, 0, 1 / 12],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.hunter2, g.predator, g.aggressor]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 8, 1, 0, 0, 0, 2 / 12],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.hunter2, g.predator, g.aggressor]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17.5, 10.5, 1, 0, 0, 0, 3 / 12],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.hunter2, g.predator, g.aggressor]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 13, 1, 0, 0, 0, 4 / 12],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.hunter2, g.predator, g.aggressor]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [14.5, 15.5, 1, 0, 0, 0, 5 / 12],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.hunter2, g.predator, g.aggressor]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [13, 18, 1, 0, 0, 0, 0]
    }]
};
exports.dual = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    LABEL: "Dual",
    BODY: {
        ACCELERATION: base.ACCEL * .95,
        FOV: base.FOV * 1.3,
        HEALHT: base.HEALTH * .975
    },
    GUNS: [{
        POSITION: [20, 5, 1, 0, 5.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.hunter, g.hunter2, g.dual]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 5, 1, 0, -5.5, 0, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.hunter, g.hunter2, g.dual]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 7.5, 1, 0, 5.5, 0, 0.1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.hunter, g.dual]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 7.5, 1, 0, -5.5, 0, 0.6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.hunter, g.dual]),
            TYPE: exports.bullet
        }
    }]
};
exports.rifle = {
    PARENT: [exports.genericTank],
    LABEL: "Rifle",
    BODY: {
        ACCELERATION: .7 * base.ACCEL,
        FOV: 1.225 * base.FOV
    },
    GUNS: [{
        POSITION: [20, 10.5, 1, 0, 0, 0, 0]
    }, {
        POSITION: [24, 7, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.rifle]),
            TYPE: exports.bullet
        }
    }]
};
exports.scaler = {
    PARENT: [exports.genericTank],
    LABEL: "Scaler",
    BODY: {
        ACCELERATION: .7 * base.ACCEL,
        FOV: 1.225 * base.FOV
    },
    GUNS: [{
        POSITION: [16, 3, 1, 0, 7.9, 0, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 3, 1, 0, -7.9, 0, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [21, 4, 1, 0, 5.1, 0, .334],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [21, 4, 1, 0, -5.1, 0, .334],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [26, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.rifle]),
            TYPE: exports.bullet
        }
    }]
};
exports.musket = {
    PARENT: [exports.genericTank],
    LABEL: "Musket",
    BODY: {
        ACCELERATION: .7 * base.ACCEL,
        FOV: 1.2 * base.FOV
    },
    GUNS: [{
        POSITION: [15.5, 19.5, 1, 0, 0, 0, 0]
    }, {
        POSITION: [18, 7, 1, 0, 4.15, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.rifle, g.twin]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 7, 1, 0, -4.15, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.rifle, g.twin]),
            TYPE: exports.bullet
        }
    }]
};
exports.blunderbuss = {
    PARENT: [exports.genericTank],
    LABEL: "Blunderbuss",
    DANGER: 7,
    BODY: exports.rifle.BODY,
    GUNS: [{
        POSITION: [13, 4, 1, 0, -3, -9, .3],
        PROPERTIES: {
            TYPE: exports.bullet,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.rifle, g.blunderbuss])
        }
    }, {
        POSITION: [15, 4, 1, 0, -2.5, -6, .2],
        PROPERTIES: {
            TYPE: exports.bullet,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.rifle, g.blunderbuss])
        }
    }, {
        POSITION: [16, 4, 1, 0, -2, -3, .1],
        PROPERTIES: {
            TYPE: exports.bullet,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.rifle, g.blunderbuss])
        }
    }, {
        POSITION: [13, 4, 1, 0, 3, 9, .3],
        PROPERTIES: {
            TYPE: exports.bullet,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.rifle, g.blunderbuss])
        }
    }, {
        POSITION: [15, 4, 1, 0, 2.5, 6, .2],
        PROPERTIES: {
            TYPE: exports.bullet,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.rifle, g.blunderbuss])
        }
    }, {
        POSITION: [16, 4, 1, 0, 2, 3, .1],
        PROPERTIES: {
            TYPE: exports.bullet,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.rifle, g.blunderbuss])
        }
    }, {
        POSITION: [25, 7, 1, 0, 0, 0, 0],
        PROPERTIES: {
            TYPE: exports.bullet,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.rifle])
        }
    }, {
        POSITION: [14, 10.5, 1, 0, 0, 0, 0]
    }]
};
exports.armsman = {
    PARENT: [exports.genericTank],
    LABEL: "Armsman",
    DANGER: 7,
    BODY: exports.rifle.BODY,
    GUNS: [{
        POSITION: [20, 10.5, 1, 0, 0, 0, 0]
    }, {
        POSITION: [24, 7, 1, 0, 0, 0, 0],
        PROPERTIES: {
            TYPE: exports.bullet,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.rifle, g.flank, g.guard])
        }
    }, {
        POSITION: [13, 8.5, 1, 0, 0, 180, 0]
    }, {
        POSITION: [4.5, 8, 1.7, 13, 0, 180, 0],
        PROPERTIES: {
            TYPE: exports.trap,
            SHOOT_SETTINGS: combineStats([g.trap, g.guardtrap])
        }
    }]
};
exports.wagner = {
    PARENT: [exports.genericTank],
    LABEL: "Wagner",
    DANGER: 7,
    BODY: {
        ACCELERATION: .7 * base.ACCEL,
        FOV: 1.225 * base.FOV
    },
    GUNS: [{
        POSITION: [20, 10.5, 1.5, 0, 0, 0, 0]
    }, {
        POSITION: [24, 7, 1.5, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.rifle, g.mach, g.wagner]),
            TYPE: exports.bullet
        }
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
exports.emplacement = {
    PARENT: [exports.genericTank],
    LABEL: 'Emplacement',
    DANGER: 7,
    STAT_NAMES: statnames.generic,
    BODY: {
        FOV: 1.2
    },
    GUNS: [{
        POSITION: [1, 16, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.emplace, g.norecoil]),
            TYPE: exports.emplacementBlock,
            ALT_FIRE: true,
            MAX_CHILDREN: 4,
            DESTROY_OLDEST_CHILD: true,
            SYNCS_SKILLS: true
        }
    }, {
        POSITION: [7, 7.5, .6, 7, 0, 60, 0]
    }, {
        POSITION: [7, 7.5, .6, 7, 0, 180, 0]
    }, {
        POSITION: [7, 7.5, .6, 7, 0, 300, 0]
    }]
};
exports.enforceGear = {
    PARENT: [exports.turretParent],
    CONTROLLERS: ['spin'],
    GUNS: [{
        POSITION: [7, 7.5, .6, 7, 0, 0, 0]
    }, {
        POSITION: [7, 7.5, .6, 7, 0, 120, 0]
    }, {
        POSITION: [7, 7.5, .6, 7, 0, 240, 0]
    }]
};
exports.enforcement = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    LABEL: 'Enforcement',
    GUNS: [{
        POSITION: [15, 14, 1, 6, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.enforce]),
            TYPE: exports.emplacementBlock,
            ALT_FIRE: true,
            MAX_CHILDREN: 2,
            DESTROY_OLDEST_CHILD: true,
            SYNCS_SKILLS: true
        },
    }, {
        POSITION: [15, 14, 1, 6, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.enforce]),
            TYPE: exports.emplacementBlock,
            ALT_FIRE: true,
            MAX_CHILDREN: 2,
            DESTROY_OLDEST_CHILD: true,
            SYNCS_SKILLS: true
        },
    }, {
        POSITION: [15, 14, 1, 6, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.enforce]),
            TYPE: exports.emplacementBlock,
            ALT_FIRE: true,
            MAX_CHILDREN: 2,
            DESTROY_OLDEST_CHILD: true,
            SYNCS_SKILLS: true
        },
    }, {
        POSITION: [8, 14, -1.3, 4, 0, 0, 0]
    }, {
        POSITION: [7, 7.5, .6, 7, 0, 0, 0],
    }],
    TURRETS: [{
        POSITION: [10, 20, 0, 0, 360, 0],
        TYPE: exports.enforceGear,
    }],
};
exports.piston = {
    PARENT: [exports.genericTank],
    LABEL: "Piston",
    DANGER: 7,
    FACING_TYPE: "locksFacing",
    STAT_NAMES: statnames.swarm,
    BODY: {
        ACCELERATION: .8 * base.ACCEL,
        FOV: 1.3 * base.FOV
    },
    GUNS: [{
        POSITION: [7, 7, .6, 6, 5, 205, .33],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.pistonback]),
            TYPE: exports.autoswarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [6.5, 7, .6, 6, -5, 155, .33],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.pistonback]),
            TYPE: exports.autoswarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [8, 7, .6, 6, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.pistonfront]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [13, 8, 1, 0, 0, 180, 0]
    }, {
        POSITION: [4.5, 8, 1.7, 13, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.guardtrap, g.pistontrap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }]
};
exports.battleship = {
    PARENT: [exports.genericTank],
    LABEL: "Battleship",
    DANGER: 7,
    FACING_TYPE: "locksFacing",
    STAT_NAMES: statnames.swarm,
    BODY: {
        ACCELERATION: .9 * base.ACCEL,
        FOV: 1.05 * base.FOV
    },
    GUNS: [{
        POSITION: [7, 7.5, .6, 7, 4, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 7.5, .6, 7, -4, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
            TYPE: exports.autoswarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 7.5, .6, 7, 4, 270, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 7.5, .6, 7, -4, 270, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
            TYPE: exports.autoswarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }]
};
exports.tricruiser = {
    PARENT: [exports.genericTank],
    LABEL: "Tri Cruiser",
    DANGER: 8,
    STAT_NAMES: statnames.swarm,
    BODY: {
        ACCELERATION: .85 * base.ACCEL,
        FOV: 1.05 * base.FOV
    },
    GUNS: [{
        POSITION: [7, 7.5, .6, 7, 4, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.tricruiser]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 7.5, .6, 7, -4, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.tricruiser]),
            TYPE: exports.autoswarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 7.5, .6, 7, 4, 120, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.tricruiser]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 7.5, .6, 7, -4, 120, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.tricruiser]),
            TYPE: exports.autoswarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 7.5, .6, 7, 4, 240, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.tricruiser]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 7.5, .6, 7, -4, 240, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.tricruiser]),
            TYPE: exports.autoswarm,
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
exports.battlecarrier = {
    PARENT: [exports.genericTank],
    LABEL: "Battlecarrier",
    DANGER: 8,
    FACING_TYPE: "locksFacing",
    STAT_NAMES: statnames.swarm,
    BODY: {
        ACCELERATION: .75 * base.ACCEL,
        FOV: 1.2 * base.FOV
    },
    GUNS: [{
        POSITION: [7, 7.5, .6, 7, 2, 40, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier, g.battlecarrier]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 7.5, .6, 7, -2, -40, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier, g.battlecarrier]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 7.5, .6, 7, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier, g.battlecarrier]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 7.5, .6, 7, 2, 180 + 40, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier, g.battlecarrier]),
            TYPE: exports.autoswarm,
            STAT_CALCULATOR: gunCalcNames.autoswarm
        }
    }, {
        POSITION: [7, 7.5, .6, 7, -2, 180 - 40, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier, g.battlecarrier]),
            TYPE: exports.autoswarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 7.5, .6, 7, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier, g.battlecarrier]),
            TYPE: exports.autoswarm,
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
exports.formaldehyde = {
    PARENT: [exports.poisonParent],
    LABEL: "Formaldehyde",
    DANGER: 6,
    BODY: {
        FOV: 1.2
    },
    GUNS: [{
        POSITION: [22, 7.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini]),
            TYPE: exports.acidBullet
        }
    }, {
        POSITION: [20, 7.5, 1, 0, 0, 0, .333],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini]),
            TYPE: exports.acidBullet
        }
    }, {
        POSITION: [18, 7.5, 1, 0, 0, 0, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini]),
            TYPE: exports.acidBullet
        }
    }, {
        POSITION: [14, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            COLOR: 25
        }
    }]
};
exports.twinigun = {
    PARENT: [exports.genericTank],
    LABEL: "Twinigun",
    DANGER: 7,
    BODY: {
        FOV: 1.2
    },
    GUNS: [{
        POSITION: [22, 7.5, 1, 0, -5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.twin, g.twinigun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 7.5, 1, 0, -5, 0, .333],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.twin, g.twinigun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 7.5, 1, 0, -5, 0, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.twin, g.twinigun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [22, 7.5, 1, 0, 5, 0, 1 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.twin, g.twinigun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 7.5, 1, 0, 5, 0, 3 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.twin, g.twinigun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 7.5, 1, 0, 5, 0, 5 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.twin, g.twinigun]),
            TYPE: exports.bullet
        }
    }]
};
exports.streamliner = {
    PARENT: [exports.genericTank],
    LABEL: "Streamliner",
    DANGER: 7,
    BODY: {
        FOV: 1.25
    },
    GUNS: [{
        POSITION: [26, 7.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [24, 7.5, 1, 0, 0, 0, .2],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [22, 7.5, 1, 0, 0, 0, 0.4],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 7.5, 1, 0, 0, 0, .6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 7.5, 1, 0, 0, 0, .8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream]),
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
exports.katyusha = {
    PARENT: [exports.genericTank],
    LABEL: 'Katyusha',
    DANGER: 7,
    BODY: {
        ACCELERATION: base.ACCEL * .9,
        FOV: base.FOV * 1.3
    },
    GUNS: [{
        POSITION: [9, 8.5, -.5, 12, 0, 0, 0]
    }, {
        POSITION: [21, 9.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.hunter, g.hunter2]),
            TYPE: exports.launcherMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [9, 12, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [16, 13, 1, 0, 0, 0, 0.2],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.hunter]),
            TYPE: exports.launcherMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.skimmertrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [14, 6, 1, 0, 2, 230, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.skimmertrail]),
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.skimmertrail, g.hypermissileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [14, 6, 1, 0, 2, 210, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.skimmertrail, g.hypermissileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [14, 6, 1, 0, -2, 90, .5],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.skimmertrail, g.hypermissileTrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [14, 6, 1, 0, 2, 270, .5],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.skimmertrail, g.hypermissileTrail]),
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
            SHOOT_SETTINGS: combineStats([g.swarm, g.missileTrail, g.skimmertrail, g.swampertrail, g.hovertrail]),
            TYPE: [exports.swarm, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [15, 7.5, 0.6, 0, 2, 230, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.swarm, g.missileTrail, g.skimmertrail, g.swampertrail, g.hovertrail]),
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
            SHOOT_SETTINGS: combineStats([g.trap, g.missileTrail, g.skimmertrail, g.pathertrail]),
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
            SHOOT_SETTINGS: combineStats([g.trap, g.missileTrail, g.skimmertrail, g.pathertrail]),
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
exports.sharpenerMissile = {
    PARENT: [exports.homingBullet],
    LABEL: "Missile",
    INDEPENDENT: true,
    FACING_TYPE: "spinMissile",
    GUNS: [{
        POSITION: [15, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.twisterMissileTrail, g.heatseeker]),
            TYPE: [exports.homingBullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            AUTOFIRE: true,
        }
    }, {
        POSITION: [3, 15, 1.3, 15, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.twisterMissileTrail, g.heatseeker, g.fake, g.norecoil]),
            TYPE: [exports.homingBullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            AUTOFIRE: true,
        }
    }, {
        POSITION: [15, 8, 1, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.twisterMissileTrail, g.heatseeker]),
            TYPE: [exports.homingBullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            AUTOFIRE: true,
        }
    }, {
        POSITION: [3, 15, 1.3, 15, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.twisterMissileTrail, g.heatseeker, g.fake, g.norecoil]),
            TYPE: [exports.homingBullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            AUTOFIRE: true,
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.twisterMissileTrail, g.demomantrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [15, 8, 1, 0, 0, 90, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.twisterMissileTrail, g.demomantrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [15, 8, 1, 0, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.twisterMissileTrail, g.demomantrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [15, 8, 1, 0, 0, 270, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.twisterMissileTrail, g.demomantrail]),
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
            SHOOT_SETTINGS: combineStats([g.swarm, g.missileTrail, g.twisterMissileTrail, g.tornadotrail]),
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
            SHOOT_SETTINGS: combineStats([g.swarm, g.missileTrail, g.twisterMissileTrail, g.tornadotrail]),
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
            SHOOT_SETTINGS: combineStats([g.trap, g.missileTrail, g.twisterMissileTrail, g.frontiertrail]),
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
            SHOOT_SETTINGS: combineStats([g.trap, g.missileTrail, g.twisterMissileTrail, g.frontiertrail]),
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
        for (let i = 0; i < 6; i++) {
            output.push({
                POSITION: [50 - (i * 5), 11, 1, 0, 0, 180, 1.5 + (i / 6)],
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
            SHOOT_SETTINGS: combineStats([g.trap, g.missileTrail, g.sidewinderMissileTrail, g.saturntrail]),
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
            SHOOT_SETTINGS: combineStats([g.trap, g.missileTrail, g.sidewinderMissileTrail, g.sidewinderMissileTrail2, g.saturntrail]),
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
            SHOOT_SETTINGS: combineStats([g.swarm, g.missileTrail, g.swampertrail]),
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
            SHOOT_SETTINGS: combineStats([g.trap, g.missileTrail, g.promenadertrail]),
            TYPE: [exports.trap, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
};
exports.catapultlauncherMissile = {
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.catapult2]),
            TYPE: [exports.bullet, {
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
            TYPE: [exports.catapultlauncherMissile, {
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
exports.trebutchetskimmerMissile = {
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.skimmertrail, g.catapult2, g.trebutchet2]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [14, 6, 1, 0, 2, 230, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.skimmertrail, g.catapult2, g.trebutchet2]),
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.skimmer, g.catapultMissile, g.trebutchetMissile]),
            TYPE: [exports.trebutchetskimmerMissile, {
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
    MISSILE: true,
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
exports.triNuke = {
    PARENT: [exports.bullet],
    LABEL: "Container",
    SHAPE: shapeConfig.triShrapnel,
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    MISSILE: true,
    FACING_TYPE: "turnWithSpeed",
    GUNS: (() => {
        let output = [];
        for (let i = 0; i < 3; i++) {
            output.push({
                POSITION: [1, 10, 1, 0, 0, 360 / 3 * i, Infinity],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.pound]),
                    TYPE: [exports.nuke, {
                        PERSISTS_AFTER_DEATH: true
                    }],
                    SHOOT_ON_DEATH: true
                }
            });
        }
        return output;
    })()
};
exports.crockettNuke = {
    PARENT: [exports.bullet],
    LABEL: "Nuke",
    SHAPE: shapeConfig.nuke,
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    MISSILE: true,
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
        for (let i = 0; i < 8; i++) {
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
    MISSILE: true,
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
        for (let i = 0; i < 18; i++) {
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
exports.icbmMissile = {
    PARENT: [exports.bullet],
    LABEL: "Intercontinental Ballistic Missile",
    SHAPE: shapeConfig.icbm,
    INDEPENDENT: true,
    BODY: {
        RANGE: 240
    },
    MISSILE: true,
    GUNS: (() => {
        let output = [{
            POSITION: [1, 4, 1, 0, 0, 0, Infinity],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.bullet, g.explosion, g.pound, g.destroy]),
                TYPE: [exports.explosion, {
                    PERSISTS_AFTER_DEATH: true
                }],
                SHOOT_ON_DEATH: true
            }
        }];
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.skimmer, g.swamper, g.hovercraft]),
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.skimmer, g.promenader, g.pather]),
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
    TOOLTIP: "Right-Click to reverse the spin directions of your missiles",
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
exports.sharpener = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.075 * base.FOV
    },
    LABEL: "Sharpener",
    DANGER: 7,
    GUNS: [{
        POSITION: [17, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.twister]),
            TYPE: exports.sharpenerMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [5.5, 12, -1.3, 6.5, 0, 0, 0]
    }, {
        POSITION: [3, 14, 1.3, 17, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.twister, g.fake, g.norecoil]),
            TYPE: exports.bullet,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.twister, g.demoman]),
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
exports.redistributorBullet = {
    PARENT: [exports.bullet],
    LABEL: 'Stabilizer Bullet',
    SHAPE: -6,
    CONTROLLERS: ['spin'],
    TURRETS: [{
        POSITION: [20.5, 0, 0, 0, 360, 0],
        TYPE: exports.smasherBody
    }, {
        POSITION: [20.5, 0, 0, 120, 360, 0],
        TYPE: exports.smasherBody
    }, {
        POSITION: [20.5, 0, 0, 240, 360, 0],
        TYPE: exports.smasherBody
    }] /*TURRETS: [{       POSITION: [21.5, 0, 0, 0, 360, 0],       TYPE: exports.smasherBody   }]*/
};
exports.redistributor = {
    PARENT: [exports.genericTank],
    LABEL: 'Redistributor',
    DANGER: 7,
    BODY: {
        ACCELERATION: base.ACCEL * .4,
        SPEED: base.SPEED * .705,
        FOV: 1.2
    },
    GUNS: [{
        POSITION: [7.25, 12.25, 1.25, 10, 0, 0, 0]
    }, {
        POSITION: [18.5, 12, 1, 0, 0, 0, .125],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.redistributor]),
            TYPE: exports.redistributorBullet, //WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [9, 12, -1.45, 4, 0, 0, 0]
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.swamper]),
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
    DANGER: 7,
    GUNS: [{
        POSITION: [3, 13, 1.5, 13, 0, 0, 0]
    }, {
        POSITION: [9, 12, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [16, 13, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.promenader]),
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
    LABEL: "Trebutchet",
    DANGER: 8,
    GUNS: [{
        POSITION: [9, 20, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [16, 17, 1.5, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.catapult, g.trebutchet]),
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.shrapnel, g.fake, g.norecoil]),
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
exports.firecracker = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.075 * base.FOV
    },
    LABEL: "Firecracker",
    DANGER: 8,
    GUNS: [{
        POSITION: [8, 9.5, -2.053, 3, 0, 20, 0]
    }, {
        POSITION: [8, 9.5, -2.053, 3, 0, -21, 0]
    }, {
        POSITION: [9, 17, 1, 13, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.shrapnel, g.pound, g.fake, g.norecoil]),
            TYPE: exports.bullet,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [7.5, 19.5, 1, 13, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.shrapnel, g.pound]),
            TYPE: exports.triNuke,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [8, 9.5, 2.053, 5, 0, 0, 0]
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.shrapnel, g.fake, g.norecoil]),
            TYPE: exports.bullet,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [10, 9, -.5, 9, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.shrapnel, g.fake, g.norecoil]),
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
exports.icbm = {
    PARENT: [exports.genericTank],
    BODY: {
        FOV: 1.075 * base.FOV
    },
    LABEL: "ICBM",
    DANGER: 8,
    GUNS: [{
        POSITION: [19.5, 7, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.shrapnel, g.fake, g.norecoil]),
            TYPE: exports.bullet,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [18, 9.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.shrapnel]),
            TYPE: exports.icbmMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [8, 9.5, -1.4, 5, 0, 0, 0]
    }, {
        POSITION: [11.12, 9.5, 1.4, 5, 0, 180, 0]
    }]
};
exports.gunnertrapper = {
    PARENT: [exports.genericTank],
    LABEL: "Gunner Trapper",
    STAT_NAMES: statnames.generic,
    DANGER: 7,
    GUNS: [{
        POSITION: [19, 2, 1, 0, 3, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.guard]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 2, 1, 0, -3, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.guard]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 17.5, 0.6, 0, 0, 0, 0]
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
exports.triplet = {
    PARENT: [exports.genericTank],
    LABEL: "Triplet",
    DANGER: 7,
    GUNS: [{
        POSITION: [18, 10, 1, 0, 5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.triplet]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 10, 1, 0, -5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.triplet]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [21, 10, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.triplet]),
            TYPE: exports.bullet
        }
    }]
};
exports.pentaShot = {
    PARENT: [exports.genericTank],
    LABEL: "PentaShot",
    DANGER: 7,
    GUNS: [{
        POSITION: [16, 8, 1, 0, -3, -30, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.penta]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 8, 1, 0, 3, 30, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.penta]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 8, 1, 0, -2, -15, .333],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.penta]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 8, 1, 0, 2, 15, .333],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.penta]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [22, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.penta]),
            TYPE: exports.bullet
        }
    }]
};
exports.heptaShot = {
    PARENT: [exports.genericTank],
    LABEL: "Hepta Shot",
    DANGER: 8,
    GUNS: [{
        POSITION: [13, 8, 1, 0, -4, -45, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.penta]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [13, 8, 1, 0, 4, 45, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.penta]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 8, 1, 0, -3, -30, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.penta]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 8, 1, 0, 3, 30, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.penta]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 8, 1, 0, -2, -15, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.penta]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 8, 1, 0, 2, 15, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.penta]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [22, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.penta]),
            TYPE: exports.bullet
        }
    }]
};
exports.spreadling = {
    PARENT: [exports.genericTank],
    LABEL: "Spreadling",
    DANGER: 7,
    GUNS: []
};
for (let e = 3; e > 0; e--) exports.spreadling.GUNS.push({
    POSITION: [20.5 - 1.5 * e, 4, 1, 0, .5 * e - 3, -15 * e, e / 4],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.spread]),
        TYPE: exports.bullet,
        LABEL: "Spread"
    }
});
for (let e = 3; e > 0; e--) exports.spreadling.GUNS.push({
    POSITION: [20.5 - 1.5 * e, 4, 1, 0, 3 - .5 * e, 15 * e, e / 4],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.spread]),
        TYPE: exports.bullet,
        LABEL: "Spread"
    }
});
exports.spreadling.GUNS.push({
    POSITION: [13, 9, 1.1, 8, 0, 0, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.spreadMain]),
        TYPE: exports.bullet,
        LABEL: "Main"
    }
});
exports.spreadbent = {
    PARENT: [exports.genericTank],
    LABEL: "Spreadbent",
    DANGER: 7,
    GUNS: []
};
for (let e = 3; e > 1; e--) exports.spreadbent.GUNS.push({
    POSITION: [20.5 - 1.5 * e, 4, 1, 0, .5 * e - 5, -15 * e, e / 4],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.spread]),
        TYPE: exports.bullet,
        LABEL: "Spread"
    }
});
for (let e = 3; e > 1; e--) exports.spreadbent.GUNS.push({
    POSITION: [20.5 - 1.5 * e, 4, 1, 0, 5 - .5 * e, 15 * e, e / 4],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.spread]),
        TYPE: exports.bullet,
        LABEL: "Spread"
    }
});
exports.spreadbent.GUNS.push({
    POSITION: [19, 8, 1, 0, 2.5, 15, .25],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.spreadMain]),
        TYPE: exports.bullet,
        LABEL: "Spread"
    }
}, {
    POSITION: [19, 8, 1, 0, -2.5, -15, .25],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.spreadMain]),
        TYPE: exports.bullet,
        LABEL: "Spread"
    }
}, {
    POSITION: [13, 9, 1.1, 8, 0, 0, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.spreadMain]),
        TYPE: exports.bullet,
        LABEL: "Main"
    }
});
exports.autoSpreadling = makeAuto(exports.spreadling);
exports.hyLing = makeHybrid(exports.spreadling);
exports.spread = {
    PARENT: [exports.genericTank],
    LABEL: "Spreadshot",
    DANGER: 7,
    GUNS: []
};
for (let e = 5; e > 0; e--) exports.spread.GUNS.push({
    POSITION: [20.5 - 1.5 * e, 4, 1, 0, .5 * e - 3, -15 * e, e / 6],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.spread]),
        TYPE: exports.bullet,
        LABEL: "Spread"
    }
});
for (let e = 5; e > 0; e--) exports.spread.GUNS.push({
    POSITION: [20.5 - 1.5 * e, 4, 1, 0, 3 - .5 * e, 15 * e, e / 6],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.spread]),
        TYPE: exports.bullet,
        LABEL: "Spread"
    }
});
exports.spread.GUNS.push({
    POSITION: [13, 9, 1.1, 8, 0, 0, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.spreadMain]),
        TYPE: exports.bullet,
        LABEL: "Main"
    }
});
exports.scatterGun = {
    PARENT: [exports.genericTank],
    LABEL: "Scattergun",
    DANGER: 8,
    GUNS: []
};
for (let e = 6; e > 0; e--) exports.scatterGun.GUNS.push({
    POSITION: [20.5 - 1.5 * e, 4, 1, 0, .5 * e - 3, -15 * e, e / 7],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.spread]),
        TYPE: exports.bullet,
        LABEL: "Spread"
    }
});
for (let e = 6; e > 0; e--) exports.scatterGun.GUNS.push({
    POSITION: [20.5 - 1.5 * e, 4, 1, 0, 3 - .5 * e, 15 * e, e / 7],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.spread]),
        TYPE: exports.bullet,
        LABEL: "Spread"
    }
});
exports.scatterGun.GUNS.push({
    POSITION: [13, 9, 1.1, 8, 0, 0, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.spreadMain]),
        TYPE: exports.bullet,
        LABEL: "Main"
    }
});
exports.split = {
    PARENT: [exports.genericTank],
    LABEL: 'Split',
    DANGER: 7,
    BODY: {
        SPEED: base.SPEED * .8
    },
    GUNS: [{
        POSITION: [17, 2.5, 1, 0, -2, -10, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.split, g.splitMini]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 2.5, 1, 0, 2, 10, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.split, g.splitMini]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 2.5, 1, 0, -3, 10, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.split, g.splitMini]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 2.5, 1, 0, 3, -10, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.split, g.splitMini]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5, 9, -1.6, 7, 0, 10, 0]
    }, {
        POSITION: [5, 9, -1.6, 7, 0, -10, 0]
    }, {
        POSITION: [17, 2.5, 1, 0, 3, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.split, g.splitMini]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 2.5, 1, 0, -3, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.split, g.splitMini]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.split]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5, 9, -1.6, 7, 0, 0, 0]
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
exports.backShieldTurret = {
    PARENT: [exports.genericTank],
    LABEL: "Shield",
    COLOR: 23,
    SHAPE: shapeConfig.backShield,
    HITS_OWN_TYPE: "everything",
    DAMAGE_CLASS: 1,
    BODY: {
        PUSHABILITY: 0,
        HEALTH: 1e5,
        REGEN: 1e5,
        DAMAGE: 1,
        RESIST: 1e5,
        STEALTH: 1,
        DENSITY: 1e5
    }
};
exports.backShield = {
    PARENT: [exports.genericTank],
    LABEL: 'Back Shield',
    DANGER: 7,
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet]),
            TYPE: exports.bullet
        }
    }],
    TURRETS: [{
        POSITION: [18, 18, 0, 180, 0, 1],
        TYPE: exports.backShieldTurret
    }]
};
exports.propeller = {
    PARENT: [exports.genericTank],
    LABEL: "Propeller",
    DANGER: 5,
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.tri]),
            TYPE: exports.bullet,
            LABEL: "Front"
        }
    }, {
        POSITION: [15, 6, 1, 0, 0, 150, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [15, 6, 1, 0, 0, 210, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }]
};
exports.accelerator = {
    PARENT: [exports.genericTank],
    LABEL: "Accelerator",
    DANGER: 6,
    GUNS: [{
        POSITION: [16, 8, 1, 0, 0, 135, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.accelerator]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 225, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.accelerator]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 180, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.accelerator]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }]
};
exports.tri = {
    PARENT: [exports.genericTank],
    LABEL: "Tri-Angle",
    DANGER: 6,
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.tri]),
            TYPE: exports.bullet,
            LABEL: "Front"
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 150, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 210, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }]
};
exports.booster = {
    PARENT: [exports.genericTank],
    LABEL: "Booster",
    DANGER: 7,
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.tri]),
            TYPE: exports.bullet,
            LABEL: "Front"
        }
    }, {
        POSITION: [13, 8, 1, 0, -1, 135, .6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback, g.booster]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [13, 8, 1, 0, 1, 225, .6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback, g.booster]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 145, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback, g.booster]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 215, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback, g.booster]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }]
};
exports.manOWar = {
    PARENT: [exports.genericTank],
    LABEL: "Man O' War",
    DANGER: 7,
    GUNS: [{
        POSITION: [16, 12, 1, 0, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound]),
            TYPE: exports.bullet,
            LABEL: "Side"
        }
    }, {
        POSITION: [16, 12, 1, 0, 0, -90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound]),
            TYPE: exports.bullet,
            LABEL: "Side"
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 150, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 210, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }]
};
exports.betelguese = {
    PARENT: [exports.genericTank],
    LABEL: "Betelguese",
    DANGER: 7,
    GUNS: [{
        POSITION: [16, 12, 1, 0, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound]),
            TYPE: exports.bullet,
            LABEL: "Side"
        }
    }, {
        POSITION: [16, 12, 1, 0, 0, -90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound]),
            TYPE: exports.bullet,
            LABEL: "Side"
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 150, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 210, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [2, 2, 1, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.jump]),
            TYPE: [exports.bullet, {
                ALPHA: 0
            }],
            ALT_FIRE: true
        }
    }, {
        POSITION: [9, 14, .6, 4, 0, 180, 0]
    }]
};
exports.minorminihive = {
    PARENT: [exports.bullet],
    LABEL: 'Mini Hive',
    BODY: {
        RANGE: 90,
        FOV: 0.5
    },
    FACING_TYPE: 'turnWithSpeed',
    INDEPENDENT: true,
    CONTROLLERS: ['alwaysFire', 'nearestDifferentMaster', 'targetSelf'],
    GUNS: [{
        POSITION: [7, 9.5, 0.6, 7, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
            TYPE: exports.autobee,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 9.5, 0.6, 7, 0, 180, 1 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
            TYPE: exports.autobee,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }]
};
exports.jellyfish = {
    PARENT: [exports.genericTank],
    LABEL: "Jellyfish",
    DANGER: 7,
    GUNS: [{
        POSITION: [16, 13, -1.2, 0, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.hive]),
            TYPE: exports.minorminihive
        }
    }, {
        POSITION: [13, 11, 1, 5, 0, 90, 0]
    }, {
        POSITION: [16, 13, -1.2, 0, 0, -90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.hive]),
            TYPE: exports.minorminihive
        }
    }, {
        POSITION: [13, 11, 1, 5, 0, -90, 0]
    }, {
        POSITION: [16, 8, 1, 0, 0, 150, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 210, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }]
};
exports.warfare = {
    PARENT: [exports.genericTank],
    LABEL: "Warfare",
    DANGER: 7,
    GUNS: [{
        POSITION: [18, 7, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.tri]),
            TYPE: exports.bullet,
            LABEL: "Front"
        }
    }, {
        POSITION: [16, 12, 1, 0, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.flank]),
            TYPE: exports.bullet,
            LABEL: "Side"
        }
    }, {
        POSITION: [16, 12, 1, 0, 0, -90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.flank]),
            TYPE: exports.bullet,
            LABEL: "Side"
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 150, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 210, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }]
};
exports.ambassador = {
    PARENT: [exports.genericTank],
    LABEL: "Ambassador",
    DANGER: 7,
    GUNS: [{
        POSITION: [18, 14, 1, 0, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.destroy]),
            TYPE: exports.bullet,
            LABEL: "Side"
        }
    }, {
        POSITION: [18, 14, 1, 0, 0, -90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.destroy]),
            TYPE: exports.bullet,
            LABEL: "Side"
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 150, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 210, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }]
};
exports.fighter = {
    PARENT: [exports.genericTank],
    LABEL: "Fighter",
    DANGER: 7,
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.tri]),
            TYPE: exports.bullet,
            LABEL: "Front"
        }
    }, {
        POSITION: [16, 8, 1, 0, -1, 90, .05],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.tri, g.fighter]),
            TYPE: exports.bullet,
            LABEL: "Side"
        }
    }, {
        POSITION: [16, 8, 1, 0, 1, -90, .05],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.tri, g.fighter]),
            TYPE: exports.bullet,
            LABEL: "Side"
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 150, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 210, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }]
};
exports.dogfighter = {
    PARENT: [exports.genericTank],
    LABEL: "Dogfighter",
    DANGER: 7,
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.tri]),
            TYPE: exports.bullet,
            LABEL: "Front"
        }
    }, {
        POSITION: [4, 4, 1, 4, -12, 0, .6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.tri, g.fighter2]),
            TYPE: exports.bullet,
            LABEL: "fSide"
        }
    }, {
        POSITION: [4, 4, 1, 4, 12, 0, .6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.tri, g.fighter2]),
            TYPE: exports.bullet,
            LABEL: "fSide"
        }
    }, {
        POSITION: [4, 4, 1, 2, -12, 180, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.tri, g.fighter2]),
            TYPE: exports.bullet,
            LABEL: "bSide"
        }
    }, {
        POSITION: [4, 4, 1, 2, 12, 180, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.tri, g.fighter2]),
            TYPE: exports.bullet,
            LABEL: "bSide"
        }
    }, {
        POSITION: [16, 8, 1, 0, -1, 90, .05],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.tri, g.fighter]),
            TYPE: exports.bullet,
            LABEL: "Side"
        }
    }, {
        POSITION: [16, 8, 1, 0, 1, -90, .05],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.tri, g.fighter]),
            TYPE: exports.bullet,
            LABEL: "Side"
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 150, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 210, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }]
};
exports.surfer = {
    PARENT: [exports.genericTank],
    LABEL: "Surfer",
    DANGER: 7,
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.tri]),
            TYPE: exports.bullet,
            LABEL: "Front"
        }
    }, {
        POSITION: [7, 7.5, .6, 7, -1, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.surfer]),
            TYPE: [exports.autoswarm],
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 7.5, .6, 7, 1, -90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.surfer]),
            TYPE: [exports.autoswarm],
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 150, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 210, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }]
};
exports.bomber = {
    PARENT: [exports.genericTank],
    LABEL: "Bomber",
    DANGER: 7,
    GUNS: [{
        POSITION: [20, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.guard]),
            TYPE: exports.bullet,
            LABEL: "Front"
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 130, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster]),
            TYPE: exports.bullet,
            LABEL: "Wing"
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 230, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster]),
            TYPE: exports.bullet,
            LABEL: "Wing"
        }
    }, {
        POSITION: [14, 8, 1, 0, 0, 180, 0]
    }, {
        POSITION: [4, 8, 1.5, 14, 0, 180, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.guardtrap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }]
};
exports.autotri = makeAuto(exports.tri), exports.autotri.BODY = {
    SPEED: base.SPEED
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
            TYPE: exports.bullet
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 65, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 115, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 40, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 140, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 270, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 295, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 245, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 320, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 220, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet
        },
    }]
};
exports.biohazard = {
    PARENT: [exports.genericTank],
    LABEL: "Biohazard",
    GUNS: [{
        POSITION: [19, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.pound, g.biohazard]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 12, 1, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.pound, g.biohazard]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 3, 1, 0, 0, 90, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 65, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 115, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 40, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 140, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 270, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 295, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 245, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 320, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [16, 3, 1, 0, 0, 220, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arthropoda, g.myriapoda]),
            TYPE: exports.bullet
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
exports.flankcruiser = {
    PARENT: [exports.genericTank],
    LABEL: 'Flank Cruiser',
    DANGER: 7,
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.guard]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [7, 7.5, .6, 7, 4, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.swarmguard, g.flankcruiser]),
            TYPE: exports.autoswarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 7.5, .6, 7, -4, 180, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.swarmguard, g.flankcruiser]),
            TYPE: exports.autoswarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }]
};
exports.hybrado = {
    PARENT: [exports.genericTank],
    LABEL: 'Hybrado',
    DANGER: 7,
    GUNS: [{
        POSITION: [12, 8, 1, 0, 0, 120, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.guard, g.hybrado]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 8, 1, 0, 0, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.guard, g.hybrado]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 8, 1, 0, 0, 300, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.guard, g.hybrado]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 8, 1, 0, 0, 240, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.guard, g.hybrado]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [8, 8.5, 0.6, 7, 0, 180, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.swarmguard, g.hybradoswarm]),
            TYPE: exports.autoswarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [8, 8.5, 0.6, 7, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.swarmguard, g.hybradoswarm]),
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
exports.hybrado = {
    PARENT: [exports.genericTank],
    LABEL: 'Hybrado',
    DANGER: 7,
    GUNS: [{
        POSITION: [12, 8, 1, 0, 0, 120, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.guard, g.hybrado]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 8, 1, 0, 0, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.guard, g.hybrado]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 8, 1, 0, 0, 300, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.guard, g.hybrado]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 8, 1, 0, 0, 240, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.guard, g.hybrado]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [8, 8.5, 0.6, 7, 0, 180, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.swarmguard, g.hybradoswarm]),
            TYPE: exports.autoswarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [8, 8.5, 0.6, 7, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.swarmguard, g.hybradoswarm]),
            TYPE: exports.autoswarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }]
};
exports.viper = {
    PARENT: [exports.genericTank],
    LABEL: 'Viper',
    DANGER: 8,
    GUNS: [{
        POSITION: [16, 4, 1, 0, 0, 120, 0],
    }, {
        POSITION: [12, 8, 1, 0, 0, 120, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.guard, g.hybrado, g.viper]),
            TYPE: exports.vipersnake
        }
    }, {
        POSITION: [16, 4, 1, 0, 0, 60, 0],
    }, {
        POSITION: [12, 8, 1, 0, 0, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.guard, g.hybrado, g.viper]),
            TYPE: exports.vipersnake
        }
    }, {
        POSITION: [16, 4, 1, 0, 0, 300, 0],
    }, {
        POSITION: [12, 8, 1, 0, 0, 300, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.guard, g.hybrado, g.viper]),
            TYPE: exports.vipersnake
        }
    }, {
        POSITION: [16, 4, 1, 0, 0, 240, 0],
    }, {
        POSITION: [12, 8, 1, 0, 0, 240, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.guard, g.hybrado, g.viper]),
            TYPE: exports.vipersnake
        }
    }, {
        POSITION: [8, 8.5, 0.6, 7, 0, 180, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.swarmguard, g.hybradoswarm]),
            TYPE: exports.autoswarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [8, 8.5, 0.6, 7, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.swarmguard, g.hybradoswarm]),
            TYPE: exports.autoswarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }]
};
exports.hive = {
    PARENT: [exports.bullet],
    LABEL: 'Hive',
    BODY: {
        RANGE: 90,
        FOV: 0.5
    },
    FACING_TYPE: 'turnWithSpeed',
    INDEPENDENT: true,
    CONTROLLERS: ['alwaysFire', 'nearestDifferentMaster', 'targetSelf'],
    GUNS: [{
        POSITION: [7, 9.5, 0.6, 7, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.hiveBees]),
            TYPE: exports.autobee,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 9.5, 0.6, 7, 0, 72, 1 / 5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.hiveBees]),
            TYPE: exports.autobee,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 9.5, 0.6, 7, 0, 144, 2 / 5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.hiveBees]),
            TYPE: exports.autobee,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 9.5, 0.6, 7, 0, 216, 3 / 5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.hiveBees]),
            TYPE: exports.autobee,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 9.5, 0.6, 7, 0, 288, 4 / 5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.hiveBees]),
            TYPE: exports.autobee,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }]
};
exports.megahive = {
    PARENT: [exports.bullet],
    LABEL: 'Hive',
    BODY: {
        RANGE: 90,
        FOV: 0.5
    },
    FACING_TYPE: 'turnWithSpeed',
    INDEPENDENT: true,
    CONTROLLERS: ['alwaysFire', 'nearestDifferentMaster', 'targetSelf'],
    GUNS: [{
        POSITION: [7, 9.5, 0.6, 7, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.hiveBees]),
            TYPE: exports.autobee,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 9.5, 0.6, 7, 0, 51.42, 1 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.hiveBees]),
            TYPE: exports.autobee,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 9.5, 0.6, 7, 0, 102.84, 2 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.hiveBees]),
            TYPE: exports.autobee,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 9.5, 0.6, 7, 0, 154.26, 3 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.hiveBees]),
            TYPE: exports.autobee,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 9.5, 0.6, 7, 0, -154.26, 4 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.hiveBees]),
            TYPE: exports.autobee,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 9.5, 0.6, 7, 0, -102.84, 5 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.hiveBees]),
            TYPE: exports.autobee,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [7, 9.5, 0.6, 7, 0, -51.42, 6 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.hiveBees]),
            TYPE: exports.autobee,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }]
};
exports.trapHive = {
    PARENT: [exports.bullet],
    LABEL: "Hive",
    BODY: {
        RANGE: 90,
        FOV: .5
    },
    FACING_TYPE: "turnWithSpeed",
    INDEPENDENT: true,
    CONTROLLERS: ["alwaysFire", "nearestDifferentMaster", "targetSelf"],
    AI: {
        NO_LEAD: true
    },
    GUNS: (() => {
        let e = [];
        for (let T = 0; T < 3; T++) e.push({
            POSITION: [7, 9.5, .6, 7, 0, 120 * T, 1 / 3 * T],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.hiveBees]),
                TYPE: exports.bee,
                STAT_CALCULATOR: gunCalcNames.swarm
            }
        }, {
            POSITION: [13, 8.5, 1, 0, 0, 120 * T + 60, 1 / 3 * T]
        }, {
            POSITION: [4, 8.5, 1.7, 13, 0, 120 * T + 60, 1 / 3 * T],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.traphive, g.bee, g.hiveBees]),
                TYPE: [exports.trap, {
                    PERSISTS_AFTER_DEATH: true
                }],
                STAT_CALCULATOR: gunCalcNames.trap
            }
        });
        return e
    })()
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
        POSITION: [16, 13, -1.2, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.hive]),
            TYPE: exports.minihive
        }
    }, {
        POSITION: [13, 11, 1, 5, 0, 0, 0]
    }]
};
exports.swarmer = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    BODY: {
        ACCELERATION: base.ACCEL * .9,
        SPEED: base.SPEED * .9,
    },
    LABEL: 'Swarmer',
    GUNS: [{
        POSITION: [17, 13, -1.2, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.hive, g.swarmer]),
            TYPE: exports.hive
        }
    }, {
        POSITION: [14, 11, 1, 5, 0, 0, 0]
    }]
};
exports.megaswarmer = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    BODY: {
        ACCELERATION: base.ACCEL * .9,
        SPEED: base.SPEED * .9,
    },
    LABEL: 'Mega Swarmer',
    GUNS: [{
        POSITION: [18, 13, -1.2, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.hive, g.swarmer, [1.2, 1.2, 1, .925, 1.4, .9, .9, .8, .8, 1.5, 1, 1, 2]]),
            TYPE: exports.megahive
        }
    }, {
        POSITION: [15, 11, 1, 5, 0, 0, 0]
    }]
};
exports.trapswarmer = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    BODY: {
        ACCELERATION: base.ACCEL * .9,
        SPEED: base.SPEED * .8,
    },
    LABEL: 'Trap Swarmer',
    GUNS: [{
        POSITION: [12, 13, -1.2, 5, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.hive, g.trapswarmer]),
            TYPE: exports.trapHive
        }
    }, {
        POSITION: [13, 11, .8, 5, 0, 0, 0]
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
        RANGE: 120
    }
};
exports.boomer = {
    PARENT: [exports.genericTank],
    DANGER: 6,
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
exports.bentboomer = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    LABEL: 'Bent Boomer',
    STAT_NAMES: statnames.trap,
    FACING_TYPE: 'locksFacing',
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: base.FOV * 1.15
    },
    GUNS: [{
        POSITION: [5, 10, 1, 14, 0, 40, 0]
    }, {
        POSITION: [6, 10, -1.5, 7, 0, 40, 0]
    }, {
        POSITION: [2, 10.5, 1.3, 18, 0, 40, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.boomerang, g.bentboomerang]),
            TYPE: exports.boomerang
        }
    }, {
        POSITION: [5, 10, 1, 14, 0, 310, 0]
    }, {
        POSITION: [6, 10, -1.5, 7, 0, 310, 0]
    }, {
        POSITION: [2, 10.5, 1.3, 18, 0, 310, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.boomerang, g.bentboomerang]),
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
exports.gondola = {
    PARENT: [exports.genericTank],
    LABEL: "Gondola",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        ACCELERATION: .85 * base.ACCEL,
        SPEED: .95 * base.SPEED,
        FOV: 1.1 * base.FOV
    },
    MAX_CHILDREN: 10,
    SHAPE: 4,
    GUNS: [{
        POSITION: [6.5, 12.5, 1.2, 7, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, g.gondola]),
            TYPE: exports.sunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6.5, 12.5, 1.2, 7, 0, 270, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, g.gondola]),
            TYPE: exports.sunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }]
};
exports.maleficitorDrone = {
    LABEL: "Drone",
    TYPE: "drone",
    ACCEPTS_SCORE: false,
    DANGER: 2,
    CONTROL_RANGE: 0,
    SHAPE: 4,
    MOTION_TYPE: "chase",
    FACING_TYPE: "smoothToTarget",
    CONTROLLERS: ["nearestDifferentMaster", "canRepel", "mapTargetToGoal"],
    AI: {
        BLIND: true
    },
    BODY: {
        PENETRATION: .5,
        PUSHABILITY: .85,
        ACCELERATION: .08,
        HEALTH: 1.5 * wepHealthFactor,
        DAMAGE: 2.65 * wepDamageFactor,
        SPEED: 4.5,
        RANGE: 90,
        DENSITY: 0.5,
        RESIST: 1.5,
        FOV: 1.25
    },
    HITS_OWN_TYPE: "hard",
    DRAW_HEALTH: false,
    CLEAR_ON_MASTER_UPGRADE: true,
    BUFF_VS_FOOD: true,
    INVISIBLE: [.06, .03],
    NECRO: true
};
exports.malefictorProp = {
    PARENT: [exports.genericTank],
    DANGER: 0,
    SHAPE: 1000004,
    TRAVERSE_SPEED: .5
};
exports.maleficitor = {
    PARENT: [exports.genericTank],
    LABEL: "Maleficitor",
    DANGER: 7,
    STAT_NAMES: statnames.necro,
    BODY: {
        ACCELERATION: base.ACCEL * 0.75,
        SPEED: base.SPEED * 0.85,
        FOV: base.FOV * 1.1
    },
    SHAPE: 4,
    MAX_CHILDREN: 18,
    TOOLTIP: "Togggle Override to make your drones turn invisible.",
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [6, 12, 1.2, 7, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, [.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.maleficitorDrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro
        }
    }],
    TURRETS: [{
        POSITION: [10, 0, 0, 0, 0, 1],
        TYPE: exports.malefictorProp
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
exports.elamnecro = {
    PARENT: [exports.genericTank],
    LABEL: "Elamnecro",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        ACCELERATION: .8 * base.ACCEL,
        SPEED: .9 * base.SPEED,
        FOV: 1.1 * base.FOV
    },
    MAX_CHILDREN: 16,
    SHAPE: 4,
    INVISIBLE: [.2, .05],
    TOOLTIP: "Stay still to turn invisible.",
    GUNS: [{
        POSITION: [6, 12, 1.2, 7, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
            TYPE: exports.sunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            SKIN: 4
        }
    }, {
        POSITION: [6, 12, 1.2, 7, 0, 90, 0.25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
            TYPE: exports.sunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            SKIN: 4
        }
    }, {
        POSITION: [6, 12, 1.2, 7, 0, 180, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
            TYPE: exports.sunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            SKIN: 4
        }
    }, {
        POSITION: [6, 12, 1.2, 7, 0, 270, 0.75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
            TYPE: exports.sunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            SKIN: 4
        }
    }]
};
exports.gridlock = {
    PARENT: [exports.genericTank],
    LABEL: "Gridlock",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        ACCELERATION: .8 * base.ACCEL,
        SPEED: .9 * base.SPEED,
        FOV: 1.1 * base.FOV
    },
    MAX_CHILDREN: 20,
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
        POSITION: [6, 12, 1.2, 7, 0, 90, 0.125],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
            TYPE: exports.sunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6, 12, 1.2, 7, 0, 180, 0.25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
            TYPE: exports.sunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6, 12, 1.2, 7, 0, 270, 0.375],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
            TYPE: exports.sunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6, 12, 1.2, 5, 0, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
            TYPE: exports.sunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6, 12, 1.2, 5, 0, 90, 0.625],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
            TYPE: exports.sunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6, 12, 1.2, 5, 0, 180, 0.75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
            TYPE: exports.sunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6, 12, 1.2, 5, 0, 270, 0.875],
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
    MAX_CHILDREN: 24,
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.infestor]),
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.infestor, g.imposter]),
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
        ACCELERATION: base.ACCEL * 0.8,
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
exports.protist = {
    PARENT: [exports.genericTank],
    LABEL: 'Protist',
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        ACCELERATION: base.ACCEL * 0.8,
        FOV: 1.1
    },
    GUNS: [{
        POSITION: [18, 5, 1, 0, 0, 0, 0,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pathogi]),
            TYPE: exports.bullet
        },
    }, {
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
    LABEL: "Machine",
    BODY: {
        ACCELERATION: base.ACCEL * 1.1,
    },
    DANGER: 5,
    GUNS: [{
        POSITION: [12, 10, 1.4, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach]),
            TYPE: exports.bullet
        }
    }]
};
// Recoil could be a cool upgrade...? Branching into Nuclear Bomb too
exports.foamBullet = {
    PARENT: [exports.bullet],
    LABEL: "Bubble",
    GUNS: (function () {
        const output = [];
        for (let i = 0; i < 12; i++) {
            output.push({
                POSITION: [1, 1, 1, 0, 0, 360 / 12 * i, .75 + i / 12 * Math.random()],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.bullet, g.foamBullet]),
                    TYPE: [exports.bullet, {
                        PERSISTS_AFTER_DEATH: true,
                        LAYER: 6
                    }],
                    AUTOFIRE: true
                }
            });
        }
        return output;
    })()
};
exports.foamGun = {
    PARENT: [exports.genericTank],
    LABEL: "Foam Gun",
    DANGER: 7,
    GUNS: [{
        POSITION: [10, 10, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.foamGun]),
            TYPE: exports.foamBullet
        }
    }]
};
exports.sponge = {
    PARENT: [exports.genericTank],
    LABEL: "Sponge",
    DANGER: 8,
    GUNS: [{
        POSITION: [12, 10, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.foamGun]),
            TYPE: exports.foamBullet
        }
    }, {
        POSITION: [8, 10, 1.4, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach]),
            TYPE: exports.bullet
        }
    }]
};
exports.bubbleGun = {
    PARENT: [exports.genericTank],
    LABEL: "Bubble Gun",
    DANGER: 7,
    GUNS: [{
        POSITION: [12, 9, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.foamGun, g.bubbleGun]),
            TYPE: exports.foamBullet
        }
    }]
};
exports.corroderExplosion = {
    PARENT: [exports.bullet],
    LABEL: 'Explosion',
    INDEPENDENT: true,
    PERSISTS_AFTER_DEATH: true,
    BODY: {
        SPEED: 1,
        DENSITY: 5,
        RANGE: 100
    },
    GUNS: (function () {
        const output = [];
        for (let i = 0; i < 5; i++) {
            output.push({
                POSITION: [2, 5, 1, 0, 0, 360 / 5 * i, .1],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.bullet, g.foamBullet, g.corroderExplosion]),
                    TYPE: [exports.bullet, {
                        PERSISTS_AFTER_DEATH: true
                    }]
                }
            });
        }
        return output;
    })()
};
exports.corroderBullet = {
    PARENT: [exports.bullet],
    LABEL: "Nuke",
    INDEPENDENT: true,
    GUNS: (function () {
        const output = [];
        for (let i = 0; i < 3; i++) {
            output.push({
                POSITION: [2, 12, 1, 0, 0, 360 / 3 * i, Infinity],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.bullet, g.corroderBullet]),
                    TYPE: exports.corroderExplosion,
                    SHOOT_ON_DEATH: true
                }
            });
        }
        return output;
    })()
};
exports.corroder = {
    PARENT: [exports.genericTank],
    LABEL: "Corroder",
    DANGER: 8,
    BODY: {
        ACCELERATION: base.ACCEL * .75,
        SPEED: base.SPEED * .95
    },
    GUNS: [{
        POSITION: [14.5, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.foamGun, g.bubbleGun, g.corroder]),
            TYPE: exports.corroderBullet
        }
    }]
};
exports.bombProjectile = {
    PARENT: [exports.bullet],
    LABEL: "Bomb",
    FACING_TYPE: "turnWithSpeed",
    GUNS: (function () {
        const output = [{
            POSITION: [28, 2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                COLOR: 9
            }
        }, {
            POSITION: [20, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                COLOR: 9
            }
        }];
        for (let i = 0; i < 30; i++) {
            output.push({
                POSITION: [i > 10 ? 2 : 7, 3.5, 1, 0, 0, i > 10 ? i * 20 : i * 18, Infinity],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.bullet, g.foamBullet]),
                    TYPE: [exports.bullet, {
                        PERSISTS_AFTER_DEATH: true
                    }],
                    SHOOT_ON_DEATH: true
                }
            });
        }
        return output;
    })()
};
exports.iceBombProjectile = {
    PARENT: [exports.bullet],
    LABEL: "Bomb",
    FACING_TYPE: "turnWithSpeed",
    GUNS: (function () {
        const output = [{
            POSITION: [28, 2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                COLOR: 26
            }
        }, {
            POSITION: [20, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                COLOR: 26
            }
        }];
        for (let i = 0; i < 30; i++) {
            output.push({
                POSITION: [i > 10 ? 2 : 7, 3.5, 1, 0, 0, i > 10 ? i * 20 : i * 18, Infinity],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.bullet, g.foamBullet, [1, 1, 1, 1, .50, .50, .50, 1, .50, 1, 1, 1, 1]]),
                    TYPE: [exports.freezeBullet, {
                        PERSISTS_AFTER_DEATH: true
                    }],
                    SHOOT_ON_DEATH: true
                }
            });
        }
        return output;
    })()
};
exports.nukeBombProjectile = {
    PARENT: [exports.bullet],
    LABEL: "Bomb",
    FACING_TYPE: "turnWithSpeed",
    GUNS: (function () {
        const output = [{
            POSITION: [28, 2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                COLOR: 9
            }
        }, {
            POSITION: [20, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, [.334, .8, .1, .65, 10, .05, 10, .05, 1, .5, 1, .1, 2]]),
                TYPE: [exports.bullet, {
                    PERSISTS_AFTER_DEATH: true,
                    LAYER: 6
                }],
                COLOR: 9,
                AUTOFIRE: true
            }
        }];
        for (let i = 0; i < 60; i++) {
            output.push({
                POSITION: [i > 20 ? 2 : (i > 40 ? 4 : 8), 3.5, 1, 0, 0, i * 6, 99],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.bullet, g.foamBullet]),
                    TYPE: [exports.bullet, {
                        PERSISTS_AFTER_DEATH: true
                    }],
                    SHOOT_ON_DEATH: true
                }
            });
        }
        return output;
    })()
};
exports.bomb = {
    PARENT: [exports.genericTank],
    LABEL: "Bomb",
    DANGER: 7,
    BODY: {
        ACCELERATION: base.ACCEL * .7,
        SPEED: base.SPEED * .8
    },
    GUNS: [{
        POSITION: [21, 14, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.foamGun, g.bomb]),
            TYPE: exports.bombProjectile
        }
    }, {
        POSITION: [24, 8, 1, 0, 0, 0, 0]
    }, {
        POSITION: [18, 10.88, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SKIN: 6
        }
    }, {
        POSITION: [18, 10.88, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SKIN: 5
        }
    }]
};
exports.cryobomb = {
    PARENT: [exports.iceParent],
    LABEL: "Cryobomb",
    DANGER: 7,
    BODY: {
        ACCELERATION: base.ACCEL * .7,
        SPEED: base.SPEED * .8
    },
    GUNS: [{
        POSITION: [21, 14, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.foamGun, g.bomb]),
            TYPE: exports.iceBombProjectile
        }
    }, {
        POSITION: [24, 8, 1, 0, 0, 0, 0]
    }, {
        POSITION: [18, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            COLOR: 26
        }
    }, {
        POSITION: [18, 10.88, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SKIN: 6
        }
    }, {
        POSITION: [18, 10.88, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SKIN: 5
        }
    }]
};
exports.nuclearBomb = {
    PARENT: [exports.genericTank],
    LABEL: "Nuclear Bomb",
    DANGER: 8,
    BODY: {
        ACCELERATION: base.ACCEL * .75
    },
    GUNS: [{
        POSITION: [21, 18.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.foamGun, g.bomb, g.nuclearBomb]),
            TYPE: exports.nukeBombProjectile
        }
    }, {
        POSITION: [24, 8, 1, 0, 0, 0, 0]
    }, {
        POSITION: [18, 10.88, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SKIN: 6
        }
    }, {
        POSITION: [18, 10.88, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SKIN: 5
        }
    }]
};
exports.sparklerBullet = {
    PARENT: [exports.bullet],
    LABEL: 'Spark',
    HITS_OWN_TYPE: 'hardOnlyDrones',
    MOTION_TYPE: "glide",
    SHAPE: 6,
    GUNS: [{
        POSITION: [14, 6, 1, 0, 0, 0, 3],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sparklerBullet]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [14, 6, 1, 0, 0, -1, 3.1],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sparklerBullet]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [14, 6, 1, 0, 0, 1, 3.2],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sparklerBullet]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [14, 6, 1, 0, 0, -2, 3.3],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sparklerBullet]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [14, 6, 1, 0, 0, 2, 3.4],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sparklerBullet]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [14, 6, 1, 0, 0, -3, 3.5],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sparklerBullet]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [14, 6, 1, 0, 0, 3, 3.6],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sparklerBullet]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [14, 6, 1, 0, 0, -4, 3.7],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sparklerBullet]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [14, 6, 1, 0, 0, 0, 3.8],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sparklerBullet]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }]
};
exports.cracklerTurret = {
    INDEPENDENT: true,
    CONTROLLERS: ["reversespin"],
    GUNS: (function () {
        const output = [];
        for (let i = 0; i < 3; i++) {
            output.push({
                POSITION: [16, 8, 1, 0, 0, 360 / 3 * i, 0]
            }, {
                POSITION: [3, 8, 1.4, 16, 0, 360 / 3 * i, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.flank, g.turret, g.weak, g.weak, g.weak]),
                    TYPE: [exports.trap, {
                        PERSISTS_AFTER_DEATH: true,
                        LAYER: 6
                    }],
                    AUTOFIRE: true
                }
            });
        }
        return output;
    })()
};
exports.cracklerBullet = {
    PARENT: [exports.bullet],
    LABEL: 'Spark',
    HITS_OWN_TYPE: 'hardOnlyDrones',
    MOTION_TYPE: "glide",
    SHAPE: 6,
    GUNS: [{
        POSITION: [14, 6, 1, 0, 0, 0, 3],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sparklerBullet]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [14, 6, 1, 0, 0, -1, 3.1],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sparklerBullet]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [14, 6, 1, 0, 0, 1, 3.2],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sparklerBullet]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [14, 6, 1, 0, 0, -2, 3.3],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sparklerBullet]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [14, 6, 1, 0, 0, 2, 3.4],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sparklerBullet]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [14, 6, 1, 0, 0, -3, 3.5],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sparklerBullet]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [14, 6, 1, 0, 0, 3, 3.6],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sparklerBullet]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [14, 6, 1, 0, 0, -4, 3.7],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sparklerBullet]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [14, 6, 1, 0, 0, 0, 3.8],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.sparklerBullet]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }],
    TURRETS: [{
        POSITION: [12.5, 0, 0, 0, 360, 1],
        TYPE: exports.cracklerTurret
    }]
};
exports.sparkler = {
    PARENT: [exports.genericTank],
    LABEL: "Sparkler",
    DANGER: 7,
    BODY: {
        FOV: 1.2
    },
    GUNS: [{
        POSITION: [10, 14, -0.9, 9, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.foamGun, g.sparkler, g.fake]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [13, 15, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.foamGun, g.sparkler]),
            TYPE: exports.sparklerBullet,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [14, 15, 1.2, 0, 0, 0, 0]
    }]
};
exports.crackler = {
    PARENT: [exports.genericTank],
    LABEL: "Crackler",
    DANGER: 8,
    BODY: {
        FOV: 1.2
    },
    GUNS: [{
        POSITION: [10, 14, -0.9, 9, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.foamGun, g.sparkler, g.crackler, g.fake]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [13, 15, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.foamGun, g.sparkler, g.crackler]),
            TYPE: exports.cracklerBullet,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [14, 15, 1.2, 0, 0, 0, 0]
    }, {
        POSITION: [3, 15 * 1.2, 1.4, 14, 0, 0, 0]
    }]
};
exports.flamethrower = {
    PARENT: [exports.genericTank],
    LABEL: "Flamethrower",
    DANGER: 7,
    BODY: {
        FOV: 1.1,
        SPEED: base.SPEED * .85,
        ACCELERATION: base.ACCEL * .7
    },
    GUNS: [{
        POSITION: [15.077, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flamethrower]),
            TYPE: exports.bullet,
            SKIN: 1
        }
    }]
};
exports.courser = {
    PARENT: [exports.genericTank],
    LABEL: "Courser",
    DANGER: 8,
    BODY: {
        FOV: 1.2,
        SPEED: base.SPEED * .7,
        ACCELERATION: base.ACCEL * .65
    },
    GUNS: (function () {
        const output = [{
            POSITION: [15, 15, 1.2, 4, 0, 0, 0]
        }];
        for (let i = 0; i < 50; i++) {
            output.push({
                POSITION: [24, 5, 1, 0, i * .1, 0, i * .1],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.bullet, g.course]),
                    TYPE: exports.bullet
                }
            }, {
                POSITION: [24, 5, 1, 0, i * -.1, 0, i * .1],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.bullet, g.course]),
                    TYPE: exports.bullet
                }
            });
        }
        return output.reverse();
    })()
};
exports.foamGun.UPGRADES_TIER_3 = [exports.bubbleGun, exports.bomb, exports.sparkler, exports.flamethrower];
exports.bubbleGun.UPGRADES_TIER_4 = [exports.sponge, exports.corroder];
exports.bomb.UPGRADES_TIER_4 = [exports.nuclearBomb, exports.cryobomb];
exports.sparkler.UPGRADES_TIER_4 = [exports.crackler];
exports.flamethrower.UPGRADES_TIER_4 = [exports.courser];
exports.blaster = {
    PARENT: [exports.genericTank],
    LABEL: "Blaster",
    BODY: {
        ACCELERATION: base.ACCEL * 1.1,
    },
    DANGER: 6,
    GUNS: [{
        POSITION: [10, 12, 1.4, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.blast]),
            TYPE: exports.bullet
        }
    }]
};
exports.naturalist = {
    PARENT: [exports.genericTank],
    LABEL: 'Naturalist',
    DANGER: 6,
    BODY: {
        FOV: base.FOV * 1.1,
        SPEED: base.SPEED * 0.9,
    },
    GUNS: [{
        POSITION: [17, 2, -3, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.naturalist]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [4.5, 8.5, -1.6, 7.5, 0, 0, 0]
    }]
};

exports.forestfire = {
    PARENT: [exports.genericTank],
    LABEL: 'Forestfire',
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.1,
        SPEED: base.SPEED * 0.9,
    },
    GUNS: [{
        POSITION: [4.4, 4, 1.7, 10, 2, 0, 0]
    }, {
        POSITION: [17, 2, -3, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.inferno, g.pelleter, g.naturalist, g.forestfire]),
            TYPE: exports.infernoFlare
        }
    }, {
        POSITION: [4.5, 8.5, -1.6, 7.5, 0, 0, 0]
    }]
};
exports.naturalistMinion = {
    PARENT: [exports.baseMinion],
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [17, 2, -3, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.minion, g.pelleter, g.naturalist]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [4.5, 8.5, -1.6, 7.5, 0, 0, 0]
    }],
};
exports.dropkick = {
    PARENT: [exports.genericTank],
    LABEL: 'Drop-kick',
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.1,
        SPEED: base.SPEED * 0.9,
    },
    GUNS: [{
        POSITION: [17, 2, -3, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.naturalist]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [4.5, 8.5, -1.6, 7.5, 0, 0, 0]
    }, {
        POSITION: [5, 11, 1, 10.5, 0, 180, 0,],
    }, {
        POSITION: [2, 14, 1, 15.5, 0, 180, 0,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.spawner, g.sidekick]),
            TYPE: exports.naturalistMinion,
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            MAX_CHILDREN: 1,
        },
    }, {
        POSITION: [4, 14, 1, 8, 0, 180, 0,],
    }],
};
exports.kinematic = {
    PARENT: [exports.genericTank],
    LABEL: 'Kinematic',
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.1,
        SPEED: base.SPEED * 0.8,
    },
    GUNS: [{
        POSITION: [17, 2, -3, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.naturalist, g.boxerfront, g.kinematic]),
            TYPE: exports.bullet,
            ALT_FIRE: true
        }
    }, {
        POSITION: [4.5, 8.5, -1.6, 7.5, 0, 0, 0]
    }, {
        POSITION: [16, 8, 1, 0, 0, 135, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.accelerator]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 225, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.accelerator]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 180, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.accelerator]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }]
};
exports.scattercannon = {
    PARENT: [exports.genericTank],
    LABEL: 'Scatter Cannon',
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.1,
        SPEED: base.SPEED * 0.9,
    },
    GUNS: [{
        POSITION: [20, 2, -3, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.naturalist, g.click, g.scattercannon]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 2, -3, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.naturalist, g.click, g.scattercannon]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 2, -3, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.naturalist, g.click, g.scattercannon]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 2, -3, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.naturalist, g.click, g.scattercannon]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [4.5, 6.5, -0.6, 9.5, 0, 0, 0]
    }, {
        POSITION: [4.5, 8.5, -1.6, 7.5, 0, 0, 0]
    }]
};
exports.cleanser = {
    PARENT: [exports.genericTank],
    LABEL: 'Cleanser',
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.1,
        SPEED: base.SPEED * 0.9,
    },
    GUNS: [{
        POSITION: [17, 0.7, -3, 2.7, 0, 0, 0.2],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.naturalist, g.spray, g.cleanser]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 2, -3, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.naturalist, g.cleanser]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [4.5, 8.5, -1.6, 7.5, 0, 0, 0]
    }]
};
exports.diploid = {
    PARENT: [exports.genericTank],
    LABEL: 'Diploid',
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.1,
        SPEED: base.SPEED * 0.9,
    },
    GUNS: [{
        POSITION: [17, 2, -3, 0, -3, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.naturalist, g.twin, g.diploid]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 2, -3, 0, 3, 0, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.naturalist, g.twin, g.diploid]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [4.5, 8.5, -1.6, 7.5, 0, 0, 0]
    }]
};
exports.haploid = {
    PARENT: [exports.genericTank],
    LABEL: 'Haploid',
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.1,
        SPEED: base.SPEED * 0.9,
    },
    GUNS: [{
        POSITION: [15, 2, -3, 0, -3, 0, 0.667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.naturalist, g.twin, g.diploid, g.haploid]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 2, -3, 0, 3, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.naturalist, g.twin, g.diploid, g.haploid]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 2, -3, 0, 0, 0, 0.334],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.naturalist, g.twin, g.diploid, g.haploid]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [4.5, 8.5, -1.6, 7.5, 0, 0, 0]
    }]
};
exports.coingun = {
    PARENT: [exports.genericTank],
    LABEL: 'Coin Gun',
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.1,
        SPEED: base.SPEED * 0.9,
    },
    GUNS: [{
        POSITION: [17, 2.5, -3, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.naturalist, g.pound, g.coingun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [4.5, 8.5, -1.4, 7.5, 0, 0, 0]
    }]
};
exports.entomologist = {
    PARENT: [exports.genericTank],
    LABEL: 'Entomologist',
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.1,
        SPEED: base.SPEED * 0.9,
    },
    GUNS: [{
        POSITION: [17, 6, -3, -3, 0, 0, 0],
    }, {
        POSITION: [17, 2, -3, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.pelleter, g.naturalist, g.entomologist]),
            TYPE: exports.bee
        }
    }, {
        POSITION: [4.5, 8.5, -1.6, 7.5, 0, 0, 0]
    }]
};
exports.artificialist = {
    PARENT: [exports.genericTank],
    LABEL: 'Artificialist',
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.1,
        SPEED: base.SPEED * 0.9,
    },
    GUNS: [{
        POSITION: [17, 2, -3, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.naturalist, g.heatseeker]),
            TYPE: exports.homingBullet
        }
    }, {
        POSITION: [4.5, 8.5, -1.6, 7.5, 0, 0, 0]
    }, {
        POSITION: [3, 11, 1.3, 17, 0, 0, 0],
    }]
};
exports.inferno = {
    PARENT: [exports.genericTank],
    LABEL: "Inferno",
    DANGER: 6,
    BODY: {
        ACCELERATION: base.ACCEL * 1.1,
    },
    GUNS: [{
        POSITION: [12, 8, 1.4, 0, 3, 0, 0],
    }, {
        POSITION: [28, 6, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.inferno]),
            TYPE: exports.infernoFlare
        }
    }]
};
exports.sprayer = {
    PARENT: [exports.genericTank],
    LABEL: "Sprayer",
    BODY: {
        ACCELERATION: base.ACCEL * 1.05,
    },
    DANGER: 6,
    GUNS: [{
        POSITION: [23, 7, 1, 0, 0, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.spray]),
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
exports.engine = {
    PARENT: [exports.genericTank],
    LABEL: "Engine",
    BODY: {
        ACCELERATION: base.ACCEL * .65,
    },
    DANGER: 7,
    GUNS: [{
        POSITION: [12, 10, 1.4, 11, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.engine]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 10, 1.4, 6.5, 0, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.engine]),
            TYPE: exports.bullet
        }
    }]
};
exports.steamengine = {
    PARENT: [exports.genericTank],
    LABEL: "Steam Engine",
    BODY: {
        ACCELERATION: base.ACCEL * .5,
    },
    DANGER: 8,
    GUNS: [{
        POSITION: [25.75, 6.5, 1, 0, 0, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.spray, g.engine, g.steamengine]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 10, 1.4, 11, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.engine, g.steamengine]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [21.25, 7, 1, 0, 0, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.spray, g.engine, g.steamengine]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 10, 1.4, 6.5, 0, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.engine, g.steamengine]),
            TYPE: exports.bullet
        }
    }]
};
exports.twinMachine = {
    PARENT: [exports.genericTank],
    LABEL: "Twin Machine",
    BODY: {
        ACCELERATION: base.ACCEL * 1.1,
    },
    DANGER: 6,
    GUNS: [{
        POSITION: [18, 6, 1.5, 0, 5.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.mach, g.twinmachine]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 6, 1.5, 0, -5.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.mach, g.twinmachine]),
            TYPE: exports.bullet
        }
    }]
};
exports.doubleMachine = {
    PARENT: [exports.genericTank],
    LABEL: "Double Machine",
    DANGER: 7,
    BODY: {
        ACCELERATION: base.ACCEL * 1.1,
    },
    GUNS: [{
        POSITION: [18, 6, 1.5, 0, 5.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.mach, g.twinmachine]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 6, 1.5, 0, -5.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.mach, g.twinmachine]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 6, 1.5, 0, 5.5, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.mach, g.twinmachine]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 6, 1.5, 0, -5.5, 180, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.mach, g.twinmachine]),
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.mach, g.bent, g.twinmachine]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 6, 1.5, 0, 2, 20, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.mach, g.bent, g.twinmachine]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 6, 1.5, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.mach, g.bent, g.twinmachine]),
            TYPE: exports.bullet
        }
    }]
};
exports.pentaMachine = {
    PARENT: [exports.genericTank],
    LABEL: "Penta Machine",
    DANGER: 7,
    BODY: {
        SPEED: .9 * base.SPEED
    },
    GUNS: [{
        POSITION: [14, 6, 1.5, 0, -4, -40, 2/3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.mach, g.bent, g.twinmachine, g.penta]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [14, 6, 1.5, 0, 4, 40, 2/3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.mach, g.bent, g.twinmachine, g.penta]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 6, 1.5, 0, -2, -20, 1/3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.mach, g.bent, g.twinmachine, g.penta]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 6, 1.5, 0, 2, 20, 1/3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.mach, g.bent, g.twinmachine, g.penta]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 6, 1.5, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.mach, g.bent, g.twinmachine, g.penta]),
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
                SHOOT_SETTINGS: combineStats([g.bullet, g.taurusPortalScaling]),
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
                SHOOT_SETTINGS: combineStats([g.bullet, g.taurusPortalScaling, g.taurusPortalScaling]),
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
                SHOOT_SETTINGS: combineStats([g.swarm, g.taurusPortalScaling]),
                TYPE: [exports.swarm, {
                    PERSISTS_AFTER_DEATH: true
                }],
                SHOOT_ON_DEATH: true
            }
        });
        return output;
    })()
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
            COLOR: 11
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
            COLOR: 11
        }
    }, {
        POSITION: [6, 10, -1.5, 6.5, 0, 0, 0]
    }]
};
exports.superlaser = {
    PARENT: [exports.genericTank],
    LABEL: 'Superlaser',
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [10, 9, -1.5, 6.5, 0, 0, 0],
        PROPERTIES: {
            COLOR: 13
        }
    }, {
        POSITION: [22, 9, 0.75, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.hitScanMain, g.superlaserMain]),
            SHOOT_SETTINGS2: combineStats([g.bullet, g.hitScan, g.superlaser]),
            SHOOT_SETTINGS3: combineStats([g.bullet, g.explosion, [1, 1, 1, .1, .8, .8, 1, 1, 1, .4, 1, 1, 1]]),
            TYPE: exports.bullet,
            ON_SHOOT: "hitScan2"
        }
    }, {
        POSITION: [18, 7, 0.75, 0, 0, 0, 0],
        PROPERTIES: {
            COLOR: 13
        }
    }, {
        POSITION: [6, 10, -1.5, 6.5, 0, 0, 0]
    }]
};
exports.pelleter = {
    PARENT: [exports.genericTank],
    DANGER: 5,
    LABEL: "Pelleter",
    GUNS: [{
        POSITION: [19, 2, 1, 0, 3, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 2, 1, 0, -3, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 17.5, 0.6, 0, 0, 0, 0]
    }]
};
exports.puntGun = {
    PARENT: [exports.genericTank],
    DANGER: 6,
    LABEL: "Punt Gun",
    GUNS: [{
        POSITION: [19, 2, 1, 0, 3, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 2, 1, 0, -3, 0, 1 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 2, 1, 0, 3, 0, 2 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 2, 1, 0, -3, 0, 3 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 2, 1, 0, 3, 0, 4 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 2, 1, 0, -3, 0, 5 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 17.5, 0.6, 0, 0, 0, 0]
    }]
};
exports.gunner = {
    PARENT: [exports.genericTank],
    LABEL: "Gunner",
    DANGER: 6,
    GUNS: [{
        POSITION: [12, 3.5, 1, 0, 7.25, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 3.5, 1, 0, -7.25, 0, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 3.5, 1, 0, 3.75, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 3.5, 1, 0, -3.75, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner]),
            TYPE: exports.bullet
        }
    }]
};
exports.hurricane = {
    PARENT: [exports.genericTank],
    LABEL: "Cyclone",
    DANGER: 7,
    GUNS: [{
        POSITION: [15, 3.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.cyclone]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 3.5, 1, 0, 0, 30, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.cyclone]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 3.5, 1, 0, 0, 60, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.cyclone]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 3.5, 1, 0, 0, 90, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.cyclone]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 3.5, 1, 0, 0, 120, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.cyclone]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 3.5, 1, 0, 0, 150, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.cyclone]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 3.5, 1, 0, 0, 180, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.cyclone]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 3.5, 1, 0, 0, 210, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.cyclone]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 3.5, 1, 0, 0, 240, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.cyclone]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 3.5, 1, 0, 0, 270, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.cyclone]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 3.5, 1, 0, 0, 300, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.cyclone]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 3.5, 1, 0, 0, 330, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.cyclone]),
            TYPE: exports.bullet
        }
    }]
};
exports.vulcan = {
    PARENT: [exports.genericTank],
    LABEL: 'Vulcan',
    DANGER: 7,
    GUNS: [{
        POSITION: [30, 1.5, 1, 0, -4.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.vulc]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [30, 1.5, 1, 0, -4.5, 0, .9],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.vulc]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [30, 1.5, 1, 0, 4.5, 0, .4],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.vulc]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [30, 1.5, 1, 0, 4.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.vulc]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [30, 1.5, 1, 0, -2.5, 0, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.vulc]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [30, 1.5, 1, 0, 2.5, 0, .3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.vulc]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [30, 1.5, 1, 0, 2.5, 0, .6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.vulc]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [30, 1.5, 1, 0, -2.5, 0, .8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.vulc]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [30, 1.5, 1, 0, 0, 0, .2],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.vulc]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [30, 1.5, 1, 0, 0, 0, .7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.vulc]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 16, 1, 0, 0, 0, 0]
    }, {
        POSITION: [5, 16, 1, 20, 0, 0, 0]
    }]
};
exports.gunnerCruiser = {
    PARENT: [exports.genericTank],
    LABEL: "Gunner Cruiser",
    STAT_NAMES: statnames.generic,
    DANGER: 7,
    GUNS: [{
        POSITION: [14, 3, 1, 0, -5.5, -7, .334],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.minishotSmall]),
            TYPE: exports.swarm
        }
    }, {
        POSITION: [14, 3, 1, 0, 5.5, 7, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.minishotSmall]),
            TYPE: exports.swarm
        }
    }, {
        POSITION: [19, 2, 1, 0, 3, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.guard]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 2, 1, 0, -3, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.guard]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 17.5, 0.6, 0, 0, 0, 0]
    }]
};
exports.heavyGunner = {
    PARENT: [exports.genericTank],
    LABEL: "Rimfire",
    DANGER: 7,
    GUNS: [{
        POSITION: [12, 5, 1, 0, 7.25, 10, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.pound]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 5, 1, 0, -7.25, -10, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.pound]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 5, 1, 0, 3.75, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.pound]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 5, 1, 0, -3.75, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.pound]),
            TYPE: exports.bullet
        }
    }]
};
exports.machinegunner = {
    PARENT: [exports.genericTank],
    LABEL: "Machine Gunner",
    DANGER: 6,
    BODY: {
        SPEED: .9 * base.SPEED
    },
    GUNS: [{
        POSITION: [14, 3, 4, -3, 5, 0, .6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.machgunner]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [14, 3, 4, -3, -5, 0, .8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.machgunner]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [14, 3, 4, 0, 2.5, 0, .4],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.machgunner]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [14, 3, 4, 0, -2.5, 0, .2],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.machgunner]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [14, 3, 4, 3, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.machgunner]),
            TYPE: exports.bullet
        }
    }]
};
exports.screwGun = {
    PARENT: [exports.genericTank],
    DANGER: 6,
    LABEL: "Screwgun",
    GUNS: [{
        POSITION: [19, 2, 1, 0, -2.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwgun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 2, 1, 0, 2.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwgun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0]
    }]
};
exports.nailgun = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    LABEL: "Nailgun",
    GUNS: [{
        POSITION: [19, 2, 1, 0, -2.5, 0, 0.334],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwgun, g.nailgun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 2, 1, 0, 2.5, 0, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwgun, g.nailgun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 2, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwgun, g.nailgun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0]
    }]
};
exports.screwPunt = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    LABEL: "Screw Punt",
    GUNS: [{
        POSITION: [19, 2, 1, 0, 2.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.screwgun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 2, 1, 0, -2.5, 0, 1 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.screwgun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 2, 1, 0, 2.5, 0, 2 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.screwgun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 2, 1, 0, -2.5, 0, 3 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.screwgun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 2, 1, 0, 2.5, 0, 4 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.screwgun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 2, 1, 0, -2.5, 0, 5 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.screwgun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0]
    }]
};
exports.bandolier = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    LABEL: "Bandolier",
    GUNS: [{
        POSITION: [23, 2, 1, 0, 3, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.bandolier]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [23, 2, 1, 0, -3, 0, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.bandolier]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [21, 2, 1, 0, 3, 0, .2],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.bandolier]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [21, 2, 1, 0, -3, 0, .3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.bandolier]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 2, 1, 0, 3, 0, .4],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.bandolier]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 2, 1, 0, -3, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.bandolier]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 2, 1, 0, 3, 0, .6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.bandolier]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 2, 1, 0, -3, 0, .7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.bandolier]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 2, 1, 0, 3, 0, .8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.bandolier]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 2, 1, 0, -3, 0, .9],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.bandolier]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 17.5, 0.6, 0, 0, 0, 0]
    }]
};
exports.gust = {
    PARENT: [exports.genericTank],
    LABEL: 'Gust',
    DANGER: 8,
    BODY: {
        SPEED: base.SPEED * .9
    },
    GUNS: [{
        POSITION: [5, 9, -1.6, 7, 0, 10, 0]
    }, {
        POSITION: [5, 9, -1.6, 7, 0, -10, 0]
    }]
};
for (let i = 0; i < 10; i++) exports.gust.GUNS.push({
    POSITION: [3, 2.5, 1, 13.75, 0, i * 4 - 20, i / 20],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.bandolier, g.gust]),
        TYPE: exports.bullet,
        COLOR: 9
    }
});
for (let i = 0; i < 10; i++) exports.gust.GUNS.push({
    POSITION: [3, 2.5, 1, 13.75, 0, 20 - i * 4, (i + 10) / 20],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.bandolier, g.gust]),
        TYPE: exports.bullet,
        COLOR: 9
    }
});
exports.gust.GUNS.push({
    POSITION: [5, 9, -1.6, 7, 0, 0, 0]
});
exports.gustception = makeCeption(exports.gust);
exports.cwisLaser = {
    PARENT: [exports.bullet],
    LABEL: "Laser",
    SHAPE: -1
};
exports.cwisTurret = {
    PARENT: [exports.genericTank],
    LABEL: "Turret",
    BODY: {
        FOV: 1
    },
    DANGER: 0,
    TARGETS_AMMO: true,
    CONTROLLERS: ["onlyAcceptInArc", "nearestDifferentMaster", "spinWhenIdle"],
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [20, 7.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, [0.2, 0, 0.1, 1, 0.3, 0.3, 2, 2, 1, 0.2, 0.1, 0.1, 1]]),
            TYPE: exports.cwisLaser,
            COLOR_OVERRIDE: 11,
            COLOR: 9,
            SKIN: 2
        }
    }]
};
exports.lockheedMissile = {
    PARENT: [exports.swarm],
    LABEL: "Countermeasure Missile",
    SHAPE: shapeConfig.missile,
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    MISSILE: true,
    TARGETS_MISSILES: true,
    GUNS: [{
        POSITION: [1, 1, 1, 0, 0, 0, Infinity],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.explosion, [1, 1, 1, 1, 0.4, 0.4, 1, 1, 1, 0.3, 1, 1, 1]]),
            TYPE: [exports.explosion, {
                PERSISTS_AFTER_DEATH: true
            }],
            SHOOT_ON_DEATH: true
        }
    }]
};
exports.lockheedTurret = {
    PARENT: [exports.genericTank],
    LABEL: "Turret",
    BODY: {
        FOV: 5
    },
    DANGER: 0,
    TARGETS_MISSILES: true,
    CONTROLLERS: ["onlyAcceptInArc", "nearestDifferentMaster"],
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [20, 15, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, [3, 0, 0.1, 1, 0.3, 0.3, 2, 2, 1, 2, 0.1, 0.1, 1]]),
            TYPE: exports.lockheedMissile,
            COLOR_OVERRIDE: 16,
            COLOR: 9,
            SKIN: 1
        }
    }]
};
exports.cwis = makeAuto({
    PARENT: [exports.genericTank],
    DANGER: 7,
    LABEL: "CWIS",
    GUNS: [{
        POSITION: [19, 2, 1, 0, -2.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwgun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 2, 1, 0, 2.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwgun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0]
    }]
}, "CWIS", {
    type: exports.cwisTurret,
    size: 15
});
exports.phalanx = {
    PARENT: [exports.genericTank],
    DANGER: 8,
    LABEL: "Phalanx",
    GUNS: [{
        POSITION: [19, 2, 1, 0, -2.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwgun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 2, 1, 0, 2.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwgun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0]
    }],
    TURRETS: [{
        POSITION: [15, 0, 0, 180, 360, 1],
        TYPE: exports.cwisTurret
    }, {
        POSITION: [10, 0, 0, 0, 360, 1],
        TYPE: exports.cwisTurret
    }]
};
exports.lockheed = makeAuto({
    PARENT: [exports.genericTank],
    DANGER: 8,
    LABEL: "Lockheed",
    GUNS: [{
        POSITION: [19, 2, 1, 0, -2.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwgun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 2, 1, 0, 2.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwgun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0]
    }]
}, "Lockheed", {
    type: exports.lockheedTurret,
    size: 15
});
exports.ohmyfuckinggod = {
    PARENT: [exports.genericTank],
    DANGER: 25,
    LABEL: "Oh my fucking god I HAVE NUKESSSSDSDSDSDSDSDSDS",
    GUNS: [{
        POSITION: [10, 9, -.5, 9, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.shrapnel, g.fake, g.norecoil]),
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
        POSITION: [17, 10, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.shrapnel]),
            TYPE: exports.crockettNuke,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [17, 10, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.shrapnel]),
            TYPE: exports.triNuke,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [17, 10, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.shrapnel]),
            TYPE: exports.rpgRocket,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [17, 10, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.shrapnel]),
            TYPE: exports.icbmMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [5.5, 10, -1.3, 6.5, 0, 0, 0]
    }],
    TURRETS: (() => {
        let output = [{
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: exports.lockheedTurret
        }];
        for (let i = 1; i < 6; i++) {
            output.push({
                POSITION: [10, 8, 0, 360 / 6 * i, 90, 0],
                TYPE: exports.cwisTurret
            });
        }
        return output;
    })()
};
exports.smasherBody = {
    LABEL: '',
    CONTROLLERS: ['spin'],
    COLOR: 9,
    SHAPE: 6,
    INDEPENDENT: true,
};
exports.smasherBody2 = {
    LABEL: '',
    CONTROLLERS: ['fastspin'],
    COLOR: 9,
    SHAPE: 6,
    INDEPENDENT: true,
};
exports.landmineBody = {
    LABEL: '',
    CONTROLLERS: ['spin'],
    COLOR: 9,
    SHAPE: 1000006,
    INDEPENDENT: true
};
exports.landmineBody2 = {
    LABEL: '',
    CONTROLLERS: ['fastspin'],
    COLOR: 9,
    SHAPE: 1000006,
    INDEPENDENT: true
};
exports.spikeBody = {
    LABEL: "",
    CONTROLLERS: ["spin"],
    COLOR: 9,
    SHAPE: -4,
    INDEPENDENT: true
};
exports.spikeBody1 = {
    LABEL: "",
    CONTROLLERS: ["fastspin"],
    COLOR: 9,
    SHAPE: 3,
    INDEPENDENT: true
};
exports.spikeBody2 = {
    LABEL: "",
    CONTROLLERS: ["reversespin"],
    COLOR: 9,
    SHAPE: 3,
    INDEPENDENT: true
};
exports.megasmashBody = {
    LABEL: "",
    CONTROLLERS: ["spin"],
    COLOR: 9,
    SHAPE: -6,
    INDEPENDENT: true
};
exports.smasher = {
    PARENT: [exports.genericTank],
    LABEL: 'Smasher',
    DANGER: 5,
    BODY: {
        SPEED: 1.15 * base.SPEED,
        FOV: 1.05 * base.FOV,
        DENSITY: 2 * base.DENSITY
    },
    TURRETS: [{
        /** SIZE     X       Y     ANGLE    ARC */
        POSITION: [21.5, 0, 0, 0, 360, 0,],
        TYPE: exports.smasherBody,
    }],
    IS_SMASHER: true,
    SKILL_CAP: [12, 0, 0, 0, 0, 12, 12, 12, 12, 12],
    STAT_NAMES: statnames.smasher,
};
exports.landmine = {
    PARENT: [exports.genericTank],
    LABEL: 'Landmine',
    DANGER: 6,
    BODY: {
        SPEED: 1.15 * base.SPEED,
        FOV: 1.05 * base.FOV,
        DENSITY: 2 * base.DENSITY
    },
    TURRETS: [{
        POSITION: [21.5, 0, 0, 0, 360, 0],
        TYPE: exports.landmineBody2
    }, {
        POSITION: [21.5, 0, 0, 0, 360, 0],
        TYPE: exports.landmineBody
    }],
    IS_SMASHER: true,
    INVISIBLE: [.5, .01],
    TOOLTIP: "Stay still to turn invisible",
    SKILL_CAP: [12, 0, 0, 0, 0, 12, 12, 12, 12, 12],
    STAT_NAMES: statnames.smasher,
};

exports.megasmash = {
    PARENT: [exports.genericTank],
    LABEL: "Mega-Smasher",
    DANGER: 7,
    BODY: {
        SPEED: 1.1 * base.SPEED,
        FOV: 1.1 * base.FOV,
        DENSITY: 5 * base.DENSITY
    },
    IS_SMASHER: true,
    SKILL_CAP: [12, 0, 0, 0, 0, 12, 12, 12, 12, 12],
    STAT_NAMES: statnames.smasher,
    TURRETS: [{
        POSITION: [24, 0, 0, 0, 360, 0],
        TYPE: exports.megasmashBody
    }]
};
exports.spike = {
    PARENT: [exports.genericTank],
    LABEL: "Spike",
    DANGER: 7,
    BODY: {
        SPEED: 1.2 * base.SPEED,
        DAMAGE: 1.1 * base.DAMAGE,
        FOV: 1.05 * base.FOV,
        DENSITY: 2 * base.DENSITY
    },
    IS_SMASHER: true,
    SKILL_CAP: [12, 0, 0, 0, 0, 12, 12, 12, 12, 12],
    STAT_NAMES: statnames.smasher,
    TURRETS: [{
        POSITION: [20.5, 0, 0, 0, 360, 0],
        TYPE: exports.spikeBody
    }, {
        POSITION: [20.5, 0, 0, 120, 360, 0],
        TYPE: exports.spikeBody
    }, {
        POSITION: [20.5, 0, 0, 240, 360, 0],
        TYPE: exports.spikeBody
    }]
};
exports.weirdSpike = {
    PARENT: [exports.genericTank],
    LABEL: "Ninja Star",
    DANGER: 7,
    BODY: {
        SPEED: 1.3 * base.SPEED,
        DAMAGE: 1.15 * base.DAMAGE,
        FOV: 1.05 * base.FOV,
        DENSITY: 1.5 * base.DENSITY
    },
    IS_SMASHER: true,
    SKILL_CAP: [12, 0, 0, 0, 0, 12, 12, 12, 12, 12],
    STAT_NAMES: statnames.smasher,
    TURRETS: [{
        POSITION: [20.5, 0, 0, 0, 360, 0],
        TYPE: exports.spikeBody1
    }, {
        POSITION: [20.5, 0, 0, 180, 360, 0],
        TYPE: exports.spikeBody2
    }]
};
exports.bonker = {
    PARENT: [exports.genericTank],
    LABEL: 'Bonker',
    DANGER: 5,
    SIZE: exports.genericTank.SIZE * .6,
    BODY: {
        SPEED: 1.5 * base.SPEED,
        DAMAGE: 1.1 * base.DAMAGE,
        FOV: 1.1 * base.FOV,
        DENSITY: 1.4  * base.DENSITY
    },
    TURRETS: [{
        /** SIZE     X       Y     ANGLE    ARC */
        POSITION: [21.5, 0, 0, 0, 360, 0,],
        TYPE: exports.smasherBody,
    }],
    IS_SMASHER: true,
    SKILL_CAP: [12, 0, 0, 0, 0, 12, 12, 12, 12, 12],
    STAT_NAMES: statnames.smasher,
};
exports.autosmash = makeAuto(exports.smasher, "Auto-Smasher", {
    size: 11
}), exports.autosmash.SKILL_CAP = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
exports.lancer = makeLancer("Lancer");
exports.sword = makeLancer("Sword", 1.25);
exports.axe = makeLancer("Axe", 1, 1.3, 1.2, {
    speed: 0.8
});
exports.dagger = makeLancer("Dagger", 0.75, 0.75, 0.9, {
    speed: 1.3
});
exports.trailblazer = makeLancer("Trailblazer", 1, 1, 1, {
    guns: [{
        POSITION: [14, 6, 1, 0, -2, 130, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster]),
            TYPE: exports.bullet,
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [14, 6, 1, 0, 2, 230, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster]),
            TYPE: exports.bullet,
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
});
exports.shredder = makeLancer("Shredder", 1, 1.1, 1.2, 1);
for (let i = 7, k = 3; i > 0; i--) {
    exports.shredder.GUNS.push({
        POSITION: [3, 0.05, -55, (k), (-(20 / 8 * i) - 5), 80, 0],
    });
    k += (3.3 / 8) * 0.9 * 0.75
};
for (let i = 7, k = 3; i > 0; i--) {
    exports.shredder.GUNS.push({
        POSITION: [3, 0.05, -55, (k), ((20 / 8 * i) + 5), -80, 0],
    });
    k += (3.3 / 8) * 0.9 * 0.75
};
exports.shredder.GUNS.push(exports.shredder.GUNS[0]);
exports.flail = makeFlail("Flail", 3);
exports.reacher = makeFlail("Reacher", 4);
exports.whammy = makeFlail("Double Whammy", 4, 1, 40, exports.smasherBody, 2);
exports.hongKongLongDong = makeFlail("Hong Kong Long Dong", 5);
exports.mace = makeFlail("Mace", 3, 1.05, 65, exports.spike);
exports.nossle = makeFlail("Nossle", 3, 1.05, 90, exports.spike);
exports.marner = makeFlail("Marner", 2, 1, 50, exports.smasherBody, 2);
exports.bloodcurdler = makeFlail("Bloodcurdler", 2, 1.05, 65, exports.spike, 2);
exports.fidgetSpinner = makeFlail("Fidget Spinner", 1, 1, 50, exports.smasherBody, 3);
exports.windmill = makeFlail("Windmill", 2, 1, 50, exports.smasherBody, 4);
exports.catO = makeFlail("Cat O' Nine Tails", 3, .85, 25, exports.smasherBody, 9);
exports.valientFlail = makeFlail("Valient Flail", 2, 0.75);
exports.autoFlail = makeAuto(exports.flail);
exports.flangle = makeFlail("Flangle", 3, 1, 50, exports.smasherBody, 1, [{
    POSITION: [15, 6, 1, 0, 0, 150, .1],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.thruster]),
        TYPE: exports.bullet,
        LABEL: gunCalcNames.thruster
    }
}, {
    POSITION: [15, 6, 1, 0, 0, 210, .1],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.thruster]),
        TYPE: exports.bullet,
        LABEL: gunCalcNames.thruster
    }
}]);
exports.marner.FACING_TYPE = exports.catO.FACING_TYPE = exports.bloodcurdler.FACING_TYPE = exports.windmill.FACING_TYPE = exports.fidgetSpinner.FACING_TYPE = "windmill";
exports.akafuji0 = makeAka("Akafuji", 6, 6, 1, 0, {
    guns: [{
        POSITION: [18, 8, 1, 0, 0, 180, 0],
        PROPERTIES: {
            COLOR: 9
        }
    }, {
        POSITION: [1, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.fake]),
            TYPE: exports.bullet,
            ALT_FIRE: true,
            ON_SHOOT: "aka"
        }
    },]
});
exports.akafuji31 = makeAka("Akafuji", 6, 6, 1, 60, {
    guns: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet]),
            TYPE: exports.bullet,
        }
    }, {
        POSITION: [1, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.fake]),
            TYPE: exports.bullet,
            ALT_FIRE: true,
            ON_SHOOT: 'aka2'
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 180, 0],
        PROPERTIES: {
            COLOR: 9
        }
    }],
    offset: 0,
    offset2: 0.55
});
for (let i = 1; i < 31; i++) {
    exports["akafuji" + i] = makeAka("Akafuji", 6, 6, 1, 60 / 31 * i, {
        offset: (31 - i) / 31,
        offset2: 0.55 / 31 * i,
        guns: [{
            POSITION: [10 + 8 / 31 * i, 8, 1, 0, 0, 0, 0],
        }, {
            POSITION: [18, 8, 1, 0, 0, 180, 0],
            PROPERTIES: {
                COLOR: 9
            }
        }],
        turrets: false
    });
}
exports.saboten0 = makeAka("Saboten", 6, 6, 1, 0, {
    guns: [{
        POSITION: [20, 8, 1, 0, 5.5, 180, 0],
        PROPERTIES: {
            COLOR: 9
        }
    }, {
        POSITION: [20, 8, 1, 0, -5.5, 180, 0.5],
        PROPERTIES: {
            COLOR: 9
        }
    }, {
        POSITION: [1, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.fake]),
            TYPE: exports.bullet,
            ALT_FIRE: true,
            ON_SHOOT: "sab"
        }
    }]
});
exports.saboten31 = makeAka("Saboten", 6, 6, 1, 60, {
    guns: [{
        POSITION: [20, 8, 1, 0, 5.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 8, 1, 0, -5.5, 0, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [1, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.fake]),
            TYPE: exports.bullet,
            ALT_FIRE: true,
            ON_SHOOT: 'sab2'
        }
    }, {
        POSITION: [20, 8, 1, 0, 5.5, 180, 0],
        PROPERTIES: {
            COLOR: 9
        }
    }, {
        POSITION: [20, 8, 1, 0, -5.5, 180, 0.5],
        PROPERTIES: {
            COLOR: 9
        }
    },],
    offset: 0,
    offset2: 0.55
});
for (let i = 1; i < 31; i++) {
    exports["saboten" + i] = makeAka("Saboten", 6, 6, 1, 60 / 31 * i, {
        offset: (31 - i) / 31,
        offset2: 0.55 / 31 * i,
        guns: [{
            POSITION: [10 + 10 / 30 * i, 8 / 30 * i, 1, 0, 5.5 / 30 * i, 0, 0],
        }, {
            POSITION: [10 + 10 / 30 * i, 8 / 30 * i, 1, 0, -5.5 / 30 * i, 0, 0],
        }, {
            POSITION: [20, 8, 1, 0, 5.5, 180, 0],
            PROPERTIES: {
                COLOR: 9
            }
        }, {
            POSITION: [20, 8, 1, 0, -5.5, 180, 0.5],
            PROPERTIES: {
                COLOR: 9
            }
        }],
        turrets: false
    });
}
exports.vessle0 = makeAka("Vessle", 6, 6, 1, 0, {
    guns: [{
        POSITION: [12, 10, 1.4, 8, 0, 180, 0],
        PROPERTIES: {
            COLOR: 9
        }
    }, {
        POSITION: [1, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.fake]),
            TYPE: exports.bullet,
            ALT_FIRE: true,
            ON_SHOOT: "ves"
        }
    }]
});
exports.vessle31 = makeAka("Vessle", 6, 6, 1, 60, {
    guns: [{
        POSITION: [12, 10, 1.4, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [1, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.fake]),
            TYPE: exports.bullet,
            ALT_FIRE: true,
            ON_SHOOT: 'ves2'
        }
    }, {
        POSITION: [12, 10, 1.4, 8, 0, 180, 0],
        PROPERTIES: {
            COLOR: 9
        }
    }],
    offset: 0,
    offset2: 0.55
});
for (let i = 1; i < 31; i++) {
    exports["vessle" + i] = makeAka("Vessle", 6, 6, 1, 60 / 31 * i, {
        offset: (31 - i) / 31,
        offset2: 0.55 / 31 * i,
        guns: [{
            POSITION: [12 / 30 * i, 10, 1.4, 8, 0, 0, 0],
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 180, 0],
            PROPERTIES: {
                COLOR: 9
            }
        }
        ],
        turrets: false
    });
}
exports.autoLancer = makeAuto(exports.lancer);
exports.spoopyGhost = makeHybrid(exports.lancer, "👻 Spoopy Ghost 👻");
// Aircraft Parent
exports.aircraftCarrierPlaneParent = {
    LABEL: "Plane",
    TYPE: "drone",
    ACCEPTS_SCORE: false,
    DANGER: 2,
    CONTROL_RANGE: 0,
    SHAPE: 0,
    MOTION_TYPE: "chase",
    FACING_TYPE: "smoothToTarget",
    BODY: {
        PENETRATION: .5,
        PUSHABILITY: 1,
        ACCELERATION: .08,
        HEALTH: 1.5 * wepHealthFactor,
        DAMAGE: 2.6 * wepDamageFactor,
        SPEED: 4,
        RANGE: 90,
        DENSITY: 0.5,
        RESIST: 1.5,
        FOV: 1.25
    },
    HITS_OWN_TYPE: "hard",
    DRAW_HEALTH: false,
    CLEAR_ON_MASTER_UPGRADE: true,
    BUFF_VS_FOOD: true,
    CONTROLLERS: ["plane"],
    IS_PLANE: true,
    GO_THROUGH_BASES: true,
    GO_THROUGH_WALLS: true,
    LAYER: 100
};
exports.fighterParent = {
    PARENT: [exports.minion],
    LABEL: "Fighter",
    IS_PLANE: true,
    GO_THROUGH_BASES: true,
    GO_THROUGH_WALLS: true,
    LAYER: 100,
    TARGET_PLANES: true,
    BODY: {
        FOV: 3
    }
};
// Aircraft Standard Ammunition
g.antiAircraft = [1.4, 0, 2.6, .5, .3, .8, 2, 2.25, 1.5, 1, 1, 3, 1];
exports.antiAircraftTurret = {
    PARENT: [exports.turretParent],
    INDEPENDENT: true,
    TARGET_PLANES: true,
    SHAPE: [
        [-1, -1],
        [0.5, -1],
        [1, -0.5],
        [1, 0.5],
        [0.5, 1],
        [-1, 1]
    ],
    GUNS: [{
        POSITION: [20, 5, .75, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.antiAircraft]),
            TYPE: exports.shard
        }
    }]
};
exports.apBomb = {
    PARENT: [exports.bullet],
    LABEL: "Bomb",
    SHAPE: shapeConfig.nuke,
    PERSISTS_AFTER_DEATH: true,
    ALWAYS_ACTIVE: true,
    GO_THROUGH_WALLS: true,
    GUNS: (function () {
        let output = [];
        for (let i = 0; i < 8; i++) output.push({
            POSITION: [1, 1, 1, 0, 0, 360 / 8 * i, Infinity],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.minion]),
                TYPE: [exports.shard, {
                    PERSISTS_AFTER_DEATH: true
                }],
                SHOOT_ON_DEATH: true
            }
        });
        return output;
    })()
};
exports.heBomb = {
    PARENT: [exports.bullet],
    LABEL: "Bomb",
    SHAPE: shapeConfig.nuke,
    PERSISTS_AFTER_DEATH: true,
    ALWAYS_ACTIVE: true,
    GO_THROUGH_WALLS: true,
    GUNS: (function () {
        let output = [{
            POSITION: [1, 7.5, 1, 0, 0, 0, Infinity],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.explosion, [1, 1, 1, 1, .25, .25, 2, 1, 1, .5, 1, 1, 1]]),
                TYPE: [exports.explosion, {
                    PERSISTS_AFTER_DEATH: true
                }],
                SHOOT_ON_DEATH: true
            }
        }];
        for (let i = 0; i < 8; i++) output.push({
            POSITION: [1, 1, 1, 0, 0, 360 / 8 * i, Infinity],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.minion, g.weak]),
                TYPE: [exports.shard, {
                    PERSISTS_AFTER_DEATH: true
                }],
                SHOOT_ON_DEATH: true
            }
        });
        return output;
    })()
};
exports.sapBomb = {
    PARENT: [exports.bullet],
    LABEL: "Bomb",
    SHAPE: shapeConfig.nuke,
    PERSISTS_AFTER_DEATH: true,
    ALWAYS_ACTIVE: true,
    GO_THROUGH_WALLS: true,
    GUNS: (function () {
        let output = [{
            POSITION: [1, 7.5, 1, 0, 0, 0, Infinity],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.explosion, [1, 1, 1, 1, .175, .175, 1.6, 1, 1, .5, 1, 1, 1]]),
                TYPE: [exports.explosion, {
                    PERSISTS_AFTER_DEATH: true
                }],
                SHOOT_ON_DEATH: true
            }
        }];
        for (let i = 0; i < 8; i++) output.push({
            POSITION: [1, 1, 1, 0, 0, 360 / 8 * i, Infinity],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.minion]),
                TYPE: [exports.shard, {
                    PERSISTS_AFTER_DEATH: true
                }],
                SHOOT_ON_DEATH: true
            }
        });
        return output;
    })()
};
exports.skipBomb = {
    PARENT: [exports.bullet],
    LABEL: "Skip Bomb",
    INDEPENDENT: true,
    BODY: {
        RANGE: 120
    },
    MOTION_TYPE: "sidewinder",
    FACING_TYPE: "smoothWithMotion",
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    LIKES_SHAPES: true,
    SHAPE: shapeConfig.nuke,
    PERSISTS_AFTER_DEATH: true,
    ALWAYS_ACTIVE: true,
    GO_THROUGH_WALLS: true,
    INDEPENDENT: true,
    GUNS: (function () {
        let output = [{
            POSITION: [1, 7.5, 1, 0, 0, 0, Infinity],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.explosion, [1, 1, 1, 1, .45, .6, 2, 1, 1, .5, 1, 1, 1]]),
                TYPE: [exports.explosion, {
                    PERSISTS_AFTER_DEATH: true
                }],
                SHOOT_ON_DEATH: true
            }
        }];
        for (let i = 0; i < 8; i++) output.push({
            POSITION: [1, 1, 1, 0, 0, 360 / 8 * i, Infinity],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.minion]),
                TYPE: [exports.shard, {
                    PERSISTS_AFTER_DEATH: true
                }],
                SHOOT_ON_DEATH: true
            }
        });
        return output;
    })()
};
exports.carpetBomb = {
    PARENT: [exports.bullet],
    LABEL: "Bomb",
    SHAPE: shapeConfig.nuke,
    PERSISTS_AFTER_DEATH: true,
    ALWAYS_ACTIVE: true,
    GO_THROUGH_WALLS: true,
    GUNS: (function () {
        let output = [{
            POSITION: [1, 7.5, 1, 0, 0, 0, Infinity],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.explosion, [1, 1, 1, 1, .1, .1, 1, 1, 1, .5, 1, 1, 1]]),
                TYPE: [exports.explosion, {
                    PERSISTS_AFTER_DEATH: true
                }],
                SHOOT_ON_DEATH: true
            }
        }];
        for (let i = 0; i < 8; i++) output.push({
            POSITION: [1, 1, 1, 0, 0, 360 / 8 * i, Infinity],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.minion, g.weak]),
                TYPE: [exports.shard, {
                    PERSISTS_AFTER_DEATH: true
                }],
                SHOOT_ON_DEATH: true
            }
        });
        return output;
    })()
};
exports.torpedo = {
    PARENT: [exports.bullet],
    LABEL: "Torpedo",
    SHAPE: shapeConfig.rpgRocket,
    PERSISTS_AFTER_DEATH: true,
    ALWAYS_ACTIVE: true,
    GO_THROUGH_WALLS: true
};
exports.apRocket = {
    PARENT: [exports.bullet],
    LABEL: "Rocket",
    SHAPE: shapeConfig.missile,
    INDEPENDENT: true,
    PERSISTS_AFTER_DEATH: true,
    ALWAYS_ACTIVE: true,
    GO_THROUGH_WALLS: true,
    GUNS: [{
        POSITION: [1, 4, 1, 0, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }]
};
exports.heRocket = {
    PARENT: [exports.bullet],
    LABEL: "Rocket",
    SHAPE: shapeConfig.missile,
    INDEPENDENT: true,
    PERSISTS_AFTER_DEATH: true,
    ALWAYS_ACTIVE: true,
    GO_THROUGH_WALLS: true,
    GUNS: (function () {
        const output = [{
            POSITION: [1, 4, 1, 0, 0, 180, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.bullet, g.thruster]),
                TYPE: [exports.bullet, {
                    PERSISTS_AFTER_DEATH: true
                }]
            }
        }, {
            POSITION: [1, 5, 1, 0, 0, 0, Infinity],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.explosion, [1, 1, 1, 1, .175, .75, 2, 1, 1, .25, 1, 1, 1]]),
                TYPE: [exports.explosion, {
                    PERSISTS_AFTER_DEATH: true
                }],
                SHOOT_ON_DEATH: true
            }
        }];
        for (let i = 0; i < 12; i++) {
            output.push({
                POSITION: [1, 1, 1, 0, 0, 360 / 8 * i, Infinity],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.bullet, g.minion, g.weak]),
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
exports.sapRocket = {
    PARENT: [exports.bullet],
    LABEL: "Rocket",
    SHAPE: shapeConfig.missile,
    INDEPENDENT: true,
    PERSISTS_AFTER_DEATH: true,
    ALWAYS_ACTIVE: true,
    GO_THROUGH_WALLS: true,
    GUNS: (function () {
        const output = [{
            POSITION: [1, 4, 1, 0, 0, 180, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.bullet, g.thruster]),
                TYPE: [exports.bullet, {
                    PERSISTS_AFTER_DEATH: true
                }]
            }
        }, {
            POSITION: [1, 5, 1, 0, 0, 0, Infinity],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.explosion, [1, 1, 1, 1, .08, .45, 2, 1, 1, .25, 1, 1, 1]]),
                TYPE: [exports.explosion, {
                    PERSISTS_AFTER_DEATH: true
                }],
                SHOOT_ON_DEATH: true
            }
        }];
        for (let i = 0; i < 12; i++) {
            output.push({
                POSITION: [1, 1, 1, 0, 0, 360 / 8 * i, Infinity],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.bullet, g.minion]),
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
exports.alexanderNevsky = (function () {
    g.nevsky = [12, 0, 1, 1, .9, .8, .7, 2, 1, 2, 1, 1.75, 2];
    g.nevskySecondary = [6, 0, 1, 1, .6, .6, 1, 1.5, 1, 1, 1, 2, 1];
    exports.nevskyMainGun = {
        PARENT: [exports.genericTank],
        LABEL: "Turret",
        DANGER: 0,
        COLOR: 16,
        SHAPE: [
            [1, -1],
            [-0.5, -1],
            [-1, -0.5],
            [-1, 0.5],
            [-0.5, 1],
            [1, 1]
        ],
        CONTROLLERS: ["onlyAcceptInArc", "onlyFireWhenInRange"],
        GUNS: [{
            POSITION: [23, 3.5, 1, 0, -4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.shell, g.nevsky]),
                TYPE: exports.shard
            }
        }, {
            POSITION: [23, 3.5, 1, 0, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.shell, g.nevsky]),
                TYPE: exports.shard
            }
        }]
    };
    exports.nevskySecondary = {
        PARENT: [exports.turretParent],
        INDEPENDENT: true,
        SHAPE: [
            [1, -1],
            [-0.5, -1],
            [-1, -0.5],
            [-1, 0.5],
            [-0.5, 1],
            [1, 1]
        ],
        GUNS: [{
            POSITION: [23, 3.5, 1, 0, -4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.shell, g.nevskySecondary]),
                TYPE: exports.shard
            }
        }, {
            POSITION: [23, 3.5, 1, 0, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.shell, g.nevskySecondary]),
                TYPE: exports.shard
            }
        }]
    };
    exports.nevskyProp = {
        DANGER: 0,
        COLOR: 16,
        SHAPE: [
            [1.5, .75],
            [-1.5, .75],
            [-1.5, -.75],
            [1.5, -.75]
        ],
        TURRETS: [{
            POSITION: [10, 5, 0, 0, 0, 1],
            TYPE: [exports.genericTank, {
                COLOR: 16,
                DANGER: 0
            }]
        }, {
            POSITION: [10, -5, 0, 0, 0, 1],
            TYPE: [exports.genericTank, {
                COLOR: 16,
                DANGER: 0
            }]
        }]
    };
    return {
        PARENT: [exports.genericTank],
        LABEL: "Alexander Nevsky",
        SIZE: 55,
        BODY: {
            HEALTH: 4500,
            SPEED: 1,
            PUSHABILITY: 0
        },
        FACING_TYPE: "smoothWithMotion",
        SHAPE: [
            [1.5, 0],
            [1, 0.2],
            [0, 0.275],
            [-1, 0.225],
            [-1.2, 0],
            [-1, -0.225],
            [0, -0.275],
            [1, -0.2]
        ],
        TURRETS: [{
            POSITION: [1.5, 2.5, 0, 90, 150, 1],
            TYPE: exports.antiAircraftTurret
        }, {
            POSITION: [1.5, 2.5, 0, 270, 150, 1],
            TYPE: exports.antiAircraftTurret
        }, {
            POSITION: [1.5, 10, 0, 0, 150, 1],
            TYPE: exports.antiAircraftTurret
        }, {
            POSITION: [1.5, 9, 0, 180, 150, 1],
            TYPE: exports.antiAircraftTurret
        }, {
            POSITION: [2.5, 6.5, 0, 0, 240, 1],
            TYPE: exports.nevskyMainGun
        }, {
            POSITION: [2.5, 4, 0, 0, 240, 1],
            TYPE: exports.nevskyMainGun
        }, {
            POSITION: [2.5, 6.5, 0, 180, 240, 1],
            TYPE: exports.nevskyMainGun
        }, {
            POSITION: [2.5, 4, 0, 180, 240, 1],
            TYPE: exports.nevskyMainGun
        }, {
            POSITION: [1.8, 2, 2, 90, 150, 1],
            TYPE: exports.nevskySecondary
        }, {
            POSITION: [1.8, 2, -2, 90, 150, 1],
            TYPE: exports.nevskySecondary
        }, {
            POSITION: [1.8, 2, 2, 270, 150, 1],
            TYPE: exports.nevskySecondary
        }, {
            POSITION: [1.8, 2, -2, 270, 150, 1],
            TYPE: exports.nevskySecondary
        }, {
            POSITION: [4, 0, 0, 0, 0, 1],
            TYPE: exports.nevskyProp
        }]
    };
})();
exports.petropavlovsk = (function () {
    g.petropavlovsk = [18, 0, 1, 1, 1, 1, 1.2, 2.2, 1.2, 2, 1, 1.75, 2];
    g.petropavlovskSecondary = [6, 0, 1, 1, .6, .6, 1, 1.5, 1, 1, 1, 2, 1];
    exports.petropavlovskMainGun = {
        PARENT: [exports.genericTank],
        LABEL: "Turret",
        DANGER: 0,
        COLOR: 16,
        SHAPE: [
            [1, -1],
            [-0.5, -1],
            [-1, -0.5],
            [-1, 0.5],
            [-0.5, 1],
            [1, 1]
        ],
        CONTROLLERS: ["onlyAcceptInArc", "onlyFireWhenInRange"],
        GUNS: [{
            POSITION: [23, 3.25, 1, 0, -5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.shell, g.petropavlovsk]),
                TYPE: exports.shard
            }
        }, {
            POSITION: [23, 3.25, 1, 0, 5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.shell, g.petropavlovsk]),
                TYPE: exports.shard
            }
        }, {
            POSITION: [23, 3.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.shell, g.petropavlovsk]),
                TYPE: exports.shard
            }
        }]
    };
    exports.petropavlovskSecondary = {
        PARENT: [exports.turretParent],
        INDEPENDENT: true,
        SHAPE: [
            [1, -1],
            [-0.5, -1],
            [-1, -0.5],
            [-1, 0.5],
            [-0.5, 1],
            [1, 1]
        ],
        GUNS: [{
            POSITION: [23, 3.5, 1, 0, -4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.shell, g.petropavlovskSecondary]),
                TYPE: exports.shard
            }
        }, {
            POSITION: [23, 3.5, 1, 0, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.shell, g.petropavlovskSecondary]),
                TYPE: exports.shard
            }
        }]
    };
    exports.petropavlovskProp = {
        DANGER: 0,
        COLOR: 16,
        SHAPE: [
            [1.5, .75],
            [-1.5, .75],
            [-1.5, -.75],
            [1.5, -.75]
        ],
        TURRETS: [{
            POSITION: [10, 5, 0, 0, 0, 1],
            TYPE: [exports.genericTank, {
                COLOR: 16,
                DANGER: 0
            }]
        }, {
            POSITION: [10, -5, 0, 0, 0, 1],
            TYPE: [exports.genericTank, {
                COLOR: 16,
                DANGER: 0
            }]
        }, {
            POSITION: [15, 0, 0, 0, 0, 1],
            TYPE: [exports.genericTank, {
                COLOR: 16,
                DANGER: 0
            }]
        }, {
            POSITION: [10, 0, 0, 0, 0, 1],
            TYPE: [exports.genericTank, {
                COLOR: 9,
                DANGER: 0
            }]
        }, {
            POSITION: [5, 0, 0, 0, 0, 1],
            TYPE: [exports.genericTank, {
                COLOR: 16,
                DANGER: 0
            }]
        }]
    };
    return {
        PARENT: [exports.genericTank],
        LABEL: "Petropavlovsk",
        SIZE: 57,
        BODY: {
            HEALTH: 5200,
            SPEED: .9,
            PUSHABILITY: 0
        },
        FACING_TYPE: "smoothWithMotion",
        SHAPE: ["M 7 0 C 0 -2 -2 -2 -6 -.5 L -6 .5 C -2 2 0 2 7 0", 5],
        TURRETS: [{
            POSITION: [1.5, 2.5, 0, 90, 150, 1],
            TYPE: exports.antiAircraftTurret
        }, {
            POSITION: [1.5, 2.5, 0, 270, 150, 1],
            TYPE: exports.antiAircraftTurret
        }, {
            POSITION: [1.5, 10, 0, 0, 150, 1],
            TYPE: exports.antiAircraftTurret
        }, {
            POSITION: [1.5, 9, 0, 180, 150, 1],
            TYPE: exports.antiAircraftTurret
        }, {
            POSITION: [1.5, 2.5, 0, 90, 360, 1],
            TYPE: exports.antiAircraftTurret
        }, {
            POSITION: [1.5, 2.5, 0, 270, 360, 1],
            TYPE: exports.antiAircraftTurret
        }, {
            POSITION: [1.5, 10, 0, 0, 360, 1],
            TYPE: exports.antiAircraftTurret
        }, {
            POSITION: [1.5, 9, 0, 180, 360, 1],
            TYPE: exports.antiAircraftTurret
        }, {
            POSITION: [1.6, 2, 4, 90, 150, 1],
            TYPE: exports.petropavlovskSecondary
        }, {
            POSITION: [1.6, 2, -4, 90, 150, 1],
            TYPE: exports.petropavlovskSecondary
        }, {
            POSITION: [1.6, 2, -2, 90, 150, 1],
            TYPE: exports.petropavlovskSecondary
        }, {
            POSITION: [1.6, 2, 2, 90, 150, 1],
            TYPE: exports.petropavlovskSecondary
        }, {
            POSITION: [1.6, 2, 4, 270, 150, 1],
            TYPE: exports.petropavlovskSecondary
        }, {
            POSITION: [1.6, 2, -4, 270, 150, 1],
            TYPE: exports.petropavlovskSecondary
        }, {
            POSITION: [1.6, 2, -2, 270, 150, 1],
            TYPE: exports.petropavlovskSecondary
        }, {
            POSITION: [1.6, 2, 2, 270, 150, 1],
            TYPE: exports.petropavlovskSecondary
        }, {
            POSITION: [2.5, 6.5, 0, 0, 240, 1],
            TYPE: exports.petropavlovskMainGun
        }, {
            POSITION: [2.5, 4, 0, 0, 240, 1],
            TYPE: exports.petropavlovskMainGun
        }, {
            POSITION: [2.5, 4, 0, 180, 240, 1],
            TYPE: exports.petropavlovskMainGun
        }, {
            POSITION: [4, 0, 0, 0, 0, 1],
            TYPE: exports.petropavlovskProp
        }]
    };
})();
exports.yamato = (function () { // owo
    g.yamato = [65, 0, 1, 1, 1.75, 1.5, 2, 2.5, 1, 4, 1, 1.3, 2];
    g.yamatoSecondary = [6, 0, 1, 1, .6, .6, 1.25, 1.5, 1, 1, 1, 2, 1];
    exports.yamatoTurret = {
        PARENT: [exports.genericTank],
        LABEL: "Turret",
        DANGER: 0,
        COLOR: 16,
        SHAPE: [
            [1, -1],
            [-0.5, -1],
            [-1, -0.5],
            [-1, 0.5],
            [-0.5, 1],
            [1, 1]
        ],
        CONTROLLERS: ["onlyAcceptInArc", "onlyFireWhenInRange"],
        TRAVERSE_SPEED: 5,
        GUNS: [{
            POSITION: [23, 3, 1, 0, -5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.shell, g.yamato]),
                TYPE: exports.shard
            }
        }, {
            POSITION: [23, 3, 1, 0, 5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.shell, g.yamato]),
                TYPE: exports.shard
            }
        }, {
            POSITION: [23, 3, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.shell, g.yamato]),
                TYPE: exports.shard
            }
        }]
    };
    exports.yamatoSecondary = {
        PARENT: [exports.turretParent],
        INDEPENDENT: true,
        SHAPE: [
            [1, -1],
            [-0.5, -1],
            [-1, -0.5],
            [-1, 0.5],
            [-0.5, 1],
            [1, 1]
        ],
        GUNS: [{
            POSITION: [23, 3.5, 1, 0, -4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.shell, g.yamatoSecondary]),
                TYPE: exports.shard
            }
        }, {
            POSITION: [23, 3.5, 1, 0, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.shell, g.yamatoSecondary]),
                TYPE: exports.shard
            }
        }]
    };
    exports.yamatoProp = {
        DANGER: 0,
        COLOR: 16,
        SHAPE: [
            [1.5, .75],
            [-1.5, .75],
            [-1.5, -.75],
            [1.5, -.75]
        ],
        TURRETS: [{
            POSITION: [10, 5, 0, 0, 0, 1],
            TYPE: [exports.genericTank, {
                COLOR: 16,
                DANGER: 0
            }]
        }, {
            POSITION: [10, -5, 0, 0, 0, 1],
            TYPE: [exports.genericTank, {
                COLOR: 16,
                DANGER: 0
            }]
        }, {
            POSITION: [12, 0, 0, 0, 0, 1],
            TYPE: [exports.genericTank, {
                COLOR: 16,
                DANGER: 0
            }]
        }, {
            POSITION: [8, 0, 0, 0, 0, 1],
            TYPE: [exports.genericTank, {
                COLOR: 16,
                DANGER: 0
            }]
        }, {
            POSITION: [4, 0, 0, 0, 0, 1],
            TYPE: [exports.genericTank, {
                COLOR: 16,
                DANGER: 0
            }]
        }]
    };
    return {
        PARENT: [exports.genericTank],
        LABEL: "Yamato ✯",
        SIZE: 70,
        BODY: {
            HEALTH: 6500,
            SPEED: .6,
            FOV: 1,
            PUSHABILITY: 0
        },
        FACING_TYPE: "smoothWithMotion",
        SHAPE: [
            [1.5, 0],
            [1, 0.2],
            [0, 0.275],
            [-1, 0.225],
            [-1.2, 0],
            [-1, -0.225],
            [0, -0.275],
            [1, -0.2]
        ],
        TURRETS: [{
            POSITION: [1.5, 2.5, 0, 90, 150, 1],
            TYPE: exports.antiAircraftTurret
        }, {
            POSITION: [1.5, 2.5, 0, 270, 150, 1],
            TYPE: exports.antiAircraftTurret
        }, {
            POSITION: [1.5, 10, 0, 0, 150, 1],
            TYPE: exports.antiAircraftTurret
        }, {
            POSITION: [1.5, 9, 0, 180, 150, 1],
            TYPE: exports.antiAircraftTurret
        }, {
            POSITION: [1.5, 2.5, 0, 90, 150, 1],
            TYPE: exports.antiAircraftTurret
        }, {
            POSITION: [1.5, 2.5, 0, 270, 150, 1],
            TYPE: exports.antiAircraftTurret
        }, {
            POSITION: [1.5, 10, 0, 0, 150, 1],
            TYPE: exports.antiAircraftTurret
        }, {
            POSITION: [1.5, 9, 0, 180, 150, 1],
            TYPE: exports.antiAircraftTurret
        }, {
            POSITION: [3, 6.5, 0, 0, 300, 1],
            TYPE: exports.yamatoTurret
        }, {
            POSITION: [3, 4, 0, 0, 300, 1],
            TYPE: exports.yamatoTurret
        }, {
            POSITION: [3, 6.5, 0, 180, 300, 1],
            TYPE: exports.yamatoTurret
        }, {
            POSITION: [1.8, 2, 2, 90, 150, 1],
            TYPE: exports.yamatoSecondary
        }, {
            POSITION: [1.8, 2, -2, 90, 150, 1],
            TYPE: exports.yamatoSecondary
        }, {
            POSITION: [1.8, 2, 2, 270, 150, 1],
            TYPE: exports.yamatoSecondary
        }, {
            POSITION: [1.8, 2, -2, 270, 150, 1],
            TYPE: exports.yamatoSecondary
        }, {
            POSITION: [4, 0, 0, 0, 0, 1],
            TYPE: exports.yamatoProp
        }]
    };
})();
g.submarineTorpedo = [20, 0, .1, 1, 3, 3, 2, 1.7, 1.4, 1.3, 1, 2, 1];
exports.submarineTorpedo = {
    PARENT: [exports.bullet],
    LABEL: "Torpedo",
    SHAPE: shapeConfig.rpgRocket,
    PERSISTS_AFTER_DEATH: true,
    ALWAYS_ACTIVE: true
};
function createSubmarine(options = {}) {
    return {
        PARENT: [exports.genericTank],
        LABEL: options.name,
        SIZE: 25 + 2 * options.tier,
        BODY: {
            HEALTH: 600 + 25 * options.tier,
            SPEED: 4 + .6 * options.tier
        },
        SUBMARINE: options.time,
        GUNS: (function () {
            const output = [];
            for (let i = 0; i < options.torpedoTubes.amount; i++) {
                output.push({
                    POSITION: [1, 5, 1, 0, 0, 0, i / options.torpedoTubes.amount / options.torpedoTubes.amount],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.bullet, g.submarineTorpedo, ...options.torpedoTubes.stats]),
                        TYPE: exports.submarineTorpedo
                    }
                });
            }
            return output;
        })()
    }
}
exports.u2051 = createSubmarine({
    name: "U-2051",
    tier: 4,
    torpedoTubes: {
        amount: 6,
        stats: []
    }
});
// CARRIER BASE STATS
g.cvSecondary = [16, 0, .1, 1, .65, .6, 1.3, 2, 1.2, 1.5, 1, .1, 1];
g.cvAntiAircraft = [2.25, 0, 2, 1, .5, .5, 1, 1.3, 1.3, 1, 1, 2, 1];
g.heBombBaseStat = [1, 1, 1, .5, .175, 2, 4, .4, 1, 1.5, 1, 2, 1];
g.apBombBaseStat = [1, 1, 1, .5, .6, 4, 8, .4, 1, 1.5, 1, 2, 1];
g.sapBombBaseStat = [1, 1, 1, .5, .3, 3, 6, .4, 1, 1.5, 1, 2, 1];
g.skipBombBaseStat = [1, 1, 1, .5, .1, 1.8, 3, .4, 1, 1.5, 1, 2, 1];
g.carpetBombBaseStat = [1, 1, 1, .5, .08, .9, 6, .4, 1, 1.5, 1, 2, 1];
g.torpedoBaseStat = [1, 1, 1, .6, .6, 8, 2, 1, .9, 1.7, 1, 2, 1];
g.heRocketBaseStat = [1, 1, 1, .4, .2, .5, 2, 1.2, 1.4, 1, 1, .8, 1];
g.apRocketBaseStat = [1, 1, 1, .4, .4, 7, 2, 1.2, 1.4, 1, 1, .8, 1];
g.sapRocketBaseStat = [1, 1, 1, .4, .3, 2, 2, 1.2, 1.4, 1, 1, .8, 1];
g.fighterBaseStat = [1.2, 0, .1, .65, .8, .8, 2, 2, 1, 1, 1, 1, 1];
g.heBombBaseStatSpawner = g.apBombBaseStatSpawner = g.sapBombBaseStatSpawner = g.skipBombBaseStatSpawner = g.carpetBombBaseStatSpawner = [1, 0, 1, 2.5, 1.6, .3, 3, 1.175, 1.175, 1, .1, 1, 1];
g.torpedoBaseStatSpawner = [1, 0, 1, 2.5, 2, .5, 3, 1, 1, 1, .1, 1, 1];
g.heRocketBaseStatSpawner = g.apRocketBaseStatSpawner = g.sapRocketBaseStatSpawner = [1, 0, 1, 2.5, 1.2, .25, 3, 1.35, 1.35, 1, .1, 1, 1];
g.fighterBaseStatSpawner = [1, 0, 1, 2.5, .8, .8, .8, 1.4, 1.4, 1, 1, 1, 1.6];
const createCarrier = (function () {
    function createCarrierBody(options = {}) {
        if (options.width == null) {
            options.width = .45;
        }
        if (options.length == null) {
            options.length = 2;
        }
        if (options.insertBefore == null) {
            options.insertBefore = [];
        }
        if (options.point == null) {
            options.point = [];
        }
        if (options.insertAfter == null) {
            options.insertAfter = [];
        }
        if (options.leftSpots == null) {
            options.leftSpots = 0;
        }
        if (options.rightSpots == null) {
            options.rightSpots = 0;
        }
        if (options.leftSpotWidth == null) {
            options.leftSpotWidth = false;
        }
        if (options.rightSpotWidth == null) {
            options.rightSpotWidth = false;
        }
        let shapeData = options.insertBefore;
        let pointData = [];
        if (options.point.length) {
            shapeData = shapeData.concat(options.point);
        } else {
            shapeData = shapeData.concat([
                [options.length / 1.5, -options.width / 3],
                [options.length / 1.5, options.width / 3],
                [options.length / 2, options.width / 2]
            ]);
        }
        for (let i = 0; i < options.leftSpots; i++) {
            const width = options.leftSpotWidth || (options.length / options.leftSpots) / (5 / 3);
            const x = i * (options.length / options.leftSpots) - options.length / 2 + width * 1.5;
            const point = [
                [x + width / 2, options.width / 2],
                [x + width / 5, options.width / 2 + width / 4],
                [x - width / 5, options.width / 2 + width / 4],
                [x - width / 2, options.width / 2]
            ];
            shapeData = shapeData.concat(point);
            pointData.push({
                point: point,
                side: 0
            });
        }
        shapeData = shapeData.concat([
            [-options.length / 2, options.width / 2],
            [-options.length / 2, options.width / 3.5],
            [-options.length / 1.8, options.width / 5],
            [-options.length / 1.8, -options.width / 5],
            [-options.length / 2, -options.width / 3.5],
            [-options.length / 2, -options.width / 2]
        ]);
        for (let i = options.rightSpots - 1; i > -1; i--) {
            const width = options.rightSpotWidth || (options.length / options.rightSpots) / (5 / 3);
            const x = i * (options.length / options.rightSpots) - options.length / 2 + width * 1.5;
            const point = [
                [x - width / 2, -options.width / 2],
                [x - width / 5, -options.width / 2 - width / 4],
                [x + width / 5, -options.width / 2 - width / 4],
                [x + width / 2, -options.width / 2]
            ];
            shapeData = shapeData.concat(point);
            pointData.push({
                point: point,
                side: 1
            });
        }
        shapeData.push([options.length / 2, -options.width / 2]);
        return {
            shapeCode: shapeData.concat(options.insertAfter),
            points: pointData,
            bodyWidth: options.width
        }
    }
    function createCarrierTurret(options = {}) {
        if (options.positions == null) {
            options.positions = [0];
        }
        if (options.antiAircraft == null) {
            options.antiAircraft = false;
        }
        if (options.stats == null) {
            options.stats = [g[options.antiAircraft ? "cvAntiAircraft" : "cvSecondary"]];
        }
        return {
            PARENT: [exports.turretParent],
            INDEPENDENT: options.antiAircraft,
            TARGET_PLANES: options.antiAircraft,
            SHAPE: [
                [1, -1],
                [-0.5, -1],
                [-1, -0.5],
                [-1, 0.5],
                [-0.5, 1],
                [1, 1]
            ],
            GUNS: (function () {
                const output = [];
                for (const offY of options.positions) {
                    output.push({
                        POSITION: [20, 3, 1, 0, offY, 0, 0],
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.bullet, ...options.stats]),
                            TYPE: exports.shard
                        }
                    });
                }
                return output;
            })()
        };
    }
    let carrierIndex = 0;
    function createProp(width, options = {}) {
        if (options.size == null) {
            options.size = 3;
        }
        if (options.shape == null) {
            options.shape = 4;
        }
        if (options.layers == null) {
            options.layers = [];
        }
        if (options.flip == null) {
            options.flip = false;
        }
        exports[`carrierProp${carrierIndex}`] = {
            SHAPE: options.shape,
            TURRETS: options.layers
        };
        return {
            POSITION: [options.size, 1.5, ((width / 2 * 10) * .65) * (options.flip ? -1 : 1), 0, 0, 1],
            TYPE: exports[`carrierProp${carrierIndex}`]
        };
    }
    return function (options = {}) {
        if (options.name == null) {
            options.name = "Aircraft Carrier";
        }
        if (options.premium == true) {
            options.name += " ✯";
        }
        if (options.tier == null) {
            options.tier = 1;
        }
        if (options.bodyStats == null) {
            options.bodyStats = {};
        }
        if (options.bodyStats.health == null) {
            options.bodyStats.health = 1;
        }
        if (options.bodyStats.speed == null) {
            options.bodyStats.speed = 1;
        }
        if (options.prop == null) {
            options.prop = {};
        }
        if (options.aviation == null) {
            options.aviation = [];
        }
        const { shapeCode, points, bodyWidth } = createCarrierBody(options.hullInfo);
        carrierIndex++;
        return {
            PARENT: [exports.genericTank],
            LABEL: options.name,
            SIZE: 28 + (5 * options.tier),
            BODY: {
                HEALTH: 750 * options.tier * options.bodyStats.health,
                SPEED: (4 - (.75 * options.tier)) * options.bodyStats.health,
                PUSHABILITY: 0
            },
            FACING_TYPE: "smoothWithMotion",
            SHAPE: shapeCode,
            GUNS: (function () {
                const output = [];
                for (const squadron of options.aviation) {
                    exports[`carrierPlane${carrierIndex}${squadron.type}`] = {
                        PARENT: [exports[squadron.type === "fighter" ? "fighterParent" : "aircraftCarrierPlaneParent"]],
                        LABEL: squadron.name || "Bomber",
                        SHAPE: shapeConfig.plane,
                        INDEPENDENT: squadron.type === "fighter",
                        GUNS: (function () {
                            if (squadron.type === "fighter") {
                                return [];
                            }
                            const output = [];
                            for (let i = 0; i < (squadron.payload || 1); i++) {
                                output.push({
                                    POSITION: [0, 10, 1, 0, 0, 0, 0],
                                    PROPERTIES: {
                                        SHOOT_SETTINGS: combineStats([g.bullet, g[`${squadron.type}BaseStat`], ...squadron.ammoStats]),
                                        TYPE: exports[squadron.type],
                                        ON_SHOOT: "die",
                                        ALT_FIRE: true,
                                        LABEL: "Dropped"
                                    }
                                });
                            }
                            return output;
                        })(),
                        TURRETS: (function () {
                            if (squadron.type !== "fighter") {
                                return [];
                            }
                            exports[`fighterGun${carrierIndex}${squadron.type}`] = {
                                PARENT: [exports.turretParent],
                                CONTROLLERS: ["onlyAcceptInArc", "onlyFireWhenInRange"],
                                SHAPE: 4,
                                GUNS: (function () {
                                    const output = [];
                                    for (let i = 0; i < (squadron.payload || 1); i++) {
                                        output.push({
                                            POSITION: [17, 7, 1, 0, 0, 0, 0],
                                            PROPERTIES: {
                                                SHOOT_SETTINGS: combineStats([g.bullet, g[`${squadron.type}BaseStat`], ...squadron.ammoStats]),
                                                TYPE: exports.shard
                                            }
                                        });
                                    }
                                    return output;
                                })()
                            };
                            return [{
                                POSITION: [8, 6, 0, 0, 45, 0],
                                TYPE: exports[`fighterGun${carrierIndex}${squadron.type}`]
                            }];
                        })()
                    };
                    output.push({
                        POSITION: [1, 3, 1, 0, 0, 0, 0],
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([g.drone, g[`${squadron.type}BaseStatSpawner`], ...(squadron.spawnStats || [])]),
                            TYPE: exports[`carrierPlane${carrierIndex}${squadron.type}`],
                            MAX_CHILDREN: squadron.size,
                            AUTOFIRE: squadron.type === "fighter"
                        },
                        LAUNCH_SQUADRON: (squadron.type === "fighter" ? null : squadron.type)
                    });
                }
                return output;
            })(),
            TURRETS: (function () {
                exports[`carrierTurret${carrierIndex}LeftMount`] = createCarrierTurret(options.hullInfo.leftMount);
                exports[`carrierTurret${carrierIndex}RightMount`] = createCarrierTurret(options.hullInfo.rightMount);
                const output = [];
                points.forEach((data, i) => {
                    const { point, side } = data;
                    const size = Math.abs(point[0][0] - point[point.length - 1][0]) * 4;
                    let x = (point[0][1] + point[1][1]) / 2 * 10;
                    let y = (point[0][0] + point[point.length - 1][0]) / 2 * 10;
                    if (side) {
                        x *= -1;
                    } else {
                        y -= (Math.abs(point[0][0] - point[point.length - 1][0]) * 10 + (size / 1.25));
                    }
                    output.push({
                        POSITION: [size, x, y, side ? 270 : 90, 180, 1],
                        TYPE: exports[`carrierTurret${carrierIndex}${side ? "RightMount" : "LeftMount"}`]
                    });
                });
                if (options.prop !== -1) output.push(createProp(bodyWidth, options.prop));
                if (options.hullInfo.mounts) {
                    exports[`carrierMountTurret${carrierIndex}`] = createCarrierTurret(options.hullInfo.mounts.turretData);
                    options.hullInfo.mounts.positions.forEach(position => {
                        output.push({
                            POSITION: position,
                            TYPE: exports[`carrierMountTurret${carrierIndex}`]
                        });
                    });
                }
                return output;
            })(),
            CARRIER_TALK_DATA: options.aviation.map(entry => entry.type)
        };
    }
})();
// American Carriers
g.americanRocket = (payload, divider = 1) => [1, 1, 1, 1 / payload, 1 / payload / divider, 1 / payload / divider, 1 + payload * .1, 1, 1, 1, 1, 1 + payload / 1.5, 1];
exports.independence = createCarrier({
    name: "Independence",
    tier: 1,
    hullInfo: {
        leftSpots: 5,
        rightSpots: 5,
        leftMount: {
            antiAircraft: true,
            stats: [g.cvAntiAircraft, [1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1]]
        },
        rightMount: {
            antiAircraft: true,
            stats: [g.cvAntiAircraft, [1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1]]
        }
    },
    prop: {
        size: 2,
        shape: 0,
        flip: false
    },
    aviation: [{
        type: "heBomb",
        name: "Dive Bomber",
        size: 3,
        payload: 4,
        ammoStats: [[1, 1, 4, .8, .2, .2, .5, 1, 1, 1, 1, 4, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "heRocket",
        name: "Rocket Attack Plane",
        size: 3,
        payload: 4,
        ammoStats: [g.americanRocket(8, 1.6)],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }]
});
exports.lexington = createCarrier({
    name: "Lexington",
    tier: 2,
    hullInfo: {
        leftSpots: 4,
        rightSpots: 4,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        },
        mounts: {
            positions: [
                [1.75, 5, 1.5, 0, 270, 1],
                [1.75, 2, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [0]
            }
        }
    },
    prop: {
        shape: [
            [1.5, .5],
            [-1.5, .5],
            [-1.5, -.5],
            [1.5, -.5]
        ]
    },
    aviation: [{
        type: "heBomb",
        name: "Dive Bomber",
        size: 3,
        payload: 4,
        ammoStats: [[1, 1, 4, .8, .2, .2, .5, 1, 1, 1, 1, 4, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "heRocket",
        name: "Rocket Attack Plane",
        size: 3,
        payload: 4,
        ammoStats: [[1, 1, 4, .8, .1, .2, .5, 1, 1, 1, 1, 4, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 3,
        payload: 4,
        ammoStats: [[1, 1, 1, .8, 1, 1, 1, 1, 1, 1.2, 1, 1.5, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }]
});
exports.yorktown = createCarrier({
    name: "Yorktown",
    tier: 3,
    hullInfo: {
        leftSpots: 5,
        rightSpots: 5,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        },
        mounts: {
            positions: [
                [1.75, 5, 1.5, 0, 270, 1],
                [1.75, 2, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [-5.5, 5.5]
            }
        }
    },
    prop: {
        shape: [
            [1.5, .5],
            [-1.5, .5],
            [-1.5, -.5],
            [1.5, -.5]
        ]
    },
    aviation: [{
        type: "heBomb",
        name: "Dive Bomber",
        size: 4,
        payload: 4,
        ammoStats: [[1, 1, 4, .8, .1, .1, .5, 1, 1, 1, 1, 4, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "heRocket",
        name: "Rocket Attack Plane",
        size: 4,
        payload: 4,
        ammoStats: [[1, 1, 4, .8, .1, .1, .5, 1, 1, 1, 1, 4, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 4,
        payload: 4,
        ammoStats: [[1, 1, 1, .8, .9, .8, 1, 1, 1, 1.2, 1, 1.5, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }]
});
exports.midway = createCarrier({
    name: "Midway",
    tier: 4,
    hullInfo: {
        leftSpots: 6,
        rightSpots: 6,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        },
        mounts: {
            positions: [
                [1.75, 7, 1.5, 0, 270, 1],
                [1.75, 5, 1.5, 0, 270, 1],
                [1.75, 2, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [-5.5, 5.5]
            }
        }
    },
    prop: {
        shape: [
            [1.5, .5],
            [-1.5, .5],
            [-1.5, -.5],
            [1.5, -.5]
        ]
    },
    aviation: [{
        type: "heBomb",
        name: "Dive Bomber",
        size: 5,
        payload: 4,
        ammoStats: [[1, 1, 4, .8, .1, .1, .5, 1, 1, 1, 1, 4, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "heRocket",
        name: "Rocket Attack Plane",
        size: 5,
        payload: 4,
        ammoStats: [[1, 1, 4, .8, .1, .1, .5, 1, 1, 1, 1, 4, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 5,
        payload: 4,
        ammoStats: [[1, 1, 1, .8, .9, .8, 1, 1, 1, 1.2, 1, 1.5, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }]
});
exports.saipan = createCarrier({
    name: "Saipan",
    tier: 2,
    premium: true,
    hullInfo: {
        leftSpots: 5,
        rightSpots: 5,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        },
        mounts: {
            positions: [
                [1.75, 5, 1.5, 0, 270, 1],
                [1.75, 2, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [-5.5, 5.5]
            }
        }
    },
    prop: {
        shape: [
            [1.5, .5],
            [-1.5, .5],
            [-1.5, -.5],
            [1.5, -.5]
        ]
    },
    aviation: [{
        type: "sapBomb",
        name: "Dive Bomber",
        size: 3,
        payload: 4,
        ammoStats: [[1, 1, 4, .8, .2, .2, .5, 1, 1, 1, 1, 4, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "sapRocket",
        name: "Rocket Attack Plane",
        size: 3,
        payload: 4,
        ammoStats: [[1, 1, 4, .8, .1, .2, .5, 1, 1, 1, 1, 4, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }]
});
exports.enterprise = createCarrier({
    name: "Enterprise",
    tier: 3,
    premium: true,
    hullInfo: {
        leftSpots: 6,
        rightSpots: 6,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        },
        mounts: {
            positions: [
                [1.75, 5, 1.5, 0, 270, 1],
                [1.75, 2, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [-5.5, 5.5, 0]
            }
        }
    },
    prop: {
        shape: [
            [1.5, .5],
            [-1.5, .5],
            [-1.5, -.5],
            [1.5, -.5]
        ]
    },
    aviation: [{
        type: "sapBomb",
        name: "Dive Bomber",
        size: 3,
        payload: 4,
        ammoStats: [[1, 1, 4, .8, .2, .2, .5, 1, 1, 1, 1, 4, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "sapRocket",
        name: "Rocket Attack Plane",
        size: 3,
        payload: 4,
        ammoStats: [[1, 1, 4, .8, .1, .2, .5, 1, 1, 1, 1, 4, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 5,
        payload: 4,
        ammoStats: [[1, 1, 1, .8, .9, .8, 1, 1, 1, 1.2, 1, 1.5, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }]
});
exports.fdr = createCarrier({
    name: "Franklin Delano Roosevelt",
    tier: 4,
    premium: true,
    hullInfo: {
        leftSpots: 7,
        rightSpots: 7,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        },
        mounts: {
            positions: [
                [1.75, 7, 1.5, 0, 270, 1],
                [1.75, 4, -1.5, 180, 270, 1],
                [1.75, 5, 1.5, 0, 270, 1],
                [1.75, 2, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [-5.5, 5.5, 0]
            }
        }
    },
    prop: {
        shape: [
            [1.5, .5],
            [-1.5, .5],
            [-1.5, -.5],
            [1.5, -.5]
        ]
    },
    aviation: [{
        type: "sapBomb",
        name: "Dive Bomber",
        size: 3,
        payload: 4,
        ammoStats: [[1, 1, 4, .8, .2, .2, .5, 1, 1, 1, 1, 4, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "sapRocket",
        name: "Rocket Attack Plane",
        size: 3,
        payload: 4,
        ammoStats: [[1, 1, 4, .8, .1, .2, .5, 1, 1, 1, 1, 4, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 5,
        payload: 4,
        ammoStats: [[1, 1, 1, .8, .9, .8, 1, 1, 1, 1.2, 1, 1.5, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "skipBomb",
        name: "Skip Bomber",
        size: 3,
        payload: 4,
        ammoStats: [[1, 1, 4, .8, .18, .22, .5, 1, 1, 1, 1, 4, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }]
});
// Japanese Carriers
exports.ryujo = createCarrier({
    name: "Ryūjō",
    tier: 1,
    hullInfo: {
        width: .5,
        length: 1.8,
        leftSpots: 6,
        rightSpots: 6,
        leftMount: {
            antiAircraft: true,
            stats: [g.cvAntiAircraft, [1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1]]
        },
        rightMount: {
            antiAircraft: true,
            stats: [g.cvAntiAircraft, [1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1]]
        },
        mounts: {
            positions: [
                [1.5, 3, 1.5, 90, 90, 0],
                [1.5, 3, -1.5, 90, 90, 0],
                [1.5, 3, 1.5, 270, 90, 0],
                [1.5, 3, -1.5, 270, 90, 0]
            ],
            turretData: {
                positions: [0],
                stats: [g.cvSecondary, [2, 1, 1.2, 1, .9, .8, .9, 1, 1, .9, 1, 1.2, 1]]
            }
        }
    },
    prop: -1,
    aviation: [{
        type: "sapRocket",
        name: "Rocket Attack Plane",
        size: 2,
        payload: 3,
        ammoStats: [[1, 1, 1, .7, .45, .45, 1, 1, 1, 1, 1, 2, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1.2, 1.2, 1, 1, 1, 1]],
    }, {
        type: "sapBomb",
        name: "Dive Bomber",
        size: 3,
        payload: 1,
        ammoStats: [[1, 1, 1, 1, 1.1, 1.1, 1, 1, 1, 1, 1, 2, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1.2, 1.2, 1, 1, 1, 1]],
    }]
});
exports.shokaku = createCarrier({
    name: "Shōkaku",
    tier: 2,
    hullInfo: {
        width: .5,
        length: 1.8,
        leftSpots: 7,
        rightSpots: 7,
        leftMount: {
            antiAircraft: true,
            stats: [g.cvAntiAircraft, [1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1]]
        },
        rightMount: {
            antiAircraft: true,
            stats: [g.cvAntiAircraft, [1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1]]
        },
        mounts: {
            positions: [
                [1.5, 3, 1.5, 90, 90, 0],
                [1.5, 3, -1.5, 90, 90, 0],
                [1.5, 3, 3, 90, 90, 0],
                [1.5, 3, -3, 90, 90, 0],
                [1.5, 3, 1.5, 270, 90, 0],
                [1.5, 3, -1.5, 270, 90, 0],
                [1.5, 3, 3, 270, 90, 0],
                [1.5, 3, -3, 270, 90, 0]
            ],
            turretData: {
                positions: [0],
                stats: [g.cvSecondary, [2, 1, 1.2, 1, .9, .8, .9, 1, 1, .9, 1, 1.2, 1]]
            }
        }
    },
    prop: -1,
    aviation: [{
        type: "sapRocket",
        name: "Rocket Attack Plane",
        size: 3,
        payload: 3,
        ammoStats: [[1, 1, 1, .7, .45, .45, 1, 1, 1, 1, 1, 2, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1.2, 1.2, 1, 1, 1, 1]],
    }, {
        type: "sapBomb",
        name: "Dive Bomber",
        size: 4,
        payload: 1,
        ammoStats: [[1, 1, 1, 1, 1.1, 1.1, 1, 1, 1, 1, 1, 2, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1.2, 1.2, 1, 1, 1, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 3,
        payload: 1,
        ammoStats: [[1, 1, 1, 1, 1.1, 1.1, 1, 1, 1, 1, 1, 2, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1.2, 1.2, 1, 1, 1, 1]],
    }]
});
exports.taiho = createCarrier({
    name: "Taihō",
    tier: 3,
    hullInfo: {
        width: .5,
        length: 2.2,
        leftSpots: 9,
        rightSpots: 9,
        leftMount: {
            antiAircraft: true,
            stats: [g.cvAntiAircraft, [1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1]]
        },
        rightMount: {
            antiAircraft: true,
            stats: [g.cvAntiAircraft, [1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1]]
        },
        mounts: {
            positions: [
                [1.5, 3, 2, 90, 90, 0],
                [1.5, 3, -2, 90, 90, 0],
                [1.5, 3, 5, 90, 90, 0],
                [1.5, 3, -5, 90, 90, 0],
                [1.5, 3, 8, 90, 90, 0],
                [1.5, 3, -8, 90, 90, 0],
                [1.5, 3, 2, 270, 90, 0],
                [1.5, 3, -2, 270, 90, 0],
                [1.5, 3, 5, 270, 90, 0],
                [1.5, 3, -5, 270, 90, 0],
                [1.5, 3, 8, 270, 90, 0],
                [1.5, 3, -8, 270, 90, 0]
            ],
            turretData: {
                positions: [0],
                stats: [g.cvSecondary, [2, 1, 1.2, 1, .9, .8, .9, 1, 1, .9, 1, 1.2, 1]]
            }
        }
    },
    prop: -1,
    aviation: [{
        type: "sapRocket",
        name: "Rocket Attack Plane",
        size: 4,
        payload: 3,
        ammoStats: [[1, 1, 1, .7, .45, .45, 1, 1, 1, 1, 1, 2, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1.2, 1.2, 1, 1, 1, 1]],
    }, {
        type: "sapBomb",
        name: "Dive Bomber",
        size: 4,
        payload: 1,
        ammoStats: [[1, 1, 1, 1, 1.2, 1.2, 1, 1, 1, 1, 1, 2, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1.2, 1.2, 1, 1, 1, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 4,
        payload: 1,
        ammoStats: [[1, 1, 1, 1, 1.1, 1.1, 1, 1, 1, 1, 1, 2, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1.2, 1.2, 1, 1, 1, 1]],
    }]
});
exports.hakuryu = createCarrier({
    name: "Hakuryu",
    tier: 4,
    hullInfo: {
        width: .5,
        length: 2.2,
        leftSpots: 10,
        rightSpots: 10,
        leftMount: {
            antiAircraft: true,
            stats: [g.cvAntiAircraft, [1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1]]
        },
        rightMount: {
            antiAircraft: true,
            stats: [g.cvAntiAircraft, [1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1]]
        },
        mounts: {
            positions: [
                [1.5, 3, 2, 90, 90, 0],
                [1.5, 3, -2, 90, 90, 0],
                [1.5, 3, 5, 90, 90, 0],
                [1.5, 3, -5, 90, 90, 0],
                [1.5, 3, 8, 90, 90, 0],
                [1.5, 3, -8, 90, 90, 0],
                [1.5, 3, 2, 270, 90, 0],
                [1.5, 3, -2, 270, 90, 0],
                [1.5, 3, 5, 270, 90, 0],
                [1.5, 3, -5, 270, 90, 0],
                [1.5, 3, 8, 270, 90, 0],
                [1.5, 3, -8, 270, 90, 0]
            ],
            turretData: {
                positions: [0],
                stats: [g.cvSecondary, [2, 1, 1.2, 1, .9, .8, .9, 1, 1, .9, 1, 1.2, 1]]
            }
        }
    },
    prop: -1,
    aviation: [{
        type: "sapRocket",
        name: "Rocket Attack Plane",
        size: 4,
        payload: 4,
        ammoStats: [[1, 1, 1, .7, .375, .375, 1, 1, 1, 1, 1, 2, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1.2, 1.2, 1, 1, 1, 1]],
    }, {
        type: "sapBomb",
        name: "Dive Bomber",
        size: 5,
        payload: 1,
        ammoStats: [[1, 1, 1, 1, 1.2, 1.2, 1, 1, 1, 1, 1, 2, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1.2, 1.2, 1, 1, 1, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 4,
        payload: 1,
        ammoStats: [[1, 1, 1, 1, 1.1, 1.1, 1, 1, 1, 1, 1, 2, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1.2, 1.2, 1, 1, 1, 1]],
    }]
});
// German Carriers
exports.rhein = createCarrier({
    name: "Rhein",
    tier: 1,
    hullInfo: {
        leftSpots: 3,
        rightSpots: 3,
        leftMount: {
            antiAircraft: true,
            stats: [g.cvAntiAircraft, [.7, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1]]
        },
        rightMount: {
            antiAircraft: true,
            stats: [g.cvAntiAircraft, [.7, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1]]
        },
        mounts: {
            positions: [
                [1.75, 5, 1.5, 0, 270, 1],
                [1.75, 2, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [-5.5, 5.5],
                stats: [g.cvSecondary, [.75, 1, .5, 1, 1.2, 1.2, 2, 1.2, 1.2, 1.1, 1, .5, 2]]
            }
        }
    },
    prop: {
        shape: [
            [1.5, .5],
            [-1.5, .5],
            [-1.5, -.5],
            [1.5, -.5]
        ]
    },
    aviation: [{
        type: "apBomb",
        name: "Dive Bomber",
        size: 4,
        payload: 2,
        ammoStats: [[1, 1, 4, .8, .8, .8, 1, 1, 1, 1, 1, 2, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "apRocket",
        name: "Rocket Attack Plane",
        size: 3,
        payload: 4,
        ammoStats: [[1, 1, 4, .8, .4, .4, 1, 1, 1, 1, 1, 4, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }]
});
exports.wesser = createCarrier({
    name: "Wesser",
    tier: 2,
    hullInfo: {
        leftSpots: 4,
        rightSpots: 4,
        leftMount: {
            antiAircraft: true,
            stats: [g.cvAntiAircraft, [.7, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1]]
        },
        rightMount: {
            antiAircraft: true,
            stats: [g.cvAntiAircraft, [.7, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1]]
        },
        mounts: {
            positions: [
                [1.75, 5, 1.5, 0, 270, 1],
                [1.75, 2, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [-5.5, 5.5, 0],
                stats: [g.cvSecondary, [.75, 1, .5, 1, 1.2, 1.2, 2, 1.2, 1.2, 1.1, 1, .5, 2]]
            }
        }
    },
    prop: {
        shape: [
            [1.5, .5],
            [-1.5, .5],
            [-1.5, -.5],
            [1.5, -.5]
        ]
    },
    aviation: [{
        type: "apBomb",
        name: "Dive Bomber",
        size: 4,
        payload: 2,
        ammoStats: [[1, 1, 4, .8, .8, .8, 1, 1, 1, 1, 1, 2, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "apRocket",
        name: "Rocket Attack Plane",
        size: 4,
        payload: 4,
        ammoStats: [[1, 1, 4, .8, .4, .4, 1, 1, 1, 1, 1, 4, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 4,
        payload: 4,
        ammoStats: [[1, 1, 1, .8, .6, .6, 1, 1, 1, 1, 1, 1.5, 1]],
        spawnStats: [[1, 1, 1, 1, 1.2, 1.1, 1, 1, 1, 1, 1, 1, 1]],
    }]
});
exports.augustVonParceval = createCarrier({
    name: "August Von Parceval",
    tier: 3,
    hullInfo: {
        leftSpots: 5,
        rightSpots: 5,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        },
        mounts: {
            positions: [
                [1.75, 7, 1.5, 0, 270, 1],
                [1.75, 4, -1.5, 180, 270, 1],
                [1.75, 5, 1.5, 0, 270, 1],
                [1.75, 2, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [-5.5, 5.5, 0],
                stats: [g.cvSecondary, [.75, 1, .5, 1, 1.2, 1.2, 2, 1.2, 1.2, 1.1, 1, .5, 2]]
            }
        }
    },
    prop: {
        shape: [
            [1.5, .5],
            [-1.5, .5],
            [-1.5, -.5],
            [1.5, -.5]
        ]
    },
    aviation: [{
        type: "apBomb",
        name: "Dive Bomber",
        size: 5,
        payload: 2,
        ammoStats: [[1, 1, 4, .8, .7, .7, 1, 1, 1, 1, 1, 2, 1]],
    }, {
        type: "apRocket",
        name: "Rocket Attack Plane",
        size: 5,
        payload: 4,
        ammoStats: [[1, 1, 4, .8, .35, .35, 1, 1, 1, 1, 1, 4, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 5,
        payload: 4,
        ammoStats: [[1, 1, 1, .8, .55, .55, 1, 1, 1, 1, 1, 1.5, 1]],
    }]
});
exports.manfredVonRichthofen = createCarrier({
    name: "Manfred Von Richthofen",
    tier: 4,
    hullInfo: {
        leftSpots: 6,
        rightSpots: 6,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        },
        mounts: {
            positions: [
                [1.75, 9, 1.5, 0, 270, 1],
                [1.75, 6, -1.5, 180, 270, 1],
                [1.75, 7, 1.5, 0, 270, 1],
                [1.75, 4, -1.5, 180, 270, 1],
                [1.75, 5, 1.5, 0, 270, 1],
                [1.75, 2, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [-5.5, 5.5, 0],
                stats: [g.cvSecondary, [.75, 1, .5, 1, 1.2, 1.2, 2, 1.2, 1.2, 1.1, 1, .5, 2]]
            }
        }
    },
    prop: {
        shape: [
            [1.5, .5],
            [-1.5, .5],
            [-1.5, -.5],
            [1.5, -.5]
        ],
        layers: [{
            POSITION: [8, -8, 0, 0, 0, 1],
            TYPE: exports.genericTank
        }, {
            POSITION: [8, 8, 0, 0, 0, 1],
            TYPE: [exports.genericTank, {
                COLOR: 9
            }]
        }]
    },
    aviation: [{
        type: "apBomb",
        name: "Dive Bomber",
        size: 5,
        payload: 3,
        ammoStats: [[1, 1, 4, .8, .7, .7, 1, 1, 1, 1, 1, 2, 1]],
    }, {
        type: "apRocket",
        name: "Rocket Attack Plane",
        size: 5,
        payload: 4,
        ammoStats: [[1, 1, 4, .8, .35, .35, 1, 1, 1, 1, 1, 4, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 5,
        payload: 4,
        ammoStats: [[1, 1, 1, .8, .55, .55, 1, 1, 1, 1, 1, 1.5, 1]],
    }]
});
exports.erichLoewenhardt = createCarrier({
    name: "Erich Loewenhardt",
    tier: 2,
    premium: true,
    hullInfo: {
        leftSpots: 4,
        rightSpots: 4,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        },
        mounts: {
            positions: [
                [1.75, 7, 1.5, 0, 270, 1],
                [1.75, 5, 1.5, 0, 270, 1],
                [1.75, 2, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [-5.5, 5.5],
                stats: [g.cvSecondary, [.6, 1, .5, 1, .4, .45, 2, 1.2, 1.2, 1.1, 1, 2, 2]]
            }
        }
    },
    prop: {
        shape: [
            [1.5, .5],
            [-1.5, .5],
            [-1.5, -.5],
            [1.5, -.5]
        ],
        layers: [{
            POSITION: [8, -8, 0, 0, 0, 1],
            TYPE: exports.genericTank
        }]
    },
    aviation: [{
        type: "heBomb",
        name: "Dive Bomber",
        size: 5,
        payload: 3,
        ammoStats: [[1, 1, 4, .8, .3, .3, 1, 1, 1, 1, 1, 2, 1]],
    }, {
        type: "apRocket",
        name: "Rocket Attack Plane",
        size: 5,
        payload: 4,
        ammoStats: [[1, 1, 4, .8, .35, .35, 1, 1, 1, 1, 1, 4, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 5,
        payload: 4,
        ammoStats: [[1, 1, 1, .8, .55, .55, 1, 1, 1, 1, 1, 1.5, 1]],
    }]
});
exports.grafZeppelin = createCarrier({
    name: "Graf Zeppelin",
    tier: 3,
    premium: true,
    hullInfo: {
        leftSpots: 5,
        rightSpots: 5,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        },
        mounts: {
            positions: [
                [1.75, 9, 1.5, 0, 270, 1],
                [1.75, 6, -1.5, 180, 270, 1],
                [1.75, 7, 1.5, 0, 270, 1],
                [1.75, 4, -1.5, 180, 270, 1],
                [1.75, 5, 1.5, 0, 270, 1],
                [1.75, 2, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [-5.5, 5.5, 0],
                stats: [g.cvSecondary, [.6, 1, .5, 1, .4, .45, 2, 1.2, 1.2, 1.1, 1, 2, 2]]
            }
        }
    },
    prop: {
        shape: [
            [1.5, .5],
            [-1.5, .5],
            [-1.5, -.5],
            [1.5, -.5]
        ],
        layers: [{
            POSITION: [8, -8, 0, 0, 0, 1],
            TYPE: exports.genericTank
        }, {
            POSITION: [8, 8, 0, 0, 0, 1],
            TYPE: exports.genericTank
        }, {
            POSITION: [8, 0, 0, 0, 0, 1],
            TYPE: [exports.genericTank, {
                COLOR: 9
            }]
        }]
    },
    aviation: [{
        type: "apBomb",
        name: "Dive Bomber",
        size: 5,
        payload: 3,
        ammoStats: [[1, 1, 4, .8, .3, .3, 1, 1, 1, 1, 1, 2, 1]],
    }, {
        type: "apRocket",
        name: "Rocket Attack Plane",
        size: 5,
        payload: 4,
        ammoStats: [[1, 1, 4, .8, .35, .35, 1, 1, 1, 1, 1, 4, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 5,
        payload: 4,
        ammoStats: [[1, 1, 1, .8, .55, .55, 1, 1, 1, 1, 1, 1.5, 1]],
    }]
});
exports.maxImmelmann = createCarrier({
    name: "Max Immelmann",
    tier: 4,
    premium: true,
    hullInfo: {
        leftSpots: 7,
        rightSpots: 7,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        },
        mounts: {
            positions: [
                [1.75, 9, 1.5, 0, 270, 1],
                [1.75, 6, -1.5, 180, 270, 1],
                [1.75, 7, 1.5, 0, 270, 1],
                [1.75, 4, -1.5, 180, 270, 1],
                [1.75, 5, 1.5, 0, 270, 1],
                [1.75, 2, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [-8, -3, 3, 8],
                stats: [g.cvSecondary, [.6, 1, .5, 1, .4, .45, 2, 1.2, 1.2, 1.1, 1, 2, 2]]
            }
        }
    },
    prop: {
        shape: [
            [1.5, .5],
            [-1.5, .5],
            [-1.5, -.5],
            [1.5, -.5]
        ],
        layers: [{
            POSITION: [8, -8, 0, 0, 0, 1],
            TYPE: exports.genericTank
        }, {
            POSITION: [8, 8, 0, 0, 0, 1],
            TYPE: exports.genericTank
        }, {
            POSITION: [8, 0, 0, 0, 0, 1],
            TYPE: [exports.genericTank, {
                COLOR: 9
            }]
        }]
    },
    aviation: [{
        type: "apBomb",
        name: "Dive Bomber",
        size: 5,
        payload: 3,
        ammoStats: [[1, 1, 4, .8, .3, .3, 1, 1, 1, 1, 1, 2, 1]]
    }, {
        type: "skipBomb",
        name: "Skip Bomber",
        size: 5,
        payload: 4,
        ammoStats: [[1, 1, 4, .8, .3, .3, 1, 1, 1, 1, 1, 2, 1]]
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 5,
        payload: 4,
        ammoStats: [[1, 1, 1, .8, .55, .55, 1, 1, 1, 1, 1, 1.5, 1]]
    }]
});
// Soviet Carriers
exports.komsomolets = createCarrier({
    name: "Komsomolets",
    tier: 1,
    hullInfo: {
        point: [
            [1, -.2],
            [1.5, 0],
            [1, .2]
        ],
        leftSpots: 5,
        rightSpots: 5,
        leftMount: {
            antiAircraft: true,
            stats: [g.cvAntiAircraft, [1.5, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1]]
        },
        rightMount: {
            antiAircraft: true,
            stats: [g.cvAntiAircraft, [1.5, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1]]
        },
        mounts: {
            positions: [
                [1.75, 5, -1.5, 0, 270, 1],
                [1.75, 2, 1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [0]
            }
        }
    },
    prop: {
        size: 2,
        shape: 0,
        flip: true
    },
    aviation: [{
        type: "skipBomb",
        name: "Skip Bomber",
        size: 12,
        payload: 2,
        ammoStats: [[1, 1, 1, 1, .5, .5, .85, 1, 1, 1, 1, 2, 1]],
        spawnStats: [[1, 1, 1, 1, .8, .7, 1, 1, 1, 1, 1, 1, 1]],
    }]
});
exports.serov = createCarrier({
    name: "Serov",
    tier: 2,
    hullInfo: {
        leftSpots: 3,
        rightSpots: 5,
        rightMount: {
            antiAircraft: true
        },
        mounts: {
            positions: [
                [1.75, 5, 1.5, 0, 270, 1],
                [1.75, 2, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [-5.5, 5.5]
            }
        }
    },
    prop: {
        shape: [
            [1.5, .5],
            [-1.5, .5],
            [-1.5, -.5],
            [1.5, -.5]
        ],
        layers: [{
            POSITION: [10, 0, 0, 0, 0, 1],
            TYPE: [exports.genericTank, { COLOR: 16 }]
        }]
    },
    aviation: [{
        type: "apRocket",
        name: "Rocket Attack Plane",
        size: 10,
        payload: 1,
        ammoStats: [[1, 1, 1, 1, .8, .8, 1, 1, 1, 1, 1, 2, 1]],
        spawnStats: [[1, 1, 1, 1, .8, .7, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "skipBomb",
        name: "Skip Bomber",
        size: 10,
        payload: 1,
        ammoStats: [[1, 1, 1, 1, .7, .7, 1, 1, 1, 1, 1, 2, 1]],
        spawnStats: [[1, 1, 1, 1, .8, .7, 1, 1, 1, 1, 1, 1, 1]],
    }]
});
exports.pobeda = createCarrier({
    name: "Pobeda",
    tier: 3,
    hullInfo: {
        leftSpots: 3,
        rightSpots: 3,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        },
        mounts: {
            positions: [
                [1.75, 7, 1.5, 0, 270, 1],
                [1.75, 5, 1.5, 0, 270, 1],
                [1.75, 4, -1.5, 180, 270, 1],
                [1.75, 2, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [0]
            }
        }
    },
    prop: {
        shape: [
            [1.5, .5],
            [-1.5, .5],
            [-1.5, -.5],
            [1.5, -.5]
        ],
        layers: [{
            POSITION: [10, 0, 0, 0, 0, 1],
            TYPE: [exports.gem, { COLOR: 9 }]
        }]
    },
    aviation: [{
        type: "apRocket",
        name: "Rocket Attack Plane",
        size: 11,
        payload: 1,
        ammoStats: [[1, 1, 1, 1, .8, .8, 1, 1, 1, 1, 1, 2, 1]],
        spawnStats: [[1, 1, 1, 1, .8, .7, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "skipBomb",
        name: "Skip Bomber",
        size: 11,
        payload: 1,
        ammoStats: [[1, 1, 1, 1, .7, .7, 1, 1, 1, 1, 1, 2, 1]],
        spawnStats: [[1, 1, 1, 1, .8, .7, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 11,
        payload: 1,
        ammoStats: [[1, 1, .1, 1, 1.6, 1.6, 1.5, .8, 1, 2, 1, .1, 1]],
        spawnStats: [[1, 1, 1, 1, .8, .7, 1, 1, 1, 1, 1, 1, 1]],
    }]
});
exports.nakhimovProp = {
    CONTROLLERS: ["spin"],
    INDEPENDENT: true,
    GUNS: (function () {
        const output = [];
        for (let i = 0; i < 3; i++) {
            output.push({
                POSITION: [3, 12, 1, 19, 0, 360 / 3 * i, 0]
            }, {
                POSITION: [22, 6, 1, 0, 0, 360 / 3 * i, 0]
            });
        }
        return output;
    })()
};
exports.nakhimov = createCarrier({
    name: "Admiral Nakhimov",
    tier: 4,
    hullInfo: {
        leftSpots: 6,
        rightSpots: 6,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        },
        mounts: {
            positions: [
                [1.75, 7, 1.5, 0, 270, 1],
                [1.75, 5, 1.5, 0, 270, 1],
                [1.75, 4, -1.5, 180, 270, 1],
                [1.75, 2, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [-5.5, 5.5, 0]
            }
        }
    },
    prop: {
        shape: [
            [1.5, .75],
            [-1.5, .75],
            [-1.5, -.75],
            [1.5, -.75]
        ],
        layers: [{
            POSITION: [10, 0, 0, 0, 0, 1],
            TYPE: [exports.gem, { COLOR: 9 }]
        }, {
            POSITION: [6, 0, 0, 0, 360, 1],
            TYPE: exports.nakhimovProp
        }]
    },
    aviation: [{
        type: "apRocket",
        name: "Rocket Attack Plane",
        size: 14,
        payload: 2,
        ammoStats: [[1, 1, 1, 1, .4, .6, .8, 1, 1, 1, 1, 2, 1]],
        spawnStats: [[1, 1, 1, 1, .8, .7, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "skipBomb",
        name: "Skip Bomber",
        size: 14,
        payload: 1,
        ammoStats: [[1, 1, 1, 1, .7, .7, 1, 1, 1, 1, 1, 2, 1]],
        spawnStats: [[1, 1, 1, 1, .8, .7, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 14,
        payload: 1,
        ammoStats: [[1, 1, .1, 1, 1.6, 1.6, 1.5, .8, 1, 2, 1, .1, 1]],
        spawnStats: [[1, 1, 1, 1, .8, .7, 1, 1, 1, 1, 1, 1, 1]],
    }]
});
exports.chkalov = createCarrier({
    name: "Chkalov",
    premium: true,
    tier: 3,
    hullInfo: {
        leftSpots: 5,
        rightSpots: 5,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        },
        mounts: {
            positions: [
                [1.75, 7, 1.5, 0, 270, 1],
                [1.75, 5, 1.5, 0, 270, 1],
                [1.75, 4, -1.5, 180, 270, 1],
                [1.75, 2, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [5.5, -5.5]
            }
        }
    },
    prop: {
        shape: [
            [1.5, .5],
            [-1.5, .5],
            [-1.5, -.5],
            [1.5, -.5]
        ],
        layers: [{
            POSITION: [10, 0, 0, 0, 0, 1],
            TYPE: [exports.gem, { COLOR: 9 }]
        }, {
            POSITION: [7.5, 0, 0, 0, 0, 1],
            TYPE: [exports.triangle, { COLOR: 16 }]
        }, {
            POSITION: [5, 0, 0, 0, 0, 1],
            TYPE: [exports.genericTank, { COLOR: 9 }]
        }]
    },
    aviation: [{
        type: "apRocket",
        name: "Rocket Attack Plane",
        size: 11,
        payload: 1,
        ammoStats: [[1, 1, 1, 1, .8, .8, 1, 1, 1, 1, 1, 2, 1]],
        spawnStats: [[1, 1, 1, 1, .8, .7, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "heBomb",
        name: "Dive Bomber",
        size: 11,
        payload: 1,
        ammoStats: [[1, 1, 1, 1, .7, .7, 1, 1, 1, 1, 1, 2, 1]],
        spawnStats: [[1, 1, 1, 1, .8, .7, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "skipBomb",
        name: "Skip Bomber",
        size: 11,
        payload: 1,
        ammoStats: [[1, 1, 1, 1, .7, .7, 1, 1, 1, 1, 1, 2, 1]],
        spawnStats: [[1, 1, 1, 1, .8, .7, 1, 1, 1, 1, 1, 1, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 11,
        payload: 1,
        ammoStats: [[1, 1, .1, 1, 1.6, 1.6, 1.5, .8, 1, 2, 1, .1, 1]],
        spawnStats: [[1, 1, 1, 1, .8, .7, 1, 1, 1, 1, 1, 1, 1]],
    }]
});
// Royal Navy Carriers
exports.hermes = createCarrier({
    name: "Hermes",
    tier: 1,
    hullInfo: {
        leftSpots: 2,
        rightSpots: 2,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        }
    },
    prop: {
        size: 2,
        shape: 0
    },
    aviation: [{
        type: "carpetBomb",
        name: "Carpet Bomber",
        size: 5,
        payload: 6,
        ammoStats: [[1, 1, 4, .5, 1, 1, 1, 1, 1, 1, 1, 3, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }]
});
exports.argus = createCarrier({
    name: "Argus",
    tier: 2,
    hullInfo: {
        leftSpots: 3,
        rightSpots: 3,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        }
    },
    prop: {
        size: 2,
        shape: 0,
        layers: [{
            POSITION: [20, 30, 0, 0, 0, 1],
            TYPE: exports.genericTank
        }]
    },
    aviation: [{
        type: "carpetBomb",
        name: "Carpet Bomber",
        size: 5,
        payload: 6,
        ammoStats: [[1, 1, 4, .5, 1, 1, 1, 1, 1, 1, 1, 3, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 6,
        payload: 1,
        ammoStats: [[1, 1, 1, .9, 1, 2, 1, 1, 1, 1, 1, 1, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }]
});
exports.furious = createCarrier({
    name: "Furious",
    tier: 3,
    hullInfo: {
        leftSpots: 4,
        rightSpots: 4,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        },
        mounts: {
            positions: [
                [1.5, 10, 1.5, 0, 270, 1],
                [1.5, 8, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [0]
            }
        }
    },
    prop: {
        size: 2,
        shape: 0,
        layers: [{
            POSITION: [20, 30, 0, 0, 0, 1],
            TYPE: exports.genericTank
        }, {
            POSITION: [20, -30, 0, 0, 0, 1],
            TYPE: exports.genericTank
        }]
    },
    aviation: [{
        type: "carpetBomb",
        name: "Carpet Bomber",
        size: 5,
        payload: 6,
        ammoStats: [[1, 1, 4, .5, 1, 1, 1, 1, 1, 1, 1, 3, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }, {
        type: "skipBomb",
        name: "Skip Bomber",
        size: 6,
        payload: 1,
        ammoStats: [[1, 1, 4, .5, 1, 1, 1, 1, 1, 1, 1, 3, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 6,
        payload: 1,
        ammoStats: [[1, 1, 1, .9, 1, 2, 1, 1, 1, 1, 1, 1, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }]
});
exports.audacious = createCarrier({
    name: "Audacious",
    tier: 4,
    hullInfo: {
        leftSpots: 5,
        rightSpots: 5,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        },
        mounts: {
            positions: [
                [1.5, 10, 1.5, 0, 270, 1],
                [1.5, 8, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [-5.5, 5.5]
            }
        }
    },
    prop: {
        size: 2,
        shape: 0,
        layers: [{
            POSITION: [20, 30, 0, 0, 0, 1],
            TYPE: exports.genericTank
        }, {
            POSITION: [20, -30, 0, 0, 0, 1],
            TYPE: exports.genericTank
        }, {
            POSITION: [10, 0, 0, 0, 0, 1],
            TYPE: [exports.genericTank, { COLOR: 9 }]
        }]
    },
    aviation: [{
        type: "carpetBomb",
        name: "Carpet Bomber",
        size: 6,
        payload: 6,
        ammoStats: [[1, 1, 4, .5, 1, 1, 1, 1, 1, 1, 1, 3, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }, {
        type: "skipBomb",
        name: "Skip Bomber",
        size: 6,
        payload: 1,
        ammoStats: [[1, 1, 4, .5, 1, 1, 1, 1, 1, 1, 1, 3, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 6,
        payload: 1,
        ammoStats: [[1, 1, 1, .9, 1, 2, 1, 1, 1, 1, 1, 1, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }, {
        type: "heRocket",
        name: "Rocket Attack Plane",
        size: 6,
        payload: 1,
        ammoStats: [[1, 1, 1, .8, 1, 1, 1, 1, 1, 1, 1, 3, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }]
});
exports.arkRoyal = createCarrier({
    name: "Ark Royal",
    tier: 2,
    premium: true,
    hullInfo: {
        leftSpots: 3,
        rightSpots: 3,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        }
    },
    prop: {
        size: 2,
        shape: 0,
        layers: [{
            POSITION: [20, -30, 0, 0, 0, 1],
            TYPE: exports.genericTank
        }]
    },
    aviation: [{
        type: "carpetBomb",
        name: "Carpet Bomber",
        size: 6,
        payload: 6,
        ammoStats: [[1, 1, 4, .5, 1, 1, 1, 1, 1, 1, 1, 3, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }, {
        type: "skipBomb",
        name: "Dive Bomber",
        size: 6,
        payload: 1,
        ammoStats: [[1, 1, 2, .5, 1, 1, 1, 1, 1, 1, 1, 1.5, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }]
});
exports.indomitable = createCarrier({
    name: "Indomitable",
    tier: 3,
    premium: true,
    hullInfo: {
        leftSpots: 4,
        rightSpots: 4,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        },
        mounts: {
            positions: [
                [1.5, 10, 1.5, 0, 270, 1],
                [1.5, 8, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [-5.5, 5.5]
            }
        }
    },
    prop: {
        size: 2,
        shape: 0,
        layers: [{
            POSITION: [20, -30, 0, 0, 0, 1],
            TYPE: [exports.genericTank, { COLOR: 9 }]
        }]
    },
    aviation: [{
        type: "carpetBomb",
        name: "Carpet Bomber",
        size: 6,
        payload: 6,
        ammoStats: [[1, 1, 4, .5, 1, 1, 1, 1, 1, 1, 1, 3, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }, {
        type: "skipBomb",
        name: "Dive Bomber",
        size: 6,
        payload: 1,
        ammoStats: [[1, 1, 2, .5, 1, 1, 1, 1, 1, 1, 1, 1.5, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 6,
        payload: 1,
        ammoStats: [[1, 1, 1, .9, 1, 2, 1, 1, 1, 1, 1, 1, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }]
});
exports.implacable = createCarrier({
    name: "Implacable",
    tier: 4,
    premium: true,
    hullInfo: {
        leftSpots: 5,
        rightSpots: 5,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        },
        mounts: {
            positions: [
                [1.5, 10, 1.5, 0, 270, 1],
                [1.5, 8, -1.5, 180, 270, 1],
                [1.5, 4, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [-5.5, 5.5]
            }
        }
    },
    prop: {
        size: 2,
        shape: 0,
        layers: [{
            POSITION: [20, 30, 0, 0, 0, 1],
            TYPE: [exports.genericTank, { COLOR: 9 }]
        }, {
            POSITION: [20, -30, 0, 0, 0, 1],
            TYPE: [exports.genericTank, { COLOR: 9 }]
        }]
    },
    aviation: [{
        type: "carpetBomb",
        name: "Carpet Bomber",
        size: 6,
        payload: 6,
        ammoStats: [[1, 1, 4, .5, 1, 1, 1, 1, 1, 1, 1, 3, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }, {
        type: "skipBomb",
        name: "Dive Bomber",
        size: 6,
        payload: 1,
        ammoStats: [[1, 1, 2, .5, 1, 1, 1, 1, 1, 1, 1, 1.5, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 6,
        payload: 1,
        ammoStats: [[1, 1, 1, .9, 1, 2, 1, 1, 1, 1, 1, 1, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }, {
        type: "heRocket",
        name: "Rocket Attack Plane",
        size: 6,
        payload: 1,
        ammoStats: [[1, 1, 1, .8, 1, 1, 1, 1, 1, 1, 1, 3, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }]
});
exports.illustrious = createCarrier({
    name: "Illustrious",
    tier: 3,
    premium: true,
    hullInfo: {
        leftSpots: 6,
        rightSpots: 6,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        },
        mounts: {
            positions: [
                [1.5, 10, 1.5, 0, 270, 1],
                [1.5, 8, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [-5.5, 5.5]
            }
        }
    },
    prop: {
        size: 2,
        shape: 4,
        layers: [{
            POSITION: [20, 30, 0, 0, 0, 1],
            TYPE: [exports.genericTank, { COLOR: 9 }]
        }]
    },
    aviation: [{
        type: "carpetBomb",
        name: "Carpet Bomber",
        size: 6,
        payload: 6,
        ammoStats: [[1, 1, 4, .5, 1, 1, 1, 1, 1, 1, 1, 3, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 6,
        payload: 2,
        ammoStats: [[1, 1, 1, .9, 1, 2, 1, 1, 1, 1, 1, 1, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }, {
        type: "fighter",
        name: "Patrol Fighter",
        size: 3,
        payload: 1,
        ammoStats: [],
        spawnStats: [],
    }]
});
exports.indefatigable = createCarrier({
    name: "Indefatigable",
    tier: 4,
    premium: true,
    hullInfo: {
        leftSpots: 8,
        rightSpots: 8,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        },
        mounts: {
            positions: [
                [1.5, 10, 1.5, 0, 270, 1],
                [1.5, 8, -1.5, 180, 270, 1],
                [1.5, 4, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [-5.5, 5.5, 0]
            }
        }
    },
    prop: {
        size: 2,
        shape: 4,
        layers: [{
            POSITION: [20, 30, 0, 0, 0, 1],
            TYPE: [exports.genericTank, { COLOR: 9 }]
        }]
    },
    aviation: [{
        type: "carpetBomb",
        name: "Carpet Bomber",
        size: 6,
        payload: 6,
        ammoStats: [[1, 1, 4, .5, 1, 1, 1, 1, 1, 1, 1, 3, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 6,
        payload: 2,
        ammoStats: [[1, 1, 1, .9, 1, 2, 1, 1, 1, 1, 1, 1, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }, {
        type: "fighter",
        name: "Patrol Fighter",
        size: 6,
        payload: 1,
        ammoStats: [],
        spawnStats: [],
    }]
});
exports.malta = createCarrier({
    name: "Malta",
    tier: 5,
    premium: true,
    hullInfo: {
        leftSpots: 12,
        rightSpots: 12,
        leftMount: {
            antiAircraft: true
        },
        rightMount: {
            antiAircraft: true
        },
        mounts: {
            positions: [
                [1.5, 10, 1.5, 0, 270, 1],
                [1.5, 8, -1.5, 180, 270, 1],
                [1.5, 4, -1.5, 180, 270, 1]
            ],
            turretData: {
                positions: [-5.5, 5.5, 0]
            }
        }
    },
    prop: {
        size: 2,
        shape: 4,
        layers: [{
            POSITION: [20, 30, 0, 0, 0, 1],
            TYPE: [exports.genericTank, { COLOR: 9 }]
        }]
    },
    aviation: [{
        type: "carpetBomb",
        name: "Carpet Bomber",
        size: 4,
        payload: 12,
        ammoStats: [[1, 1, 4, .5, 1, 1, 1, 1, 1, 1, 1, 3, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }, {
        type: "torpedo",
        name: "Torpedo Bomber",
        size: 4,
        payload: 5,
        ammoStats: [[1, 1, 1, .9, 1, 2, 1, 1, 1, 1, 1, 1, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }, {
        type: "sapRocket",
        name: "Rocket Attack Plane",
        size: 4,
        payload: 4,
        ammoStats: [[1, 1, 1, .8, .6, 1, 2, 1, 1, 1, 1, 3, 1]],
        spawnStats: [[1, 1, 1, 1.1, 1.3, 1.1, 1, .9, .8, 1, 1, 1, 1]],
    }, {
        type: "fighter",
        name: "Patrol Fighter",
        size: 4,
        payload: 3,
        ammoStats: [],
        spawnStats: [],
    }]
});
exports.autobasic = makeAuto(exports.basic);
exports.autotrapper = makeAuto(exports.trapper);
exports.autobuilder = makeAuto(exports.builder);
exports.autopelleter = makeAuto(exports.pelleter);
exports.autogunner = makeAuto(exports.gunner);
exports.autopropeller = makeAuto(exports.propeller);
exports.autotri = makeAuto(exports.tri);
exports.basicception = makeCeption(exports.basic);
exports.twinception = makeCeption(exports.twin);
exports.sniperception = makeCeption(exports.sniper);
exports.machineception = makeCeption(exports.machine);
exports.pounderception = makeCeption(exports.pounder);
exports.flankception = makeCeption(exports.flank);
g.zeppelinExplosion = [1, 1, 1, 1, 2 / 3, 1 / 3, 1, 1, 1, .5, 1, 1, 1]
g.zeppelin = [4, 1, 1, .8, .9, .9, 4 / 3, 4 / 3, 4 / 3, 1.2, 1, 1, 1];
exports.zeppelinBullet = {
    PARENT: [exports.bullet],
    INDEPENDENT: true,
    MISSILE: true,
    GO_THROUGH_WALLS: true,
    GUNS: [{
        POSITION: [1, 1, 1, 0, 0, 0, Infinity],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.explosion, g.zeppelinExplosion]),
            TYPE: [exports.explosion, {
                PERSISTS_AFTER_DEATH: true
            }],
            SHOOT_ON_DEATH: true
        }
    }]
};
exports.zeppelinTurret = {
    PARENT: [exports.turretParent],
    SHAPE: shapeConfig.zeppelinTurret,
    TRAVERSE_SPEED: .5,
    GUNS: [{
        POSITION: [1, 12, 1, 5, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.zeppelin]),
            TYPE: exports.zeppelinBullet
        }
    }],
    TURRETS: [{
        POSITION: [11, 0, 0, 0, 0, 0],
        TYPE: [exports.genericTank, {
            COLOR: 11
        }]
    }]
};
exports.zeppelin = {
    PARENT: [exports.genericTank],
    LABEL: "Zeppelin",
    DANGER: 7,
    TURRETS: [{
        POSITION: [11, 0, 0, 0, 360, 1],
        TYPE: exports.zeppelinTurret
    }]
};
exports.giffardBullet = {
    PARENT: [exports.bullet],
    INDEPENDENT: true,
    MISSILE: true,
    GO_THROUGH_WALLS: true,
    GUNS: [{
        POSITION: [1, 1, 1, 0, 0, 0, Infinity],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.explosion, g.zeppelinExplosion]),
            TYPE: [exports.explosion, {
                PERSISTS_AFTER_DEATH: true
            }],
            SHOOT_ON_DEATH: true
        }
    }, {
        POSITION: [14, 6, 1, 0, -2, 130, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.skimmertrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [14, 6, 1, 0, 2, 230, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.missileTrail, g.skimmertrail]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }],
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }]
};
exports.giffardTurret = {
    PARENT: [exports.turretParent],
    SHAPE: shapeConfig.zeppelinTurret,
    TRAVERSE_SPEED: .5,
    GUNS: [{
        POSITION: [1, 12, 1, 5, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.zeppelin]),
            TYPE: exports.giffardBullet
        }
    }],
    TURRETS: [{
        POSITION: [11, 0, 0, 0, 0, 0],
        TYPE: [exports.genericTank, {
            COLOR: 0
        }]
    }]
};
exports.giffard = {
    PARENT: [exports.genericTank],
    LABEL: "Giffard",
    DANGER: 8,
    TURRETS: [{
        POSITION: [11, 0, 0, 0, 360, 1],
        TYPE: exports.giffardTurret
    }]
};
exports.hindenburgBullet = {
    PARENT: [exports.homingBullet],
    INDEPENDENT: true,
    MISSILE: true,
    GO_THROUGH_WALLS: true,
    GUNS: [{
        POSITION: [1, 1, 1, 0, 0, 0, Infinity],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.explosion, g.zeppelinExplosion]),
            TYPE: [exports.explosion, {
                PERSISTS_AFTER_DEATH: true
            }],
            SHOOT_ON_DEATH: true
        }
    }]
};
exports.hindenburgTurret = {
    PARENT: [exports.turretParent],
    SHAPE: shapeConfig.zeppelinTurret,
    TRAVERSE_SPEED: .5,
    GUNS: [{
        POSITION: [1, 12, 1, 5, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.zeppelin]),
            TYPE: exports.hindenburgBullet
        }
    }],
    TURRETS: [{
        POSITION: [11, 0, 0, 0, 0, 0],
        TYPE: [exports.genericTank, {
            COLOR: 5
        }]
    }]
};
exports.hindenburg = {
    PARENT: [exports.genericTank],
    LABEL: "Hindenburg",
    DANGER: 8,
    TURRETS: [{
        POSITION: [11, 0, 0, 0, 360, 1],
        TYPE: exports.hindenburgTurret
    }]
};
exports.heinrichArntzenBullet = {
    PARENT: [exports.bullet],
    INDEPENDENT: true,
    MISSILE: true,
    GO_THROUGH_WALLS: true,
    GUNS: [{
        POSITION: [1, 1, 1, 0, 0, 0, Infinity],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.explosion, g.zeppelinExplosion]),
            TYPE: [exports.explosion, {
                PERSISTS_AFTER_DEATH: true
            }],
            SHOOT_ON_DEATH: true
        }
    }, {
        POSITION: [1, 5, 1, 0, 0, 0, 1],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.minion]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [1, 5, 1, 0, 0, 90, 1],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.minion]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [1, 5, 1, 0, 0, 180, 1],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.minion]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [1, 5, 1, 0, 0, 270, 1],
        PROPERTIES: {
            AUTOFIRE: true,
            SHOOT_SETTINGS: combineStats([g.bullet, g.minion]),
            TYPE: [exports.bullet, {
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }]
};
exports.heinrichArntzenTurret = {
    PARENT: [exports.turretParent],
    SHAPE: shapeConfig.zeppelinTurret,
    TRAVERSE_SPEED: .5,
    GUNS: [{
        POSITION: [1, 12, 1, 5, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.zeppelin]),
            TYPE: exports.heinrichArntzenBullet
        }
    }],
    TURRETS: [{
        POSITION: [11, 0, 0, 0, 0, 0],
        TYPE: [exports.genericTank, {
            COLOR: 21
        }]
    }]
};
exports.heinrichArntzen = {
    PARENT: [exports.genericTank],
    LABEL: "Heinrich Arntzen",
    DANGER: 8,
    TURRETS: [{
        POSITION: [11, 0, 0, 0, 360, 1],
        TYPE: exports.heinrichArntzenTurret
    }]
};
exports.zeppelin2 = makeAutoN(exports.zeppelinTurret, 2, "Zeppelin-2");
exports.zeppelin.UPGRADES_TIER_4 = [exports.giffard, exports.hindenburg, exports.heinrichArntzen, exports.zeppelin2];
exports.pelleterhybrid = makeHybrid(exports.pelleter, "Pelleter Hybrid");
exports.naturalistbrid = makeHybrid(exports.naturalist, "Naturalistbrid");
exports.basebrid = makeHybrid(exports.basic, "Basebrid");
exports.hybrid = makeHybrid(exports.destroyer, "Hybrid");
exports.poundbrid = makeHybrid(exports.pounder, "Poundbrid");
exports.annibrid = makeHybrid(exports.anni, "Annibrid");
exports.benthybrid = makeHybrid(exports.tripleshot, "Bent Hybrid");
exports.auto2 = makeAutoN(exports.basic, 2, "Auto-2");
exports.twin2 = makeAutoN(exports.twin, 2, "Twin-2");
exports.sniper2 = makeAutoN(exports.sniper, 2, "Sniper-2");
exports.machine2 = makeAutoN(exports.machine, 2, "Machine-2");
exports.pounder2 = makeAutoN(exports.pounder, 2, "Pounder-2");
exports.trapper2 = makeAutoN(exports.trapper, 2, "Trapper-2");
exports.director2 = makeAutoN(exports.director, 2, "Director-2");
exports.grower2 = makeAutoN(exports.grower, 2, "Grower-2");
exports.pelleter2 = makeAutoN(exports.pelleter, 2, "Pelleter-2");
exports.auto3 = makeAutoN(exports.basic, 3, "Auto-3");
exports.twin3 = makeAutoN(exports.twin, 3, "Twin-3");
exports.sniper3 = makeAutoN(exports.sniper, 3, "Sniper-3");
exports.machine3 = makeAutoN(exports.machine, 3, "Machine-3");
exports.pounder3 = makeAutoN(exports.pounder, 3, "Pounder-3");
exports.trapper3 = makeAutoN(exports.trapper, 3, "Trapper-3");
exports.director3 = makeAutoN(exports.director, 3, "Director-3");
exports.grower3 = makeAutoN(exports.grower, 3, "Grower-3");
exports.pelleter3 = makeAutoN(exports.pelleter, 3, "Pelleter-3");
exports.auto5 = makeAutoN(exports.basic, 5, "Auto-5");
exports.twin5 = makeAutoN(exports.twin, 5, "Twin-5");
exports.sniper5 = makeAutoN(exports.sniper, 5, "Sniper-5");
exports.machine5 = makeAutoN(exports.machine, 5, "Machine-5");
exports.pounder5 = makeAutoN(exports.pounder, 5, "Pounder-5");
exports.trapper5 = makeAutoN(exports.trapper, 5, "Trapper-5");
exports.director5 = makeAutoN(exports.director, 5, "Director-5");
exports.grower5 = makeAutoN(exports.grower, 5, "Grower-5");
exports.pelleter5 = makeAutoN(exports.pelleter, 5, "Pelleter-5");
exports.auto7 = makeAutoN(exports.basic, 7, "Auto-7");
exports.swivel2 = makeAutoN(exports.basic, 2, "Swivel-2", {
    swivel: true
});
exports.swivel3 = makeAutoN(exports.basic, 3, "Swivel-3", {
    swivel: true
});
exports.swivel5 = makeAutoN(exports.basic, 5, "Swivel-5", {
    swivel: true
});
exports.swivelTwin = makeAutoN(exports.twin, 3, "Swivel-Twin", {
    swivel: true
});
exports.swivelSniper = makeAutoN(exports.sniper, 3, "Swivel-Sniper", {
    swivel: true
});
exports.swivelMachine = makeAutoN(exports.machine, 3, "Swivel-Machine", {
    swivel: true
});
exports.swivelPounder = makeAutoN(exports.pounder, 3, "Swivel-Pounder", {
    swivel: true
});
exports.swivelTrapper = makeAutoN(exports.trapper, 3, "Swivel-Trapper", {
    swivel: true
});
exports.swivelDirector = makeAutoN(exports.director, 3, "Swivel-Director", {
    swivel: true
});
exports.swivelGrower = makeAutoN(exports.grower, 3, "Swivel-Grower", {
    swivel: true
});
exports.swivelPelleter = makeAutoN(exports.pelleter, 3, "Swivel-Pelleter", {
    swivel: true
});
exports.axis4 = combine(exports.auto2, exports.swivel2, "TURRETS", "Axis-4", {
    ROTATIONS: {
        TURRETS_TANK_2: 90
    }
});
exports.stack6 = combine(exports.auto3, exports.swivel3, "TURRETS", "Stack-6", {
    ROTATIONS: {
        TURRETS_TANK_2: 60
    }
});
// SCHLIFFFENNNNNN
exports.schlieffen = {
    PARENT: [exports.genericTank],
    LABEL: "Schlieffen",
    SIZE: exports.genericTank.SIZE * 1.2,
    BODY: {
        HEALTH: base.HEALTH * 1.25,
        DAMAGE: base.DAMAGE * 1.175,
        SPEED: base.SPEED * .75,
        FOV: base.FOV * 1.075
    },
    FACING_TYPE: "autospin",
    DANGER: 9,
    TURRETS: (function () {
        const output = [{
            POSITION: [27.5, 0, 0, 0, 360, 0],
            TYPE: exports.smasherBody
        }];
        g.schlieffenAutoTurret = [1 + (.0334 * 16), .05, 1.2, 1, 1 - (.015 * 16), 1 - (.01 * 16), 2, 1.15, 1.15, 1.25, 1, 1, 1];
        exports.schlieffenAutoTurret = {
            PARENT: [exports.turretParent],
            LABEL: "Cannon",
            GUNS: [{
                POSITION: [24, 9, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.bullet, g.turret, g.schlieffenAutoTurret]),
                    TYPE: exports.bullet
                }
            }]
        }
        for (let i = 0; i < 16; i++) {
            output.push({
                POSITION: [6, i % 2 === 0 ? 8 : 9.5, 0, 360 / 16 * i, 90, +(i % 2 === 0)],
                TYPE: [exports.schlieffenAutoTurret, {
                    COLOR: i % 4 === 0 ? 17 : 16
                }]
            });
        }
        return output;
    })()
};
exports.basicCeptionist = makeCeptionist(exports.basic);
exports.twinCeptionist = makeCeptionist(exports.twin);
exports.twinCeptionist2 = makeCeptionist(exports.twin, -1, {
    type: exports.twin
});
exports.tripleCeptionist = makeCeptionist(exports.tripleshot);
exports.doubleCeptionist = makeCeptionist(exports.double);
exports.spreadlingCeptionist = makeCeptionist(exports.spreadling);
exports.sniperCeptionist = makeCeptionist(exports.sniper);
exports.sniperCeptionist2 = makeCeptionist(exports.sniper, -1, {
    type: exports.sniper
});
exports.assassinCeptionist = makeCeptionist(exports.assassin);
exports.minigunCeptionist = makeCeptionist(exports.minigun);
exports.hunterCeptionist = makeCeptionist(exports.hunter);
exports.machineCeptionist = makeCeptionist(exports.machine);
exports.machineCeptionist2 = makeCeptionist(exports.machine, -1, {
    type: exports.machine
});
exports.sprayCeptionist = makeCeptionist(exports.sprayer);
exports.blasterCeptionist = makeCeptionist(exports.blaster);
exports.twinMachineCeptionist = makeCeptionist(exports.twinMachine);
exports.flankCeptionist = makeCeptionist(exports.flank);
exports.flankCeptionist2 = makeCeptionist(exports.flank, -1, {
    type: exports.flank
});
exports.hexaCeptionist = makeCeptionist(exports.hexa);
exports.arthropodaCeptionist = makeCeptionist(exports.arthropoda);
exports.triCeptionist = makeCeptionist(exports.tri);
exports.pounderCeptionist = makeCeptionist(exports.pounder);
exports.pounderCeptionist2 = makeCeptionist(exports.pounder, -1, {
    type: exports.pounder
});
exports.destroyerCeptionist = makeCeptionist(exports.destroyer);
exports.multishotCeptionist = makeCeptionist(exports.multishot);
exports.boxerCeptionist = makeCeptionist(exports.boxer);
exports.basicCeptionist.UPGRADES_TIER_3 = [exports.twinCeptionist, exports.sniperCeptionist, exports.machineCeptionist, exports.flankCeptionist, exports.pounderCeptionist];
exports.twinCeptionist.UPGRADES_TIER_4 = [exports.twinCeptionist2, exports.tripleCeptionist, exports.doubleCeptionist, exports.spreadlingCeptionist, exports.twinMachineCeptionist];
exports.sniperCeptionist.UPGRADES_TIER_4 = [exports.sniperCeptionist2, exports.assassinCeptionist, exports.minigunCeptionist, exports.hunterCeptionist];
exports.machineCeptionist.UPGRADES_TIER_4 = [exports.machineCeptionist2, exports.minigunCeptionist, exports.sprayCeptionist, exports.blasterCeptionist, exports.twinMachineCeptionist];
exports.flankCeptionist.UPGRADES_TIER_4 = [exports.flankCeptionist2, exports.hexaCeptionist, exports.arthropodaCeptionist, exports.triCeptionist];
exports.pounderCeptionist.UPGRADES_TIER_4 = [exports.pounderCeptionist2, exports.destroyerCeptionist, exports.multishotCeptionist, exports.boxerCeptionist];
exports.hivemind = makeHivemind(exports.basic, 2, "Hivemind");
exports.twinmind = makeHivemind(exports.twin, 2);
exports.snipemind = makeHivemind(exports.sniper, 2, "Snipemind");
exports.machmind = makeHivemind(exports.machine, 2, "Machmind");
exports.flankmind = makeHivemind(exports.flank, 2);
exports.poundmind = makeHivemind(exports.pounder, 2, "Poundmind");
exports.trapmind = makeHivemind(exports.trapper, 2, "Trapmind");
exports.dronemind = makeHivemind(exports.director, 2, "Dronemind");
exports.growmind = makeHivemind(exports.grower, 2, "Growmind");
exports.pelletmind = makeHivemind(exports.pelleter, 2, "Pelletmind");
exports.automindAutoTurret = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [22, 10, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.turret, [2, 1, 2, 1, .6, .7, 1.2, 1, 1, .8, 1, 2, 1]]),
            TYPE: exports.bullet
        }
    }]
};
exports.automind = makeHivemind(makeAuto(exports.basic, -1, {
    type: exports.automindAutoTurret
}), 2, "Automind");
exports.madman = makeHivemind(exports.basic, 4, "Madman");
exports.overtrapper = makeOver(exports.trapper);
exports.overbasic = makeOver(exports.basic);
exports.overdestroyer = makeOver(exports.destroyer);
exports.VIP = {
    PARENT: [exports.genericTank],
    LABEL: "VIP",
    STAT_NAMES: statnames.generic,
    DANGER: 6,
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6, 11, 1.2, 11, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.weak]),
            TYPE: exports.autodrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 3,
        }
    }, {
        POSITION: [6, 11, 1.2, 7, 0, 180, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.weak]),
            TYPE: exports.autodrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 2,
        }
    }]
};
exports.deluxe = {
    PARENT: [exports.genericTank],
    LABEL: "Deluxe",
    STAT_NAMES: statnames.generic,
    DANGER: 7,
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6, 11, 1.2, 15, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.weak]),
            TYPE: exports.autodrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 3
        }
    }, {
        POSITION: [6, 11, 1.2, 11, 0, 180, .33],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.weak]),
            TYPE: exports.autodrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 2
        }
    }, {
        POSITION: [6, 11, 1.2, 7, 0, 180, .66],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.weak]),
            TYPE: exports.autodrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 2
        }
    }]
};
exports.overluxe = {
    PARENT: [exports.genericTank],
    LABEL: "Overluxe",
    STAT_NAMES: statnames.generic,
    DANGER: 8,
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6, 11, 1.2, 11, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.weak]),
            TYPE: exports.autodrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 3
        }
    }, {
        POSITION: [6, 11, 1.2, 7, 0, 180, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.weak]),
            TYPE: exports.autodrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 2
        }
    }, {
        POSITION: [6, 11, 1.2, 7, 0, 125, .66],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.weak]),
            TYPE: exports.autodrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 2
        }
    }, {
        POSITION: [6, 11, 1.2, 7, 0, 235, .66],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.weak]),
            TYPE: exports.autodrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 2
        }
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
    DANGER: 9,
    SKILL: skillSet({
        rld: 1,
        dam: 1,
        pen: 1,
        str: 1,
        spd: 1
    }),
    SKILL_CAP: [9, 9, 9, 9, 9, 0, 0, 0, 0, 0],
    LEVEL: -1,
    BODY: {
        RESIST: 100,
        SPEED: 0,
        HEALTH: 10 * base.HEALTH,
        DAMAGE: 2 * base.DAMAGE,
        PENETRATION: .25,
        FOV: .7,
        PUSHABILITY: 0,
        HETERO: 0,
        REGEN: .5 * base.REGEN
    },
    SIZE: exports.genericTank.SIZE * 2,
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
        POSITION: [15.5, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.destroyerDominator]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5, 8, -1.6, 6.25, 0, 0, 0]
    }]
};
exports.gunnerDominator = {
    PARENT: [exports.dominator],
    GUNS: [{
        POSITION: [14.25, 3.5, 1, 0, -1.75, 0, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.gunnerDominator]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [14.25, 3.5, 1, 0, 1.75, 0, .334],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.gunnerDominator]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15.5, 3.5, 1, 0, 0, 0, 0],
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
exports.droneDominator = {
    PARENT: [exports.dominator],
    FACING_TYPE: "autospin",
    GUNS: (function () {
        const output = [];
        for (let i = 0; i < 6; i++) {
            output.push({
                POSITION: [3.75, 4, 1.2, 8.5, 0, 360 / 6 * i, i / 6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.droneDominator]),
                    TYPE: exports.drone,
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: gunCalcNames.drone,
                    WAIT_TO_CYCLE: true,
                    MAX_CHILDREN: 3
                }
            }, {
                POSITION: [3.75, 4.45, -1.6, 7.2, 0, 360 / 6 * i, 0]
            });
        }
        return output;
    })()
};
exports.steamrollerDominator = {
    PARENT: [exports.dominator],
    GUNS: [{
        POSITION: [11, 3.5, 1, 6.5, 0, 0, 0]
    }, {
        POSITION: [4.25, 6.75, 1.01, 17, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.destroyerDominator, g.steamrollerDominator]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5, 6.75, -1.6, 6.75, 0, 0, 0]
    }]
};
exports.crockettDominator = {
    PARENT: [exports.dominator],
    GUNS: [{
        POSITION: [17.5, 3.25, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.crockettDominator, g.fake]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.crockettDominator, g.fake]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [14.5, 6.75, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.crockettDominator]),
            TYPE: exports.crockettNuke
        }
    }, {
        POSITION: [5, 6.75, -1.6, 6.75, 0, 0, 0]
    }]
};
exports.spawnerDominator = {
    PARENT: [exports.dominator],
    FACING_TYPE: "autospin",
    GUNS: (function () {
        const minions = ["twin", "machine", "sniper", "pounder"];
        for (const name of minions) {
            exports[`spawnerDominator${name}Minion`] = createMinion(exports[name], [
                [1, 0, 3, 1, .8, .8, 1.5, 1, 1, .8, 2, 3, 2]
            ]);
        }
        const output = [];
        for (let i = 0; i < minions.length; i++) {
            output.push({
                POSITION: [2, 5, 1, 10.5, 0, 360 / minions.length * i, 0]
            }, {
                POSITION: [1, 6, 1, 13, 0, 360 / minions.length * i, 1],
                PROPERTIES: {
                    MAX_CHILDREN: 2,
                    SHOOT_SETTINGS: combineStats([g.spawner, g.norecoil]),
                    TYPE: [exports[`spawnerDominator${minions[i]}Minion`], {
                        INDEPENDENT: !!(i % 2),
                        BODY: {
                            FOV: 1.25
                        }
                    }],
                    STAT_CALCULATOR: gunCalcNames.drone,
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true
                }
            }, {
                POSITION: [3.5, 6, 1, 8, 0, 360 / minions.length * i, 0]
            });
        }
        return output;
    })()
};
exports.autoDominator = {
    PARENT: [exports.dominator],
    FACING_TYPE: "autospin",
    TURRETS: (function () {
        exports.autoDominatorTurret = {
            PARENT: [exports.turretParent],
            GUNS: [{
                POSITION: [20, 10, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.bullet, g.turret, g.auto2, g.auto2, g.norecoil]),
                    TYPE: exports.bullet
                }
            }]
        };
        const output = [...exports.dominator.TURRETS];
        for (let i = 0; i < 12; i++) {
            output.push({
                POSITION: [5, 9, 0, 360 / 12 * i, 90, 0],
                TYPE: exports.autoDominatorTurret
            });
        }
        return output;
    })()
};
exports.medicS = {
    COLOR: 11,
    SHAPE: [
        [0.98, 0.19],
        [0.19, 0.184],
        [0.18, 1.006],
        [-0.2, 1.006],
        [-0.2, 0.2],
        [-0.995, 0.2],
        [-0.995, -0.2],
        [-0.19, -0.205],
        [-0.205, -1],
        [0.216, -1.014],
        [0.2, -0.2],
        [1.006, -0.2]
    ]
};
exports.healBullet = {
    PARENT: [exports.bullet],
    HITS_OWN_TEAM: true
};
exports.sanctuaryTurret = {
    PARENT: [exports.genericTank],
    LABEL: "Healer",
    CONTROLLERS: ['reversespin', 'alwaysFire'],
    GUNS: []
};
for (let i = 0; i < 3; i++) exports.sanctuaryTurret.GUNS.push({
    POSITION: [10, 11, -0.5, 8, 0, (360 / 3) * i, 0]
}, {
    POSITION: [15, 12, -1.1, 0, 0, (360 / 3) * i, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.flank, [1, 1, 1, .875, 1, -1, 1, 1, 1, 0.2, 0.5, 1, 1]]),
        TYPE: exports.healBullet,
        STAT_CALCULATOR: gunCalcNames.sustained
    }
});

function makeSanctuary(type) {
    let output = JSON.parse(JSON.stringify(type));
    output.PARENT = [exports.dominator];
    output.LABEL = "Sanctuary";
    output.GUNS = type.GUNS;
    if (type.TURRETS) output.TURRETS = [...type.TURRETS];
    else output.TURRETS = [...exports.dominator.TURRETS];
    output.TURRETS.push({
        POSITION: [8, 0, 0, 0, 360, 1],
        TYPE: exports.sanctuaryTurret
    }, {
        POSITION: [8, 0, 0, 0, 360, 1],
        TYPE: [exports.medicS, {
            CONTROLLERS: ["dontTurn"]
        }]
    });
    output.HITS_OWN_TYPE = "pushOnlyTeam";
    return output;
};
exports.destroyerDominatorSanctuary = makeSanctuary(exports.destroyerDominator);
exports.gunnerDominatorSanctuary = makeSanctuary(exports.gunnerDominator);
exports.trapperDominatorSanctuary = makeSanctuary(exports.trapperDominator);
exports.droneDominatorSanctuary = makeSanctuary(exports.droneDominator);
exports.steamrollerDominatorSanctuary = makeSanctuary(exports.steamrollerDominator);
exports.autoDominatorSanctuary = makeSanctuary(exports.autoDominator);
exports.crockettDominatorSanctuary = makeSanctuary(exports.crockettDominator);
exports.spawnerDominatorSanctuary = makeSanctuary(exports.spawnerDominator);
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
            SHOOT_SETTINGS: combineStats([g.bullet, [5, 0, 4, 1, 6, 1.5, 0.7, 0.5, 2, 0.8, 2, 2, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [11, 13, 1, 6, 0, 0, .2],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, [5, 0, 4, 1, 6, 1.5, 0.7, 0.5, 2, 0.8, 2, 2, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [7, 13, -1.3, 6, 0, 0, 0]
    }]
};
exports.baseDroneSpawner = {
    PARENT: [exports.genericTank],
    LABEL: "Base",
    SIZE: 25,
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
        FOV: 3, // This is the range of the base drones. The FOV scales with the map.
        PUSHABILITY: 0,
        HETERO: 0
    },
    HITS_OWN_TYPE: "never",
    ALPHA: 0,
    MAX_CHILDREN: 8,
    GUNS: [{
        POSITION: [6, 12, 1.2, 8, 0, 0, 2],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.basedrone]),
            TYPE: [exports.drone, {
                INDEPENDENT: true,
                AI: {
                    shapefriend: true,
                    blind: true
                }
            }],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone
        }
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
    DANGER: 10,
    SIZE: exports.genericTank.SIZE * (7 / 3),
    SHAPE: 16,
    STAT_NAMES: statnames.drone,
    VALUE: 5e5,
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    BODY: bossStats({
        health: 3,
        speed: .75
    }),
    GUNS: (() => {
        let e = [],
            T = [1];
        for (let e = 1; e < 8.5; e += .5) {
            let t = e / 16;
            T.push(t);
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
            e.push(O);
        }
        return e;
    })()
};
exports.turkey = (function() {
    const TurkeyProperties = {
        MAX_CHILDREN: 4,
        SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
        TYPE: exports.drone,
        AUTOFIRE: !0,
        SYNCS_SKILLS: !0,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: !0
    };
    const TurkeyAutoProperties = {
        MAX_CHILDREN: 4,
        SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
        TYPE: [exports.drone, {
            AI: {
                skynet: !0
            },
            INDEPENDENT: !0
        }],
        AUTOFIRE: !0,
        SYNCS_SKILLS: !0,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: !0
    };
    exports.turkeyEye = {
        PARENT: [exports.genericTank],
        FACING_TYPE: "toTarget",
        COLOR: 18,
        TURRETS: [{
            POSITION: [10.75, 1, 0, 0, -15, 1],
            TYPE: [exports.genericTank, {
                COLOR: 19
            }]
        }]
    };
    exports.turkeyHead = {
        PARENT: [exports.genericTank],
        LABEL: "",
        TURRETS: [{
            POSITION: [6.5, 5.97, -5.07, 0, -15, 1],
            TYPE: exports.turkeyEye
        }, {
            POSITION: [6.5, 5.97, 5.07, 0, -15, 1],
            TYPE: exports.turkeyEye
        }],
        GUNS: [{
            POSITION: [19.81, 8.09, -1.76, 5.48, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream]),
                TYPE: exports.bullet
            }
        }]
    };
    return {
        PARENT: [exports.mothership],
        LABEL: "Turkey",
        TURRETS: [{
            POSITION: [10.76, 8.75, 0, 0, 0, 1],
            TYPE: exports.turkeyHead
        }],
        GUNS: [{
            POSITION: [18, 4.69, 1, 0, 0, 135, 2 / 3],
            PROPERTIES: TurkeyAutoProperties
        }, {
            POSITION: [20.96, 6.69, 1, 0, 0, 157.5, 1 / 3],
            PROPERTIES: TurkeyProperties
        }, {
            POSITION: [18, 4.69, 1, 0, 0, 225, 2 / 3],
            PROPERTIES: TurkeyAutoProperties
        }, {
            POSITION: [20.96, 6.69, 1, 0, 0, 202.5, 1 / 3],
            PROPERTIES: TurkeyProperties
        }, {
            POSITION: [24.09, 8.69, 1, 0, 0, 180, 0],
            PROPERTIES: TurkeyAutoProperties
        }, {
            POSITION: [24.09, 8.69, 1, 0, 0, 180, 0],
            PROPERTIES: TurkeyAutoProperties
        }, {
            POSITION: [4, 5, 1, 10, 0, 105, .1],
            PROPERTIES: TurkeyProperties
        }, {
            POSITION: [4, 5, 1, 10, 0, -105, .1],
            PROPERTIES: TurkeyProperties
        }]
    };
})();
exports.mothershipCeption = makeCeption(exports.mothership);
exports.arenaCloserParent = {
    PARENT: [exports.genericTank],
    LABEL: "Arena Closer",
    COLOR: 3,
    SIZE: exports.genericTank.SIZE * 3,
    GO_THROUGH_WALLS: true,
    GO_THROUGH_BASES: true,
    CAN_GO_OUTSIDE_ROOM: true,
    BODY: {
        HEALTH: 1e100,
        DAMAGE: 1e100,
        SHIELD: 1e100,
        REGEN: 1e100,
        SPEED: 1.5 * base.SPEED
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
exports.growerCloser = {
    PARENT: [exports.arenaCloserParent],
    LABEL: "Grower Closer",
    GUNS: [{
        POSITION: [16, 10, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.grower, g.arenaCloser]),
            TYPE: [exports.growBullet, {
                LAYER: 20
            }],
        },
    }, {
        POSITION: [2, 12, 1, 12, 0, 0, 0],
    }]
};
exports.pelleterCloser = {
    PARENT: [exports.arenaCloserParent],
    LABEL: "Pelleter Closer",
    GUNS: [{
        POSITION: [17, 3, 1, 0, 3, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.arenaCloser]),
            TYPE: exports.arenaCloserBullet
        }
    }, {
        POSITION: [17, 3, 1, 0, -3, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.arenaCloser]),
            TYPE: exports.arenaCloserBullet
        }
    }, {
        POSITION: [12, 17.5, 0.6, 0, 0, 0, 0]
    }]
};
exports.propellerCloser = {
    PARENT: [exports.arenaCloserParent],
    LABEL: "Propeller Closer",
    GUNS: [{
        POSITION: [16, 10, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.tri, g.arenaCloser]),
            TYPE: exports.arenaCloserBullet,
            LABEL: "Front"
        }
    }, {
        POSITION: [14, 7, 1, 0, 0, 150, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.arenaCloser]),
            TYPE: exports.arenaCloserBullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [14, 7, 1, 0, 0, 210, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.arenaCloser]),
            TYPE: exports.arenaCloserBullet,
            LABEL: gunCalcNames.thruster
        }
    }]
};
exports.closerCeption = makeCeption(exports.arenaCloser, "Arena Closerception");
exports.closer5 = makeAutoN(exports.arenaCloser, 5, "Arena Closer-5", {
    template: exports.arenaCloser
});
exports.closerCeptionist2 = makeCeptionist(exports.arenaCloser, "Closerceptionist", {
    type: exports.arenaCloser
});
exports.smasherCloser = {
    PARENT: [exports.arenaCloserParent],
    LABEL: "Smasher Closer",
    BODY: {
        SPEED: 3 * base.SPEED
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
exports.sentry = {
    PARENT: [exports.genericTank],
    TYPE: 'crasher',
    LABEL: 'Sentry',
    DANGER: 6,
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
    BODY: crasherStats({
        health: 5,
        damage: 2,
        speed: .2
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
exports.sentryRam = { // Needs balance
    PARENT: [exports.sentry],
    DANGER: 3,
    GUNS: [{
        POSITION: [20, 10, 2, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet]),
            TYPE: exports.bullet,
        }
    }, {
        POSITION: [4.5, 16, -1.5, 7.5, 0, 180, 0]
    },],
};
exports.swarmingSquare = { // Someone fix this pls I can't get it to work
    PARENT: [exports.sentry],
    DANGER: 3,
    SHAPE: 4,
    COLOR: 13,
    MOTION_TYPE: "drift",
    GUNS: [{
        POSITION: [7, 14, 0.6, 7, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.sentrySwarm]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }]
};
exports.greenSentrySwarm = {
    PARENT: [exports.sentry],
    COLOR: 1,
    LABEL: "PS3_33 Lite",
    DANGER: 10,
    BODY: crasherStats({
        health: 6,
        damage: 2.2,
        speed: .15
    }),
    GUNS: [{
        POSITION: [7, 14, 0.6, 7, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.sentrySwarm, [.8, 1, 1, 1, 1.2, 1.2, 1.2, 1.2, 1, .9, 1, 1, 1]]),
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
exports.sentryOmission = makeAuto(exports.sentry, 'Sentry', {
    type: exports.omissionTurret,
    size: 12
});
exports.nestDefender = {
    PARENT: [exports.genericTank],
    TYPE: 'crasher',
    LABEL: 'Nest Defender',
    DANGER: 8,
    SHAPE: 7,
    SIZE: 25,
    SKILL: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
    VALUE: 75000,
    VARIES_IN_SIZE: true,
    CONTROLLERS: ['nearestDifferentMaster', 'mapTargetToGoal'],
    BODY: bossStats({
        health: .045,
        speed: 1.8
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
g.nestDefenderLauncher = [2.1, 1, 1, 1, 2, 2, 1, .4, 1.9, 1.5, 1, 1, 1];
exports.nestDefenderKriosLauncher = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [9, 12, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [16, 13, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.turret, g.nestDefenderLauncher]),
            TYPE: exports.launcherMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }]
};
g.nestDefenderClicker = [2, 1, 2, 1, .8, .8, .8, 1, 1, 1, 1, 2, 1];
exports.nestDefenderTethysClicker = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [24, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.click, g.turret, g.nestDefenderClicker]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [24, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.click, g.turret, g.nestDefenderClicker]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [24, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.click, g.turret, g.nestDefenderClicker]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [24, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.click, g.turret, g.nestDefenderClicker]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5, 8.5, -1.6, 8, 0, 0, 0,],
    }]
};
g.nestDefenderHeatseeker = [2, 1, 1, 1, .6, .6, 2, 1, 1, .6, 1, 5, 1];
exports.nestDefenderMnemosyneHeatseeker = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.turret, g.nestDefenderHeatseeker]),
            TYPE: exports.homingBullet
        }
    }, {
        POSITION: [3, 15, 1.3, 18, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.turret, g.fake, g.norecoil]),
            TYPE: exports.homingBullet
        }
    }]
};
g.nestDefenderKraken = [2, 1, 1, 1, .6, .6, 3, 1.5, 1.25, 1, 1, 1, 1];
exports.nestDefenderIapetusKraken = {
    PARENT: [exports.turretParent],
    SHAPE: 4,
    GUNS: [{
        POSITION: [20, 3, 1, 0, -4, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.turret, g.nestDefenderKraken]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 3, 1, 0, 4, 0, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.turret, g.nestDefenderKraken]),
            TYPE: exports.bullet
        }
    }]
};
g.nestDefenderLightning = [2, 1, 1, 1, .334, .334, 2, 1.2, 1.2, 1, 1, 1, 1];
exports.nestDefenderThemisLightning = {
    PARENT: [exports.turretParent],
    MAX_CHILDREN: 4,
    GUNS: [{
        POSITION: [6, 10, 1.2, 12, 0, 0, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.lightning, g.turret, g.nestDefenderLightning]),
            TYPE: exports.autodrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone
        }
    }, {
        POSITION: [6, 10, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.lightning, g.turret, g.nestDefenderLightning]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone
        }
    }]
};
exports.nestDefenderNyxGrower = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.grower, g.turret]),
            TYPE: exports.growBullet,
        },
    }, {
        POSITION: [2, 10, 1, 14, 0, 0, 0],
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
        for (let i = 0; i < 5; i++) {
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
        for (let i = 0; i < 5; i++) {
            output.push({
                POSITION: [9, 9, 0, 360 / 5 * i + 36, 90, 0],
                TYPE: exports.nestDefenderTethysClicker
            });
        }
        return output;
    })()
};
exports.nestDefenderMnemosyneBody = {
    PARENT: [exports.genericTank],
    LABEL: "Heatseeker",
    INDEPENDENT: true,
    CONTROLLERS: ["reverseSlowSpin"],
    COLOR: 2,
    SHAPE: 5,
    SKILL: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
    TURRETS: (() => {
        let output = [];
        for (let i = 0; i < 5; i++) {
            output.push({
                POSITION: [9, 9, 0, 360 / 5 * i + 36, 90, 0],
                TYPE: exports.nestDefenderMnemosyneHeatseeker
            });
        }
        return output;
    })()
};
exports.nestDefenderIapetusBody = {
    PARENT: [exports.genericTank],
    LABEL: "Kraken",
    INDEPENDENT: true,
    CONTROLLERS: ["reverseSlowSpin"],
    COLOR: 0,
    SHAPE: 5,
    SKILL: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
    TURRETS: (() => {
        let output = [];
        for (let i = 0; i < 5; i++) {
            output.push({
                POSITION: [9, 9, 0, 360 / 5 * i + 36, 90, 0],
                TYPE: exports.nestDefenderIapetusKraken
            });
        }
        return output;
    })()
};
exports.nestDefenderThemisBody = {
    PARENT: [exports.genericTank],
    LABEL: "Lightning",
    INDEPENDENT: true,
    CONTROLLERS: ["reverseSlowSpin"],
    COLOR: 13,
    SHAPE: 5,
    SKILL: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
    TURRETS: (() => {
        let output = [];
        for (let i = 0; i < 5; i++) {
            output.push({
                POSITION: [9, 9, 0, 360 / 5 * i + 36, 90, 0],
                TYPE: exports.nestDefenderThemisLightning
            });
        }
        return output;
    })()
};
exports.nestDefenderNyxBody = {
    PARENT: [exports.genericTank],
    LABEL: "Grower",
    INDEPENDENT: true,
    CONTROLLERS: ["reverseSlowSpin"],
    COLOR: 5,
    SHAPE: 5,
    SKILL: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
    TURRETS: (() => {
        let output = [];
        for (let i = 0; i < 5; i++) {
            output.push({
                POSITION: [9, 9, 0, 360 / 5 * i + 36, 90, 0],
                TYPE: exports.nestDefenderNyxGrower
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
        for (let i = 0; i < 7; i++) {
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
        for (let i = 0; i < 7; i++) {
            output.push({
                POSITION: [6, 9, 0, 360 / 7 * i + 360 / 14, 45, 0],
                TYPE: exports.nestDefenderTrapTurret
            });
        }
        return output;
    })()
};
exports.nestDefenderMnemosyne = {
    PARENT: [exports.nestDefender],
    NAME: "Mnemosyne",
    COLOR: 2,
    TURRETS: (() => {
        let output = [{
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: exports.nestDefenderMnemosyneBody
        }];
        for (let i = 0; i < 7; i++) {
            output.push({
                POSITION: [6, 9, 0, 360 / 7 * i + 360 / 14, 45, 0],
                TYPE: exports.nestDefenderTrapTurret
            });
        }
        return output;
    })()
};
exports.nestDefenderIapetus = {
    PARENT: [exports.nestDefender],
    NAME: "Iapetus",
    COLOR: 0,
    TURRETS: (() => {
        let output = [{
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: exports.nestDefenderIapetusBody
        }];
        for (let i = 0; i < 7; i++) {
            output.push({
                POSITION: [6, 9, 0, 360 / 7 * i + 360 / 14, 45, 0],
                TYPE: exports.nestDefenderTrapTurret
            });
        }
        return output;
    })()
};
exports.nestDefenderThemis = {
    PARENT: [exports.nestDefender],
    NAME: "Themis",
    COLOR: 13,
    TURRETS: (() => {
        let output = [{
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: exports.nestDefenderThemisBody
        }];
        for (let i = 0; i < 7; i++) {
            output.push({
                POSITION: [6, 9, 0, 360 / 7 * i + 360 / 14, 45, 0],
                TYPE: exports.nestDefenderTrapTurret
            });
        }
        return output;
    })()
};
exports.nestDefenderNyx = {
    PARENT: [exports.nestDefender],
    NAME: "Nyx",
    COLOR: 5,
    TURRETS: (() => {
        let output = [{
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: exports.nestDefenderNyxBody
        }];
        for (let i = 0; i < 7; i++) {
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
exports.redistributorTurret = {
    PARENT: [exports.turretParent],
    LABEL: 'Redistributor',
    COLOR: 3,
    GUNS: [{
        POSITION: [7.25, 12.25, 1.25, 10, 0, 0, 0]
    }, {
        POSITION: [18.5, 12, 1, 0, 0, 0, .125],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.redistributor, g.turret]),
            TYPE: exports.redistributorBullet
        }
    }, {
        POSITION: [9, 12, -1.45, 4, 0, 0, 0]
    }]
};
exports.quadriaticGust = {
    PARENT: [exports.turretParent],
    LABEL: 'Gust',
    COLOR: 3,
    GUNS: [{
        POSITION: [5, 9, -1.6, 7, 0, 10, 0]
    }, {
        POSITION: [5, 9, -1.6, 7, 0, -10, 0]
    }]
};
for (let i = 0; i < 10; i++) exports.quadriaticGust.GUNS.push({
    POSITION: [3, 2.5, 1, 13.75, 0, i * 4 - 20, i / 20],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.bandolier, [4, 0, 3, 1, .8, .8, 1, 1.2, 1.2, .9, 1, 2, 1]]),
        TYPE: exports.bullet,
        COLOR: 9
    }
});
for (let i = 0; i < 10; i++) exports.quadriaticGust.GUNS.push({
    POSITION: [3, 2.5, 1, 13.75, 0, 20 - i * 4, (i + 10) / 20],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.bandolier, [4, 0, 3, 1, .8, .8, 1, 1.2, 1.2, .9, 1, 2, 1]]),
        TYPE: exports.bullet,
        COLOR: 9
    }
});
exports.quadriaticGust.GUNS.push({
    POSITION: [5, 9, -1.6, 7, 0, 0, 0]
});
exports.quadriaticTurret = {
    PARENT: [exports.genericTank],
    COLOR: 3,
    SHAPE: 4,
    LABEL: "Square",
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    TURRETS: [{
        POSITION: [8, 0, 0, 0, 60, 1],
        TYPE: exports.quadriaticGust
    }]
};
exports.quadriaticShard = {
    PARENT: [exports.miniboss],
    COLOR: 3,
    SHAPE: -4,
    LABEL: "Shard",
    VALUE: 250000,
    SIZE: 11.5,
    FACING_TYPE: "locksFacing",
    BODY: bossStats({
        speed: 4,
        health: 1 / 4
    }),
    GUNS: [{
        POSITION: [15, 8, 1.5, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.mach]),
            TYPE: exports.bullet,
            COLOR: 3
        }
    }],
    TURRETS: [{
        POSITION: [8, 0, 0, 0, 60, 1],
        TYPE: exports.quadriaticGust
    }]
};
exports.quadriaticCore = {
    PARENT: [exports.miniboss],
    LABEL: "Core",
    COLOR: 3,
    SHAPE: -4,
    VALUE: 450000,
    SIZE: 25,
    BODY: bossStats(),
    GUNS: (function () {
        const output = [];
        for (let i = 0; i < 4; i++) {
            output.push({
                POSITION: [10.75, 6, 2.5, 0, 0, 360 / 4 * i, 1],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.colony]),
                    TYPE: exports[i % 2 === 0 ? "drone" : "autodrone"],
                    AUTOFIRE: true,
                    MAX_CHILDREN: 6
                }
            });
        }
        return output;
    })(),
    TURRETS: (function () {
        const output = [];
        for (let i = 0; i < 4; i++) {
            output.push({
                POSITION: [3, 6, 6, 360 / 4 * i, 120, 1],
                TYPE: exports.autoTurret
            });
        }
        output.push({
            POSITION: [8, 0, 0, 0, 360, 1],
            TYPE: exports.redistributorTurret
        });
        return output;
    })(),
};
exports.quadriatic = {
    PARENT: [exports.miniboss],
    LABEL: "Quadriatic",
    DANGER: 10,
    COLOR: 3,
    SIZE: 25,
    VALUE: 600000,
    BODY: bossStats(),
    SHAPE: -4,
    TURRETS: (function () {
        const output = [];
        for (let i = 0; i < 4; i++) {
            output.push({
                POSITION: [9, 10, 0, 360 / 4 * i, 0, 0],
                TYPE: exports.quadriaticTurret
            }, {
                POSITION: [3, 6, 6, 360 / 4 * i, 120, 1],
                TYPE: exports.autoTurret
            });
        }
        output.push({
            POSITION: [8, 0, 0, 0, 360, 1],
            TYPE: exports.redistributorTurret
        });
        return output;
    })(),
    BROADCAST_MESSAGE: "The Quadriatic may have fallen, but the battle is not yet over...",
    FRAG_SPAWNS: ["quadriaticShard", "quadriaticShard", "quadriaticShard", "quadriaticShard", "quadriaticCore"]
};
exports.sterilizerBoss = makeAuto({
    PARENT: [exports.miniboss],
    LABEL: "Sterilizer",
    DANGER: 7,
    COLOR: 20,
    SIZE: 30,
    STAT_NAMES: statnames.necro,
    BODY: bossStats(),
    SHAPE: 4,
    MAX_CHILDREN: 24,
    VALUE: 350000,
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [8.3, 12, 1.2, 7, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, g.summoner]),
            TYPE: exports.maleficitorDrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro
        },
    }, {
        POSITION: [4.2, 13.2, -1.2, 7, 0, 0, 0],
    }, {
        POSITION: [4.2, 2.5, -1.5, 7, 5.6, 0, 0],
        PROPERTIES: {
            COLOR: 17,
        },
    }, {
        POSITION: [4.2, 2.5, -1.5, 7, -5.6, 0, 0],
        PROPERTIES: {
            COLOR: 17,
        },
    }, {
        POSITION: [4.2, 2.5, -1.5, 7, 0, 0, 0],
        PROPERTIES: {
            COLOR: 17,
        },
    }, {
        POSITION: [2.7, 4.5, -1.5, 7, 0, 0, 0],
    }, {
        POSITION: [8.3, 12, 1.2, 7, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, g.summoner]),
            TYPE: exports.maleficitorDrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro
        },
    }, {
        POSITION: [4.2, 13.2, -1.2, 7, 0, 90, 0],
    }, {
        POSITION: [4.2, 2.5, -1.5, 7, 5.6, 90, 0],
        PROPERTIES: {
            COLOR: 17,
        },
    }, {
        POSITION: [4.2, 2.5, -1.5, 7, -5.6, 90, 0],
        PROPERTIES: {
            COLOR: 17,
        },
    }, {
        POSITION: [4.2, 2.5, -1.5, 7, 0, 90, 0],
        PROPERTIES: {
            COLOR: 17,
        },
    }, {
        POSITION: [2.7, 4.5, -1.5, 7, 0, 90, 0],
    }, {
        POSITION: [8.3, 12, 1.2, 7, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, g.summoner]),
            TYPE: exports.maleficitorDrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro
        },
    }, {
        POSITION: [4.2, 13.2, -1.2, 7, 0, 180, 0],
    }, {
        POSITION: [4.2, 2.5, -1.5, 7, 5.6, 180, 0],
        PROPERTIES: {
            COLOR: 17,
        },
    }, {
        POSITION: [4.2, 2.5, -1.5, 7, -5.6, 180, 0],
        PROPERTIES: {
            COLOR: 17,
        },
    }, {
        POSITION: [4.2, 2.5, -1.5, 7, 0, 180, 0],
        PROPERTIES: {
            COLOR: 17,
        },
    }, {
        POSITION: [2.7, 4.5, -1.5, 7, 0, 180, 0],
    }, {
        POSITION: [8.3, 12, 1.2, 7, 0, 270, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, g.summoner]),
            TYPE: exports.maleficitorDrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro
        },
    }, {
        POSITION: [4.2, 13.2, -1.2, 7, 0, 270, 0],
    }, {
        POSITION: [4.2, 2.5, -1.5, 7, 5.6, 270, 0],
        PROPERTIES: {
            COLOR: 17,
        },
    }, {
        POSITION: [4.2, 2.5, -1.5, 7, -5.6, 270, 0],
        PROPERTIES: {
            COLOR: 17,
        },
    }, {
        POSITION: [4.2, 2.5, -1.5, 7, 0, 270, 0],
        PROPERTIES: {
            COLOR: 17,
        },
    }, {
        POSITION: [2.7, 4.5, -1.5, 7, 0, 270, 0],
    },],
    TURRETS: [{
        POSITION: [16, 0, 0, 0, 0, 1],
        TYPE: exports.malefictorProp
    }]
}, "Sterilizer", {
    type: exports.split,
    size: 10
});
exports.serpentAutoTurret = {
    PARENT: [exports.turretParent],
    INDEPENDENT: true,
    AI: {
        SKYNET: true
    },
    GUNS: [{
        POSITION: [18, 10, 1, 0, 0, 0, 1],
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
exports.serpentFlailPart = makeFlail("SerpentFlail", 5)
exports.serpentFlail = {
    PARENT: [exports.serpentTrail],
    FACING_TYPE: "looseToTarget",
    CONTROLLERS: ["nearestDifferentMaster", "mapAltToFire"],
    TURRETS: [{
        POSITION: [21.5, 0, 0, 0, 360, 0],
        TYPE: exports.serpentBody
    }, {
        POSITION: [24, 0, 0, 0, 360, 0],
        TYPE: exports.serpentFlailPart
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.aifix, g.aifix2]),
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.aifix, g.aifix2]),
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

exports.jormunPupil = {
    PARENT: [exports.genericEntity],
    LABEL: 'Pupil',
    COLOR: 17
}
exports.jormunEye = {
    PARENT: [exports.genericEntity],
    LABEL: 'Eye',
    FACING_TYPE: "smoothWithMotion",
    COLOR: 6,
    TURRETS: [{
        POSITION: [7, 0, 3, 270, 0, 1],
        TYPE: exports.jormunPupil
    }],
}

exports.jormun = {
    PARENT: [exports.miniboss],
    LABEL: 'Jörmungandr',
    TYPE: 'miniboss',
    COLOR: 17,
    SIZE: 20,
    BODY: {
        ACCELERATION: base.ACCEL * 0.8,
        SPEED: base.SPEED * 3.7,
        HEALTH: base.HEALTH * 1.5,
        DAMAGE: base.DAMAGE * 6.5,
        FOV: base.FOV * 2,
        DENSITY: base.DENSITY * 2,
        PUSHABILITY: 0,
    },
    CONTROLLERS: ['nearestDifferentMaster', 'mapTargetToGoal', 'mapAltToFire'],
    FACING_TYPE: 'looseToTarget',
    DEFEAT_MESSAGE: true,
    TURRETS: [{
        POSITION: [21.5, 0, 0, 0, 360, 0],
        TYPE: exports.smasherBody
    }, {
        POSITION: [16, 0, 0, 0, 360, 1],
        TYPE: exports.jormunEye
    }],
    GUNS: [{
        POSITION: [0, 0, -1.4, 0, 0, 0, 1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.aifix, g.aifix2]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5, 14, -1.4, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.jormun]),
            TYPE: [exports.serpentTrail, exports.serpentTrail, exports.serpentTrail, exports.serpentFlail],
            AUTOFIRE: true,
            RANDOM_TYPE: true,
        }
    }]
};

g.guardianDrone = [.75, 3, 1, 1, 1.25, 1.25, 2, 1.2, 1.2, 1, 1, 1, 1];
exports.guardian = {
    PARENT: [exports.miniboss],
    LABEL: 'Guardian',
    DANGER: 8,
    FACING_TYPE: "locksFacing",
    SHAPE: 3,
    COLOR: 5,
    SIZE: 20,
    MAX_CHILDREN: 24,
    BODY: bossStats({
        health: .9,
        speed: 1.25
    }),
    GUNS: [{
        POSITION: [6, 12, 1.25, 6, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.guardianDrone]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm,
            AUTOFIRE: true
        }
    }]
};
exports.greenGuardian = {
    PARENT: [exports.miniboss],
    LABEL: 'Green Guardian',
    DANGER: 8,
    FACING_TYPE: "locksFacing",
    SHAPE: 3,
    COLOR: 1,
    SIZE: 20,
    MAX_CHILDREN: 24,
    BODY: bossStats({
        health: 1.2,
        speed: 1.25
    }),
    GUNS: [{
        POSITION: [6, 12, 1.25, 6, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.guardianDrone]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm,
            AUTOFIRE: true
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
    LABEL: "Elite Sprayer",
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
exports.sentryFragBoss = {
    PARENT: [exports.elite],
    LABEL: "Mega Sentry",
    TURRETS: [{
        POSITION: [9, 9, 0, 60, 0, 0],
        TYPE: exports.sentryTrap
    }, {
        POSITION: [9, 9, 0, 180, 0, 0],
        TYPE: exports.sentryGun
    }, {
        POSITION: [9, 9, 0, 300, 0, 0],
        TYPE: exports.sentryOmission
    }, {
        POSITION: [11, 0, 0, 0, 360, 1],
        TYPE: [exports.stovepipe, {
            INDEPENDENT: true,
            CONTROLLERS: ["nearestDifferentMaster"],
            COLOR: 5,
            FACING_TYPE: "autospin"
        }]
    }],
    BROADCAST_MESSAGE: "The Mega Sentry may have fallen, but the battle is not yet over...",
    FRAG_SPAWNS: ["sentrySwarm", "sentryGun", "sentryTrap", "sentryOmission", "sentrySwarm", "sentryGun", "sentryTrap", "sentryOmission", "sentrySwarm", "sentryGun", "sentryTrap", "sentryOmission"]
};
g.atrium = [.5, 0, 1, .5, .7, .7, 1, 1.2, 1.2, 1, 1, 3, 1];
exports.atrium = makeAuto({
    PARENT: [exports.elite],
    LABEL: 'Atrium',
    COLOR: 18,
    SHAPE: 3,
    FACING_TYPE: 'autospin',
    GUNS: [{
        POSITION: [5, 16, 1.3, 6, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.meta, g.atrium]),
            TYPE: exports.autodrone,
            MAX_CHILDREN: 4,
            LABEL: 'Devastator'
        },
    }, {
        POSITION: [5, 16, 1.3, 6, 0, 60, .334],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.meta, g.atrium]),
            TYPE: exports.autodrone,
            MAX_CHILDREN: 4,
            LABEL: 'Devastator'
        }
    }, {
        POSITION: [5, 16, 1.3, 6, 0, -60, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.meta, g.atrium]),
            TYPE: exports.autodrone,
            MAX_CHILDREN: 4,
            LABEL: 'Devastator'
        }
    }]
}, "Atrium", {
    type: exports.builder
});
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
g.legendaryCrasherThruster = [3 / 4, 2, 2, 1, 2, 2, 2, .8, 1, .6, 1, 2, 1];
g.legendaryCrasherGunThing = [2, 0, .1, 1, .8, 1, .4, 1.2, 1, .6, 2, 2, 1];
exports.hunterAuto = {
    LABEL: '',
    BODY: {
        FOV: 2.5
    },
    CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'],
    COLOR: 5,
    GUNS: [{
        POSITION: [18, 10, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.hunter2, g.turret]),
            TYPE: [exports.bullet, {
                LAYER: 6
            }]
        }
    }, {
        POSITION: [15, 14, 1, 0, 0, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.turret]),
            TYPE: [exports.bullet, {
                LAYER: 6
            }]
        }
    }]
};
exports.twinTrapAuto = {
    LABEL: '',
    BODY: {
        FOV: 2
    },
    CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'],
    COLOR: 16,
    GUNS: [{
        POSITION: [18, 7, 1, 0, 6, 0, 0]
    }, {
        POSITION: [2, 7, 1.1, 18, 6, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.turret, [1.5, 1, 1, 1.15, 1.2, .6, 2, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.block
        }
    }, {
        POSITION: [18, 7, 1, 0, -6, 0, .5]
    }, {
        POSITION: [2, 7, 1.1, 18, -6, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.turret, [1.5, 1, 1, 1.15, 1.2, .6, 2, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.block
        }
    }]
};
exports.predatorAuto = {
    LABEL: '',
    BODY: {
        FOV: 2.25
    },
    CONTROLLERS: ['nearestDifferentMaster'],
    COLOR: 16,
    GUNS: [{
        POSITION: [24, 6, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.hunter2, g.hunter2, g.hunter2, g.hunter2, g.predator, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [22, 9, 1, 0, 0, 0, .15],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.hunter2, g.hunter2, g.hunter2, g.predator, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 12, 1, 0, 0, 0, .3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.hunter2, g.hunter2, g.predator, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 15, 1, 0, 0, 0, .45],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.hunter2, g.predator, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 18, 1, 0, 0, 0, .6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.predator, g.turret]),
            TYPE: exports.bullet
        }
    }]
};
exports.autoRangerGun2 = {
    LABEL: 'Ranger',
    BODY: {
        FOV: 2.25
    },
    CONTROLLERS: ['nearestDifferentMaster'],
    COLOR: 16,
    GUNS: [{
        POSITION: [28, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.assassin, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5, 8.5, -1.6, 8, 0, 0, 0]
    }]
};
exports.legendaryCrasher = {
    PARENT: [exports.elite],
    LABEL: 'Legendary Crasher',
    DANGER: 12,
    SIZE: 50,
    VALUE: 1000000,
    FACING_TYPE: "smoothToTarget",
    BODY: bossStats({ health: 2 }),
    GUNS: [{
        POSITION: [4.35, 5, 1.5, 8, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.legendaryCrasherThruster]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [2.75, 3.5, 1.5, 8, -8, 180, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.legendaryCrasherThruster]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [2.75, 3.5, 1.5, 8, 8, 180, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.legendaryCrasherThruster]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [4.5, .6875, 1, 4, 2.05, 60, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.legendaryCrasherGunThing]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [4.5, .6875, 1, 4, -2.45, 60, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.legendaryCrasherGunThing]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5.25, .6875, 1, 4, 1.3, 60, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.legendaryCrasherGunThing]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5.25, .6875, 1, 4, -1.7, 60, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.legendaryCrasherGunThing]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6, .6875, 1, 4, .55, 60, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.legendaryCrasherGunThing]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6, .6875, 1, 4, -0.95, 60, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.legendaryCrasherGunThing]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6.75, .75, 1, 4, -0.2, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.legendaryCrasherGunThing]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [4.5, .75, 1, 4, -2.05, -60, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.legendaryCrasherGunThing]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [4.5, .75, 1, 4, 2.45, -60, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.legendaryCrasherGunThing]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5.25, .75, 1, 4, -1.3, -60, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.legendaryCrasherGunThing]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5.25, .75, 1, 4, 1.7, -60, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.legendaryCrasherGunThing]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6, .75, 1, 4, -0.55, -60, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.legendaryCrasherGunThing]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6, .75, 1, 4, .95, -60, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.legendaryCrasherGunThing]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6.75, .75, 1, 4, .2, -60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.legendaryCrasherGunThing]),
            TYPE: exports.bullet
        }
    }],
    TURRETS: [{
        POSITION: [4.5, 9.5, 3.25, 0, 190, 0],
        TYPE: exports.hunterAuto
    }, {
        POSITION: [4.5, 9.5, -3.25, 0, 190, 0],
        TYPE: exports.hunterAuto
    }, {
        POSITION: [4.5, -2.75, 10.25, 0, 190, 0],
        TYPE: exports.hunterAuto
    }, {
        POSITION: [4.5, -2.75, -10.25, 0, 190, 0],
        TYPE: exports.hunterAuto
    }, {
        POSITION: [2.85, 12.6, 0, 0, 120, 1],
        TYPE: exports.twinTrapAuto
    }, {
        POSITION: [2.85, 12.6, 0, 120, 120, 1],
        TYPE: exports.twinTrapAuto
    }, {
        POSITION: [2.85, 12.6, 0, 240, 120, 1],
        TYPE: exports.twinTrapAuto
    }, {
        POSITION: [3.5, -4, 6.1, 0, 360, 1],
        TYPE: exports.autoRangerGun2
    }, {
        POSITION: [3.5, -4, -6.1, 0, 360, 1],
        TYPE: exports.autoRangerGun2
    }, {
        POSITION: [8, 0, 0, 0, 360, 1],
        TYPE: exports.predatorAuto
    }]
};
exports.mythicalCrasherHexaTrapper = createTurret(makeFlank(exports.trapper, 6, "Hexa-Trapper"), [g.doubleReload, g.flank, g.flank]);
exports.mythicalCrasherSniper = createTurret(exports.sniper, [g.doubleReload, g.sniper]);
exports.mythicalCrasherPounder = createTurret(exports.pounder, [g.doubleReload, g.sniper]);
exports.mythicalCrasherGunner = {
    PARENT: [exports.turretParent],
    LABEL: 'Gunner',
    GUNS: [{
        POSITION: [11, 2.5, 1, 0, 8.7, 0, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.pelleter, g.turret, g.sniper, g.doubleReload]),
            TYPE: exports.bulletLayer6
        }
    }, {
        POSITION: [11, 2.5, 1, 0, -8.7, 0, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.pelleter, g.turret, g.sniper, g.doubleReload]),
            TYPE: exports.bulletLayer6
        }
    }, {
        POSITION: [12.5, 2.5, 1, 0, 7.25, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.pelleter, g.turret, g.sniper, g.doubleReload]),
            TYPE: exports.bulletLayer6
        }
    }, {
        POSITION: [12.5, 2.5, 1, 0, -7.25, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.pelleter, g.turret, g.sniper, g.doubleReload]),
            TYPE: exports.bulletLayer6
        }
    }, {
        POSITION: [14, 2.5, 1, 0, 5.5, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.pelleter, g.turret, g.sniper, g.doubleReload]),
            TYPE: exports.bulletLayer6
        }
    }, {
        POSITION: [14, 2.5, 1, 0, -5.5, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.pelleter, g.turret, g.sniper, g.doubleReload]),
            TYPE: exports.bulletLayer6
        }
    }, {
        POSITION: [16.5, 2.4, 1, 0, 3.2, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.pelleter, g.turret, g.sniper, g.doubleReload]),
            TYPE: exports.bulletLayer6
        }
    }, {
        POSITION: [16.5, 2.4, 1, 0, -3.2, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.pelleter, g.turret, g.sniper, g.doubleReload]),
            TYPE: exports.bulletLayer6
        }
    }]
};
exports.mythicalCrasher = {
    PARENT: [exports.elite],
    LABEL: 'Mythical Crasher',
    DANGER: 9,
    SIZE: 66,
    VALUE: 2500000,
    BODY: bossStats({ health: 3 }),
    GUNS: [{
        POSITION: [3.5, 2.8, 1.4, 8, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.legendaryCrasherThruster]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [3.5, 2.8, 1.4, 8, 5.5, 180, 1 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.legendaryCrasherThruster]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [3.5, 2.8, 1.4, 8, 11, 180, 2 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.legendaryCrasherThruster]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [3.5, 2.8, 1.4, 8, -5.5, 180, 1 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.legendaryCrasherThruster]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [3.5, 2.8, 1.4, 8, -11, 180, 2 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.legendaryCrasherThruster]),
            TYPE: exports.bullet
        }
    }],
    TURRETS: [{
        POSITION: [1.9, -5.7, 2.1, 0, 360, 1],
        TYPE: [exports.mythicalCrasherHexaTrapper, {
            CONTROLLERS: ['slowSpin']
        }]
    }, {
        POSITION: [1.9, -5.7, -2.1, 0, 360, 1],
        TYPE: [exports.mythicalCrasherHexaTrapper, {
            CONTROLLERS: ['reverseSlowSpin']
        }]
    }, {
        POSITION: [2, 13.5, -1.35, 0, 220, 0],
        TYPE: exports.mythicalCrasherPounder
    }, {
        POSITION: [2, 10.7, -2.95, 0, 220, 0],
        TYPE: exports.mythicalCrasherPounder
    }, {
        POSITION: [2, 7.9, -4.575, 0, 220, 0],
        TYPE: exports.mythicalCrasherPounder
    }, {
        POSITION: [2, 5.1, -6.2, 0, 220, 0],
        TYPE: exports.mythicalCrasherPounder
    }, {
        POSITION: [2, 2.3, -7.8, 0, 220, 0],
        TYPE: exports.mythicalCrasherPounder
    }, {
        POSITION: [2, -0.5, -9.4, 0, 220, 0],
        TYPE: exports.mythicalCrasherPounder
    }, {
        POSITION: [2, -3.3, -11, 0, 220, 0],
        TYPE: exports.mythicalCrasherPounder
    }, {
        POSITION: [2, -6.1, -12.6, 0, 220, 0],
        TYPE: exports.mythicalCrasherPounder
    }, {
        POSITION: [2, 13.5, 1.35, 0, 220, 0],
        TYPE: exports.mythicalCrasherPounder
    }, {
        POSITION: [2, 10.7, 2.95, 0, 220, 0],
        TYPE: exports.mythicalCrasherPounder
    }, {
        POSITION: [2, 7.9, 4.575, 0, 220, 0],
        TYPE: exports.mythicalCrasherPounder
    }, {
        POSITION: [2, 5.1, 6.2, 0, 220, 0],
        TYPE: exports.mythicalCrasherPounder
    }, {
        POSITION: [2, 2.3, 7.8, 0, 220, 0],
        TYPE: exports.mythicalCrasherPounder
    }, {
        POSITION: [2, -0.5, 9.4, 0, 220, 0],
        TYPE: exports.mythicalCrasherPounder
    }, {
        POSITION: [2, -3.3, 11, 0, 220, 0],
        TYPE: exports.mythicalCrasherPounder
    }, {
        POSITION: [2, -6.1, 12.6, 0, 220, 0],
        TYPE: exports.mythicalCrasherPounder
    }, {
        POSITION: [2, 12.75, 0, 0, 361, 1],
        TYPE: exports.mythicalCrasherSniper
    }, {
        POSITION: [2, 10, -1.6, 0, 361, 1],
        TYPE: exports.mythicalCrasherSniper
    }, {
        POSITION: [2, 7.25, -3.2, 0, 361, 1],
        TYPE: exports.mythicalCrasherSniper
    }, {
        POSITION: [2, 4.5, -4.8, 0, 361, 1],
        TYPE: exports.mythicalCrasherSniper
    }, {
        POSITION: [2, 1.75, -6.4, 0, 361, 1],
        TYPE: exports.mythicalCrasherSniper
    }, {
        POSITION: [2, -1, -8, 0, 361, 1],
        TYPE: exports.mythicalCrasherSniper
    }, {
        POSITION: [2, -3.75, -9.6, 0, 361, 1],
        TYPE: exports.mythicalCrasherSniper
    }, {
        POSITION: [2, -6.4, -11.1, 0, 361, 1],
        TYPE: exports.mythicalCrasherSniper
    }, {
        POSITION: [2, 10, 1.6, 0, 361, 1],
        TYPE: exports.mythicalCrasherSniper
    }, {
        POSITION: [2, 7.25, 3.2, 0, 361, 1],
        TYPE: exports.mythicalCrasherSniper
    }, {
        POSITION: [2, 4.5, 4.8, 0, 361, 1],
        TYPE: exports.mythicalCrasherSniper
    }, {
        POSITION: [2, 1.75, 6.4, 0, 361, 1],
        TYPE: exports.mythicalCrasherSniper
    }, {
        POSITION: [2, -1, 8, 0, 361, 1],
        TYPE: exports.mythicalCrasherSniper
    }, {
        POSITION: [2, -3.75, 9.6, 0, 361, 1],
        TYPE: exports.mythicalCrasherSniper
    }, {
        POSITION: [2, -6.4, 11.1, 0, 361, 1],
        TYPE: exports.mythicalCrasherSniper
    }, {
        POSITION: [2, 2, 4.9, 270, 361, 1],
        TYPE: exports.mythicalCrasherGunner
    }, {
        POSITION: [2, 2, 2.5, 270, 361, 1],
        TYPE: exports.mythicalCrasherGunner
    }, {
        POSITION: [2, 2, .1, 270, 361, 1],
        TYPE: exports.mythicalCrasherGunner
    }, {
        POSITION: [2, 2, -2.3, 270, 361, 1],
        TYPE: exports.mythicalCrasherGunner
    }, {
        POSITION: [2, 2, -4.9, 90, 361, 1],
        TYPE: exports.mythicalCrasherGunner
    }, {
        POSITION: [2, 2, -2.5, 90, 361, 1],
        TYPE: exports.mythicalCrasherGunner
    }, {
        POSITION: [2, 2, -0.1, 90, 361, 1],
        TYPE: exports.mythicalCrasherGunner
    }, {
        POSITION: [2, 2, 2.3, 90, 361, 1],
        TYPE: exports.mythicalCrasherGunner
    }]
};
exports.sacredTriangleProp = {
    SHAPE: 3,
    COLOR: 5
};
exports.sentryMinion1 = {
    PARENT: [exports.minion],
    LABEL: 'Sentry Minion',
    SHAPE: 3,
    DRAW_HEALTH: true,
    GUNS: [{
        POSITION: [7, 14, .6, 7, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.pound]),
            TYPE: [exports.swarm, {
                CONTROLLERS: ['canRepel']
            }],
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }]
};
exports.longSniperAutoGun2 = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [36, 10.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.turret]),
            TYPE: exports.bullet
        }
    }]
};
exports.sentryMinion2 = {
    PARENT: [exports.minion],
    LABEL: 'Sentry Minion',
    SHAPE: 3,
    DRAW_HEALTH: true,
    GUNS: [{
        POSITION: [6.5, 5.25, 1.3, 8, -8, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, [1.5, 0, 1, 1, 1, 1.25, 1, .8, .8, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6.5, 5.25, 1.3, 8, 8, -60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, [1.5, 0, 1, 1, 1, 1.25, 1, .8, .8, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [8.5, 12.5, .7, 5, 5, 60, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.pound, g.doubleReload]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [8.5, 12.5, .7, 5, -5, -60, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.pound, g.doubleReload]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }],
    TURRETS: [{
        POSITION: [6.6, 8.75, 8.8, 180, 200, 0],
        TYPE: exports.longSniperAutoGun2
    }, {
        POSITION: [6.6, 8.75, -8.8, 180, 200, 0],
        TYPE: exports.longSniperAutoGun2
    }, {
        POSITION: [13.3, 5.5, 0, 180, 0, 1],
        TYPE: exports.sacredTriangleProp
    }]
};
exports.weirdBulletThing = {
    PARENT: [exports.bullet],
    LABEL: 'Swarming Bullet',
    FACING_TYPE: 'turnWithSpeed',
    CONTROLLERS: ['targetSelf'],
    GUNS: [{
        POSITION: [21, 14, -1.25, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.doubleReload]),
            AUTOFIRE: true,
            TYPE: [exports.swarm, {
                LABEL: 'Crasher',
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }, {
        POSITION: [21, 14, -1.25, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.doubleReload]),
            AUTOFIRE: true,
            TYPE: [exports.swarm, {
                LABEL: 'Crasher',
                PERSISTS_AFTER_DEATH: true
            }]
        }
    }]
};
exports.triSwarmMinion = {
    PARENT: [exports.minion],
    DRAW_HEALTH: true,
    FACING_TYPE: 'autospin',
    GUNS: [{
        POSITION: [14, 14, -1.2, 5, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pound, [2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1]]),
            TYPE: exports.weirdBulletThing,
            SYNCS_SKILLS: true
        }
    }, {
        POSITION: [15, 12, 1, 5, 0, 0, 0]
    }, {
        POSITION: [14, 14, -1.2, 5, 0, 120, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pound, [2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1]]),
            TYPE: exports.weirdBulletThing,
            SYNCS_SKILLS: true
        }
    }, {
        POSITION: [15, 12, 1, 5, 0, 120, 0]
    }, {
        POSITION: [14, 14, -1.2, 5, 0, 240, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pound, [2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1]]),
            TYPE: exports.weirdBulletThing,
            SYNCS_SKILLS: true
        }
    }, {
        POSITION: [15, 12, 1, 5, 0, 240, 0]
    }]
};
exports.sentryMinionSpawner = {
    LABEL: '',
    SHAPE: 3,
    COLOR: 5,
    GUNS: [{
        POSITION: [5, 23, .85, 8, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.spawner, g.factory, [2, 1, 1, .6, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.sentryMinion1,
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            MAX_CHILDREN: 2
        }
    }]
};
exports.hugeSwarmAutoGun = {
    PARENT: [exports.turretParent],
    COLOR: 5,
    GUNS: [{
        POSITION: [14.5, 10, .75, 0, 0, 45, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.pound, g.doubleReload]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [14.5, 10, .75, 0, 0, -45, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.pound, g.doubleReload]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [14.5, 10, .75, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.pound, g.doubleReload]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }]
};
exports.sacredCrasher = {
    PARENT: [exports.elite],
    LABEL: 'Sacred Crasher',
    DANGER: 12,
    SIZE: 45,
    VALUE: 1000000,
    BODY: bossStats({ health: 2 }),
    FACING_TYPE: "smoothToTarget",
    GUNS: [{
        POSITION: [5, 8, 1, 11.5, 0, 180, 0]
    }, {
        POSITION: [2, 11.5, 1.01, 16.5, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.spawner, g.factory, [2, 0, 1, 1, 2, .8, 1, .5, .5, 1, 1.5, 1, 1]]),
            TYPE: exports.sentryMinion2,
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            MAX_CHILDREN: 1
        }
    }, {
        POSITION: [6.5, 9, -1.4, 8, 0, 180, 0]
    }, {
        POSITION: [2, 3, 1.25, 8, 8, -60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.spawner, g.factory, [2, 0, 1, 2.25, 2, .8, 1, .5, .5, 1, 1.5, 1, 1]]),
            TYPE: exports.triSwarmMinion,
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            MAX_CHILDREN: 1
        }
    }, {
        POSITION: [2, 3, 1.25, 8, -8, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.spawner, g.factory, [2, 0, 1, 2.25, 2, .8, 1, .5, .5, 1, 1.5, 1, 1]]),
            TYPE: exports.triSwarmMinion,
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            MAX_CHILDREN: 1
        }
    }, {
        POSITION: [6.7, 5.1, 1.25, 8, -8, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.pound]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6.7, 5.1, 1.25, 8, 8, -60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.pound]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [2.7, 3.1, .75, 7, -10, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.doubleReload]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [2.7, 3.1, .75, 7, 10, -60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.doubleReload]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [2.7, 3.1, .75, 7, -6, 60, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.doubleReload]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [2.7, 3.1, .75, 7, 6, -60, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.doubleReload]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }],
    TURRETS: [{
        POSITION: [7.75, 20.25, 0, 120, 220, 0],
        TYPE: exports.hugeSwarmAutoGun
    }, {
        POSITION: [7.75, 20.25, 0, -120, 220, 0],
        TYPE: exports.hugeSwarmAutoGun
    }, {
        POSITION: [7.75, 6, 16.3, 180, 0, 0],
        TYPE: exports.sentryMinionSpawner
    }, {
        POSITION: [7.75, 6, -16.3, 180, 0, 0],
        TYPE: exports.sentryMinionSpawner
    }, {
        POSITION: [3.5, -10.75, 13.65, 0, 0, 0],
        TYPE: exports.sacredTriangleProp
    }, {
        POSITION: [3.5, 9.3, -11, 180, 0, 0],
        TYPE: exports.sacredTriangleProp
    }, {
        POSITION: [3.5, 13.75, -13.65, 180, 0, 0],
        TYPE: exports.sacredTriangleProp
    }, {
        POSITION: [3.5, -10.75, -13.65, 0, 0, 0],
        TYPE: exports.sacredTriangleProp
    }, {
        POSITION: [3.5, 9.3, 11, 180, 0, 0],
        TYPE: exports.sacredTriangleProp
    }, {
        POSITION: [3.5, 13.75, 13.65, 180, 0, 0],
        TYPE: exports.sacredTriangleProp
    }]
};
g.LQM_machineUnitTurret = [4, 0, 2, .8, 1.2, 1, 1.4, 1, 1, 1, 1, 2, 1];
exports.LQM_machineUnitTurret = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [12, 10, 1.4, 18, 0, 0, 2 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.LQM_machineUnitTurret, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 10, 1.4, 13, 0, 0, 1 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.LQM_machineUnitTurret, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 10, 1.4, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.LQM_machineUnitTurret, g.turret]),
            TYPE: exports.bullet
        }
    }]
};
exports.LQM_machineUnitBuilder = createTurret(exports.builder);
exports.LQM_machineUnit = makeAuto({
    PARENT: [exports.genericTank],
    SHAPE: 4,
    COLOR: 5,
    TURRETS: [{
        POSITION: [16, 9, 0, 0, 160, 0],
        TYPE: [exports.LQM_machineUnitBuilder, {
            COLOR: 5
        }]
    }, {
        POSITION: [4, 9, -6.5, 90, 160, 0],
        TYPE: exports.autoTurret
    }, {
        POSITION: [4, 9, -2.25, 90, 160, 0],
        TYPE: exports.autoTurret
    }, {
        POSITION: [4, 9, 6.5, 270, 160, 0],
        TYPE: exports.autoTurret
    }, {
        POSITION: [4, 9, 2.25, 270, 160, 0],
        TYPE: exports.autoTurret
    }]
}, '', {
    type: exports.LQM_machineUnitTurret,
    color: 5
});
g.LQM_dualMachTurret = [4, 0, 2, 1.1, .6, .6, 1.2, 1, 1, .8, 1, 2, 1];
exports.LQM_dualMachTurret = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [14, 6.4, 1.38, 10, 5.7, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.mach, g.turret, g.LQM_dualMachTurret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [14, 6.4, 1.38, 10, -5.7, 0, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.mach, g.turret, g.LQM_dualMachTurret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [14, 6.4, 1.38, 5, 5.7, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.mach, g.turret, g.LQM_dualMachTurret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [14, 6.4, 1.38, 5, -5.7, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.mach, g.turret, g.LQM_dualMachTurret]),
            TYPE: exports.bullet
        }
    }]
};
exports.LQM_machinistTurret = {
    PARENT: [exports.turretParent],
    COLOR: 5,
    GUNS: [{
        POSITION: [13, 8.5, 1.5, 12, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.sniper, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [11.5, 10.5, -1.7, 4.5, 0, 0, 0]
    }]
};
exports.LQM_twinMachTurret = {
    PARENT: [exports.turretParent],
    COLOR: 5,
    GUNS: [{
        POSITION: [14, 6.4, 1.38, 5, 5.7, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.mach, g.turret, g.doubleReload, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [14, 6.4, 1.38, 5, -5.7, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.mach, g.turret, g.doubleReload, g.doubleReload]),
            TYPE: exports.bullet
        }
    }]
};

const LQM_Turrets = a => ([{
    POSITION: [3.5, 11.25, 0, a + 60, 360, 1],
    TYPE: exports.LQM_twinMachTurret
}, {
    POSITION: [10, 12.5, 0, a, 0, 1],
    TYPE: exports.LQM_machineUnit
}, {
    POSITION: [3.5, 8, -11, a, 135, 0],
    TYPE: exports.LQM_machinistTurret
}, {
    POSITION: [3.5, 8, 11, a, 135, 0],
    TYPE: exports.LQM_machinistTurret
}, {
    POSITION: [3.5, 8, -7, a, 135, 0],
    TYPE: exports.LQM_twinMachTurret
}, {
    POSITION: [3.5, 8, 7, a, 135, 0],
    TYPE: exports.LQM_twinMachTurret
}]);

exports.legendaryQuadralMachine = makeAuto({
    PARENT: [exports.elite],
    SIZE: 62,
    DANGER: 30,
    VALUE: 5000000,
    BODY: bossStats({
        health: 3,
        speed: .5,
        damage: 2
    }),
    FACING_TYPE: 'lucrehulkSpin',
    TURRETS: []
}, 'Legendary Quadral Machine', {
    type: exports.LQM_dualMachTurret,
    independent: false,
    color: 5,
    size: 6
});
for (let i = 0; i < 3; i++) exports.legendaryQuadralMachine.TURRETS = exports.legendaryQuadralMachine.TURRETS.concat(LQM_Turrets(i * 120 + 60));
exports.summoner = {
    PARENT: [exports.miniboss],
    TYPE: "miniboss",
    DANGER: 8,
    SHAPE: 4,
    LABEL: "Summoner",
    COLOR: 13,
    SIZE: 25,
    MAX_CHILDREN: 48,
    FACING_TYPE: "autospin",
    VALUE: 500000,
    BODY: bossStats(),
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [3.5, 8.65, 1.2, 8, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner]),
            TYPE: exports.summonersunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            WAIT_TO_CYCLE: true,
        }
    }, {
        POSITION: [3.5, 8.65, 1.2, 8, 0, 270, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner]),
            TYPE: exports.summonersunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            WAIT_TO_CYCLE: true,
        }
    }, {
        POSITION: [3.5, 8.65, 1.2, 8, 0, 0, 0.25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner]),
            TYPE: exports.summonersunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            WAIT_TO_CYCLE: true,
        }
    }, {
        POSITION: [3.5, 8.65, 1.2, 8, 0, 180, 0.75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner]),
            TYPE: exports.summonersunchip,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            WAIT_TO_CYCLE: true,
        }
    }]
};
exports.fallenOverlord = makeFallen(exports.overlord, -1, {
    universalGunStats: [g.fallenOverlord],
    properties: {
        MAX_CHILDREN: 32
    }
});
exports.fallenBooster = makeFallen(exports.booster, -1, {
    bodyStats: {
        health: .7,
        damage: 1.3,
        speed: 12.5
    },
    properties: {
        FACING_TYPE: "locksFacing"
    }
});
exports.fallenHybrid = makeFallen(exports.hybrid, -1, {
    specificGunStats: {
        0: [
            [1, 0, 1, 1, 2, 1.5, 1, 1.2, 1, 1, 1, 1, 1]
        ],
        1: [
            [.5, 1, 1, 1, 2, 1.6, 1, 1, 1, 1, 1, 1, 2]
        ]
    },
    properties: {
        FACING_TYPE: "locksFacing"
    }
});
exports.palisade = (() => {
    exports.palisadeTrapper = {
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
                SHOOT_SETTINGS: combineStats([g.trap, g.turret, [2, 0, 1, 1, .9, .9, .9, .9, .9, .5, 1, 1, 1]]),
                TYPE: exports.trap,
                STAT_CALCULATOR: gunCalcNames.trap,
                AUTOFIRE: true
            }
        }]
    };
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
            damage: 1,
            speed: .1
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
            TYPE: exports.palisadeTrapper
        }, {
            POSITION: [5, 10, 0, 90, 110, 0],
            TYPE: exports.palisadeTrapper
        }, {
            POSITION: [5, 10, 0, 150, 110, 0],
            TYPE: exports.palisadeTrapper
        }, {
            POSITION: [5, 10, 0, 210, 110, 0],
            TYPE: exports.palisadeTrapper
        }, {
            POSITION: [5, 10, 0, 270, 110, 0],
            TYPE: exports.palisadeTrapper
        }, {
            POSITION: [5, 10, 0, 330, 110, 0],
            TYPE: exports.palisadeTrapper
        }]
    }
})();
exports.catalyst = (function () {
    exports.catalystMinionTurret = {
        PARENT: [exports.turretParent],
        COLOR: 6,
        GUNS: [{
            POSITION: [24, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.turret, [3, 0, 1, 1, 2, 2, 2, 1.2, 1.2, 1.2, 1, 2, 1]]),
                TYPE: exports.homingBullet
            }
        }, {
            POSITION: [18, 10.88, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SKIN: 6,
                COLOR: 6
            }
        }, {
            POSITION: [18, 10.88, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SKIN: 5,
                COLOR: 6
            }
        }]
    }
    exports.catalystMinion = {
        PARENT: [exports.minion],
        LABEL: "Fortress",
        SHAPE: -4,
        BOUNCE_OBSTACLES: true,
        FACING_TYPE: "autospin",
        TURRETS: [{
            POSITION: [12.5, 0, 0, 0, 360, 1],
            TYPE: exports.catalystMinionTurret
        }],
        INDEPENDENT: true,
        BODY: {
            FOV: 3
        },
        DRAW_HEALTH: true,
        GUNS: (function () {
            const output = [];
            for (let i = 0; i < 4; i++) {
                output.push({
                    POSITION: [15, 10, 1, 0, 0, 360 / 4 * i, 0]
                }, {
                    POSITION: [15, 5, 1, 0, 0, 360 / 4 * i, 0],
                    PROPERTIES: {
                        COLOR: 9
                    }
                }, {
                    POSITION: [3, 10, 1.5, 15, 0, 360 / 4 * i, 1],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.trap, [5, 0, 1, 1, 2, 1, 1, .8, .8, .3, 1, 1, 1]]),
                        TYPE: exports.trap,
                        AUTOFIRE: true,
                        STAT_CALCULATOR: gunCalcNames.trap,
                        MAX_CHILDREN: 1
                    }
                });
            }
            return output;
        })()
    }
    exports.catalystBottomTurret = createTurret(exports.boomer, [[2, 0, 1, 1, 2, 2, 1, .8, .5, .5, 1, 1, 3]])
    exports.catalystHunter = createTurret(exports.hunter, [[3, 0, 1, 1, 1, 1, 1, 1, 1, .7, 1, 1, 1]]);
    for (let i = 0; i < exports.catalystHunter.GUNS.length; i++) {
        exports.catalystHunter.GUNS[i].PROPERTIES.COLOR_OVERRIDE = 6;
    }
    exports.catalystSpreadling = createTurret(exports.spreadling, [[3, 0, 1, 1, 1, 1, 1.5, 1, 1, .8, 1, 1, 1]]);
    for (let i = 0; i < exports.catalystSpreadling.GUNS.length; i++) {
        exports.catalystSpreadling.GUNS[i].PROPERTIES.COLOR_OVERRIDE = 6;
    }
    return {
        PARENT: [exports.miniboss],
        SIZE: 62,
        DANGER: 30,
        SHAPE: 6,
        COLOR: 9,
        VALUE: 5000000,
        LABEL: "Catalyst",
        BODY: bossStats({
            health: 3,
            speed: .01,
            damage: 2
        }),
        FACING_TYPE: 'lucrehulkSpin',
        GUNS: (function () {
            function spawner(angle) {
                return [{
                    POSITION: [4, 6, -1.6, 8, 0, angle, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.spawner, g.factory, [1, 0, 1, 1.25, 6, 2, .6, 2, .15, 1, 1, 1, 1]]),
                        TYPE: exports.catalystMinion,
                        STAT_CALCULATOR: gunCalcNames.drone,
                        AUTOFIRE: true,
                        MAX_CHILDREN: 1,
                        SYNCS_SKILLS: true,
                        WAIT_TO_CYCLE: true
                    }
                }, {
                    POSITION: [4, 6, 1, 8, 0, angle, 0],
                    PROPERTIES: {
                        SKIN: 6,
                        COLOR: 6
                    }
                }, {
                    POSITION: [4, 6, 1, 8, 0, angle, 0],
                    PROPERTIES: {
                        SKIN: 5,
                        COLOR: 9
                    }
                }];
            }
            const output = [];
            for (let i = 0; i < 6; i++) {
                output.push(...spawner(360 / 6 * i));
            }
            return output;
        })(),
        TURRETS: (function () {
            const output = [];
            for (let i = 0; i < 6; i++) {
                output.push({
                    POSITION: [5, 10, 0, 360 / 6 * i + 360 / 12, 360 / 6 + 22.5, 0],
                    TYPE: exports.catalystBottomTurret
                }, {
                    POSITION: [2, 7, -3, 360 / 6 * i, 120, 1],
                    TYPE: [exports.catalystHunter, {
                        COLOR: 6
                    }]
                }, {
                    POSITION: [2, 7, 3, 360 / 6 * i, 120, 1],
                    TYPE: [exports.catalystHunter, {
                        COLOR: 6
                    }]
                }, {
                    POSITION: [3, 6, 0, 360 / 6 * i, 120, 1],
                    TYPE: [exports.catalystSpreadling, {
                        COLOR: 6
                    }]
                });
            }
            return output;
        })()
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
        for (let i = 0; i < 8; i++) output.push({
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
        for (let i = 0; i < 8; i++) output.push({
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
        for (let i = 0; i < 8; i++) output.push({
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
        for (let i = 0; i < 5; i++) output.push({
            POSITION: [4.5, 4, 0, 360 / 5 * i, 120, 1],
            TYPE: exports.eggPrinceTier4Turret2
        });
        for (let i = 0; i < 8; i++) output.push({
            POSITION: [4.5, 9, 0, 360 / 8 * i, 90, 0],
            TYPE: exports.eggPrinceTier3Turret1
        });
        return output;
    })()
};
exports.ek1Body = {
    LABEL: "",
    FACING_TYPE: "autospin",
    COLOR: 9,
    SHAPE: 6,
    INDEPENDENT: true,
    TURRETS: []
};
let tarry = [];
for (let e = 0; e < 6; e++) tarry.push({
    POSITION: [10, 10, 0, 360 * e / 6, 144, 0],
    TYPE: exports.autoTurret
});
g.ek2Gunner = [3, 1, 1, 1, 1.2, 1.2, 1.5, 1.1, .8, 1, 1, 2, 1];
exports.ek2Gunner = {
    PARENT: [exports.turretParent],
    LABEL: "Gunner",
    GUNS: [{
        POSITION: [12, 3.5, 1, 0, 7.25, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.turret, g.ek2Gunner]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 3.5, 1, 0, -7.25, 0, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.turret, g.ek2Gunner]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 3.5, 1, 0, 3.75, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.turret, g.ek2Gunner]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 3.5, 1, 0, -3.75, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.turret, g.ek2Gunner]),
            TYPE: exports.bullet
        }
    }]
};
exports.ek2Body = {
    PARENT: [exports.genericTank],
    LABEL: "",
    CONTROLLERS: ["slowSpin"],
    COLOR: 9,
    SHAPE: 6,
    INDEPENDENT: false,
    TURRETS: [],
    GUNS: [],
    SKILL: setBuild("0099999000")
};
for (let e = 0; e < 3; e++) exports.ek2Body.TURRETS.push({
    POSITION: [10, 8, 0, 360 * e / 3, 105, 0],
    TYPE: [exports.ek2Gunner, {
        INDEPENDENT: true,
        COLOR: 8
    }]
}, {
    POSITION: [4, 9, 3, 360 * e / 3 + 60, 105, 0],
    TYPE: [exports.autoTurret, {
        INDEPENDENT: true,
        COLOR: 8
    }]
}, {
    POSITION: [4, 9, -3, 360 * e / 3 + 60, 105, 0],
    TYPE: [exports.autoTurret, {
        INDEPENDENT: true,
        COLOR: 8
    }]
}), exports.ek2Body.GUNS.push({
    POSITION: [15, 3, .75, 0, 0, 120 * e + 60, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.turret]),
        TYPE: [exports.swarm, {
            INDEPENDENT: true,
            BODY: {
                FOV: 2
            }
        }],
        AUTOFIRE: true
    }
});
g.hunterTurret = [1.6, 1, 1, 1, 1.2, 1.05, 1, 1, 1, 1, 1, 1, 1];
exports.hunterTurret = {
    PARENT: [exports.turretParent],
    LABEL: "Hunter",
    GUNS: [{
        POSITION: [20, 13.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.hunter2, g.turret, g.hunterTurret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 16, 1, 0, 0, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.turret, g.hunterTurret]),
            TYPE: exports.bullet
        }
    }]
};
exports.ek3TwinTurret = createTurret(exports.twin, [g.doubleReload]);
for (let i = 0; i < exports.ek3TwinTurret.GUNS.length; i++) {
    exports.ek3TwinTurret.GUNS[i].POSITION[1] *= .75;
}
exports.ek3Director = createTurret(exports.director, [g.weak]);
exports.ek3Body = {
    PARENT: [exports.genericTank],
    LABEL: "",
    CONTROLLERS: ["slowSpin"],
    COLOR: 9,
    SHAPE: 12,
    INDEPENDENT: false,
    TURRETS: [],
    GUNS: [],
    SKILL: setBuild("0095553000")
};
for (let e = 0; e < 6; e++) {
    exports.ek3Body.TURRETS.push({
        POSITION: [3.15, 9.5, 1.35, 360 * e / 6 + 30, 52.5, 0],
        TYPE: [exports.ek3TwinTurret, {
            INDEPENDENT: true,
            COLOR: 8
        }]
    }, {
        POSITION: [3.15, 9.5, -1.35, 360 * e / 6 + 30, 52.5, 0],
        TYPE: [exports.ek3TwinTurret, {
            INDEPENDENT: true,
            COLOR: 8
        }]
    });
    exports.ek3Body.GUNS.push({
        POSITION: [15, 2.25, .5, 0, 1, 60 * e, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.doubleReload, g.doubleReload]),
            TYPE: [exports.swarm, {
                INDEPENDENT: true,
                BODY: {
                    FOV: 2
                }
            }],
            AUTOFIRE: true
        }
    }, {
        POSITION: [15, 2.25, .5, 0, -1, 60 * e, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.doubleReload, g.doubleReload]),
            TYPE: [exports.swarm, {
                INDEPENDENT: true,
                BODY: {
                    FOV: 2
                }
            }],
            AUTOFIRE: true
        }
    });
}
exports.ek4EagleMinion = createMinion(exports.eagle);
for (let i = 0; i < exports.ek4EagleMinion.GUNS.length; i++) {
    if (exports.ek4EagleMinion.GUNS[i].PROPERTIES) {
        exports.ek4EagleMinion.GUNS[i].PROPERTIES.ALT_FIRE = false;
    }
}
exports.ek4FalconMinion = createMinion(exports.falcon);
for (let i = 0; i < exports.ek4FalconMinion.GUNS.length; i++) {
    if (exports.ek4FalconMinion.GUNS[i].PROPERTIES) {
        exports.ek4FalconMinion.GUNS[i].PROPERTIES.ALT_FIRE = false;
    }
}
exports.ek4PentaTurret = createTurret(exports.pentaShot, [g.doubleReload]);
exports.ek4AutoTurret = createTurret(exports.basic, [g.doubleReload, g.weak]);
exports.ek4Minion = makeAuto({
    PARENT: [exports.minion],
    INDEPENDENT: true,
    BODY: {
        FOV: 2
    },
    DRAW_HEALTH: true,
    SHAPE: 8,
    DANGER: 7,
    GUNS: (() => {
        let e = [];
        for (let T = 0; T < 4; T++)
            for (let t = 0; t < 2; t++) e.push({
                POSITION: [7, 2.3, .46, 7, t % 2 == 0 ? 1.3 : -1.3, 90 * T, t % 2 == 0 ? 0 : .5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.doubleReload, g.doubleReload]),
                    TYPE: [exports.swarm, {
                        BODY: {
                            FOV: 2
                        }
                    }],
                    AUTOFIRE: true,
                    COLOR_OVERRIDE: 8
                }
            });
        return e
    })(),
    TURRETS: (() => {
        let e = [];
        for (let T = 0; T < 4; T++) e.push({
            POSITION: [5.1, 10, 0, 45 + 90 * T, 45, 0],
            TYPE: exports.ek4PentaTurret
        });
        let T = [];
        for (let e = 0; e < 4; e++)
            for (let t = 0; t < 2; t++) T.push({
                POSITION: [2.5, 10.6, 0, 45 + 90 * e + (t % 2 == 0 ? 22.5 : -22.5), 45, 0],
                TYPE: exports.ek4AutoTurret
            });
        return [...T, ...e]
    })()
}, "Mega Minion", {
    type: exports.ek4MinionGunner,
    size: 12
});
exports.ek4Shell = {
    PARENT: [exports.genericTank],
    LABEL: "",
    COLOR: 8
};
exports.ek4DualSingle = {
    PARENT: [exports.genericTank],
    LABEL: "Dual Single",
    GUNS: [{
        POSITION: [19.4, 5, 1, 0, 6, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.twin, g.turret, g.doubleReload]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [9.5, 7.5, .65, 2, 6, 0, 0]
    }, {
        POSITION: [19.4, 5, 1, 0, -6, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.twin, g.turret, g.doubleReload]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 8
        }
    }, {
        POSITION: [9.5, 7.5, .65, 2, -6, 0, 0]
    }]
};
exports.ek5Predator = createTurret(exports.predator, [g.doubleReload]);
exports.ek5Aggressor = createTurret(exports.aggressor, [g.doubleReload]);
exports.ek5Scaler = createTurret(exports.scaler, [g.sniper, g.doubleReload]);
exports.ek5Octo = createTurret(exports.octo, [g.doubleReload, g.flank]);
exports.ek5OPDual = {
    PARENT: [exports.turretParent],
    LABEL: "OP Dual",
    GUNS: [{
        POSITION: [13.2, 5.3, 1, 0, 5.75, 0, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.dual, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [11.6, 6.9, 1, 0, 5.75, 0, .334],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.dual, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [10, 8.5, 1, 0, 5.75, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.dual, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [13.2, 5.3, 1, 0, -5.75, 0, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.dual, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [11.6, 6.9, 1, 0, -5.75, 0, .334],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.dual, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [10, 8.5, 1, 0, -5.75, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.dual, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [14.8, 5.3, 1, 0, 0, 0, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.dual, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [13.2, 6.9, 1, 0, 0, 0, .334],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.dual, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [11.6, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.dual, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }]
};
exports.ek5MegaDual = {
    PARENT: [exports.turretParent],
    LABEL: "Mega Dual",
    GUNS: [{
        POSITION: [13.2, 5.3, 1, 0, 5.75, 0, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.dual, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [11.6, 6.9, 1, 0, 5.75, 0, .334],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.dual, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [10, 8.5, 1, 0, 5.75, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.dual, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [13.2, 5.3, 1, 0, -5.75, 0, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.dual, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [11.6, 6.9, 1, 0, -5.75, 0, .334],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.dual, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [10, 8.5, 1, 0, -5.75, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.dual, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [21.8, 2.5, 1, 0, 0, 0, .8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.dual, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20.6, 4, 1, 0, 0, 0, .6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.dual, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19.4, 5.5, 1, 0, 0, 0, .4],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.dual, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18.2, 7, 1, 0, 0, 0, .2],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.dual, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.dual, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [8.2, 3, 1.56, 8, 3.2, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [8.2, 3, 1.56, 8, -3.2, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }]
};
exports.ek1Minion = createMinion({
    PARENT: [exports.miniboss],
    LABEL: "EK-1",
    COLOR: 8,
    VALUE: 25e4,
    SIZE: 30,
    SKILL: setBuild("3959999055"),
    BODY: bossStats(),
    TURRETS: [...tarry, {
        POSITION: [25, 0, 0, 0, 0, 0],
        TYPE: [exports.ek1Body]
    }, {
        POSITION: [10, 0, 0, 0, 360, 1],
        TYPE: exports.bigelite4gun
    }]
});
exports.ek5MinionNailgun = createTurret(exports.nailgun, [g.doubleReload]);
exports.ek5MinionRanger = createTurret(exports.ranger, [g.doubleReload]);
exports.ek5Minion = {
    PARENT: [exports.minion],
    LABEL: "Ultra Cannon",
    BODY: bossStats({
        health: .25,
        speed: 1.5,
        fov: 3
    }),
    INDEPENDENT: true,
    DRAW_HEALTH: true,
    DANGER: 7,
    GUNS: [{
        POSITION: [26, 4, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.predator, g.minion, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [24, 7, 1, 0, 0, 0, 1 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.predator, g.minion, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [22, 10, 1, 0, 0, 0, 2 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.predator, g.minion, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 13, 1, 0, 0, 0, 3 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.predator, g.minion, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 16, 1, 0, 0, 0, 4 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.predator, g.minion, g.doubleReload]),
            TYPE: exports.bullet
        }
    }],
    TURRETS: [{
        POSITION: [4.5, 7.5, 0, 60, 45, 1],
        TYPE: exports.ek5MinionNailgun
    }, {
        POSITION: [4.5, 7.5, 0, 180, 45, 1],
        TYPE: exports.ek5MinionNailgun
    }, {
        POSITION: [4.5, 7.5, 0, 300, 45, 1],
        TYPE: exports.ek5MinionNailgun
    }, {
        POSITION: [5.5, 6.5, 0, 0, 45, 1],
        TYPE: exports.ek5MinionNailgun
    }, {
        POSITION: [5.5, 6.5, 0, 120, 45, 1],
        TYPE: exports.ek5MinionNailgun
    }, {
        POSITION: [5.5, 6.5, 0, 240, 45, 1],
        TYPE: exports.ek5MinionNailgun
    }, {
        POSITION: [5.5, 9.5, 0, 72, 45, 0],
        TYPE: exports.ek5MinionRanger
    }, {
        POSITION: [5.5, 9.5, 0, 144, 45, 0],
        TYPE: exports.ek5MinionRanger
    }, {
        POSITION: [5.5, 9.5, 0, -72, 45, 0],
        TYPE: exports.ek5MinionRanger
    }, {
        POSITION: [5.5, 9.5, 0, -144, 45, 0],
        TYPE: exports.ek5MinionRanger
    }]
};
exports.ek6TripleShot = createTurret(exports.tripleshot, [[3, 0, 1, 1, 1.2, 1.2, 1, 1, 1, .5, 1, 1, 1]]);
exports.ek6Snipeling = {
    PARENT: [exports.turretParent],
    LABEL: "Snipeling",
    GUNS: [{
        POSITION: [16, 4, 1, 0, -1, -44.7, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.spread, g.turret, [4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17.5, 4, 1, 0, -1.75, -29.8, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.spread, g.turret, [4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 4, 1, 0, -2, -14.9, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.spread, g.turret, [4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 4, 1, 0, 1, 44.7, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.spread, g.turret, [4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17.5, 4, 1, 0, 1.75, 29.8, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.spread, g.turret, [4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 4, 1, 0, 2, 14.9, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.spread, g.turret, [4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [24, 8.5, 1, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.spread, g.turret, [4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }]
};
exports.ek6Spawner = {
    PARENT: [exports.genericTank],
    LABEL: "Spawned",
    COLOR: 8,
    GUNS: [{
        POSITION: [4.5, 10, 1, 10.85, 0, 0, 2],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.spawner, g.factory, [5, 1, 1, 1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.ek1Minion,
            MAX_CHILDREN: 1,
            AUTOFIRE: true
        }
    }, {
        POSITION: [1.3, 12.75, 1.025, 15.2, 0, 0, 0]
    }, {
        POSITION: [6, 12, -1.3, 6, 0, 0, 0]
    }]
};
exports.ek6Factory = {
    PARENT: [exports.genericTank],
    LABEL: "Summoned",
    COLOR: 8,
    GUNS: [{
        POSITION: [7, 10, 1, 10.85, 0, 0, 2],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.spawner, g.factory, [5, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.ek5Minion,
            MAX_CHILDREN: 1,
            AUTOFIRE: true
        }
    }, {
        POSITION: [2, 12, 1, 13.95, 0, 0, 0]
    }, {
        POSITION: [2.1, 13.5, 1, 18, 0, 0, 0]
    }, {
        POSITION: [6, 12, -1.3, 6, 0, 0, 0]
    }],
    TURRETS: []
};
exports.ek6PanultimateDual = {
    PARENT: [exports.turretParent],
    LABEL: "Panultimate Dual",
    GUNS: [{
        POSITION: [14, 2, 1, 0, 7, 0, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [13, 3, 1, 0, 7, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 4, 1, 0, 7, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [11, 5, 1, 0, 7, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 2, 1, 0, 4.75, 0, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 3, 1, 0, 4.75, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 4, 1, 0, 4.75, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [14, 5, 1, 0, 4.75, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 2, 1, 0, 2.5, 0, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 3, 1, 0, 2.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 4, 1, 0, 2.5, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 5, 1, 0, 2.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [14, 2, 1, 0, -7, 0, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [13, 3, 1, 0, -7, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 4, 1, 0, -7, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [11, 5, 1, 0, -7, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 2, 1, 0, -4.75, 0, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 3, 1, 0, -4.75, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 4, 1, 0, -4.75, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [14, 5, 1, 0, -4.75, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 2, 1, 0, -2.5, 0, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 3, 1, 0, -2.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 4, 1, 0, -2.5, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 5, 1, 0, -2.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [14.75, 4.4, 1.5, 8, 0, 0, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [14.25, 5.2, 1.5, 8, 0, 0, .334],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [13.75, 6, 1.5, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.dual, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }],
    TURRETS: [{
        POSITION: [15, 0, 0, 0, 190, 1],
        TYPE: [exports.genericTank, {
            COLOR: 8
        }]
    }]
};
exports.ek6PantultimateHunter = {
    PARENT: [exports.turretParent],
    LABEL: "Panultimate Hunter",
    GUNS: [{
        POSITION: [33, 3.25, 1, 0, 0, 0, 1 / 12 * 1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [31.5, 4.5, 1, 0, 0, 0, 1 / 12 * 2],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [30, 6, 1, 0, 0, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [28.5, 7.5, 1, 0, 0, 0, 1 / 12 * 4],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [27, 9, 1, 0, 0, 0, 1 / 12 * 5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [25.5, 10.5, 1, 0, 0, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [24, 12, 1, 0, 0, 0, 1 / 12 * 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [22.5, 13.5, 1, 0, 0, 0, 1 / 12 * 8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [21, 15, 1, 0, 0, 0, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19.5, 16.5, 1, 0, 0, 0, 1 / 12 * 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 18, 1, 0, 0, 0, 1 / 12 * 11],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [13, 18, -1.111, 0, 0, 0, 1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.turret, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
            TYPE: exports.bullet
        }
    }],
    TURRETS: [{
        POSITION: [11, 0, 0, 0, 190, 1],
        TYPE: [exports.genericTank, {
            COLOR: 8
        }]
    }]
};
exports.eggBossTier1 = {
    PARENT: [exports.miniboss],
    LABEL: "EK-1",
    COLOR: 8,
    VALUE: 25e4,
    SIZE: 30,
    SKILL: setBuild("3959999055"),
    BODY: bossStats(),
    TURRETS: [...tarry, {
        POSITION: [25, 0, 0, 0, 0, 0],
        TYPE: [exports.ek1Body]
    }, {
        POSITION: [10, 0, 0, 0, 360, 1],
        TYPE: exports.bigelite4gun
    }]
};
exports.eggBossTier2 = {
    PARENT: [exports.miniboss],
    LABEL: "EK-2",
    COLOR: 8,
    VALUE: 35e4,
    SIZE: 35,
    BODY: bossStats({
        health: 1.5,
        speed: .75
    }),
    TURRETS: [{
        POSITION: [25, 0, 0, 0, 360, 0],
        TYPE: [exports.ek2Body]
    }, {
        POSITION: [11, 0, 0, 0, 360, 1],
        TYPE: [exports.autoTurret]
    }]
};
exports.eggBossTier3 = {
    PARENT: [exports.miniboss],
    LABEL: "EK-3",
    COLOR: 8,
    VALUE: 5e5,
    SIZE: 40,
    BODY: bossStats({
        health: 2,
        speed: .5
    }),
    TURRETS: [{
        POSITION: [25, 0, 0, 0, 360, 0],
        TYPE: [exports.ek3Body]
    }, {
        POSITION: [5, 6.5, 0, 180, 360, 1],
        TYPE: exports.ek3Director
    }, {
        POSITION: [5, 6.5, 0, 60, 360, 1],
        TYPE: exports.ek3Director
    }, {
        POSITION: [5, 6.5, 0, -60, 360, 1],
        TYPE: exports.ek3Director
    }, {
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: [exports.hunterTurret]
    }]
};
exports.eggBossTier4 = {
    PARENT: [exports.miniboss],
    LABEL: "EK-4",
    SHAPE: 12,
    COLOR: 9,
    VALUE: 75e4,
    SIZE: 50,
    BODY: bossStats({
        health: 2.5,
        speed: .25
    }),
    GUNS: (() => {
        let e = [];
        for (let T = 0; T < 4; T++) e.push({
            POSITION: [1.79, 3, 1, 10.7, 0, 90 * T, 2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, g.factory, g.pound, [1, 1, 1, (T % 2 === 0) ? 3 : 1.75, (T % 2 === 0) ? 2 : 1, 1, 1, (T % 2 === 0) ? 1 / 3 : .75, (T % 2 === 0) ? 1 / 3 : .75, 1, 5, 1, 1]]),
                TYPE: [exports.ek4Minion, exports.ek4EagleMinion, exports.ek4Minion, exports.ek4FalconMinion][T],
                MAX_CHILDREN: 1 + (T % 2),
                COLOR_OVERRIDE: 8,
                AUTPFIRE: true
            }
        }, {
            POSITION: [1, 4.31, 1, 12.2, 0, 90 * T, 0]
        }, {
            POSITION: [3.31, 4, 1, 7.94, 0, 90 * T, 0]
        });
        let T = [];
        for (let e = 0; e < 4; e++) T.push({
            POSITION: [6, 3, .5, 8, 0, 60 + 90 * e, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.doubleReload, g.doubleReload]),
                TYPE: exports.swarm
            }
        });
        let t = [];
        for (let e = 0; e < 4; e++)
            for (let T = 0; T < 2; T++) t.push({
                POSITION: [12.5, .39, 1, 0, T % 2 == 0 ? 2 : -2, 30 + 90 * e, .667],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.doubleReload, g.doubleReload]),
                    TYPE: exports.bullet
                }
            }, {
                POSITION: [12.5, .39, 1, 0, T % 2 == 0 ? .9 : -.9, 30 + 90 * e, .334],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.doubleReload, g.doubleReload]),
                    TYPE: exports.bullet
                }
            }, {
                POSITION: [12.84, .39, 1, -0, T % 2 == 0 ? 1.4 : -1.4, 30 + 90 * e, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.doubleReload, g.doubleReload]),
                    TYPE: exports.bullet
                }
            }, {
                POSITION: [2.4, 1.6, -2.5, 8.5, T % 2 == 0 ? 1.4 : -1.4, 30 + 90 * e, 0]
            });
        return [...e, ...T, ...t]
    })(),
    TURRETS: [{
        POSITION: [18, 0, 0, 0, 360, 1],
        TYPE: exports.ek4Shell
    }, {
        POSITION: [4.7, 6.1, 0, 45, 360, 1],
        TYPE: exports.ek4DualSingle
    }, {
        POSITION: [4.7, 6.1, 0, 135, 360, 1],
        TYPE: exports.ek4DualSingle
    }, {
        POSITION: [4.7, 6.1, 0, 225, 360, 1],
        TYPE: exports.ek4DualSingle
    }, {
        POSITION: [4.7, 6.1, 0, 315, 360, 1],
        TYPE: exports.ek4DualSingle
    }]
};
exports.eggBossTier5 = {
    PARENT: [exports.miniboss],
    SIZE: 60,
    LABEL: "EK-5",
    SHAPE: 16,
    COLOR: 8,
    VALUE: 1e6,
    BODY: bossStats({
        health: 3,
        speed: .01
    }),
    GUNS: (() => {
        let e = [];
        for (let T = 0; T < 2; T++) e.push({
            POSITION: [1.67, 2.45, 1, 10.48, 0, 180 * T, 2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, g.factory, [1, 1, 1, [1.5, 4][T], 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
                TYPE: [exports.ek1Minion, exports.ek5Minion][T],
                MAX_CHILDREN: 1,
                AUTOFIRE: true
            }
        }, {
            POSITION: [1, 3.7, 1.01, 12.2, 0, 180 * T, 0]
        }, {
            POSITION: [3.4, 3.4, 1, 8, 0, 180 * T, 0]
        });
        let T = [];
        for (let e = 0; e < 2; e++)
            for (let t = 0; t < 2; t++) T.push({
                POSITION: [.8, 1.25, 1, 10.1, t % 2 == 0 ? .98 : -.98, 90 + 180 * e, 2],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.spawner, g.factory, [1, 1, 1, 2.5, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
                    TYPE: [exports.ek4EagleMinion, exports.ek4FalconMinion][t],
                    MAX_CHILDREN: 1,
                    AUTOFIRE: true
                }
            }, {
                POSITION: [.49, 1.81, 1.01, 11, t % 2 == 0 ? .98 : -.98, 90 + 180 * e, 0]
            }, {
                POSITION: [1.7, 1.7, 1, 8.9, t % 2 == 0 ? .98 : -.98, 90 + 180 * e, 0]
            });
        return [...e, ...T]
    })(),
    TURRETS: (() => {
        let e = [];
        for (let T = 0; T < 4; T++)
            for (let t = 0; t < 2; t++) e.push({
                POSITION: [4.6, 10, 0, 90 * T + (t % 2 == 0 ? 22.5 : 67.5), 45, 0],
                TYPE: exports.ek5Aggressor
            });
        let T = [];
        for (let e = 0; e < 4; e++) T.push({
            POSITION: [3.1, 10, 0, 45 + 90 * e, 45, 0],
            TYPE: exports.ek5Predator
        });
        return [...e, ...T, {
            POSITION: [2.2, 6.8, 0, 90, 90, 1],
            TYPE: exports.ek5Scaler
        }, {
            POSITION: [2.2, 6.8, 0, 270, 90, 1],
            TYPE: exports.ek5Scaler
        }, {
            POSITION: [2.1, 6.2, 4.1, 0, 360, 1],
            TYPE: exports.ek5Octo
        }, {
            POSITION: [2.1, 6.2, -4.1, 0, 360, 1],
            TYPE: exports.ek5Octo
        }, {
            POSITION: [2.1, -6.2, 4.1, 0, 360, 1],
            TYPE: exports.ek5Octo
        }, {
            POSITION: [2.1, -6.2, -4.1, 0, 360, 1],
            TYPE: exports.ek5Octo
        }, {
            POSITION: [4.75, 6.5, 0, 0, 120, 1],
            TYPE: exports.ek5OPDual
        }, {
            POSITION: [4.75, 6.5, 0, 180, 120, 1],
            TYPE: exports.ek5OPDual
        }, {
            POSITION: [6.2, 0, 0, 90, 360, 1],
            TYPE: exports.ek5MegaDual
        }]
    })()
};
exports.ek6Base = {
    PARENT: [exports.genericTank],
    LABEL: "Base",
    COLOR: 34,
    SHAPE: 6,
    SKILL: setBuild("9999990999"),
    GUNS: (() => {
        let e = [];
        for (let T = 0; T < 6; T++) e.push({
            POSITION: [1.25, 2.15, 1, 9.71, 0, 60 * T, 0]
        }, {
            POSITION: [.725, 3.4000000000000004, 1, 10.7, 0, 60 * T, 2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.factory, [1, 1, 1, .8, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
                TYPE: [exports.eggBossTier4, {
                    TYPE: "minion",
                    DAMAGE_CLASS: 0,
                    HITS_OWN_TYPE: "hardWithBuffer",
                    AI: {
                        BLIND: true
                    },
                    BODY: bossStats({
                        health: .25,
                        speed: 1.5,
                        fov: 3
                    }),
                    INDEPENDENT: true,
                    DRAW_HEALTH: true,
                    CLEAR_ON_MASTER_UPGRADE: true,
                    GIVE_KILL_MESSAGE: false,
                    CONTROLLERS: ["nearestDifferentMaster", "mapAltToFire", "minion", "canRepel", "hangOutNearMaster"],
                    DANGER: 7
                }],
                STAT_CALCULATOR: gunCalcNames.drone,
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                MAX_CHILDREN: 1,
                COLOR_OVERRIDE: 9
            }
        }, {
            POSITION: [3.31, 3.15, 1, 6.94, 0, 60 * T, 0]
        });
        return e
    })(),
    TURRETS: (() => {
        let e = [];
        for (let T = 0; T < 6; T++)
            for (let t = 0; t < 2; t++) e.push({
                POSITION: [3.6, 9.625, 0 === t ? 2 : -2, 30 + 60 * T, 90, 0],
                TYPE: exports.ek6PantultimateHunter
            });
        return e
    })()
};
exports.eggBossTier6 = {
    PARENT: [exports.miniboss],
    LABEL: "EK-6",
    DANGER: 100,
    COLOR: 8,
    SHAPE: 6,
    SIZE: 100,
    VALUE: 25e5,
    BODY: bossStats({
        health: 4,
        speed: .001,
        fov: .5
    }),
    TURRETS: (() => {
        let e = [];
        for (let T of [0, 180, 60, 240]) e.push({
            POSITION: [.7, 8.5, 0, T, 90, 1],
            TYPE: exports.ek6TripleShot
        }, {
            POSITION: [.7, 8.5, 1.625, T, 90, 1],
            TYPE: exports.ek6TripleShot
        }, {
            POSITION: [.7, 8.5, -1.625, T, 90, 1],
            TYPE: exports.ek6TripleShot
        });
        let T = [];
        for (let [e, t] of [
            [0, -.9],
            [60, .9],
            [180, -.9],
            [240, .9]
        ]) T.push({
            POSITION: [1.2, 6, t, e, 90, 1],
            TYPE: exports.ek6Snipeling
        });
        let t = [];
        for (let [e, T, S] of [
            [4.85, 1.45, 30],
            [4.85, -1.45, 30],
            [4.85, 1.45, 210],
            [4.85, -1.45, 210],
            [4.85, 2.5, 120],
            [4.85, -2.5, 120],
            [4.85, 2.5, 300],
            [4.85, -2.5, 300],
            [7.25, 0, 120],
            [7.25, 0, 300]
        ]) t.push({
            POSITION: [2.5, e, T, S, 90, 1],
            TYPE: [exports.ek5MegaDual, {
                COLOR: 8
            }]
        });
        let S = [];
        for (let e of [30, 90, 150, 210, 270, 330]) {
            for (let T = 0; T < 2; T++) S.push({
                POSITION: [1.3, 9.1, 0 === T ? 1.75 : -1.75, e, 0, 1],
                TYPE: exports.ek6Spawner
            });
            S.push({
                POSITION: [1.8, 9.4, 0, e, 0, 1],
                TYPE: exports.ek6Factory
            })
        }
        return [{
            POSITION: [21, 0, 0, 0, 0, 0],
            TYPE: [exports.ek6Base, {
                COLOR: 9,
                SYNCS_TURRET_SKILLS: true
            }]
        }, ...e, ...T, ...t, ...S, {
            POSITION: [4.5, 0, 0, 30, 360, 1],
            TYPE: exports.ek6PanultimateDual
        }]
    })()
};
exports.rangerTurret = createTurret(exports.ranger);
exports.squareBossTier1 = {
    PARENT: [exports.miniboss],
    LABEL: 'MK-1',
    DANGER: 8,
    SHAPE: 4,
    COLOR: 13,
    SIZE: 24,
    VALUE: 1e5,
    BODY: bossStats(),
    FACING_TYPE: "locksFacing",
    TURRETS: [{
        POSITION: [7.5, 0, 0, 180, 360, 1],
        TYPE: [exports.rangerTurret, {
            INDEPENDENT: true
        }]
    }],
    GUNS: [{
        POSITION: [21, 4.9, 1, 0, 3.25, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.pelleter]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [21, 4.9, 1, 0, -3.25, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.pelleter]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6, 11.65, -1.5, 9.15, 0, 0, 0],
    }]
};
exports.hybridAutoGun = createTurret(exports.hybrid);
exports.squareBossTier2 = {
    PARENT: [exports.miniboss],
    LABEL: 'MK-2',
    DANGER: 8,
    SHAPE: 4,
    COLOR: 13,
    SIZE: 26,
    VALUE: 1e5,
    BODY: bossStats(),
    FACING_TYPE: "locksFacing",
    TURRETS: [{
        POSITION: [7.5, 4.65, 4.65, 180, 360, 1],
        TYPE: [exports.rangerTurret, {
            INDEPENDENT: true
        }]
    }, {
        POSITION: [7.5, 4.65, -4.65, 180, 360, 1],
        TYPE: [exports.rangerTurret, {
            INDEPENDENT: true
        }]
    }, {
        POSITION: [7.5, 4.65, 0, 0, 360, 1],
        TYPE: exports.hybridAutoGun
    }],
    GUNS: [{
        POSITION: [21, 4.9, 1, 0, 3.25, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.pelleter]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [21, 4.9, 1, 0, -3.25, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.pelleter]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [23.25, 4.9, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.pelleter]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6, 11.65, -1.5, 9.15, 0, 0, 0]
    }, {
        POSITION: [8.2, 5, .4, 7, 3.2, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
            TYPE: exports.autoSwarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [8.2, 5, .4, 7, -3.2, 90, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
            TYPE: [exports.swarm, {
                CONTROLLERS: ['canRepel']
            }],
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [8.2, 5, .4, 7, -3.2, -90, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
            TYPE: exports.autoSwarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [8.2, 5, .4, 7, 3.2, -90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
            TYPE: [exports.swarm, {
                CONTROLLERS: ['canRepel']
            }],
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }]
};
exports.twinAutoGun = createTurret(exports.twin, [g.doubleReload]);
exports.MK3_Minion = {
    PARENT: [exports.minion],
    LABEL: 'Mega Minion',
    SHAPE: 4,
    COLOR: 13,
    SIZE: 20,
    BODY: {
        FOV: .5,
        SPEED: 1.25,
        ACCELERATION: .35,
        HEALTH: 10,
        SHIELD: 1,
        DAMAGE: 1.25,
        RESIST: 1,
        PENETRATION: 1,
        DENSITY: .5,
        RANGE: 150
    },
    GUNS: [{
        POSITION: [8, 7, .9, 5, 4.5, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.pound, g.doubleReload, g.doubleReload, g.doubleReload]),
            TYPE: [exports.swarm, {
                CONTROLLERS: ['canRepel']
            }],
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [8, 7, .9, 5, -4.5, 90, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.pound, g.doubleReload, g.doubleReload, g.doubleReload]),
            TYPE: exports.autoSwarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [8, 7, .9, 5, 4.5, -90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.pound, g.doubleReload, g.doubleReload, g.doubleReload]),
            TYPE: [exports.swarm, {
                CONTROLLERS: ['canRepel']
            }],
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [8, 7, .9, 5, -4.5, -90, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.pound, g.doubleReload, g.doubleReload, g.doubleReload]),
            TYPE: exports.autoSwarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }],
    TURRETS: [{
        POSITION: [7.45, 4.5, 4.5, 0, 120, 1],
        TYPE: exports.twinAutoGun
    }, {
        POSITION: [7.45, 4.5, -4.5, 0, 120, 1],
        TYPE: exports.twinAutoGun
    }, {
        POSITION: [7.45, 4.5, 4.5, 180, 120, 1],
        TYPE: exports.twinAutoGun
    }, {
        POSITION: [7.45, 4.5, -4.5, 180, 120, 1],
        TYPE: exports.twinAutoGun
    }]
};
exports.minionSpawnerMK3 = {
    LABEL: '',
    MAX_CHILDREN: 1,
    GUNS: [{
        POSITION: [4, 14, 1, 6, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.spawner, g.factory, g.doubleReload]),
            TYPE: exports.MK3_Minion,
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true
        }
    }]
};
exports.lokiArtillery = {
    SYNC_TURRET_SKILLS: true,
    CONTROLLERS: ['onlyAcceptInArc', 'nearestDifferentMaster'],
    BODY: {
        FOV: 1.15,
    },
    LABEL: 'Turret',
    DANGER: 7,
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [17, 3, 1, 0, -6, -7, .334],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 3, 1, 0, 6, 7, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.turret, g.celestialHeavyWeapon]),
            TYPE: exports.bullet
        }
    }]
};
exports.squareBossTier3 = {
    PARENT: [exports.miniboss],
    LABEL: 'MK-3',
    DANGER: 9,
    SHAPE: 4,
    COLOR: 13,
    SIZE: 40,
    VALUE: 2e5,
    BODY: bossStats(),
    FACING_TYPE: "locksFacing",
    GUNS: [{
        POSITION: [6.333, 2.667, 1, 6, 6, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream, g.norecoil]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5.667, 2.667, 1, 6, 6, 0, 1 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream, g.norecoil]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5, 2.667, 1, 6, 6, 0, 2 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream, g.norecoil]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6.333, 2.667, 1, 6, -6, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream, g.norecoil]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5.667, 2.667, 1, 6, -6, 0, 1 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream, g.norecoil]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5, 2.667, 1, 6, -6, 0, 2 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream, g.norecoil]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [7.667, 2.667, 1, 6, 2, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream, g.doubleReload, g.norecoil]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [7, 2.667, 1, 6, 2, 0, .2],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream, g.doubleReload, g.norecoil]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6.333, 2.667, 1, 6, 2, 0, .4],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream, g.doubleReload, g.norecoil]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5.667, 2.667, 1, 6, 2, 0, .6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream, g.doubleReload, g.norecoil]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5, 2.667, 1, 6, 2, 0, .8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream, g.doubleReload, g.norecoil]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [7.667, 2.667, 1, 6, -2, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream, g.doubleReload, g.norecoil]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [7, 2.667, 1, 6, -2, 0, .2],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream, g.doubleReload, g.norecoil]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6.333, 2.667, 1, 6, -2, 0, .4],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream, g.doubleReload, g.norecoil]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5.667, 2.667, 1, 6, -2, 0, .6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream, g.doubleReload, g.norecoil]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5, 2.667, 1, 6, -2, 0, .8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream, g.doubleReload, g.norecoil]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [4, 4, 1.6, 6, 5.1, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, g.weak]),
            TYPE: [exports.sunchip, {
                INDEPENDENT: true,
                BODY: {
                    FOV: 3
                }
            }],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro,
            MAX_CHILDREN: 5
        }
    }, {
        POSITION: [4, 4, 1.6, 6, -5.1, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, g.weak]),
            TYPE: [exports.sunchip, {
                INDEPENDENT: true,
                BODY: {
                    FOV: 3
                }
            }],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro,
            MAX_CHILDREN: 5
        }
    }],
    TURRETS: [{
        POSITION: [3.4, 6.6, 0, 180, 180, 1],
        TYPE: exports.trapTurret
    }, {
        POSITION: [3.5, 6.6, 2.5, 90, 120, 1],
        TYPE: exports.director
    }, {
        POSITION: [3.5, 6.6, -2.5, 90, 120, 1],
        TYPE: exports.director
    }, {
        POSITION: [3.5, 6.6, 2.5, -90, 120, 1],
        TYPE: exports.director
    }, {
        POSITION: [3.5, 6.6, -2.5, -90, 120, 1],
        TYPE: exports.director
    }, {
        POSITION: [9, 0, 2, 90, 360, 0],
        TYPE: exports.minionSpawnerMK3
    }, {
        POSITION: [9, 0, -2, -90, 360, 0],
        TYPE: exports.minionSpawnerMK3
    }, {
        POSITION: [9, 0, 2, 0, 360, 0],
        TYPE: exports.minionSpawnerMK3
    }, {
        POSITION: [9, 0, -2, 0, 360, 0],
        TYPE: exports.minionSpawnerMK3
    }, {
        POSITION: [8, 0, 0, 0, 360, 1],
        TYPE: [exports.lokiArtillery, {
            CONTROLLERS: ['nearestDifferentMaster'],
            LABEL: 'Sheller'
        }]
    }]
};
exports.triangleBossHunterTurret = createTurret(exports.hunter);
exports.blockTrap = {
    PARENT: [exports.trap],
    SHAPE: -4
};
exports.triangleBossTier1 = {
    PARENT: [exports.miniboss],
    LABEL: 'TK-1',
    DANGER: 8,
    SHAPE: 3,
    COLOR: 2,
    SIZE: 22,
    VALUE: 150000,
    BODY: bossStats(),
    GUNS: [{
        POSITION: [8, 5.8, 1, 6, 0, 60, 0]
    }, {
        POSITION: [1.8, 5.8, 1.15, 14, 0, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.doubleReload]),
            TYPE: exports.blockTrap
        }
    }, {
        POSITION: [8, 5.8, 1, 6, 8, 60, 0]
    }, {
        POSITION: [1.8, 5.8, 1.15, 14, 8, 60, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.doubleReload]),
            TYPE: exports.blockTrap
        }
    }, {
        POSITION: [8, 5.8, 1, 6, -8, 60, 0]
    }, {
        POSITION: [1.8, 5.8, 1.15, 14, -8, 60, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.doubleReload]),
            TYPE: exports.blockTrap
        }
    }, {
        POSITION: [8, 5.8, 1, 6, 0, -60, 0]
    }, {
        POSITION: [1.8, 5.8, 1.15, 14, 0, -60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.doubleReload]),
            TYPE: exports.blockTrap
        }
    }, {
        POSITION: [8, 5.8, 1, 6, 8, -60, 0]
    }, {
        POSITION: [1.8, 5.8, 1.15, 14, 8, -60, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.doubleReload]),
            TYPE: exports.blockTrap
        }
    }, {
        POSITION: [8, 5.8, 1, 6, -8, -60, 0]
    }, {
        POSITION: [1.8, 5.8, 1.15, 14, -8, -60, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.doubleReload]),
            TYPE: exports.blockTrap
        }
    }, {
        POSITION: [8, 5.8, 1, 6, 0, 180, 0]
    }, {
        POSITION: [1.8, 5.8, 1.15, 14, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.doubleReload]),
            TYPE: exports.blockTrap
        }
    }, {
        POSITION: [8, 5.8, 1, 6, 8, 180, 0]
    }, {
        POSITION: [1.8, 5.8, 1.15, 14, 8, 180, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.doubleReload]),
            TYPE: exports.blockTrap
        }
    }, {
        POSITION: [8, 5.8, 1, 6, -8, 180, 0]
    }, {
        POSITION: [1.8, 5.8, 1.15, 14, -8, 180, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.doubleReload]),
            TYPE: exports.blockTrap
        }
    }],
    TURRETS: [{
        POSITION: [8, -0.6, 0, 0, 360, 1],
        TYPE: exports.triangleBossHunterTurret
    }]
};
exports.triangleBossTier2Turret = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [18, 6, 1, 0, 6.5, 0, 0]
    }, {
        POSITION: [3, 6, 1.5, 18, 6.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.turret]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [18, 6, 1, 0, -6.5, 0, 0]
    }, {
        POSITION: [3, 6, 1.5, 18, -6.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.turret]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [21, 6, 1, 0, 0, 0, 0]
    }, {
        POSITION: [3, 6, 1.5, 21, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.turret]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }]
};
exports.trapMinion = createMinion(exports.trapper);
exports.triangleBossTier2 = {
    PARENT: [exports.miniboss],
    LABEL: 'TK-2',
    DANGER: 8,
    SHAPE: 3,
    COLOR: 2,
    SIZE: 28,
    VALUE: 300000,
    BODY: bossStats(),
    FACING_TYPE: 'autospin',
    GUNS: [{
        POSITION: [7, 6, 1, 6, 8.5, 60, 0]
    }, {
        POSITION: [1.8, 6, 1.15, 13, 8.5, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.doubleReload]),
            TYPE: exports.blockTrap
        }
    }, {
        POSITION: [7, 6, 1, 6, -8.5, 60, 0]
    }, {
        POSITION: [1.8, 6, 1.15, 13, -8.5, 60, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.doubleReload]),
            TYPE: exports.blockTrap
        }
    }, {
        POSITION: [7, 6, 1, 6, 8.5, -60, 0]
    }, {
        POSITION: [1.8, 6, 1.15, 13, 8.5, -60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.doubleReload]),
            TYPE: exports.blockTrap
        }
    }, {
        POSITION: [7, 6, 1, 6, -8.5, -60, 0]
    }, {
        POSITION: [1.8, 6, 1.15, 13, -8.5, -60, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.doubleReload]),
            TYPE: exports.blockTrap
        }
    }, {
        POSITION: [7, 6, 1, 6, 8.5, 180, 0]
    }, {
        POSITION: [1.8, 6, 1.15, 13, 8.5, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.doubleReload]),
            TYPE: exports.blockTrap
        }
    }, {
        POSITION: [7, 6, 1, 6, -8.5, 180, 0]
    }, {
        POSITION: [1.8, 6, 1.15, 13, -8.5, 180, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.doubleReload]),
            TYPE: exports.blockTrap
        }
    }, {
        POSITION: [2.27, 6, 1, 9.77, 0, 60, 0]
    }, {
        POSITION: [1, 7.5, 1, 12.05, 0, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.spawner, g.factory, g.doubleReload]),
            TYPE: exports.trapMinion,
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            MAX_CHILDREN: 2
        }
    }, {
        POSITION: [2.82, 7.36, 1, 7.64, 0, 60, 0]
    }, {
        POSITION: [2.27, 6, 1, 9.77, 0, -60, 0]
    }, {
        POSITION: [1, 7.5, 1, 12.05, 0, -60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.spawner, g.factory, g.doubleReload]),
            TYPE: exports.trapMinion,
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            MAX_CHILDREN: 2
        }
    }, {
        POSITION: [2.82, 7.36, 1, 7.64, 0, -60, 0]
    }, {
        POSITION: [2.27, 6, 1, 9.77, 0, 180, 0]
    }, {
        POSITION: [1, 7.5, 1, 12.05, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.spawner, g.factory, g.doubleReload]),
            TYPE: exports.trapMinion,
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            MAX_CHILDREN: 2
        }
    }, {
        POSITION: [2.82, 7.36, 1, 7.64, 0, 180, 0]
    }],
    TURRETS: [{
        POSITION: [3.1, 12.7, 0, 0, 360, 1],
        TYPE: exports.autoTurret
    }, {
        POSITION: [3.1, 12.7, 0, 120, 360, 1],
        TYPE: exports.autoTurret
    }, {
        POSITION: [3.1, 12.7, 0, 240, 360, 1],
        TYPE: exports.autoTurret
    }, {
        POSITION: [7.2, 0, 0, 0, 360, 1],
        TYPE: exports.triangleBossTier2Turret
    }]
};
exports.blasterTurret = createTurret(exports.blaster);
exports.triangleBossTier3Minion = {
    PARENT: [exports.minion],
    LABEL: 'Mega Minion',
    SHAPE: 129,
    COLOR: 2,
    SIZE: 50,
    BODY: {
        FOV: .6,
        SPEED: 1,
        ACCELERATION: .14,
        HEALTH: 25,
        SHIELD: 1,
        DAMAGE: 1.6,
        RESIST: 1,
        PENETRATION: 1,
        DENSITY: .5,
        RANGE: 150
    },
    FACING_TYPE: 'autospin',
    GUNS: [{
        POSITION: [7, 3.4, 1, 0, 0, 60, 0]
    }, {
        POSITION: [1.2, 3.4, 1.7, 7, 0, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [7, 3.4, 1, 0, 0, -60, 0]
    }, {
        POSITION: [1.2, 3.4, 1.7, 7, 0, -60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [7, 3.4, 1, 0, 0, 180, 0]
    }, {
        POSITION: [1.2, 3.4, 1.7, 7, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }, {
        POSITION: [10, 2.5, .36, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [10, 2.5, .36, 0, 0, 120, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [10, 2.5, .36, 0, 0, 240, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }],
    TURRETS: [{
        POSITION: [3.9, 0, 0, 60, 360, 1],
        TYPE: exports.blasterTurret
    }]
};
exports.triangleBossTier3GunnerTurret = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [11, 2.5, 1, 0, 8.7, 0, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [11, 2.5, 1, 0, -8.7, 0, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12.5, 2.5, 1, 0, 7.25, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12.5, 2.5, 1, 0, -7.25, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [14, 2.5, 1, 0, 5.5, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [14, 2.5, 1, 0, -5.5, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16.5, 2.4, 1, 0, 3.2, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16.5, 2.4, 1, 0, -3.2, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }]
};
exports.eliteDirector = {
    PARENT: [exports.elite],
    LABEL: "Elite Director",
    COLOR: 17,
    GUNS: (function () {
        g.eliteDirector = [4 / 3, 0, 1, .9, .8, .85, 1.2, 1, 1.15, 1, 1, 1, 1];
        const output = [];
        for (let i = 0; i < 3; i++) {
            output.push({
                POSITION: [17.2, 4.7, 2, 0, -5.3, 60 + (360 / 3 * i), 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.eliteDirector]),
                    TYPE: exports.drone,
                    MAX_CHILDREN: 2
                }
            }, {
                POSITION: [17.2, 4.7, 2, 0, 5.3, 60 + (360 / 3 * i), .5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.eliteDirector]),
                    TYPE: exports.drone,
                    MAX_CHILDREN: 2
                }
            }, {
                POSITION: [4.5, 20, -1.2, 7.5, 0, 60 + (360 / 3 * i), 0]
            }, {
                POSITION: [4.5, 10, -1.2, 7.5, 0, 60 + (360 / 3 * i), 0],
                PROPERTIES: {
                    COLOR: 18
                }
            });
        }
        return output;
    })(),
    TURRETS: [{
        POSITION: [13, 0, 0, 0, 360, 1],
        TYPE: exports.triangleBossTier3GunnerTurret
    }]
};
exports.triangleBossTier3 = {
    PARENT: [exports.miniboss],
    LABEL: 'TK-3',
    DANGER: 8,
    SHAPE: 3,
    COLOR: 2,
    SIZE: 33,
    VALUE: 500000,
    BODY: bossStats(),
    FACING_TYPE: "locksFacing",
    GUNS: [{
        POSITION: [7, 5.6, 1, 6, 9, 180, 0]
    }, {
        POSITION: [1.3, 5.6, 1.26, 13, 9, 180, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block]),
            TYPE: exports.blockTrap
        }
    }, {
        POSITION: [7, 5.6, 1, 6, -9, 180, 0]
    }, {
        POSITION: [1.3, 5.6, 1.26, 13, -9, 180, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block]),
            TYPE: exports.blockTrap
        }
    }, {
        POSITION: [3.7, 10.4, 1, 6, 0, 180, 0]
    }, {
        POSITION: [1.3, 10.4, 1.3, 9.7, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.pound]),
            TYPE: exports.blockTrap
        }
    }, {
        POSITION: [3.15, 7.03, 1, 9.3, 4, 60, 0]
    }, {
        POSITION: [1.65, 9.46, 1, 12.45, 4, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.spawner, g.factory, g.doubleSize, g.bigger, g.bigger]),
            TYPE: exports.triangleBossTier3Minion,
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            MAX_CHILDREN: 1
        }
    }, {
        POSITION: [6.05, 8.91, 1, 4.43, 4, 60, 0]
    }, {
        POSITION: [3.15, 7.03, 1, 9.3, -4, -60, 0]
    }, {
        POSITION: [1.65, 9.46, 1, 12.45, -4, -60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.spawner, g.factory, g.doubleSize, g.bigger, g.bigger]),
            TYPE: exports.triangleBossTier3Minion,
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            MAX_CHILDREN: 1
        }
    }, {
        POSITION: [6.05, 8.91, 1, 4.43, -4, -60, 0]
    }, {
        POSITION: [6.6, 1.7, 1, 7, 4, 0, 2 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.sniper]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [6.6, 1.7, 1, 7, -4, 0, 2 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.sniper]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [8.5, 1.7, 1, 7.3, 2.1, 0, 1 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.sniper]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [8.5, 1.7, 1, 7.3, -2.1, 0, 1 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.sniper]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [8.75, 2, 1, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.sniper]),
            TYPE: exports.bullet
        }
    }],
    TURRETS: [{
        POSITION: [11.6, -0.5, 0, 0, 360, 1],
        TYPE: exports.triangleBossTier3GunnerTurret
    }]
};
exports.celestial = {
    PARENT: [exports.miniboss],
    LABEL: "Celestial",
    SHAPE: 9,
    SIZE: 50,
    VARIES_IN_SIZE: false,
    VALUE: 1000000,
    BODY: bossStats({
        health: 2.5,
        speed: .75,
        fov: 1.5
    }),
    ABILITY_IMMUNE: true,
    BROADCAST_MESSAGE: "A Celestial has been defeated!"
};
exports.eternal = {
    PARENT: [exports.miniboss],
    LABEL: 'Eternal',
    BODY: bossStats({
        health: 7.5,
        speed: .1,
        regen: .05,
        shield: .1,
        fov: .8
    }),
    VALUE: 5000000,
    SIZE: 100,
    SHAPE: 11,
    ABILITY_IMMUNE: true,
    BROADCAST_MESSAGE: "An Eternal has been defeated!"
};
exports.celestialTrapTurret = {
    LABEL: 'Turret',
    INDEPENDENT: true,
    COLOR: 16,
    GUNS: [{
        POSITION: [16, 14, 1, 0, 0, 0, 0]
    }, {
        POSITION: [4, 14, 1.8, 16, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.celestialTrapTurret]),
            TYPE: exports.trap,
            STAT_CALCULATOR: gunCalcNames.trap,
            AUTOFIRE: true
        }
    }]
}
const celestialTrapTurretArray = [];
for (let i = 0; i < 9; i++) celestialTrapTurretArray.push({
    POSITION: [6, 9, 0, i * (360 / 9) + ((360 / 9) / 2), 0, 0],
    TYPE: [exports.celestialTrapTurret, {
        CONTROLLERS: ['nearestDifferentMaster']
    }]
});
exports.apolloSprayer = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [23, 7, 1, 0, 0, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.turret, g.apolloSprayer]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 10, 1.4, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.turret, g.apolloSprayer]),
            TYPE: exports.bullet
        }
    }]
};
exports.apolloSprayerBody = {
    LABEL: "Sprayer",
    SHAPE: 5,
    CONTROLLERS: ["slowSpin"],
    SKILL: setBuild("0077777000"),
    INDEPENDENT: true,
    TURRETS: (() => {
        let output = [];
        for (let i = 0; i < 5; i++) output.push({
            POSITION: [9, 8, 0, (360 / 5 * i) + (360 / 10), 135, 0],
            TYPE: exports.apolloSprayer
        });
        return output;
    })()
};
exports.apolloDroneBody = {
    LABEL: "Square",
    SHAPE: 7,
    CONTROLLERS: ["reverseSlowSpin"],
    MAX_CHILDREN: 35,
    GUNS: (() => {
        let output = [];
        for (let i = 0; i < 7; i++) output.push({
            POSITION: [4, 6.5, 1.2, 7.5, 0, ((360 / 7) * i) + (360 / 14), 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.turret]),
                TYPE: [exports.sunchip, {
                    INDEPENDENT: true,
                    BODY: {
                        FOV: 2
                    }
                }],
                AUTOFIRE: true,
                SUNC_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.necro
            }
        });
        return output;
    })()
};
exports.apolloCelestial = {
    PARENT: [exports.celestial],
    NAME: "Apollo",
    COLOR: 13,
    TURRETS: [...celestialTrapTurretArray, {
        POSITION: [15, 0, 0, 0, 360, 1],
        TYPE: [exports.apolloDroneBody, {
            COLOR: 13
        }]
    }, {
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: [exports.apolloSprayerBody, {
            COLOR: 13
        }]
    }]
};
exports.odinRifle = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [20, 10.5, 1, 0, 0, 0, 0]
    }, {
        POSITION: [24, 7, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.rifle, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }]
};
exports.odinRifleBody = {
    LABEL: "Rifle",
    SHAPE: 5,
    CONTROLLERS: ["slowSpin"],
    SKILL: setBuild("0077777000"),
    INDEPENDENT: true,
    TURRETS: (() => {
        let output = [];
        for (let i = 0; i < 5; i++) output.push({
            POSITION: [9, 8, 0, (360 / 5 * i) + (360 / 10), 135, 0],
            TYPE: exports.odinRifle
        });
        return output;
    })()
};
exports.odinDroneBody = {
    LABEL: "Triangle",
    SHAPE: 7,
    CONTROLLERS: ["reverseSlowSpin"],
    MAX_CHILDREN: 28,
    GUNS: (() => {
        let output = [];
        for (let i = 0; i < 7; i++) output.push({
            POSITION: [4, 6.5, 1.2, 7.5, 0, ((360 / 7) * i) + (360 / 14), 2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, [1, 1, 1, 1, 1.3, 1.2, 1, .8, .8, 1, 1, 1, 1.2], g.turret]),
                TYPE: [exports.drone, {
                    INDEPENDENT: true,
                    BODY: {
                        FOV: 2
                    }
                }],
                AUTOFIRE: true,
                SUNC_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.necro
            }
        });
        return output;
    })()
};
exports.odinCelestial = {
    PARENT: [exports.celestial],
    NAME: "Odin",
    COLOR: 2,
    TURRETS: [...celestialTrapTurretArray, {
        POSITION: [15, 0, 0, 0, 360, 1],
        TYPE: [exports.odinDroneBody, {
            COLOR: 2
        }]
    }, {
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: [exports.odinRifleBody, {
            COLOR: 2
        }]
    }]
};
exports.artemisTwister = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [10, 13.5, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [17, 15, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.celestialHeavyWeapon, g.oneQuartMoreDamage, g.oneQuartMoreHealth, g.turret]),
            TYPE: exports.twisterMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }, {
        POSITION: [7.5, 15, -1.175, 4.5, 0, 0, 0]
    }]
};
exports.artemisTwisterBody = {
    LABEL: "Twister",
    SHAPE: 5,
    CONTROLLERS: ["slowSpin"],
    SKILL: setBuild("0077777000"),
    INDEPENDENT: true,
    TURRETS: (() => {
        let output = [];
        for (let i = 0; i < 5; i++) output.push({
            POSITION: [9, 8, 0, (360 / 5 * i) + (360 / 10), 135, 0],
            TYPE: exports.artemisTwister
        });
        return output;
    })()
};
exports.pentagonDrone = {
    PARENT: [exports.drone],
    LABEL: "Pentagon",
    INDEPENDENT: true,
    SHAPE: 5
};
exports.artemisDroneBody = {
    LABEL: "Pentagon",
    SHAPE: 7,
    CONTROLLERS: ["reverseSlowSpin"],
    MAX_CHILDREN: 21,
    GUNS: (() => {
        let output = [];
        for (let i = 0; i < 7; i++) output.push({
            POSITION: [4, 6.5, 1.2, 7.5, 0, ((360 / 7) * i) + (360 / 14), 2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, [2, 1, 1, 1, 4, 2, 1, .4, .4, 1, 1, 1.5, 2], g.turret]),
                TYPE: [exports.pentagonDrone, {
                    INDEPENDENT: true,
                    BODY: {
                        FOV: 2
                    }
                }],
                AUTOFIRE: true,
                SUNC_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.necro
            }
        });
        return output;
    })()
};
exports.artemisCelestial = {
    PARENT: [exports.celestial],
    NAME: "Artemis",
    COLOR: 14,
    TURRETS: [...celestialTrapTurretArray, {
        POSITION: [15, 0, 0, 0, 360, 1],
        TYPE: [exports.artemisDroneBody, {
            COLOR: 14
        }]
    }, {
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: [exports.artemisTwisterBody, {
            COLOR: 14
        }]
    }]
};
exports.demeterSwarmer = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [17, 13, -1.2, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.hive, g.swarmer, g.celestialHeavyWeapon, g.demeterSwarmer, g.turret]),
            TYPE: exports.hive
        }
    }, {
        POSITION: [14, 11, 1, 5, 0, 0, 0]
    }]
};
exports.demeterSwarmerBody = {
    LABEL: "Swarmer",
    SHAPE: 5,
    CONTROLLERS: ["slowSpin"],
    SKILL: setBuild("0077777000"),
    INDEPENDENT: true,
    TURRETS: (() => {
        let output = [];
        for (let i = 0; i < 5; i++) output.push({
            POSITION: [9, 8, 0, (360 / 5 * i) + (360 / 10), 135, 0],
            TYPE: exports.demeterSwarmer
        });
        return output;
    })()
};
exports.demeterSwarmBody = {
    LABEL: "Base",
    SHAPE: 7,
    CONTROLLERS: ["reverseSlowSpin"],
    GUNS: (() => {
        let output = [];
        for (let i = 0; i < 7; i++) output.push({
            POSITION: [4.5, 2, 0.75, 7.5, -1.5, ((360 / 7) * i) + (360 / 14), 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.demeterSwarm, g.turret]),
                TYPE: [exports.swarm, {
                    INDEPENDENT: true
                }],
                AUTOFIRE: true,
                SUNC_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.swarm
            }
        }, {
            POSITION: [4.5, 2, 0.75, 7.5, 1.5, ((360 / 7) * i) + (360 / 14), 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.demeterSwarm, g.turret]),
                TYPE: [exports.swarm, {
                    INDEPENDENT: true
                }],
                AUTOFIRE: true,
                SUNC_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.swarm
            }
        }, {
            POSITION: [6, 2, 0.75, 7.5, 0, ((360 / 7) * i) + (360 / 14), 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.demeterSwarm, g.turret]),
                TYPE: [exports.swarm, {
                    INDEPENDENT: true
                }],
                AUTOFIRE: true,
                SUNC_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.swarm
            }
        });
        return output;
    })()
};
exports.demeterCelestial = {
    PARENT: [exports.celestial],
    NAME: "Demeter",
    COLOR: 1,
    TURRETS: [...celestialTrapTurretArray, {
        POSITION: [15, 0, 0, 0, 360, 1],
        TYPE: [exports.demeterSwarmBody, {
            COLOR: 1
        }]
    }, {
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: [exports.demeterSwarmerBody, {
            COLOR: 1
        }]
    }]
};
exports.athenaQuint = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [16, 10, 1, 0, -5, 0, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.quint, g.athenaQuint, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 10, 1, 0, 5, 0, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.quint, g.athenaQuint, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 10, 1, 0, -3, 0, .333],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.quint, g.athenaQuint, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 10, 1, 0, 3, 0, .333],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.quint, g.athenaQuint, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [22, 10, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.quint, g.athenaQuint, g.turret]),
            TYPE: exports.bullet
        }
    }]
};
exports.athenaQuintBody = {
    LABEL: "Quintuplet",
    SHAPE: 5,
    CONTROLLERS: ["slowSpin"],
    SKILL: setBuild("0077777000"),
    INDEPENDENT: true,
    TURRETS: (() => {
        let output = [];
        for (let i = 0; i < 5; i++) output.push({
            POSITION: [9, 8, 0, (360 / 5 * i) + (360 / 10), 135, 0],
            TYPE: exports.athenaQuint
        });
        return output;
    })()
};
exports.athenaCrasherBody = {
    LABEL: "Crasher",
    SHAPE: 7,
    CONTROLLERS: ["reverseSlowSpin"],
    MAX_CHILDREN: 7,
    GUNS: (() => {
        let output = [];
        for (let i = 0; i < 7; i++) output.push({
            POSITION: [4, 6.5, 1.2, 7.5, 0, ((360 / 7) * i) + (360 / 14), 2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.athenaCrasher, g.turret]),
                TYPE: [exports.drone, {
                    INDEPENDENT: true,
                    BODY: {
                        FOV: 3
                    }
                }],
                AUTOFIRE: true,
                SUNC_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.necro
            }
        });
        return output;
    })()
};
exports.athenaCelestial = {
    PARENT: [exports.celestial],
    NAME: "Athena",
    COLOR: 5,
    TURRETS: [...celestialTrapTurretArray, {
        POSITION: [15, 0, 0, 0, 360, 1],
        TYPE: [exports.athenaCrasherBody, {
            COLOR: 5
        }]
    }, {
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: [exports.athenaQuintBody, {
            COLOR: 5
        }]
    }]
};
exports.arestrapswarmer = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [12, 13, -1.2, 5, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, [1.25, 1, 1, .8, .8, .8, .8, 1.1, 1.1, 1.1, 1, 1, 1.1], g.celestialHeavyWeapon, g.oneQuartMoreReload, g.turret]),
            TYPE: exports.trapHive
        }
    }, {
        POSITION: [13, 11, .8, 5, 0, 0, 0]
    }]
};
exports.arestrapswarmerBody = {
    LABEL: "Trap Swarmer",
    SHAPE: 5,
    CONTROLLERS: ["slowSpin"],
    SKILL: setBuild("0077777000"),
    INDEPENDENT: true,
    TURRETS: (() => {
        let output = [];
        for (let i = 0; i < 5; i++) output.push({
            POSITION: [9, 8, 0, (360 / 5 * i) + (360 / 10), 135, 0],
            TYPE: exports.arestrapswarmer
        });
        return output;
    })()
};
exports.aresSwarm = {
    PARENT: [exports.swarm],
    SHAPE: 7,
    FACING_TYPE: "autospin",
    LABEL: "Spite"
};
exports.aresSwarmTurret = makeSwarmSpawner(combineStats([g.swarm, g.aresSwarm, g.turret]), exports.aresSwarm, 18);
exports.aresDroneBody = {
    LABEL: "Egg",
    SHAPE: 7,
    CONTROLLERS: ["reverseSlowSpin"],
    SKILL: setBuild("0077777000"),
    INDEPENDENT: true,
    TURRETS: (() => {
        let output = [];
        for (let i = 0; i < 7; i++) output.push({
            POSITION: [8, 8, 0, (360 / 7 * i) + (360 / 17), 135, 0],
            TYPE: exports.aresSwarmTurret
        });
        return output;
    })()
};
exports.aresCelestial = {
    PARENT: [exports.celestial],
    NAME: "Ares",
    COLOR: 9,
    TURRETS: [...celestialTrapTurretArray, {
        POSITION: [15, 0, 0, 0, 360, 1],
        TYPE: [exports.aresDroneBody, {
            COLOR: 9
        }]
    }, {
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: [exports.arestrapswarmerBody, {
            COLOR: 9
        }]
    }]
};
exports.lokiArtilleryBody = {
    LABEL: "Artillery",
    SHAPE: 5,
    CONTROLLERS: ["slowSpin"],
    SKILL: setBuild("0077777000"),
    INDEPENDENT: true,
    TURRETS: (() => {
        let output = [];
        for (let i = 0; i < 5; i++) output.push({
            POSITION: [9, 8, 0, (360 / 5 * i) + (360 / 10), 135, 0],
            TYPE: exports.lokiArtillery
        });
        return output;
    })()
};
exports.lokiDrone = {
    PARENT: [exports.drone],
    SHAPE: 6
};
exports.lokiDroneBody = {
    LABEL: "Gem",
    SHAPE: 7,
    CONTROLLERS: ["reverseSlowSpin", 'nearestDifferentMaster'],
    MAX_CHILDREN: 21,
    INDEPENDENT: true,
    GUNS: (() => {
        let output = [];
        for (let i = 0; i < 7; i++) output.push({
            POSITION: [4.5, 7.5, 1.2, 7.5, 0, ((360 / 7) * i) + (360 / 14), 2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, [3, 1, 1, 1, 6, 3, 1, .2, .2, 1, 2, 1, 4], g.turret]),
                TYPE: [exports.lokiDrone, {
                    INDEPENDENT: true,
                    BODY: {
                        FOV: 2
                    }
                }],
                AUTOFIRE: true,
                SYNC_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.drone
            }
        });
        return output;
    })()
};
exports.lokiCelestial = {
    PARENT: [exports.celestial],
    NAME: "Loki",
    COLOR: 0,
    TURRETS: [...celestialTrapTurretArray, {
        POSITION: [15, 0, 0, 0, 360, 1],
        TYPE: [exports.lokiDroneBody, {
            COLOR: 0
        }]
    }, {
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: [exports.lokiArtilleryBody, {
            COLOR: 0
        }]
    }]
};
exports.rheaPromenader = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [3, 13, 1.5, 13, 0, 0, 0]
    }, {
        POSITION: [9, 12, -.5, 9, 0, 0, 0]
    }, {
        POSITION: [16, 13, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.promenader, g.celestialHeavyWeapon, g.turret]),
            TYPE: exports.promenaderMissile,
            STAT_CALCULATOR: gunCalcNames.sustained
        }
    }]
};
exports.rheaPromenaderBody = {
    LABEL: "Promenader",
    SHAPE: 5,
    CONTROLLERS: ["slowSpin"],
    SKILL: setBuild("0077777000"),
    INDEPENDENT: true,
    TURRETS: (() => {
        let output = [];
        for (let i = 0; i < 5; i++) output.push({
            POSITION: [9, 8, 0, (360 / 5 * i) + (360 / 10), 135, 0],
            TYPE: exports.rheaPromenader
        });
        return output;
    })()
};
exports.rheaMinionBody = {
    LABEL: "Base",
    SHAPE: 7,
    CONTROLLERS: ["reverseSlowSpin", 'nearestDifferentMaster'],
    MAX_CHILDREN: 14,
    INDEPENDENT: true,
    GUNS: (() => {
        let output = [];
        for (let i = 0; i < 7; i++) output.push({
            POSITION: [3.75, 7.5, .75, 7.5, 0, ((360 / 7) * i) + (360 / 14), 2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.rheaMinion, g.turret]),
                TYPE: [exports.minion, {
                    INDEPENDENT: true,
                    BODY: {
                        FOV: 2.25
                    }
                }],
                AUTOFIRE: true,
                SYNC_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.drone
            }
        });
        return output;
    })()
};
exports.rheaCelestial = {
    PARENT: [exports.celestial],
    NAME: "Rhea",
    COLOR: 8,
    TURRETS: [...celestialTrapTurretArray, {
        POSITION: [15, 0, 0, 0, 360, 1],
        TYPE: [exports.rheaMinionBody, {
            COLOR: 8
        }]
    }, {
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: [exports.rheaPromenaderBody, {
            COLOR: 8
        }]
    }]
};
exports.hadesRocketeer = createTurret(exports.rocketeer, [g.celestialHeavyWeapon]);
exports.hadesRocketeerBody = {
    LABEL: "Rocketeer",
    SHAPE: 5,
    CONTROLLERS: ["slowSpin"],
    SKILL: setBuild("0077777000"),
    INDEPENDENT: true,
    TURRETS: (() => {
        let output = [];
        for (let i = 0; i < 5; i++) output.push({
            POSITION: [9, 8, 0, (360 / 5 * i) + (360 / 10), 135, 0],
            TYPE: exports.hadesRocketeer
        });
        return output;
    })()
};
exports.hadesDroneBody = {
    LABEL: "Body",
    SHAPE: 7,
    CONTROLLERS: ["reverseSlowSpin"],
    MAX_CHILDREN: 21,
    GUNS: (() => {
        let output = [];
        for (let i = 0; i < 7; i++) output.push({
            POSITION: [4, 6.5, 1.2, 7.5, 0, ((360 / 7) * i) + (360 / 14), 0]
        }, {
            POSITION: [2, 6.5 * 1.2, 1.2, 11.5, 0, ((360 / 7) * i) + (360 / 14), 1 + i / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.navyist, [1, 0, 1, .5, 1.2, 1.2, 1, 1.2, 1.2, 1, 1, 1, 1], g.turret]),
                TYPE: [exports.navyistdrone, {
                    INDEPENDENT: true,
                    BODY: {
                        FOV: 2
                    }
                }],
                AUTOFIRE: true,
                SUNC_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.necro
            }
        });
        return output;
    })()
};
exports.hadesCelestial = {
    PARENT: [exports.celestial],
    NAME: "Hades",
    COLOR: 21,
    TURRETS: [...celestialTrapTurretArray, {
        POSITION: [15, 0, 0, 0, 360, 1],
        TYPE: [exports.hadesDroneBody, {
            COLOR: 21
        }]
    }, {
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: [exports.hadesRocketeerBody, {
            COLOR: 21
        }]
    }]
};
exports.pontusScrewPunt = createTurret(exports.screwPunt, [[1, 0, .5, 1, 1.2, 1.2, 1.5, 1.1, 1, 1, 1, .5, 1]]);
exports.pontusScrewPuntBody = {
    LABEL: "Screw Punt",
    SHAPE: 5,
    CONTROLLERS: ["slowSpin"],
    SKILL: setBuild("0077777000"),
    INDEPENDENT: true,
    TURRETS: (() => {
        let output = [];
        for (let i = 0; i < 5; i++) output.push({
            POSITION: [9, 8, 0, (360 / 5 * i) + (360 / 10), 135, 0],
            TYPE: exports.pontusScrewPunt
        });
        return output;
    })()
};
exports.pontusDrone = {
    PARENT: [exports.drone],
    GUNS: (function() {
        const output = [];
        for (let i = 0; i < 6; i ++) {
            output.push({
                POSITION: [1, 7.5, 1, 0, 0, 360 / 6 * i, Infinity],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.bullet, g.minion, g.weak, g.flank]),
                    TYPE: [exports.bulletLayer6, {
                        PERSISTS_AFTER_DEATH: true
                    }],
                    SHOOT_ON_DEATH: true,
                    AUTOFIRE: true
                }
            });
        }
        return output;
    })()
}
exports.pontusDroneBody = {
    LABEL: "Body",
    SHAPE: 7,
    CONTROLLERS: ["reverseSlowSpin"],
    MAX_CHILDREN: 21,
    GUNS: (() => {
        let output = [];
        for (let i = 0; i < 7; i++) output.push({
            POSITION: [4, 6.5, 1.2, 7.5, 0, ((360 / 7) * i) + (360 / 14), 1 + i / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.turret]),
                TYPE: [exports.pontusDrone, {
                    INDEPENDENT: true,
                    BODY: {
                        FOV: 2
                    }
                }],
                AUTOFIRE: true,
                SUNC_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.necro
            }
        });
        return output;
    })()
};
exports.pontusCelestial = {
    PARENT: [exports.celestial],
    NAME: "Pontus",
    COLOR: 4,
    TURRETS: [...celestialTrapTurretArray, {
        POSITION: [15, 0, 0, 0, 360, 1],
        TYPE: [exports.pontusDroneBody, {
            COLOR: 4
        }]
    }, {
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: [exports.pontusScrewPuntBody, {
            COLOR: 4
        }]
    }]
};
exports.oceanusCelestial = (() => {
    // here for balancing
    g.oceanusHive = [2, 1, 1, .85, 2, 2, 1, .8, 1.2, .9, 1, 1, 2];
    g.oceanusCarrier = [2, 1, 1, 1, 1.1, 1.2, 1.1, 1.3, 1.25, .9, 1, 1, 1];
    g.oceanusNailgun = [2, 1, 1, 1, 1.2, 1.2, 1.4, 1.5, 1, 1.2, 1, 1, 1];
    const color = 135;
    /*(() => {
            let output = [];
            for (let i = 135; i < 155; i ++) output.push(i);
            return output.join(", ");
        })();*/
    exports.oceanusMiniSwarmer = createTurret(exports.miniswarmer, [g.oceanusHive]);
    exports.oceanusMiniSwarmerBody = {
        LABEL: "Mini Swarmer",
        SHAPE: 9,
        COLOR: color,
        SKILL: setBuild("0077777000"),
        CONTROLLERS: ['reverseSlowSpin'],
        TURRETS: (() => {
            let output = [];
            for (let i = 0; i < 9; i++) output.push({
                POSITION: [6.5, 9, 0, (360 / 9 * i) + (360 / 18), 90, 0],
                TYPE: exports.oceanusMiniSwarmer
            });
            return output;
        })()
    };
    exports.oceanusCarrier = createTurret(exports.carrier, [g.oceanusCarrier]);
    exports.oceanusCarrierBody = {
        LABEL: "Carrier",
        SHAPE: 5,
        COLOR: color,
        SKILL: setBuild("0077777000"),
        CONTROLLERS: ['reverseSlowSpin'],
        TURRETS: (() => {
            let output = [];
            for (let i = 0; i < 7; i++) output.push({
                POSITION: [8, 9, 0, (360 / 5 * i) + (360 / 10), 90, 0],
                TYPE: exports.oceanusCarrier
            });
            return output;
        })()
    };
    exports.oceanusNailgun = createTurret(exports.nailgun, [g.oceanusNailgun]);
    exports.oceanusNailgunBody = {
        LABEL: "Nailgun",
        SHAPE: 7,
        COLOR: color,
        SKILL: setBuild("0077777000"),
        CONTROLLERS: ['slowSpin'],
        TURRETS: (() => {
            let output = [];
            for (let i = 0; i < 7; i++) output.push({
                POSITION: [8, 9, 0, (360 / 7 * i) + (360 / 14), 90, 0],
                TYPE: exports.oceanusNailgun
            });
            return output;
        })()
    };
    return {
        PARENT: [exports.eternal],
        NAME: 'Oceanus',
        COLOR: color,
        DANGER: 100,
        TURRETS: (() => {
            let output = [{
                POSITION: [16, 0, 0, 0, 360, 1],
                TYPE: exports.oceanusMiniSwarmerBody
            }, {
                POSITION: [9.6, 0, 0, 0, 360, 1],
                TYPE: exports.oceanusNailgunBody
            }, {
                POSITION: [5.76, 0, 0, 0, 360, 1],
                TYPE: exports.oceanusCarrierBody
            }];
            for (let i = 0; i < 11; i++) output.push({
                POSITION: [5.5, 9.5, 0, (360 / 11 * i) + (360 / 22), 0, 0],
                TYPE: exports.celestialTrapTurret
            });
            return output;
        })()
    };
})();
exports.raCelestial = (() => {
    g.raDrone = [2, 1, 1, 1.5, 5, 3, 1, .25, .25, 1, 1, 1, 2];
    g.raOmegaOscillator = [2, .5, .1, 1, 1, 1, 1.5, 1.5, 1.5, 2, 2, .1, 2];
    g.raBee = [1.75, 1, 1, 1, .5, 1.2, 1.1, 1.5, 1.25, .5, 1, 1, 1];
    g.raMissileThruster = [.6, 2, 3, .6, 1, 1, 1, .5, .2, .4, 1, 2, 1];
    g.raMissileTurret = [5, 1, 1, .875, 4, 1, 1, 1, 1, 1.5, 1, 1, 2];
    exports.raDrone = {
        PARENT: [exports.drone],
        SHAPE: 7,
        HITS_OWN_TYPE: 'hard'
    };
    exports.raDroneBody = {
        LABEL: "Heptagon",
        SHAPE: 9,
        COLOR: 35,
        MAX_CHILDREN: 14,
        CONTROLLERS: ['reverseSlowSpin'],
        GUNS: (() => {
            let output = [];
            for (let i = 0; i < 9; i++) output.push({
                POSITION: [3.5, 4.5, 1.2, 7.5, 0, ((360 / 9) * i) + (360 / 18), 2],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.raDrone]),
                    TYPE: [exports.raDrone, {
                        INDEPENDENT: true,
                        BODY: {
                            FOV: 2
                        }
                    }],
                    AUTOFIRE: true,
                    SUNC_SKILLS: true,
                    STAT_CALCULATOR: gunCalcNames.drone
                }
            });
            return output;
        })()
    };
    exports.raMissile = {
        PARENT: [exports.skimmerMissile],
        GUNS: [{
            POSITION: [7, 9.5, .6, 7, 0, -20, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.raBee]),
                TYPE: [exports.bee, {
                    INDEPENDENT: true
                }],
                AUTOFIRE: true
            }
        }, {
            POSITION: [7, 9.5, .6, 7, 0, 20, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.raBee]),
                TYPE: [exports.bee, {
                    INDEPENDENT: true
                }],
                AUTOFIRE: true
            }
        }, {
            POSITION: [10, 9.5, .6, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.raBee]),
                TYPE: [exports.bee, {
                    INDEPENDENT: true
                }],
                AUTOFIRE: true
            }
        }, {
            POSITION: [15, 12, .6, 3, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.raMissileThruster]),
                TYPE: [exports.bullet, {
                    PERSISTS_AFTER_DEATH: true
                }],
                AUTOFIRE: true
            }
        }]
    };
    exports.raMissileTurret = {
        SYNC_TURRET_SKILLS: true,
        LABEL: "Turret",
        DANGER: 6,
        INDEPENDENT: true,
        CONTROLLERS: ['nearestDifferentMaster'],
        BODY: {
            FOV: 10
        },
        GUNS: [{
            POSITION: [12, 14, -0.5, 9, 0, 0, 0]
        }, {
            POSITION: [10, 14, -0.5, 9, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.raMissileTurret, g.turret]),
                TYPE: exports.raMissile
            }
        }, {
            POSITION: [17, 15, 1, 0, 0, 0, 0]
        }]
    };
    exports.raMissileBody = {
        LABEL: "Sun Spear",
        SHAPE: 7,
        COLOR: 35,
        SKILL: setBuild("0077777000"),
        CONTROLLERS: ['slowSpin'],
        TURRETS: (() => {
            let output = [];
            for (let i = 0; i < 7; i++) output.push({
                POSITION: [8, 9, 0, (360 / 7 * i) + (360 / 14), 90, 0],
                TYPE: exports.raMissileTurret
            });
            return output;
        })()
    };
    exports.raOmegaOscillator = {
        SYNC_TURRET_SKILLS: true,
        LABEL: "Turret",
        DANGER: 6,
        INDEPENDENT: true,
        CONTROLLERS: ['nearestDifferentMaster'],
        BODY: {
            FOV: 10
        },
        GUNS: [{
            POSITION: [5, 8, 1.5, 20, 0, 0, 0]
        }, {
            POSITION: [5, 8, 1.5, 15, 0, 0, 0]
        }, {
            POSITION: [5, 8, 1.5, 10, 0, 0, 0]
        }, {
            POSITION: [5, 8, 1.5, 5, 0, 0, 0]
        }, {
            POSITION: [30, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.raOmegaOscillator]),
                TYPE: exports.bullet
            }
        }, {
            POSITION: [17.5, 6, .75, 0, 0, 0, 0],
            PROPERTIES: {
                COLOR: 35
            }
        }, {
            POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0]
        }]
    };
    exports.raOmegaOscillatorBody = {
        LABEL: "Omega Oscillator",
        SHAPE: 5,
        COLOR: 35,
        SKILL: setBuild("0077777000"),
        CONTROLLERS: ['reverseSlowSpin'],
        TURRETS: (() => {
            let output = [];
            for (let i = 0; i < 5; i++) output.push({
                POSITION: [8, 9, 0, (360 / 5 * i) + (360 / 10), 90, 0],
                TYPE: exports.raOmegaOscillator
            });
            return output;
        })()
    };
    return {
        PARENT: [exports.eternal],
        NAME: 'Ra',
        COLOR: 35,
        DANGER: 100,
        TURRETS: (() => {
            let output = [{
                POSITION: [16, 0, 0, 0, 360, 1],
                TYPE: exports.raDroneBody
            }, {
                POSITION: [9.6, 0, 0, 0, 360, 1],
                TYPE: exports.raMissileBody
            }, {
                POSITION: [5.76, 0, 0, 0, 360, 1],
                TYPE: exports.raOmegaOscillatorBody
            }];
            for (let i = 0; i < 11; i++) output.push({
                POSITION: [5.5, 9.5, 0, (360 / 11 * i) + (360 / 22), 0, 0],
                TYPE: exports.celestialTrapTurret
            });
            return output;
        })()
    };
})();
exports.thorCelestial = (() => {
    let color = 130;
    g.thorDual = [4, 1, 1, 1, 2, 2, 2, 1.2, 1.1, .975, 1, 1, 1.1];
    g.thorMissileTrail = [1.25, 2, 1, 1, 1.5, 1.5, 1.5, .5, .5, 1, 1, 1, 1];
    g.thorMissileSwarm = [2.5, 2, 1, 1, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1, 1, 1];
    g.thorHyperskimmer = [5.75, 1, 1, .75, 5, 2, 1, .6, .75, 1.2, 1, 1, 1];
    g.thorMinion = [2, 1, 1, 1, 2, .7, 1, .5, .5, 1, 1.1, 1, 2];
    exports.thorDual = {
        PARENT: [exports.turretParent],
        GUNS: [{
            POSITION: [18, 7, 1, 0, 5.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.dual, g.thorDual, g.turret]),
                TYPE: exports.bullet,
                LABEL: "Small"
            }
        }, {
            POSITION: [18, 7, 1, 0, -5.5, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.dual, g.thorDual, g.turret]),
                TYPE: exports.bullet,
                LABEL: "Small"
            }
        }, {
            POSITION: [16, 8.5, 1, 0, 5.5, 0, .25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.dual, g.thorDual, g.turret]),
                TYPE: exports.bullet
            }
        }, {
            POSITION: [16, 8.5, 1, 0, -5.5, 0, .75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.dual, g.thorDual, g.turret]),
                TYPE: exports.bullet
            }
        }]
    };
    exports.thorDualBody = {
        LABEL: "Dual",
        SHAPE: 9,
        COLOR: color,
        SKILL: setBuild("0077777000"),
        CONTROLLERS: ['reverseSlowSpin'],
        TURRETS: (() => {
            let output = [];
            for (let i = 0; i < 9; i++) output.push({
                POSITION: [6.5, 9, 0, (360 / 9 * i) + (360 / 18), 90, 0],
                TYPE: exports.thorDual
            });
            return output;
        })()
    };
    exports.thorHypermissile = {
        PARENT: [exports.skimmerMissile],
        GUNS: [{
            POSITION: [14, 6, 0.75, 0, -2, 150, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.swarm, g.thorMissileSwarm]),
                TYPE: [exports.swarm, {
                    PERSISTS_AFTER_DEATH: true
                }],
                STAT_CALCULATOR: gunCalcNames.thruster
            }
        }, {
            POSITION: [14, 6, 0.75, 0, 2, 210, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.swarm, g.thorMissileSwarm]),
                TYPE: [exports.swarm, {
                    PERSISTS_AFTER_DEATH: true
                }],
                STAT_CALCULATOR: gunCalcNames.thruster
            }
        }, {
            POSITION: [14, 6, 1.25, 0, -2, 90, .5],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.bullet, g.thorMissileTrail]),
                TYPE: [exports.bullet, {
                    PERSISTS_AFTER_DEATH: true
                }]
            }
        }, {
            POSITION: [14, 6, 1.25, 0, 2, 270, .5],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.bullet, g.thorMissileTrail]),
                TYPE: [exports.bullet, {
                    PERSISTS_AFTER_DEATH: true
                }]
            }
        }]
    };
    exports.thorHyperskimmer = {
        PARENT: [exports.turretParent],
        GUNS: [{
            POSITION: [10, 17, -.5, 9, 0, 0, 0]
        }, {
            POSITION: [17, 18, 1.25, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.thorHyperskimmer, g.turret]),
                TYPE: exports.thorHypermissile,
                STAT_CALCULATOR: gunCalcNames.sustained
            }
        }]
    };
    exports.thorHyperskimmerBody = {
        LABEL: "Hyperskimmer",
        SHAPE: 7,
        COLOR: color,
        SKILL: setBuild("0077777000"),
        CONTROLLERS: ['slowSpin'],
        TURRETS: (() => {
            let output = [];
            for (let i = 0; i < 7; i++) output.push({
                POSITION: [8, 9, 0, (360 / 7 * i) + (360 / 14), 90, 0],
                TYPE: exports.thorHyperskimmer
            });
            return output;
        })()
    };
    exports.thorSpawner = {
        PARENT: [exports.turretParent],
        GUNS: [{
            POSITION: [4.5, 10, 1, 10.5, 0, 0, 0]
        }, {
            POSITION: [1, 12, 1, 15, 0, 0, 2],
            PROPERTIES: {
                MAX_CHILDREN: 2,
                SHOOT_SETTINGS: combineStats([g.spawner, g.thorMinion, g.turret]),
                TYPE: [exports.minion, {
                    INDEPENDENT: true,
                    BODY: {
                        FOV: 3
                    }
                }],
                STAT_CALCULATOR: gunCalcNames.drone,
                AUTOFIRE: true,
                SYNCS_SKILLS: true
            }
        }, {
            POSITION: [3.5, 12, 1, 8, 0, 0, 0]
        }]
    };
    exports.thorSpawnerBody = {
        LABEL: "Spawner",
        SHAPE: 5,
        COLOR: color,
        SKILL: setBuild("0077777000"),
        CONTROLLERS: ['reverseSlowSpin'],
        TURRETS: (() => {
            let output = [];
            for (let i = 0; i < 5; i++) output.push({
                POSITION: [8, 9, 0, (360 / 5 * i) + (360 / 10), 90, 0],
                TYPE: exports.thorSpawner
            });
            return output;
        })()
    };
    return {
        PARENT: [exports.eternal],
        NAME: 'Thor',
        COLOR: color,
        DANGER: 100,
        TURRETS: (() => {
            let output = [{
                POSITION: [16, 0, 0, 0, 360, 1],
                TYPE: exports.thorDualBody
            }, {
                POSITION: [9.6, 0, 0, 0, 360, 1],
                TYPE: exports.thorHyperskimmerBody
            }, {
                POSITION: [5.76, 0, 0, 0, 360, 1],
                TYPE: exports.thorSpawnerBody
            }];
            for (let i = 0; i < 11; i++) output.push({
                POSITION: [5.5, 9.5, 0, (360 / 11 * i) + (360 / 22), 0, 0],
                TYPE: exports.celestialTrapTurret
            });
            return output;
        })()
    };
})();
exports.nyxCelestial = (() => {
    exports.nyxDrone = {
        PARENT: [exports.drone],
        SHAPE: 9,
        HITS_OWN_TYPE: 'hard'
    };
    exports.nyxDroneBody = {
        LABEL: "Nonagon",
        SHAPE: 9,
        COLOR: 162,
        MAX_CHILDREN: 14,
        CONTROLLERS: ['reverseSlowSpin'],
        GUNS: (() => {
            let output = [];
            for (let i = 0; i < 9; i++) output.push({
                POSITION: [3.5, 4.5, 1.2, 7.5, 0, ((360 / 9) * i) + (360 / 18), 2],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, [4, 0, 1, 1, 4, 2, 1, .2, .2, 1, 1, 1, 1]]),
                    TYPE: [exports.raDrone, {
                        INDEPENDENT: true,
                        BODY: {
                            FOV: 2
                        }
                    }],
                    AUTOFIRE: true,
                    SUNC_SKILLS: true,
                    STAT_CALCULATOR: gunCalcNames.drone
                }
            });
            return output;
        })()
    };
    exports.nyxShrapnel = createTurret(exports.shrapnel, [[1, 0, .5, 1, 2, 1.5, 1, 1.5, .7, 1.2, 1, 1, 1]]);
    exports.nyxScaler = createTurret(exports.scaler, [g.doubleReload]);
    exports.nyxShrapnel.BODY = exports.nyxScaler.BODY = {
        FOV: 4
    };
    exports.nyxShrapnelBody = {
        LABEL: "Shrapnel",
        SHAPE: 7,
        COLOR: 162,
        SKILL: setBuild("0077777000"),
        CONTROLLERS: ['slowSpin'],
        TURRETS: (() => {
            let output = [];
            for (let i = 0; i < 7; i++) output.push({
                POSITION: [6.5, 9, 0, (360 / 7 * i) + (360 / 14), 90, 0],
                TYPE: exports.nyxShrapnel
            });
            return output;
        })()
    };
    exports.nyxScalerBody = {
        LABEL: "Scaler",
        SHAPE: 5,
        COLOR: 162,
        SKILL: setBuild("0077777000"),
        CONTROLLERS: ['reverseSlowSpin'],
        TURRETS: (() => {
            let output = [];
            for (let i = 0; i < 5; i++) output.push({
                POSITION: [6.5, 9, 0, (360 / 5 * i) + (360 / 10), 90, 0],
                TYPE: exports.nyxScaler
            });
            return output;
        })()
    };
    return {
        PARENT: [exports.eternal],
        NAME: 'Nyx',
        COLOR: 162,
        DANGER: 100,
        TURRETS: (() => {
            let output = [{
                POSITION: [16, 0, 0, 0, 360, 1],
                TYPE: exports.nyxDroneBody
            }, {
                POSITION: [9.6, 0, 0, 0, 360, 1],
                TYPE: exports.nyxShrapnelBody
            }, {
                POSITION: [5.76, 0, 0, 0, 360, 1],
                TYPE: exports.nyxScalerBody
            }];
            for (let i = 0; i < 11; i++) output.push({
                POSITION: [5.5, 9.5, 0, (360 / 11 * i) + (360 / 22), 0, 0],
                TYPE: exports.celestialTrapTurret
            });
            return output;
        })()
    };
})();
exports.sanctuary = {
    PARENT: [exports.genericTank],
    SIZE: 30,
    DANGER: 8,
    BODY: {
        HEALTH: base.HEALTH * 30,
        PUSHABILITY: 3
    },
    MAX_CHILDREN: 30,
    VALUE: 3e5,
    FACING_TYPE: "autospin",
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
};
exports.eggSanctuary = {
    PARENT: [exports.sanctuary],
    LABEL: "Egg Sanctuary",
    COLOR: 6,
    GUNS: [{
        POSITION: [6, 12, 1.2, 6.5, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
                [3, 0.8, 2, 0.6, 0.1, 0.1, 0.25, 1, 1, 1, 1, 1, 1]
            ]),
            TYPE: [exports.egg, {
                BODY: {
                    ACCELERATION: 0.01
                }
            }],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone
        }
    }],
    BROADCAST_MESSAGE: "An egg sanctuary has been defeated...",
    SPAWN_ON_DEATH: "eggPrinceTier1"
};
exports.squareSanctuary = {
    PARENT: [exports.sanctuary],
    NAME: '',
    LABEL: "Square Sanctuary",
    COLOR: 13,
    SHAPE: 4,
    GUNS: [{
        POSITION: [5, 12, 1.2, 8, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
                [3, 0.8, 2, 0.6, 0.1, 0.1, 0.25, 1, 1, 1, 1, 1, 1]
            ]),
            TYPE: [exports.square, {
                BODY: {
                    ACCELERATION: 0.0075
                }
            }],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro
        }
    }, {
        POSITION: [5, 12, 1.2, 8, 0, 270, 0.5,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
                [3, 0.8, 2, 0.6, 0.1, 0.1, 0.25, 1, 1, 1, 1, 1, 1]
            ]),
            TYPE: [exports.square, {
                BODY: {
                    ACCELERATION: 0.0075
                }
            }],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro
        }
    }, {
        POSITION: [5, 12, 1.2, 8, 0, 0, 0.25,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
                [3, 0.8, 2, 0.6, 0.1, 0.1, 0.25, 1, 1, 1, 1, 1, 1]
            ]),
            TYPE: [exports.square, {
                BODY: {
                    ACCELERATION: 0.0075
                }
            }],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro
        }
    }, {
        POSITION: [5, 12, 1.2, 8, 0, 180, 0.75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
                [3, 0.8, 2, 0.6, 0.1, 0.1, 0.25, 1, 1, 1, 1, 1, 1]
            ]),
            TYPE: [exports.square, {
                BODY: {
                    ACCELERATION: 0.0075
                }
            }],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro
        }
    }],
    BROADCAST_MESSAGE: "A square sanctuary has been defeated...",
    SPAWN_ON_DEATH: "summoner"
};
exports.triangleSanctuary = {
    PARENT: [exports.sanctuary],
    LABEL: "Triangle Sanctuary",
    COLOR: 2,
    SHAPE: 3,
    GUNS: [{
        POSITION: [5, 12, 1.2, 8, 0, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
                [3, 0.8, 2, 0.6, 0.1, 0.1, 0.25, 1, 1, 1, 1, 1, 1]
            ]),
            TYPE: [exports.triangle, {
                BODY: {
                    ACCELERATION: 0.005
                }
            }],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro
        }
    }, {
        POSITION: [5, 12, 1.2, 8, 0, -60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
                [3, 0.8, 2, 0.6, 0.1, 0.1, 0.25, 1, 1, 1, 1, 1, 1]
            ]),
            TYPE: [exports.triangle, {
                BODY: {
                    ACCELERATION: 0.005
                }
            }],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro
        }
    }, {
        POSITION: [5, 12, 1.2, 8, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
                [3, 0.8, 2, 0.6, 0.1, 0.1, 0.25, 1, 1, 1, 1, 1, 1]
            ]),
            TYPE: [exports.triangle, {
                BODY: {
                    ACCELERATION: 0.005
                }
            }],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro
        }
    }],
    BROADCAST_MESSAGE: "A triangle sanctuary has been defeated...",
    SPAWN_ON_DEATH: "eliteSkimmer"
};
exports.lucrehulk = (function () {
    g.lucrehulkTurret = [2, 1, 1, 1, .6, .8, 1, 1, 1.1, 1, 1, 2, 1];
    let index = 0;

    function createProp(type, options = {}) {
        if (options.stats == null) options.stats = [];
        if (options.size == null) options.size = 9;
        if (options.arc == null) options.arc = 200;
        exports[`lucrehulkTurret${index}`] = createTurret(type, [g.lucrehulkTurret, ...options.stats]);
        return {
            PARENT: [exports.genericTank],
            LABEL: "",
            COLOR: 18,
            SHAPE: 5,
            SKILL: setBuild("0079685000"),
            DAMAGE_CLASS: 1,
            BODY: {
                PUSHABILITY: 0,
                HEALTH: 1e4,
                REGEN: 1000,
                DAMAGE: 1,
                RESIST: 10000,
                STEALTH: 1,
                DENSITY: 10000
            },
            HITS_OWN_TYPE: "everything",
            TURRETS: [{
                POSITION: [options.size, 0, 0, 0, options.arc, 1],
                TYPE: exports[`lucrehulkTurret${index++}`]
            }]
        };
    }
    exports.lucrehulkSwarmSpawner = makeSwarmSpawner(combineStats([g.swarm, [1.8, 0, .25, .6, 2, 1, 2, 1.334, 1.5, 1, 1, 1, 1]]), exports.swarm, 9);
    exports.lucrehulkBlankProp = createProp(exports.genericTank, {
        size: 6
    });
    exports.lucrehulkSniperProp = createProp(exports.ranger);
    exports.lucrehulkMachineProp = createProp(exports.machine);
    exports.lucrehulkSwarmProp = createProp(exports.lucrehulkSwarmSpawner);
    exports.lucrehulkRocketeerProp = createProp(exports.rocketeer, {
        stats: [
            [1.6, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1]
        ],
        arc: 240
    });
    return {
        PARENT: [exports.miniboss],
        LABEL: "Lucrehulk",
        DANGER: 15,
        COLOR: 18,
        SIZE: 30,
        VALUE: 750000,
        FACING_TYPE: "lucrehulkSpin",
        BODY: bossStats({
            health: 3,
            speed: .1
        }),
        GUNS: [{
            POSITION: [28, 10, 1.8, 8, 0, 0, 0]
        }],
        TURRETS: (function () {
            exports.lucrehulkDestroyer = createTurret(exports.destroyer, [g.lucrehulkTurret, [1.8, 1, .1, .9, 2, 2, 2, 1.2, 1.2, 1.5, 2, .1, 3]]);
            const output = [{
                POSITION: [12, 0, 0, 180, 180, 1],
                TYPE: exports.lucrehulkDestroyer
            }, {
                POSITION: [23, 35, 0, 0, 0, 1],
                TYPE: exports.lucrehulkRocketeerProp
            }];
            for (const [angle, propName] of [
                [36, "lucrehulkBlankProp"],
                [72, "lucrehulkSwarmProp"],
                [108, "lucrehulkMachineProp"],
                [144, "lucrehulkSniperProp"]
            ]) {
                output.push({
                    POSITION: [23, 35, 0, angle, 0, 1],
                    TYPE: exports[propName]
                }, {
                    POSITION: [23, 35, 0, -angle, 0, 1],
                    TYPE: exports[propName]
                });
            }
            return output;
        })()
    }
})();
exports.longSiloStream = makeAuto({
    BODY: {
        FOV: 2
    },
    CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'],
    COLOR: 16,
    HAS_NO_RECOIL: true,
    GUNS: [{
        POSITION: [44, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.mini, g.stream, g.turret, g.doubleReload, g.sniper]),
            TYPE: [exports.bullet, {
                LAYER: 6
            }]
        }
    }, {
        POSITION: [40, 8, 1, 0, 0, 0, 1 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.mini, g.stream, g.turret, g.doubleReload, g.sniper]),
            TYPE: [exports.bullet, {
                LAYER: 6
            }]
        }
    }, {
        POSITION: [36, 8, 1, 0, 0, 0, 2 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.mini, g.stream, g.turret, g.doubleReload, g.sniper]),
            TYPE: [exports.bullet, {
                LAYER: 6
            }]
        }
    }, {
        POSITION: [32, 8, 1, 0, 0, 0, 3 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.mini, g.stream, g.turret, g.doubleReload, g.sniper]),
            TYPE: [exports.bullet, {
                LAYER: 6
            }]
        }
    }, {
        POSITION: [28, 8, 1, 0, 0, 0, 4 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.mini, g.stream, g.turret, g.doubleReload, g.sniper]),
            TYPE: [exports.bullet, {
                LAYER: 6
            }]
        }
    }, {
        POSITION: [24, 8, 1, 0, 0, 0, 5 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.mini, g.stream, g.turret, g.doubleReload, g.sniper]),
            TYPE: [exports.bullet, {
                LAYER: 6
            }]
        }
    }, {
        POSITION: [20, 8, 1, 0, 0, 0, 6 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.mini, g.stream, g.turret, g.doubleReload, g.sniper]),
            TYPE: [exports.bullet, {
                LAYER: 6
            }]
        }
    }, {
        POSITION: [5, 8, -1.6, 8, 0, 0, 0]
    }]
}, 'Long Silo', {
    type: exports.genericTank,
    size: 13,
    color: 6
});
exports.spreadshotTurret = createTurret(exports.spread, [g.doubleReload]);
exports.mothershipTurret = makeAuto(createTurret(exports.mothership, [g.doubleReload, g.weak]), "Mothership", {
    type: exports.genericTank,
    size: 13,
    color: 6
});
exports.mothershipMinion = createMinion(exports.mothership);
exports.mothershipMinion.DRAW_HEALTH = true;
exports.ultimateMothership = makeAuto({
    PARENT: [exports.genericTank],
    DANGER: 14,
    SHAPE: 16,
    COLOR: 13,
    SIZE: 100,
    LEVEL: 60,
    VALUE: 59212,
    FACING_TYPE: 'lucrehulkSpin',
    BODY: {
        FOV: .74,
        SPEED: .9,
        ACCELERATION: .1,
        HEALTH: 3500000,
        DAMAGE: 6,
        REGEN: .015
    },
    GUNS: [],
    TURRETS: []
}, 'Sun King', { // Ultimate Mothership
    type: exports.mothershipTurret,
    size: 4.35
});
for (let i = 1; i < 9; i++) {
    let angle = i * 45;
    exports.ultimateMothership.GUNS.push({
        POSITION: [0.27, 3, 1, 10.75, 0, angle, 0]
    }, {
        POSITION: [0.7, 3.65, 1.01, 11.2, 0, angle, i / 8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.spawner, g.factory, [2, 0, 1, 1.2, .5, .2, 1, 2, 1, 1, 1, 1, 1]]),
            TYPE: exports.mothershipMinion,
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            MAX_CHILDREN: 1
        }
    }, {
        POSITION: [2.75, 3.4, 1, 8, 0, angle, 0]
    }, {
        POSITION: [0.27, 3, 1, 10.75, 0, 22.5 - angle, 0]
    }, {
        POSITION: [0.7, 3.65, 1.01, 11.2, 0, 22.5 - angle, 1 + i / 8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.spawner, g.factory, [2, 0, 1, 1.2, 1, 1, 1, 2, 1, 1, 1, 1, 1]]),
            TYPE: [exports.mothershipMinion, {
                INDEPENDENT: true
            }],
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            MAX_CHILDREN: 1
        }
    }, {
        POSITION: [2.75, 3.4, 1, 8, 0, 22.5 - angle, 0]
    });
}
for (let i = 0; i < 4; i++) {
    let angle = i * 360 / 4;
    exports.ultimateMothership.TURRETS.push({
        POSITION: [2.285, 5.15, 0, angle, 190, 1],
        TYPE: exports.longSiloStream
    }, {
        POSITION: [1.25, 8, 2.1, angle, 190, 1],
        TYPE: exports.spreadshotTurret
    }, {
        POSITION: [1.25, 8, -2.1, angle, 190, 1],
        TYPE: exports.spreadshotTurret
    }, {
        POSITION: [4.35, 6.285, 0, angle + 45, 361, 1],
        TYPE: exports.mothershipTurret
    });
};
exports.hexaDualAutoGun = {
    PARENT: [exports.turretParent],
    LABEL: 'Hexa Dual',
    COLOR: 27,
    HAS_NO_RECOIL: true,
    GUNS: [{
        POSITION: [20, 6.75, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.flank, g.turret]),
            TYPE: [exports.bullet, {
                LAYER: 6
            }]
        }
    }, {
        POSITION: [20, 6.75, 1, 0, 0, 120, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.flank, g.turret]),
            TYPE: [exports.bullet, {
                LAYER: 6
            }]
        }
    }, {
        POSITION: [20, 6.75, 1, 0, 0, 240, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.flank, g.turret]),
            TYPE: [exports.bullet, {
                LAYER: 6
            }]
        }
    }, {
        POSITION: [20, 6.75, 1, 0, 0, 60, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.flank, g.turret]),
            TYPE: [exports.bullet, {
                LAYER: 6
            }]
        }
    }, {
        POSITION: [20, 6.75, 1, 0, 0, 180, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.flank, g.turret]),
            TYPE: [exports.bullet, {
                LAYER: 6
            }]
        }
    }, {
        POSITION: [20, 6.75, 1, 0, 0, 300, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.flank, g.turret]),
            TYPE: [exports.bullet, {
                LAYER: 6
            }]
        }
    }, {
        POSITION: [14, 3.6, 1, 0, 0, 30, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.turret, [1.5, 0, 1, 1, .5, .5, 2, 1.2, 1, 1, 1, 1, 1]]),
            TYPE: [exports.bullet, {
                LAYER: 6
            }]
        }
    }, {
        POSITION: [14, 3.6, 1, 0, 0, 150, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.turret, [1.5, 0, 1, 1, .5, .5, 2, 1.2, 1, 1, 1, 1, 1]]),
            TYPE: [exports.bullet, {
                LAYER: 6
            }]
        }
    }, {
        POSITION: [14, 3.6, 1, 0, 0, 270, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.turret, [1.5, 0, 1, 1, .5, .5, 2, 1.2, 1, 1, 1, 1, 1]]),
            TYPE: [exports.bullet, {
                LAYER: 6
            }]
        }
    }, {
        POSITION: [14, 3.6, 1, 0, 0, 90, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.turret, [1.5, 0, 1, 1, .5, .5, 2, 1.2, 1, 1, 1, 1, 1]]),
            TYPE: [exports.bullet, {
                LAYER: 6
            }]
        }
    }, {
        POSITION: [14, 3.6, 1, 0, 0, 210, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.turret, [1.5, 0, 1, 1, .5, .5, 2, 1.2, 1, 1, 1, 1, 1]]),
            TYPE: [exports.bullet, {
                LAYER: 6
            }]
        }
    }, {
        POSITION: [14, 3.6, 1, 0, 0, 330, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.turret, [1.5, 0, 1, 1, .5, .5, 2, 1.2, 1, 1, 1, 1, 1]]),
            TYPE: [exports.bullet, {
                LAYER: 6
            }]
        }
    }]
};
exports.tripletAutoGun = createTurret(exports.triplet, [g.doubleReload]);
exports.tripletAutoGun.COLOR = 27;
exports.hexadecimatorTwinTurret = createTurret(exports.twin, [g.doubleReload, g.sniper]);
exports.hexadecimatorTwinTurret.COLOR = 27;
for (let i = 0; i < exports.hexadecimatorTwinTurret.GUNS.length; i++) {
    exports.hexadecimatorTwinTurret.GUNS[i].PROPERTIES.TYPE = [exports.bullet, {
        LAYER: 6
    }];
}
exports.hexadecimator = {
    PARENT: [exports.miniboss],
    LABEL: 'Hexadecimator',
    DANGER: 8,
    SHAPE: 6,
    COLOR: 27,
    SIZE: 44,
    BODY: bossStats(),
    FACING_TYPE: 'autospin',
    TURRETS: [{
        POSITION: [4.6, 10, 2.9, 0, 195, 0],
        TYPE: exports.tripletAutoGun
    }, {
        POSITION: [4.6, 10, -2.9, 0, 195, 0],
        TYPE: exports.tripletAutoGun
    }, {
        POSITION: [4.6, 10, 2.9, 60, 195, 0],
        TYPE: exports.tripletAutoGun
    }, {
        POSITION: [4.6, 10, -2.9, 60, 195, 0],
        TYPE: exports.tripletAutoGun
    }, {
        POSITION: [4.6, 10, 2.9, 120, 195, 0],
        TYPE: exports.tripletAutoGun
    }, {
        POSITION: [4.6, 10, -2.9, 120, 195, 0],
        TYPE: exports.tripletAutoGun
    }, {
        POSITION: [4.6, 10, 2.9, 180, 195, 0],
        TYPE: exports.tripletAutoGun
    }, {
        POSITION: [4.6, 10, -2.9, 180, 195, 0],
        TYPE: exports.tripletAutoGun
    }, {
        POSITION: [4.6, 10, 2.9, 240, 195, 0],
        TYPE: exports.tripletAutoGun
    }, {
        POSITION: [4.6, 10, -2.9, 240, 195, 0],
        TYPE: exports.tripletAutoGun
    }, {
        POSITION: [4.6, 10, 2.9, 300, 195, 0],
        TYPE: exports.tripletAutoGun
    }, {
        POSITION: [4.6, 10, -2.9, 300, 195, 0],
        TYPE: exports.tripletAutoGun
    }, {
        POSITION: [2.25, 6.8, 1.75, 0, 220, 1],
        TYPE: exports.hexadecimatorTwinTurret
    }, {
        POSITION: [2.25, 6.8, -1.75, 0, 220, 1],
        TYPE: exports.hexadecimatorTwinTurret
    }, {
        POSITION: [2.25, 6.8, 1.75, 60, 220, 1],
        TYPE: exports.hexadecimatorTwinTurret
    }, {
        POSITION: [2.25, 6.8, -1.75, 60, 220, 1],
        TYPE: exports.hexadecimatorTwinTurret
    }, {
        POSITION: [2.25, 6.8, 1.75, 120, 220, 1],
        TYPE: exports.hexadecimatorTwinTurret
    }, {
        POSITION: [2.25, 6.8, -1.75, 120, 220, 1],
        TYPE: exports.hexadecimatorTwinTurret
    }, {
        POSITION: [2.25, 6.8, 1.75, 180, 220, 1],
        TYPE: exports.hexadecimatorTwinTurret
    }, {
        POSITION: [2.25, 6.8, -1.75, 180, 220, 1],
        TYPE: exports.hexadecimatorTwinTurret
    }, {
        POSITION: [2.25, 6.8, 1.75, 240, 220, 1],
        TYPE: exports.hexadecimatorTwinTurret
    }, {
        POSITION: [2.25, 6.8, -1.75, 240, 220, 1],
        TYPE: exports.hexadecimatorTwinTurret
    }, {
        POSITION: [2.25, 6.8, 1.75, 300, 220, 1],
        TYPE: exports.hexadecimatorTwinTurret
    }, {
        POSITION: [2.25, 6.8, -1.75, 300, 220, 1],
        TYPE: exports.hexadecimatorTwinTurret
    }, {
        POSITION: [4.9, 0, 0, 0, 360, 1],
        TYPE: exports.hexaDualAutoGun
    }, {
        POSITION: [3.25, 0, 0, 0, 0, 1],
        TYPE: [exports.eggBossCircleProp, {
            COLOR: 28
        }]
    }]
};
exports.heptaDirectorAutoGun = {
    PARENT: [exports.turretParent],
    LABEL: 'Cartographer',
    COLOR: 29,
    FACING_TYPE: "reverseSpin",
    GUNS: (function () {
        const output = [];
        for (let i = 0; i < 7; i++) {
            output.push({
                POSITION: [5.55, 7.35, 1.25, 8, 0, 360 / 7 * i, i / 7],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.meta, g.turret]),
                    TYPE: [exports.drone, {
                        LAYER: 6,
                        INDEPENDENT: true
                    }],
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: gunCalcNames.drone,
                    MAX_CHILDREN: 2,
                    WAIT_TO_CYCLE: true
                }
            });
        }
        return output;
    })()
};
exports.weirdSpreadrifleAutoGun = {
    PARENT: [exports.turretParent],
    LABEL: 'Blunderbuss',
    COLOR: 29,
    GUNS: [{
        POSITION: [21, 4.3, 1, 0, 2.3, 6.4, .45],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.rifle, g.pelleter, g.turret, g.doubleReload, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [21, 4.3, 1, 0, -2.3, -6.4, .45],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.rifle, g.pelleter, g.turret, g.doubleReload, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [21.3, 4.3, 1, 0, 1.8, 4.2, .3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.rifle, g.pelleter, g.turret, g.doubleReload, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [21.3, 4.3, 1, 0, -1.8, -4.2, .3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.rifle, g.pelleter, g.turret, g.doubleReload, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [21.6, 4.3, 1, 0, 1.3, 2, .15],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.rifle, g.pelleter, g.turret, g.doubleReload, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [21.6, 4.3, 1, 0, -1.3, -2, .15],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.rifle, g.pelleter, g.turret, g.doubleReload, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [22.4, 4.3, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.rifle, g.pelleter, g.turret, g.doubleReload, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [10.5, 18.9, .666, 3, 0, 0, 0]
    }]
};
exports.longNailgunAutoGun = {
    PARENT: [exports.turretParent],
    LABEL: 'Nailgun',
    COLOR: 29,
    GUNS: [{
        POSITION: [22.5, 3.9, 1, 0, 3.45, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwgun, g.nailgun, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [22.5, 3.9, 1, 0, -3.45, 0, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwgun, g.nailgun, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [24.85, 3.9, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwgun, g.nailgun, g.turret, g.doubleReload]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [10.75, 17.5, .65, 3, 0, 0, 0]
    }]
};
exports.heptadecimator = {
    PARENT: [exports.miniboss],
    LABEL: 'Heptadecimator',
    DANGER: 8,
    SHAPE: 7,
    COLOR: 29,
    SIZE: 48,
    BODY: bossStats(),
    FACING_TYPE: 'autospin',
    TURRETS: [{
        POSITION: [7.2, 10.2, 0, 25.714, 200, 0],
        TYPE: exports.weirdSpreadrifleAutoGun
    }, {
        POSITION: [7.2, 10.2, 0, 77.143, 200, 0],
        TYPE: exports.weirdSpreadrifleAutoGun
    }, {
        POSITION: [7.2, 10.2, 0, 128.571, 200, 0],
        TYPE: exports.weirdSpreadrifleAutoGun
    }, {
        POSITION: [7.2, 10.2, 0, 180, 200, 0],
        TYPE: exports.weirdSpreadrifleAutoGun
    }, {
        POSITION: [7.2, 10.2, 0, 231.429, 200, 0],
        TYPE: exports.weirdSpreadrifleAutoGun
    }, {
        POSITION: [7.2, 10.2, 0, 282.857, 200, 0],
        TYPE: exports.weirdSpreadrifleAutoGun
    }, {
        POSITION: [7.2, 10.2, 0, 334.286, 200, 0],
        TYPE: exports.weirdSpreadrifleAutoGun
    }, {
        POSITION: [1.85, 8.6, 0, 0, 250, 1],
        TYPE: exports.autoTurretLayer6
    }, {
        POSITION: [1.85, 8.6, 0, 360 / 7, 250, 1],
        TYPE: exports.autoTurretLayer6
    }, {
        POSITION: [1.85, 8.6, 0, 2 * 360 / 7, 250, 1],
        TYPE: exports.autoTurretLayer6
    }, {
        POSITION: [1.85, 8.6, 0, 3 * 360 / 7, 250, 1],
        TYPE: exports.autoTurretLayer6
    }, {
        POSITION: [1.85, 8.6, 0, 4 * 360 / 7, 250, 1],
        TYPE: exports.autoTurretLayer6
    }, {
        POSITION: [1.85, 8.6, 0, 5 * 360 / 7, 250, 1],
        TYPE: exports.autoTurretLayer6
    }, {
        POSITION: [1.85, 8.6, 0, 6 * 360 / 7, 250, 1],
        TYPE: exports.autoTurretLayer6
    }, {
        POSITION: [3.15, 7.3, 0, 25.714, 235, 1],
        TYPE: exports.longNailgunAutoGun
    }, {
        POSITION: [3.15, 7.3, 0, 77.143, 235, 1],
        TYPE: exports.longNailgunAutoGun
    }, {
        POSITION: [3.15, 7.3, 0, 128.571, 235, 1],
        TYPE: exports.longNailgunAutoGun
    }, {
        POSITION: [3.15, 7.3, 0, 180, 235, 1],
        TYPE: exports.longNailgunAutoGun
    }, {
        POSITION: [3.15, 7.3, 0, 231.429, 235, 1],
        TYPE: exports.longNailgunAutoGun
    }, {
        POSITION: [3.15, 7.3, 0, 282.857, 235, 1],
        TYPE: exports.longNailgunAutoGun
    }, {
        POSITION: [3.15, 7.3, 0, 334.286, 235, 1],
        TYPE: exports.longNailgunAutoGun
    }, {
        POSITION: [6.9, 0, 0, 0, 360, 1],
        TYPE: exports.heptaDirectorAutoGun
    }]
};
exports.hellbringerSwarm = {
    LABEL: '',
    BODY: {
        FOV: 2
    },
    COLOR: 16,
    HAS_NO_RECOIL: true,
    GUNS: [{
        POSITION: [15, 10, .6, 0, 5, 0, 2 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [15, 10, .6, 0, -5, 0, 1 / 3],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }, {
        POSITION: [18, 9, .6, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier]),
            TYPE: exports.swarm,
            STAT_CALCULATOR: gunCalcNames.swarm
        }
    }]
};
exports.hellbringer = {
    PARENT: [exports.genericTank],
    LABEL: 'Unholy Hellbringer',
    DANGER: 10,
    SHAPE: shapeConfig.unholyHellbringer,
    COLOR: 6,
    SIZE: 46,
    BODY: {
        FOV: .78,
        SPEED: 1.15,
        ACCELERATION: .2,
        HEALTH: 1500,
        DAMAGE: 6,
        REGEN: .015,
        DENSITY: base.DENSITY * 2
    },
    GUNS: [{
        POSITION: [10, 7, 1, -10, 0, 0, 0]
    }],
    TURRETS: [{
        POSITION: [7, 9, 0, 45, 175, 0],
        TYPE: exports.hellbringerSwarm
    }, {
        POSITION: [7, 9, 0, -45, 175, 0],
        TYPE: exports.hellbringerSwarm
    }]
};
exports.osciAutoGun = {
    PARENT: [exports.autoTurret],
    LABEL: 'Oscilloscope',
    COLOR: 30,
    GUNS: [{
        POSITION: [9, 8, 1.32, 25, 0, 0, 0]
    }, {
        POSITION: [9, 8, 1.32, 18, 0, 0, 0]
    }, {
        POSITION: [9, 8, 1.32, 11, 0, 0, 0]
    }, {
        POSITION: [35.5, 7.6, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.turret, [2.1, 0, .1, 1, 1.2, 1.1, 2, 1.3, 1, 1.1, 1, .1, 1]]),
            TYPE: exports.bulletLayer6
        }
    }, {
        POSITION: [5, 7.6, -1.6, 8, 0, 0, 0]
    }],
    TURRETS: [{
        POSITION: [13.75, 0, 0, 0, 0, 1],
        TYPE: [exports.genericTank, {
            COLOR: 31
        }]
    }]
};
exports.longOsciAutoGun = {
    PARENT: [exports.turretParent],
    LABEL: 'Radiolocator',
    COLOR: 30,
    GUNS: [{
        POSITION: [9, 8, 1.32, 39, 0, 0, 0]
    }, {
        POSITION: [9, 8, 1.32, 32, 0, 0, 0]
    }, {
        POSITION: [9, 8, 1.32, 25, 0, 0, 0]
    }, {
        POSITION: [9, 8, 1.32, 18, 0, 0, 0]
    }, {
        POSITION: [9, 8, 1.32, 11, 0, 0, 0]
    }, {
        POSITION: [50, 7.6, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.turret, [2.5, 0, .1, 1, 1.3, 1.15, 2.15, 1.3, 1, 1.1, 1, .1, 1]]),
            TYPE: exports.bulletLayer6
        }
    }, {
        POSITION: [5, 7.6, -1.6, 8, 0, 0, 0]
    }],
    TURRETS: [{
        POSITION: [13.75, 0, 0, 0, 0, 1],
        TYPE: [exports.genericTank, {
            COLOR: 31
        }]
    }]
};
exports.veryLongOsciAutoGun = {
    PARENT: [exports.turretParent],
    LABEL: 'Thicc Oscillscope',
    COLOR: 30,
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [9, 8, 1.32, 52, 0, 0, 0]
    }, {
        POSITION: [9, 8, 1.32, 45, 0, 0, 0]
    }, {
        POSITION: [9, 8, 1.32, 38, 0, 0, 0]
    }, {
        POSITION: [9, 8, 1.32, 31, 0, 0, 0]
    }, {
        POSITION: [9, 8, 1.32, 24, 0, 0, 0]
    }, {
        POSITION: [9, 8, 1.32, 17, 0, 0, 0]
    }, {
        POSITION: [9, 8, 1.32, 10, 0, 0, 0]
    }, {
        POSITION: [2, 2.15, .01, 62.35, 2.15, -0.85, 0]
    }, {
        POSITION: [2, 2.15, .01, 62.35, -2.15, .85, 0]
    }, {
        POSITION: [62.75, 7.6, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.turret, [2.75, 0, .1, 1, 1.3, 1.225, 2.2, 1.5, 1, 1.1, 1, .1, 1]]),
            TYPE: exports.bulletLayer6
        }
    }, {
        POSITION: [5, 7.6, -1.6, 8, 0, 0, 0]
    }],
    TURRETS: [{
        POSITION: [11.45, 0, 0, 0, 0, 1],
        TYPE: [exports.genericTank, {
            COLOR: 31
        }]
    }]
};
exports.megaOsciAutoGun = {
    PARENT: [exports.turretParent],
    LABEL: 'Tremor',
    COLOR: 30,
    GUNS: [{
        POSITION: [16, 12.75, 1.32, 24, 0, 0, 0]
    }, {
        POSITION: [15, 12.75, 1.32, 17, 0, 0, 0]
    }, {
        POSITION: [14, 12.75, 1.32, 10, 0, 0, 0]
    }, {
        POSITION: [42.7, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.turret, [2, 0, .1, 1, 1, 1, 1.5, 1.25, 1, 1.1, 1, .1, 1]]),
            TYPE: exports.bulletLayer6
        }
    }, {
        POSITION: [10, 12, -1.6, 3, 0, 0, 0]
    }],
    TURRETS: [{
        POSITION: [11.5, 0, 0, 0, 0, 1],
        TYPE: [exports.eggBossCircleProp, {
            COLOR: 31
        }]
    }]
};
exports.tetraplexPounder = createTurret(exports.pounder, [g.sniper]);
exports.tetraplex = {
    PARENT: [exports.genericTank],
    LABEL: 'Tetraplex',
    DANGER: 8,
    BODY: {
        FOV: .65,
        SPEED: 1.08,
        ACCELERATION: base.ACCEL * .3,
        HEALTH: 2000,
        DAMAGE: 5.15,
        REGEN: .0125
    },
    COLOR: 30,
    SHAPE: shapeConfig.tetraplex,
    SIZE: 82,
    FACING_TYPE: 'lucrehulkSpin',
    TURRETS: [{
        POSITION: [1.5, -6, 0, 0, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, -6, 0, 60, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, -6, 0, 120, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, -6, 0, 180, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, -6, 0, 240, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, -6, 0, 300, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, 11.25, 0, 0, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, 11.25, 0, 60, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, 11.25, 0, 120, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, -1.675, 7.55, 0, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, -1.675, -7.55, 180, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, -1.675, 7.55, 60, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, -1.675, -7.55, 240, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, -1.675, 7.55, 120, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, -1.675, -7.55, 300, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, -1.675, 7.55, 180, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, -1.675, -7.55, 0, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, -1.675, 7.55, 240, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, -1.675, -7.55, 60, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, -1.675, 7.55, 300, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, -1.675, -7.55, 120, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, 7.05, 7.55, 0, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, 7.05, -7.55, 120, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, 7.05, 7.55, 60, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, 7.05, -7.55, 180, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, 7.05, 7.55, 120, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, 7.05, -7.55, 240, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, 7.05, 7.55, 180, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, 7.05, -7.55, 300, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, 7.05, 7.55, 240, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, 7.05, -7.55, 0, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, 7.05, 7.55, 300, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, 7.05, -7.55, 60, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, 11.25, 0, 180, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, 11.25, 0, 240, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [1.5, 11.25, 0, 300, 220, 1],
        TYPE: exports.osciAutoGun
    }, {
        POSITION: [2.3, 8.65, 0, 0, 225, 1],
        TYPE: exports.longOsciAutoGun
    }, {
        POSITION: [2.3, 8.65, 0, 60, 225, 1],
        TYPE: exports.longOsciAutoGun
    }, {
        POSITION: [2.3, 8.65, 0, 120, 225, 1],
        TYPE: exports.longOsciAutoGun
    }, {
        POSITION: [2.3, 8.65, 0, 180, 225, 1],
        TYPE: exports.longOsciAutoGun
    }, {
        POSITION: [2.3, 8.65, 0, 240, 225, 1],
        TYPE: exports.longOsciAutoGun
    }, {
        POSITION: [2.3, 8.65, 0, 300, 225, 1],
        TYPE: exports.longOsciAutoGun
    }, {
        POSITION: [3.3, 0, 0, -30, 361, 1],
        TYPE: exports.veryLongOsciAutoGun
    }]
};
for (let i = 0; i < 6; i++) {
    let angle = i * 60;
    exports.tetraplex.TURRETS = exports.tetraplex.TURRETS.concat({
        POSITION: [1.4, 8.75, -9.1, 60 + angle, 215, 0],
        TYPE: exports.tetraplexPounder
    }, {
        POSITION: [1.4, 8.75, -5.7, 60 + angle, 215, 0],
        TYPE: exports.tetraplexPounder
    }, {
        POSITION: [2.15, 8.75, -7.4, 60 + angle, 205, 0],
        TYPE: exports.megaOsciAutoGun
    }, {
        POSITION: [1.4, 8.75, 9.1, angle, 215, 0],
        TYPE: exports.tetraplexPounder
    }, {
        POSITION: [1.4, 8.75, 5.7, angle, 215, 0],
        TYPE: exports.tetraplexPounder
    }, {
        POSITION: [2.15, 8.75, 7.4, angle, 205, 0],
        TYPE: exports.megaOsciAutoGun
    });
    exports.tetraplex.TURRETS = exports.tetraplex.TURRETS.concat({
        POSITION: [1.4, 13, 1.7, angle, 215, 0],
        TYPE: exports.tetraplexPounder
    }, {
        POSITION: [1.4, 13, -1.7, angle, 215, 0],
        TYPE: exports.tetraplexPounder
    }, {
        POSITION: [2.15, 13, 0, angle, 205, 0],
        TYPE: exports.megaOsciAutoGun
    });
}
exports.autoDroneTurret = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [22, 11, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.turret, g.autoDroneTurret]),
            TYPE: exports.bullet
        }
    }]
};
exports.motordrone = makeAuto(exports.drone, -1, {
    type: exports.autoDroneTurret
});
exports.squareProp = {
    PARENT: [exports.genericTank],
    SHAPE: 4,
    COLOR: 16
};
exports.motor = {
    PARENT: [exports.genericTank],
    LABEL: 'Motor',
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.95
    },
    MAX_CHILDREN: 6,
    GUNS: [{
        POSITION: [6, 12, 1.2, 8, 0, 0, 0,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone]),
            TYPE: exports.motordrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }],
    TURRETS: [{
        POSITION: [10, 0, 0, 0, 0, 1],
        TYPE: exports.squareProp
    }]
};
exports.overdrive = {
    PARENT: [exports.genericTank],
    LABEL: 'Overdrive',
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        ACCELERATION: base.ACCEL * 0.75,
        SPEED: base.SPEED * 0.95
    },
    MAX_CHILDREN: 8,
    GUNS: [{
        POSITION: [6, 12, 1.2, 8, 0, 90, 0,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
            TYPE: exports.motordrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }, {
        POSITION: [6, 12, 1.2, 8, 0, 270, 0,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
            TYPE: exports.motordrone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true
        }
    }],
    TURRETS: [{
        POSITION: [10, 0, 0, 0, 0, 1],
        TYPE: exports.squareProp
    }]
};
exports.industrialist = {
    PARENT: [exports.genericTank],
    LABEL: 'Industrialist',
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * .9,
        ACCELERATION: base.ACCEL * 0.65,
        FOV: 1.1
    },
    MAX_CHILDREN: 8,
    GUNS: [{
        POSITION: [5, 12, 1, 11, 0, 0, 0]
    }, {
        POSITION: [2, 15, 1, 16, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.spawner, g.factory]),
            TYPE: exports.minion,
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true
        }
    }, {
        POSITION: [6.5, 15, 1, 6, 0, 0, 0]
    }]
};
exports.arsenal = {
    PARENT: [exports.genericTank],
    LABEL: "Arsenal",
    DANGER: 6,
    GUNS: [{
        POSITION: [14, 8, 1, 0, 0, 0, 0]
    }, {
        POSITION: [11, 10, 1, 0, 0, 0, 0]
    }, {
        POSITION: [3, 8, 1.7, 14, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.arsenal]),
            TYPE: exports.trapbox,
            STAT_CALCULATOR: gunCalcNames.trap
        }
    }]
};
exports.gleamer = {
    PARENT: [exports.genericTank],
    LABEL: 'Gleamer',
    DANGER: 7,
    BODY: {
        HEALTH: base.HEALTH * .85,
        SHIELD: base.SHIELD * .85,
        DENSITY: base.DENSITY * .7
    },
    TOOLTIP: "Right-Click to jump",
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.tri]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [11, 15, -1.31, 2, 0, 0, 0]
    }, {
        POSITION: [16, 8, 1, 0, 0, 150, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback]),
            TYPE: exports.bullet,
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 210, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback]),
            TYPE: exports.bullet,
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [2, 2, 1, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.jump]),
            TYPE: [exports.bullet, {
                ALPHA: 0
            }],
            ALT_FIRE: true
        }
    }, {
        POSITION: [9, 14, .6, 4, 0, 180, 0]
    }]
};
exports.pulsejet = {
    PARENT: [exports.genericTank],
    LABEL: 'Pulsejet',
    DANGER: 7,
    BODY: {
        HEALTH: base.HEALTH * .85,
        SHIELD: base.SHIELD * .85,
        DENSITY: base.DENSITY * .7
    },
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.tri]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [11, 15, -1.31, 2, 0, 0, 0]
    }, {
        POSITION: [16, 8, 1, 0, -1, 90, .05],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.tri, g.fighter]),
            TYPE: exports.bullet,
            LABEL: "Side"
        }
    }, {
        POSITION: [16, 8, 1, 0, 1, -90, .05],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.tri, g.fighter]),
            TYPE: exports.bullet,
            LABEL: "Side"
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 150, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback]),
            TYPE: exports.bullet,
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 210, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.thruster, g.triback]),
            TYPE: exports.bullet,
            STAT_CALCULATOR: gunCalcNames.thruster
        }
    }, {
        POSITION: [2, 2, 1, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.jump]),
            TYPE: [exports.bullet, {
                ALPHA: 0
            }],
            ALT_FIRE: true
        }
    }, {
        POSITION: [9, 14, .6, 4, 0, 180, 0]
    }]
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
exports.hideBot = {
    FACING_TYPE: "looseToTarget",
    NAME: "[AI] ",
    CONTROLLERS: ["botMovement"]
};
exports.soccerBall = {
    PARENT: [exports.genericTank],
    SHAPE: 16,
    SIZE: 50,
    COLOR: 19,
    FACING_TYPE: "turnWithSpeed",
    LABEL: "Soccer Ball",
    BODY: {
        HEALTH: 1e100,
        DAMAGE: 0,
        REGEN: 100,
        SHIELD: 1e100,
        SPEED: base.SPEED * 2,
        PENETRATION: base.PENETRATION * .25,
        DENSITY: base.DENSITY * 2,
        PUSHABILITY: 13
    },
    TURRETS: [{
        POSITION: [10, 0, 0, 0, 0, 1],
        TYPE: [exports.genericTank, {
            COLOR: 8
        }]
    }]
};
exports.tagMode = {
    PARENT: [exports.bullet],
    LABEL: "Players"
};
exports.killRace = {
    PARENT: [exports.bullet],
    LABEL: "Kills"
};
exports.soccerScoreboard = {
    PARENT: [exports.bullet],
    LABEL: "Goals"
};
exports.hideAndSeek = {
    PARENT: [exports.bullet],
    LABEL: "Points"
};
exports.kadenHasAids = {
    PARENT: [exports.genericTank],
    LABEL: "peacful protestses bee liek",
    SHAPE: 1000036,
    GUNS: [{
        POSITION: [25, 25, 1, -12.5, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, [1, 1, 5, 7.5, 25, 25, 25, 2, 2, 1, 1, 100, 1]]),
            TYPE: exports.bullet,
            SKIN: 3
        }
    }]
};
exports.ovularBullshit = {
    PARENT: [exports.genericTank],
    LABEL: "Diabolical Bullshit",
    GUNS: (function () {
        g.ovularBullshit = function (i) {
            return [5, .1, .05, 1, .5, .5, 1, (i * .05) + .25, 1, .5, 1, .05, 1];
        }
        const output = [{
            POSITION: [20, 6, 1, 0, 0, 0, 0],
            PROPERTIES: {
                COLOR: 14
            }
        }, {
            POSITION: [17.5, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.ovularBullshit(0), g.fake]),
                TYPE: exports.bullet,
                SKIN: 2
            }
        }];
        for (let i = 0; i < 18; i++) {
            const reach = (i > 9 ? 18 - i : i) / 9 * 5;
            output.push({
                POSITION: [1, 2.5, 1, 0, reach, reach, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.ovularBullshit(i)]),
                    TYPE: [exports.trap, {
                        HITS_OWN_TYPE: "never"
                    }]
                }
            }, {
                POSITION: [1, 2.5, 1, 0, -reach, -reach, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.ovularBullshit(i)]),
                    TYPE: [exports.trap, {
                        HITS_OWN_TYPE: "never"
                    }]
                }
            });
        }
        return output;
    })()
};
exports.paner = makePara('2 + Math.sin(i * Math.PI / 180)', '.5 * Math.cos(i * Math.PI / 180)', 'Paner', {
    color: 13
});
exports.rose = makePara('(11 * Math.cos(i) - 6 * Math.cos(11 / 6 * i)) / 18', '(11 * Math.sin(i) - 6 * Math.sin(11 / 6 * i)) / 18', 'Rose', {
    color: 14,
    cycle: 2160,
    c: 360
});
exports.cycloid = makePara('1.5 + Math.sin(i * Math.PI / 180) / 2', 'Math.cos(i * Math.PI / 180) / 2', 'Cycloid', {
    color: 6
});
exports.cardioid = makePara('1 + Math.cos(i) * (1 - Math.cos(i))', 'Math.sin(i) * (1 - Math.cos(i))', 'Cardioid', {
    color: 2
});
exports.parabol = makePara('2 - Math.cos(2 * i)', 'Math.sin(i) / 2', 'Parabol', {
    color: 14
});
exports.flex = makePara('2 + Math.cos(2 * i)', 'Math.sin(5 - i)', 'Flex', {
    color: 22
});
exports.lissajous = makePara('Math.sin(2 * i) + 2', 'Math.cos(3 * i)', 'Lissajous', {
    color: 24,
    c: 64 * Math.PI
});
exports.stweamwinder = {
    PARENT: [exports.genericTank],
    LABEL: 'Stweamwinder',
    DANGER: 7,
    BODY: {
        FOV: 1.3
    },
    GUNS: []
};
for (let i = 0; i < 100; i++) exports.stweamwinder.GUNS = [{
    POSITION: [23, 8, 1.01, i * 2.1, 0, 0, 1 - (i / 100)],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream, [2, .01, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
        TYPE: exports.bullet
    }
}, ...exports.stweamwinder.GUNS];
exports.vortex = {
    PARENT: [exports.genericTank],
    LABEL: 'Vortex',
    DANGER: 7,
    BODY: {
        FOV: 1.3
    },
    GUNS: []
};
for (let i = 0; i < 10; i++) {
    exports.vortex.GUNS = [{
        POSITION: [18, 8, 1, 0, 0, i * 10 + 240, i * .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, i * 10 + 120, i * .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, i * 10, i * .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank]),
            TYPE: exports.bullet
        }
    }, ...exports.vortex.GUNS];
}
exports.panzerf2 = makeFlank(exports.panzerf);
exports.stweamicane = {
    PARENT: [exports.genericTank],
    LABEL: 'Stweamicane',
    DANGER: 7,
    BODY: {
        FOV: 1.5
    },
    GUNS: []
};
for (let i = 0; i < 360; i++) exports.stweamicane.GUNS = exports.stweamicane.GUNS.concat({
    POSITION: [23, 8, 1.01, i * 2, 0, i, i / 10],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream, [2, .01, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
        TYPE: exports.bullet
    }
}, {
    POSITION: [23, 8, 1.01, i * 2, 0, i + 120, i / 10],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream, [2, .01, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
        TYPE: exports.bullet
    }
}, {
    POSITION: [23, 8, 1.01, i * 2, 0, i + 240, i / 10],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet, g.mini, g.stream, [2, .01, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]),
        TYPE: exports.bullet
    }
});
exports.stweamicane.GUNS.reverse();
exports.octoCeptionist2 = makeCeptionist(exports.octo, -1, {
    type: exports.octo
});
exports.pentaCeptionist2 = makeCeptionist(exports.pentaShot, -1, {
    type: exports.pentaShot
});
exports.fighterCeptionist2 = makeCeptionist(exports.fighter, -1, {
    type: exports.fighter
});
exports.vortexCeptionist2 = makeCeptionist(exports.vortex, -1, {
    type: exports.vortex
});
exports.domimind = makeHivemind(exports.trapperDominator, 2, "Domimind");
// PUT ANIMATION TANKS HERE SO THAT THERE ARE NO REFERENCE ERRORS
createAnimationTank("tripleDouble", "Slipknot", exports.tripleshot, exports.double);
createAnimationTank("ragnar", "Ragnar", exports.ranger, exports.gunnertrapper);
createAnimationTank("trump", "Trump", exports.lightning, exports.minitrap);
exports.hivemind.UPGRADES_TIER_3 = [exports.twinmind, exports.snipemind, exports.machmind, exports.flankmind, exports.poundmind, exports.trapmind, exports.dronemind, exports.growmind, exports.pelletmind, exports.automind, exports.madman]; // hivemind = lvl30
exports.basicception.UPGRADES_TIER_3 = [exports.twinception, exports.sniperception, exports.machineception, exports.pounderception, exports.flankception, exports.zeppelin];

// TIER 1
exports.basic.UPGRADES_TIER_1 = [exports.twin, exports.sniper, exports.machine, exports.pounder, exports.flank, exports.trapper, exports.director, exports.grower, exports.pelleter, exports.propeller, exports.minishot, exports.lancer, exports.autobasic, exports.basebrid, exports.auto2];
// TIER 2
exports.director.UPGRADES_TIER_2 = [exports.overseer, exports.underseer, exports.cruiser, exports.spawner, exports.lightning, exports.heatseeker, exports.navyist, exports.colony, exports.manager, exports.motor, exports.overbasic, exports.director2];
exports.flank.UPGRADES_TIER_2 = [exports.hexa, exports.arthropoda, exports.trapguard, exports.tri, exports.swarmguard, exports.quadtrapper, exports.backShield];
exports.sniper.UPGRADES_TIER_2 = [exports.assassin, exports.minigun, exports.hunter, exports.clicker, exports.lightning, exports.rifle, exports.sniper2, exports.inferno];
exports.pounder.UPGRADES_TIER_2 = [exports.destroyer, exports.launcher, exports.miniswarmer, exports.multishot, exports.boxer, exports.botanist, exports.poundbrid, exports.pounder2];
exports.trapper.UPGRADES_TIER_2 = [exports.builder, exports.trapguard, exports.boomer, exports.quadtrapper, exports.contagion, exports.autotrapper, exports.trapper2, exports.arsenal];
exports.twin.UPGRADES_TIER_2 = [exports.double, exports.tripleshot, exports.spreadling, exports.boxer, exports.hewn, exports.binary, exports.twinMachine, exports.gunner, exports.twin2];
exports.grower.UPGRADES_TIER_2 = [exports.botanist, exports.machGrower, exports.grower2];
exports.minishot.UPGRADES_TIER_2 = [exports.artillery, exports.harasser, exports.recruit, exports.tripleshot, exports.spreadling];
exports.machine.UPGRADES_TIER_2 = [exports.sprayer, exports.minigun, exports.twinMachine, exports.machGrower, exports.blaster, exports.machine2, exports.inferno];
exports.pelleter.UPGRADES_TIER_2 = [exports.gunner, exports.puntGun, exports.screwGun, exports.pelleterhybrid, exports.autopelleter, exports.pelleter2];
exports.propeller.UPGRADES_TIER_2 = [exports.tri, exports.accelerator, exports.autopropeller];
exports.lancer.UPGRADES_TIER_2 = [exports.sword, exports.axe, exports.dagger, exports.trailblazer, exports.shredder, exports.flail, exports.akafuji0, exports.autoLancer, exports.spoopyGhost];
exports.flail.UPGRADES_TIER_3 = [exports.autoFlail, exports.marner, exports.mace, exports.reacher, exports.flangle];
exports.mace.UPGRADES_TIER_4 = [exports.nossle, exports.bloodcurdler];
exports.reacher.UPGRADES_TIER_4 = [exports.hongKongLongDong, exports.whammy];
exports.marner.UPGRADES_TIER_4 = [exports.windmill, exports.fidgetSpinner, exports.bloodcurdler, exports.whammy];
exports.akafuji0.UPGRADES_TIER_3 = [exports.saboten0, exports.vessle0];
exports.basebrid.UPGRADES_TIER_2 = [exports.overbasic, exports.VIP, exports.swarmguard, exports.poundbrid, exports.pelleterhybrid];
exports.autobasic.UPGRADES_TIER_2 = [exports.autotrapper, exports.autopelleter, exports.autopropeller, exports.basicception];
exports.basic.UPGRADES_TIER_2 = [exports.basicCeptionist, exports.smasher];
exports.smasher.UPGRADES_TIER_3 = [exports.spike, exports.megasmash, exports.landmine, exports.weirdSpike, exports.bonker, exports.autosmash];
exports.auto2.UPGRADES_TIER_2 = [exports.auto3, exports.swivel2, exports.twin2, exports.sniper2, exports.machine2, exports.pounder2, exports.trapper2, exports.director2, exports.grower2, exports.pelleter2];
exports.dualtrapper.UPGRADES_TIER_2 = [exports.minitrap];
// TIER 3
exports.artillery.UPGRADES_TIER_3 = [exports.mortar, exports.gunnary, exports.ordnance, exports.beekeeper, exports.machinegunner];
exports.harasser.UPGRADES_TIER_3 = [exports.mortar, exports.bully, exports.militia, exports.spread, exports.machinegunner];
exports.recruit.UPGRADES_TIER_3 = [exports.gunnary, exports.militia];
exports.boomer.UPGRADES_TIER_3 = [exports.bentboomer];
exports.spreadling.UPGRADES_TIER_3 = [exports.spread, exports.spreadbent, exports.scaler, exports.hyLing, exports.autoSpreadling];
exports.arthropoda.UPGRADES_TIER_3 = [exports.myriapoda, exports.biohazard];
exports.hexa.UPGRADES_TIER_3 = [exports.octo, exports.hurricane];
exports.trapper.UPGRADES_TIER_3 = [exports.musketeer];
exports.quadtrapper.UPGRADES_TIER_3 = [exports.heptatrapper, exports.caltrop, exports.fortress, exports.palisadeTank];
exports.rifle.UPGRADES_TIER_3 = [exports.musket, exports.armsman, exports.blunderbuss, exports.wagner, exports.scaler];
exports.launcher.UPGRADES_TIER_3 = [exports.skimmer, exports.twister, exports.rocketeer, exports.sidewinder, exports.swamper, exports.promenader, exports.catapult, exports.shrapnel, exports.katyusha];
exports.lightning.UPGRADES_TIER_3 = [exports.thunder, exports.flycatcher];
exports.overseer.UPGRADES_TIER_3 = [exports.overlord, exports.battleship, exports.master];
exports.heatseeker.UPGRADES_TIER_3 = [exports.flycatcher, exports.presser, exports.astronaut, exports.heatwave];
exports.spawner.UPGRADES_TIER_3 = [exports.factory, exports.protist, exports.hivemind, exports.palisadeTank];
exports.destroyer.UPGRADES_TIER_3 = [exports.anni, exports.hybrid, exports.superstorm];
exports.underseer.UPGRADES_TIER_3 = [exports.necromancer, exports.eggmancer, exports.trimancer, exports.maleficitor];
exports.botanist.UPGRADES_TIER_3 = [exports.superstorm];
exports.cruiser.UPGRADES_TIER_3 = [exports.carrier, exports.battleship, exports.piston, exports.fortress, exports.flankcruiser, exports.gunnerCruiser, exports.hybrado];
exports.double.UPGRADES_TIER_3 = [exports.triple, exports.battleship, exports.hewndouble, exports.doubleMachine];
exports.tripleshot.UPGRADES_TIER_3 = [exports.triplet, exports.pentaShot, exports.spreadbent, exports.cutter, exports.benthybrid, exports.bentMachine];
exports.twinMachine.UPGRADES_TIER_3 = [exports.bentMachine, exports.doubleMachine, exports.twinigun];
exports.boxer.UPGRADES_TIER_3 = [exports.eagle];
exports.hewn.UPGRADES_TIER_3 = [exports.hewndouble, exports.cutter];
exports.hunter.UPGRADES_TIER_3 = [exports.predator, exports.dual, exports.katyusha, exports.ordnance];
exports.binary.UPGRADES_TIER_3 = [exports.dual];
exports.assassin.UPGRADES_TIER_3 = [exports.ranger, exports.railgun, exports.stalker, exports.falcon];
exports.multishot.UPGRADES_TIER_3 = [exports.shotgun, exports.musketeer];
exports.minigun.UPGRADES_TIER_3 = [exports.streamliner, exports.twinigun];
exports.clicker.UPGRADES_TIER_3 = [exports.puncher];
exports.sprayer.UPGRADES_TIER_3 = [exports.engine];
exports.miniswarmer.UPGRADES_TIER_3 = [exports.swarmer, exports.swamper, exports.trapswarmer];
exports.puntGun.UPGRADES_TIER_3 = [exports.screwPunt, exports.bandolier];
exports.screwGun.UPGRADES_TIER_3 = [exports.nailgun, exports.screwPunt];
exports.navyist.UPGRADES_TIER_3 = [exports.phaser, exports.arras, exports.firestarter];
exports.tri.UPGRADES_TIER_3 = [exports.booster, exports.fighter, exports.surfer, exports.bomber, exports.gleamer];
exports.accelerator.UPGRADES_TIER_3 = [exports.bomber, exports.eagle, exports.falcon];
exports.contagion.UPGRADES_TIER_3 = [exports.virus, exports.promenader];
exports.trapguard.UPGRADES_TIER_3 = [exports.gunnertrapper, exports.piston, exports.bomber];
exports.gunner.UPGRADES_TIER_3 = [exports.gunnertrapper, exports.gunnerCruiser, exports.autogunner, exports.machinegunner, exports.hurricane, exports.heavyGunner];
exports.builder.UPGRADES_TIER_3 = [exports.construct, exports.conq, exports.engineer, exports.producer, exports.caltrop, exports.autobuilder];
exports.poundbrid.UPGRADES_TIER_3 = [exports.hybrid];
exports.overbasic.UPGRADES_TIER_3 = [exports.overtrapper];
exports.swarmguard.UPGRADES_TIER_3 = [exports.flankcruiser];
exports.autotrapper.UPGRADES_TIER_3 = [exports.autobuilder];
exports.pelleterhybrid.UPGRADES_TIER_3 = [ /*exports.naturalistbrid*/];
exports.manager.UPGRADES_TIER_3 = [exports.moderator];
exports.motor.UPGRADES_TIER_3 = [exports.overdrive];
exports.autopelleter.UPGRADES_TIER_3 = [exports.autogunner];
exports.autopropeller.UPGRADES_TIER_3 = [exports.autotri];
exports.twin2.UPGRADES_TIER_3 = [exports.twin3];
exports.sniper2.UPGRADES_TIER_3 = [exports.sniper3];
exports.machine2.UPGRADES_TIER_3 = [exports.machine3];
exports.pounder2.UPGRADES_TIER_3 = [exports.pounder3];
exports.trapper2.UPGRADES_TIER_3 = [exports.trapper3];
exports.director2.UPGRADES_TIER_3 = [exports.director3];
exports.grower2.UPGRADES_TIER_3 = [exports.grower3];
exports.pelleter2.UPGRADES_TIER_3 = [exports.pelleter3];
exports.auto3.UPGRADES_TIER_3 = [exports.auto5, exports.swivel3, exports.twin3, exports.sniper3, exports.machine3, exports.pounder3, exports.trapper3, exports.director3, exports.grower3, exports.pelleter3];
exports.arsenal.UPGRADES_TIER_3 = [exports.engineer]
// TIER 4
exports.predator.UPGRADES_TIER_4 = [exports.aggressor];
exports.fume.UPGRADES_TIER_4 = [exports.fumigator, exports.smoker, exports.zamboni, exports.flyswatter];
exports.pentaShot.UPGRADES_TIER_4 = [exports.heptaShot, exports.split, exports.pentaMachine];
exports.spread.UPGRADES_TIER_4 = [exports.scatterGun, exports.gust];
exports.skimmer.UPGRADES_TIER_4 = [exports.hyperskimmer, exports.pather, exports.hovercraft, exports.trebutchet];
exports.twister.UPGRADES_TIER_4 = [exports.demoman, exports.frontier, exports.tornado, exports.twistepult, exports.sharpener];
exports.rocketeer.UPGRADES_TIER_4 = [exports.speedbump, exports.panzerf, exports.kiev, exports.onager];
exports.sidewinder.UPGRADES_TIER_4 = [exports.attackMissiler, exports.jupiter, exports.saturn];
exports.swamper.UPGRADES_TIER_4 = [exports.hovercraft, exports.tornado, exports.panzerf, exports.jupiter];
exports.promenader.UPGRADES_TIER_4 = [exports.pather, exports.frontier, exports.kiev, exports.saturn];
exports.catapult.UPGRADES_TIER_4 = [exports.trebutchet, exports.twistepult, exports.onager, exports.AIM9, exports.curator, exports.inventory, exports.mangonel];
exports.shrapnel.UPGRADES_TIER_4 = [exports.crockett, exports.icbm, exports.rpg, exports.firecracker];
exports.flycatcher.UPGRADES_TIER_4 = [exports.pyramid, exports.flyswatter];
exports.heatwave.UPGRADES_TIER_4 = [exports.feverDream];
exports.cwis.UPGRADES_TIER_4 = [exports.phalanx, exports.lockheed];
exports.phaser.UPGRADES_TIER_4 = [exports.treachery, exports.arras];
exports.engine.UPGRADES_TIER_4 = [exports.steamengine];
exports.manOWar.UPGRADES_TIER_4 = [exports.ambassador, exports.warfare, exports.jellyfish, exports.betelguese];
exports.overlord.UPGRADES_TIER_4 = [exports.cartographer];
exports.factory.UPGRADES_TIER_4 = [exports.industrialist];
exports.battleship.UPGRADES_TIER_4 = [exports.tricruiser, exports.battlecarrier];
exports.triple.UPGRADES_TIER_4 = [exports.tricruiser];
exports.hybrado.UPGRADES_TIER_4 = [exports.viper];
exports.carrier.UPGRADES_TIER_4 = [exports.battlecarrier];
exports.anni.UPGRADES_TIER_4 = [exports.annibrid, exports.redistributor];
exports.hybrid.UPGRADES_TIER_4 = [exports.annibrid, exports.overdestroyer];
exports.naturalistbrid.UPGRADES_TIER_4 = [exports.dropkick];
exports.deluxe.UPGRADES_TIER_4 = [exports.overluxe];
exports.twin3.UPGRADES_TIER_4 = [exports.twin5, exports.swivelTwin];
exports.sniper3.UPGRADES_TIER_4 = [exports.sniper5, exports.swivelSniper];
exports.machine3.UPGRADES_TIER_4 = [exports.machine5, exports.swivelMachine];
exports.pounder3.UPGRADES_TIER_4 = [exports.pounder5, exports.swivelPounder];
exports.trapper3.UPGRADES_TIER_4 = [exports.trapper5, exports.swivelTrapper];
exports.director3.UPGRADES_TIER_4 = [exports.director5, exports.swivelDirector];
exports.grower3.UPGRADES_TIER_4 = [exports.grower5, exports.swivelGrower];
exports.pelleter3.UPGRADES_TIER_4 = [exports.pelleter5, exports.swivelPelleter];
exports.auto5.UPGRADES_TIER_4 = [exports.auto7, exports.swivel5, exports.twin5, exports.sniper5, exports.machine5, exports.pounder5, exports.trapper5, exports.director5, exports.grower5, exports.pelleter5];
exports.swivel2.UPGRADES_TIER_3 = [exports.swivel3, exports.axis4];
exports.swivel3.UPGRADES_TIER_4 = [exports.swivel5, exports.swivelTwin, exports.swivelSniper, exports.swivelMachine, exports.swivelPounder, exports.swivelTrapper, exports.swivelDirector, exports.swivelGrower, exports.swivelPelleter];
exports.axis4.UPGRADES_TIER_4 = [exports.stack6];
exports.gleamer.UPGRADES_TIER_4 = [exports.pulsejet];
exports.puncher.UPGRADES_TIER_4 = [exports.jabber];
exports.bentMachine.UPGRADES_TIER_4 = [exports.pentaMachine];
exports.necromancer.UPGRADES_TIER_4 = [exports.elamnecro, exports.gridlock];
exports.shotgun.UPGRADES_TIER_4 = [exports.heavyShotgun];
exports.infestor.UPGRADES_TIER_3 = [exports.impostor];
exports.naturalist.UPGRADES_TIER_3 = [exports.diploid, exports.haploid, exports.artificialist, exports.entomologist, exports.cleanser, exports.forestfire, exports.scattercannon, exports.kinematic, exports.naturalistbrid, exports.coingun];
exports.minitrap.UPGRADES_TIER_4 = [exports.deluge, exports.biocontain];
// BETA TANKS
exports.acid.UPGRADES_TIER_3 = [exports.disintegrator, exports.mercury, exports.frostbite, exports.formaldehyde];
exports.chiller.UPGRADES_TIER_3 = [exports.paralyzer, exports.blizzard, exports.frostbite, exports.chillbrid];
exports.formaldehyde.UPGRADES_TIER_4 = [exports.biocontain];
exports.chillbrid.UPGRADES_TIER_4 = [exports.overchiller, exports.mortalChill];
exports.acidTrapper.UPGRADES_TIER_4 = [exports.coronavirus, exports.biocontain];
exports.emplacement.UPGRADES_TIER_4 = [exports.enforcement];
// TESTBED TANKS
const closers = ["arenaCloser", "twinCloser", "machineCloser", "sniperCloser", "flankCloser", "directorCloser", "pounderCloser", "trapperCloser", "growerCloser", "pelleterCloser", "propellerCloser", "smasherCloser", "closerCeption", "closer5", "closerCeptionist2"];
for (const closer of closers) {
    makeAI(closer);
}
branch("arenaClosers", "Arena Closers", closers.map(entry => exports[entry]));
branch("betaTanks", "Beta Tanks", [
    exports.naturalist,
    exports.deluxe, exports.mindController,
    exports.acid, exports.chiller,
    exports.foamGun, exports.gondola,
    exports.dogfighter, exports.tripleDouble0,
    exports.ragnar0, exports.enigma,
    exports.megaswarmer, exports.manOWar,
    exports.fume, exports.vulcan,
    exports.taser,
    exports.dualtrapper, exports.twintrap,
    exports.bushwhack, exports.trump0,
    exports.acidTrapper, exports.decimator,
    exports.warden, exports.catO,
    exports.emplacement
]);
branch("sentries", "Sentries", [
    exports.sentrySwarm, exports.greenSentrySwarm,
    exports.sentryGun, exports.sentryTrap,
    exports.sentryOmission, exports.nestDefenderKrios,
    exports.nestDefenderTethys, exports.nestDefenderMnemosyne,
    exports.nestDefenderIapetus, exports.nestDefenderThemis,
    exports.nestDefenderNyx
]);
branch("bosses", "Bosses", [
    exports.eliteDestroyer, exports.eliteGunner,
    exports.eliteSprayer, exports.eliteSprayer2,
    exports.eliteHunter, exports.industry,
    exports.atrium, exports.sentryFragBoss,
    exports.eliteSkimmer, exports.eliteDirector,
    exports.summoner, exports.palisade,
    exports.skoll, exports.hati,
    exports.eggSanctuary, exports.triangleSanctuary,
    exports.squareSanctuary, exports.lucrehulk,
    exports.guardian, exports.greenGuardian,
    exports.sterilizerBoss, exports.quadriatic,
    exports.quadriaticCore, exports.quadriaticShard,
    exports.fallenOverlord, exports.fallenBooster,
    exports.fallenHybrid
]);
branch("devBosses", "Developer Bosses", [
    exports.legendaryQuadralMachine, exports.legendaryCrasher,
    exports.sacredCrasher, exports.catalyst,
    exports.ultimateMothership, exports.hexadecimator,
    exports.heptadecimator, exports.jormun,
    exports.mythicalCrasher, exports.hellbringer,
    exports.tetraplex, exports.apolloCelestial, exports.odinCelestial,
    exports.artemisCelestial, exports.lokiCelestial,
    exports.aresCelestial, exports.rheaCelestial,
    exports.demeterCelestial, exports.athenaCelestial, exports.hadesCelestial, exports.pontusCelestial, exports.raCelestial,
    exports.oceanusCelestial, exports.thorCelestial, exports.nyxCelestial
]);
branch("misc", "Miscellaneous", [
    exports.ohmyfuckinggod, exports.infestor,
    exports.hitScan, exports.superlaser,
    exports.kadenHasAids, exports.ovularBullshit,
    exports.schlieffen, exports.domimind,
    exports.supremeAnni, exports.gustception,
    exports.ligma, exports.paner,
    exports.rose, exports.cycloid,
    exports.cardioid, exports.parabol,
    exports.flex, exports.lissajous,
    exports.vortex, exports.panzerf2,
    exports.mothership, exports.mothershipCeption,
    exports.cwis, exports.turkey
]);
branch("overdone", "Overdone Tanks", [
    exports.stweamwinder, exports.stweamicane,
    exports.octoCeptionist2, exports.pentaCeptionist2,
    exports.fighterCeptionist2, exports.vortexCeptionist2
]);
branch("tieredBosses", "X-K-X Bosses", [
    exports.eggBossTier1, exports.eggBossTier2,
    exports.eggBossTier3, exports.eggBossTier4,
    exports.eggBossTier5, exports.eggBossTier6,
    exports.eggPrinceTier1, exports.eggPrinceTier2,
    exports.eggPrinceTier3, exports.eggPrinceTier4,
    exports.squareBossTier1, exports.squareBossTier2,
    exports.squareBossTier3, exports.triangleBossTier1,
    exports.triangleBossTier2, exports.triangleBossTier3
]);
branch("dominators", "Dominators", [
    exports.destroyerDominator, exports.gunnerDominator,
    exports.trapperDominator, exports.droneDominator,
    exports.steamrollerDominator, exports.crockettDominator,
    exports.spawnerDominator, exports.autoDominator,
    exports.destroyerDominatorSanctuary, exports.gunnerDominatorSanctuary,
    exports.trapperDominatorSanctuary, exports.droneDominatorSanctuary,
    exports.steamrollerDominatorSanctuary, exports.autoDominatorSanctuary,
    exports.crockettDominatorSanctuary, exports.spawnerDominatorSanctuary
]);
branch("removedTanks", "Removed Tanks", [
    exports.basic
]);
branch("americanCarriers", "American", [
    exports.independence, exports.lexington,
    exports.yorktown, exports.midway,
    exports.saipan, exports.enterprise,
    exports.fdr
]);
branch("japaneseCarriers", "Japanese", [
    exports.ryujo, exports.shokaku,
    exports.taiho, exports.hakuryu
]);
branch("germanCarriers", "German", [
    exports.rhein, exports.wesser,
    exports.augustVonParceval, exports.manfredVonRichthofen,
    exports.erichLoewenhardt, exports.grafZeppelin,
    exports.maxImmelmann
]);
branch("russianCarriers", "Soviet", [
    exports.komsomolets, exports.serov,
    exports.pobeda, exports.nakhimov,
    exports.chkalov
]);
branch("britishCarriers", "British", [
    exports.hermes, exports.argus,
    exports.furious, exports.audacious,
    exports.arkRoyal, exports.indomitable,
    exports.implacable, exports.illustrious,
    exports.indefatigable, exports.malta
]);
branch("aircraftCarriers", "Aircraft Carriers", [
    exports.americanCarriers, exports.germanCarriers,
    exports.russianCarriers, exports.britishCarriers,
    exports.japaneseCarriers
]);
branch("navalShips", "Naval Ships", [
    exports.aircraftCarriers, exports.alexanderNevsky,
    exports.yamato, exports.petropavlovsk
]);
exports.betaTester.UPGRADES_TIER_1 = [exports.betaTanks, exports.removedTanks, exports.observer];
exports.seniorTester.UPGRADES_TIER_1 = [exports.betaTester, exports.bosses, exports.dominators, exports.sentries];
exports.testbed.UPGRADES_TIER_1 = [exports.betaTester, exports.devBosses, exports.bosses, exports.arenaClosers, exports.dominators, exports.navalShips, exports.misc, exports.sentries, exports.overdone, exports.tieredBosses];
exports.baseStats = base;
exports.g = g;
exports.setBuild = setBuild;
exports.combineStats = combineStats;
