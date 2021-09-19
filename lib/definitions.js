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
const modifyGStat = (...data) => { // modifyGStat(0, .5); modifyGStat([0, .5], [1, 2]);
    let output = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    if (typeof data[0] === "number") output[data[0]] = data[1];
    else for (let set of data) output[set[0]] = set[1];
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
    fake: [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1],
    bullet: [20, 1.2, .1, 1, 1, .875, 1.05, 6, .875, 1.1, 1.25, 15, 1],
    explosion: [1, 0, .1, 50, 45, .125, 100, 0, 0, 1.75, 5, 1, 2],
    drone: [65, .25, .1, .55, .2, 1.575, 1.6, 2, 0.9, 1, 1.7, 1, .8],
    trap: [35, 1, .08, .65, .9, .3, .8, 4.5, 1, 1.25, 1, 8, 5],
    swarm: [22, .25, .05, .4, .85, .5, .675, 3.5, .95, 1.3, 1.25, 5, 1.25],
    spawner: [45, 1, .1, .75, 4.5, .3, .2, 2, 1, 1, 1.5, 1, 1.25],
    minion: [1.25, 1, 1, 1, .55, .55, .55, 1, 1, 1, 1, 1, 1],
    // Level 15 Stats
    twin: [1, .5, .9, 1, .9, .9, .9, 1, 1, 1, 1, 1, 1],
    pound: [1.5, 2.25, .75, 1, 1.53, 1.53, 1.52, .85, 1, 1, 1, 1, 2],
    sniper: [1.25, 1.1, .5, 1, 1.1, 1, 1.3, 1.2, 1.4, 1.1, 1.2, .25, 1],
    flank: [1, 1, 1, 1, 1, .95, .9, 1, .875, 1, 1, 1, 1],
    mach: [.55, 1.2, 2, .75, .8, .8, .8, .9, .85, 1, 1, 1.95, 1],
    turret: [2, .5, 1, 1, .8, .8, 1.4, 1.1, 1.1, 1.1, 1, 1, 1],
    grower: [1, 1, 1, .75, 1.2, .9, 1, .9, 1, 1, 2, 1, .5],
    pelleter: [.8, .4, 1.5, 1, 1.33, .425, 1.15, .9, .8, .9, 1, 1.5, 1],
    thruster: [.7, 1.2, 1, 1, .9, .9, .9, .4, 1, 1, 1, 2, 1],
    // Level 30 Stats
    tri: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    destroy: [2, 2.25, .75, 1, 1.65, 1.65, 1.2, .8, 1, 1, 1, 1, 2],
    overseer: [1.33, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    double: [1, .2, 1, 1, .9, .9, .9, 1, 1, 1, 1, 1, 1],
    bent: [1, 1, 1, 1, 1, .95, 1.2, 1, 1, 1, 1, 1, 1],
    block: [1.2, 2, .1, 1.5, 2, .98, .91, 1.465, 2.475, 1.215, 1.1, 1, 1.5],
    assassin: [1.2, 1, 1, 1, 1, 1.05, 1.05, 1.2, 1, 1, 1.15, 1, 1],
    mini: [1, .6, .25, .85, .6, .6, 1.05, 1.25, 1, 1.25, 1, .6, 1],
    missileTrail: [.6, .25, 2, 1, 1, .9, .7, .4, 1, .5, 1, 1, 1],
    twisterMissileTrail: [1.75, 1, 1, 1, .8, .725, .8, 1, 1, .8, 1, 1, 1],
    sidewinderMissileTrail: [1, 1, 1, 1, 1, 1, .75, .5, .5, 1, 3, 1, 1],
    sidewinderMissileTrail2: [1.2, .8, 5, 1, .9, .9, 1.5, .8, .6, .8, 1, 3, 1],
    attackMissileTrail: [1.2, 1, 1, 1, .8, .667, .8, 1, 1, 1, 1, 1.5, 1],
    rocketeerMissileTrail: [.5, 7, 1.5, .8, .8, .7, 1, .9, .8, 1, 1, 5, 1],
    hypermissileTrail: [2, 1, 1, 1, 1.05, 1.05, 1.05, 1.1, .8, .8, 1, 1, 1],
    speedbumpMissileTrail: [4, .75, 1, 1, .5, .6, .5, 1, 1, 1, 1, .75, 1],
    panzerfMissileTrail: [1.5, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1],
    rpgRocket: [1, 1, 3, 1, .4, .6, .3, 1, 1, 1, 1, 4, 1],
    launcher: [1.5, 1.5, .1, .85, .875, .9, 1, 1, 1, 1, 1, 1, 1.5],
    guard: [1, 1.4, 1, 1, 1, .95, .9, 1, .875, 1, 1.25, 1, 1],
    guardtrap: [1, .5, 1, 1.1, 1.1, 1, 1.1, 1, 1.2, 1.2, 1.1, 1, 1.1],
    hexa: [1, 1, 1, 1, 1, .95, .95, 1, 1, 1, 1, 1, 1],
    lightning: [1, 1, 1.1, 1, .6, 1.02, 1, 1.1, 1.1, 1, 1, 1, 1],
    swarmguard: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1.25, 1, 1, 1],
    bee: [1.25, 1, 1.2, 1, .65, 1, .9, .5, 1.15, 1, 1, 1, 1],
    hiveBees: [1.2, 1, 1, 1, .9, .9, .9, .85, 1, 1, 1, 1, 1],
	  navyistt: [.25, 3, 2, .9, 1, 0, 1, .9, .85, 0.2, 1, 2.55, 1],
    navyist: [1.1, 1, 1, .95, .8, 1, 1, 1, .75, 1, 1, 1, 1],
    hive: [1.25, 1, 1.05, .834, 1.2, 1, .9, .9, .85, .9, 1, 1, 1],
    boomerang: [1.25, 2, .1, 1.5, 2, .95, .9, 1.465, 2.475, 1.215, 1.1, 1, 1.5],
    sunchip: [4, 1, 1, 1.25, 1.1, .6, 1, .45, 1, 1, 1, 1, 1.5],
    taurus: [1.25, 1, 1, 1.5, 0.25, 0, 2, .001, .001, .2, 1, 1, 1],
    taurusPortalScaling: [1, 1, 0.1, 1, .4, .6, .9, 1, 1, 0.7, 1, 2, 1],
    boxerback: [1, 1.2, 1, 1, .9, .95, .9, 1, 1, .8, 1, 1, 1],
    boxerfront: [1, 1.2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    quadtrap: [1.025, 1, 1, 1, 1, 1, 1, 1, 1, .5, 1, 1, 1],
    hunter: [1.05, 1.15, 1.05, 1, .8, .7, .95, 1, 1, 1, 1, 1, 1],
    hunter2: [1, .55, 1, 1, .9, 1.1, .8, 1, 1, 1, 1, 1, 1],
    binary: [1.2, 1.15, 1.05, 1, .8, .7, .95, 1, 1, 1, 1, 1, 1],
    binary2: [1, .55, 1, 1, .9, 1.1, .8, 1, 1, 1, 1, 1, 1],
    hewn: [.85, 0, 1, 1, 1.3, .5, 1, .8, 1, 1.2, .5, 1, 1],
    contagi: [.95, 1, 1, 1, 1.35, .6, .5, 1, 1, 1, 1.5, 1, 1],
    pathogi: [.95, 1, 1, 1, 1.35, .6, .5, 1, 1, 1, 1.5, 1, 1],
    click: [1, .25, .5, 1, .6, .85, .8, .9, .975, 1, .9, .25, 1],
    multishot: [3.5, .4, 1.1, 1.5, .875, .65, .72, 1.675, .7, 1, 1.2, 1.4, 1],
    arthropoda: [1.1, 1, 1, 1, 1.5, .3, .8, 1, 1, 1, .5, 1, 1],
    heatseeker: [1.1, 1, 1, 1, 1, 1, 1, .7, 1, 1, 1, 1, 1],
    twinMachine: [1, 1.25, 1.2, 1.35, 1, 1, 1, 1, 1, 1, 1, 1.5, 1],
    botanist: [.9, .9, 1, 1, 1, .9, 1, 1, 1, 1.1, 1, 1, 1],
    spray: [1, 1, 1, 1, .5, 1, .9, 1, 1, 1, .9, 1, 1.1],
    punt: [1.25, 1, 1, 1, .7, .34, .8, 1, 1, 1, 1, 1, 1],
    gunner: [1, 1.1, .2, 1, .9, .65, 1.2, 1, 1.1, 1.1, 1, .2, 1],
    screwGun: [1.5, 1.5, .1, 1, 1.2, 1.1, 2, 1.5, 1.1, 1.2, 1, .1, 1],
    // Level 45 Stats
    anni: [1.25, 1.5, 1, 1, 1.15, 1.15, 1.15, 1, 1, .9, 1, 1, 1.05],
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
    twister: [1.175, .8, 1, 1.15, 1.2, .9, .8, .9, .75, 1, 1.5, 1, 1],
    sidewinder: [1, 1, 2, 1.05, 1, .9, 1.25, .8, 1, 1, 1, 1, 1],
    rocketeer: [1.5, 1, .9, .9, 1.35, 1.2, 1.2, .225, 1, 1.3, 1, 1, 1.1],
    shrapnel: [3, 1, 1, 1.05, .7, 1.1, 1.1, 1, 1, .5, 1, 1, 1],
    catapult: [1.5, 1, 1, 1, .8, .6, 1, .8, 1, .675, 1, 1, 1],
    catapultMissile: [1.25, .1, 1, 1, .4, .4, 1, 1, 1, .675, 1, 3, 1],
    speedbump: [1.5, 1.1, 1, 1.175, .8, 1.05, .9, 1, 1, .9, 1, 1, 1],
    flycatcher: [1.33, 1.05, .5, 1, .95, .8, 1, 1.2, 1.4, 1, 1, .25, 1],
    heatwave: [.55, 1.2, 2, .75, .8, .8, .8, .9, .85, 1, 1, 3, 1],
    pyramid: [1, .6, 1, .8, .6, .55, 1, 1, .8, 1.25, 1, .6, 1],
    feverDream: [1.6, 0, 1, 1, .3, .8, 1, .4, 1, .7, .5, 1, 1],
    flyswatterFlare: [.8, 0, .001, 2.2, 1.2, .2, 3, 0, 1, .7, 4, 1, 1],
	  phaserFlare: [1.45, 0, .001, 1.7, 1.2, .2, 3, 0, 1, .7, 4, 1, 1],
	  treachery: [1.75, 1, 1, 1.4, 1.2, 1, 1, 1, 2, 1, 1, 1, 1],
	  treacheryFlare: [0.25, 0, .001, 1.4, 1.2, .2, 3, 0, 1, .2, 4, 1, 1],
    superstorm: [.8, .8, 1, 1, 1, .7, 1, 1, 1, 1.3, 1, 1, 1],
    battle: [1, .5, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1],
    ranger: [1.15, 1, 1, 1, 1, 1.05, 1.05, 1.15, 1, 1, 1.1, 1, 1],
    dual: [.975, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.1, 1, .95],
    shotgun: [1.5, .975, 1, 1, .9, .875, .9, 1, 1, 1, 1, 1, 1.1],
    stream: [1.15, 1, 1, 1, 1, .95, 1, 1, 1, 1, 1, 1, 1],
    punch: [1, 1, 1, 1, 1.15, 1, 1.1, 1, 1, 1, 2, 1, 1],
    engine: [1.1, .65, 1, 1, .8, 1.2, .8, 1, 1, 1, 1, 1, 1],
    swarmer: [1.05, 1, 1, 1, 1.2, 1, 1, 1, 1, .9, 1, 1, 1],
    nailgun: [1.2, 1, 1, 1, 1, .7, 1.5, 1.2, 1, 1.2, 2, 1, 1],
    bandolier: [2, .8, 1, 1, .667, .8, .667, 1, .9, .8, 1, 1, 1],
    surfer: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    rifle: [.85, .85, 1, 1, .9, .9, 1.1, 1.05, 1.05, .9, 1, 1, 1],
    virus: [1, 1.1, .5, 1, 1.1, 1, 1.3, 1.2, 1.4, 1.1, 1.2, .25, 1],
    // NPCs
    protectorSwarm: [3, 0, 2, 1, 2, 2, 2, 2, 1, .75, 2, 1, 1],
    destroyerDominator: [5, 0, 1, 1, 7.5, 5, 2, .5, 1, 1, 1, 1, 1],
    gunnerDominator: [.75, 0, 2, .85, .325, .6, .9, .9, 1, 1, 2, 1, 1],
    trapperDominator: [1.25, 0, .1, 1, 1, 1, 1, .8, 1, .9, 1, 1, 1],
    mothership: [2, 1, 1, 1, .5, .75, .75, 1, 1, 1, 2, 1, 1],
    arenaCloser: [.825, .5, 1, 1, 2, 2, 2, 1.5, 1.5, 1, 1, 1, 1],
    sentrySwarm: [1.5, 2, 1, 1, 1.5, 1.5, 1.5, 1.2, 1, 1, 1, 1, 1],
    nestDefenderTrapTurret: [5, 1, .5, 1, 2, 2, 1, .6, 1, .8, 1.2, 1, 1.5],
    crasherSpawner: [2, 1, 1, 1, .25, .25, .25, .5, 1, 1, 1, 1, 1],
    eliteGunner: [2.25, 2, 2, .8, 1.25, 1.25, 1.25, 1.1, 1.1, .8, 2, 5, 1],
    industry: [.8, 1, 1, .275, 1.75, 1, .25, .9, 1, 1, 3, 1, 1],
    summoner: [.1, 1, 1, 1, .225, .225, 1, 1, 1, 1, 1, 1, 1],
    fallenOverlord: [.1, 1, 1, .45, .2, .2, 1, 2, 1.1, 1, 1, 3, .8],
    eliteSkimmer: [1.75, 0, 1, .85, 1.6, .5, 1, .9, 1, .8, 1, .5, 1.5],
    eliteSkimmerMissile: [2, .9, 2, 1, 1.25, 1.25, 1.25, .8, 1, .8, 1, 2, 1],
    eggPrinceSwarm: [1.5, 1, 1, 1, .5, 2, 1, 3, 1.5, .9, 1, 1, 1],
    eggPrinceTier3Swarm: [.8, 1, 1, .6, .9, .8, 1, 1, .9, 1, 1, 1, 1],
    eggPrinceBullet: [1, 0, .1, 1, .5, .5, 1.5, 1.5, 1, .9, 1, .1, 1],
    aifix: [10000000, 1, 1, 1, 1, 1, 1, 1, 1000, 1, 1, 1, 1],
    serpent: [8, 0, .000001, 1.2, 1, 1, 1, .1, 0, 2, 1, 1, 1],
    serpentTurret: [3, 0, 1, 1, 1, 1, 1, 1.1, 1.8, .8, 1, 1, 1],
    //  EXTRA
    norecoil: [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    threeQuartSize: modifyGStat(3, .75),
    threeQuartSlow: modifyGStat([7, .75], [8, .75]),
    oneQuartMoreReload: modifyGStat(0, 1.25),
    doubleReload: modifyGStat(0, 2),
    oneQuartMoreHealth: modifyGStat(4, 1.25),
    oneQuartMoreDamage: modifyGStat(5, 1.25),
    celestialHeavyWeapon: [2, 1, 1, 1, 1.5, 1, 1, 1, 1, 1, 2, 1, 2],
    celestialTrapTurret: [3, 1, 1, 1, 1.25, 1.15, .25, 1, 1, .65, 1.5, 1, 1],
    apolloSprayer: [1.4, 1, 1, 1, 1, 1, 1, 1, .75, .9, 1, 1.5, 1.25],
    demeterSwarmer: [1.2, 1, 2, .875, 2, .4, .5, 2, 0, 1.25, 1, 1, 1],
    demeterSwarm: [3, 1, 1, 1, 1.5, 1.5, 1.5, 1.5, 1.5, 0.5, 1, 1, 2],
    aresSwarm: [.9, 1, 1, .75, .6, .8, 1, 1.6, 1, .8, 1, 3, 1.1]
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
const base = {
    ACCEL: 1.6,
    SPEED: 6.5,
    HEALTH: 20,
    DAMAGE: 5,
    RESIST: 1,
    PENETRATION: 1.05,
    SHIELD: 5,
    REGEN: 0.001,
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
            DAMAGE: ((wepDamageFactor * wepHealthFactor) * damage) * .4,
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
        DAMAGE_TURRET: true,
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

function bossStats(options = {}) {
    if (!options.health) options.health = 1;
    if (!options.damage) options.damage = 1;
    if (!options.speed) options.speed = 1;
    if (!options.fov) options.fov = 1;
    return {
        HEALTH: (base.HEALTH * 150) * options.health,
        DAMAGE: (base.DAMAGE * 1.1) * options.damage,
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
        HEALTH: (base.HEALTH * 0.05) * options.health,
        DAMAGE: (base.DAMAGE * 2) * options.damage,
        SPEED: (base.SPEED * 2) * options.speed,
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
const wepHealthFactor = 1.25;
const wepDamageFactor = 1.3;
const basePolygonDamage = 2.3;
const basePolygonHealth = 2.3;
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
        PUSHABILITY: .95,
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
exports.growBullet = {
    PARENT: [exports.bullet],
    MOTION_TYPE: 'grower'
};
exports.flareBullet = {
    PARENT: [exports.bullet],
    SHAPE: 4,
    PERSISTS_AFTER_DEATH: true
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
    BUFF_VS_FOOD: true
};
exports.sunchip = {
    PARENT: [exports.drone],
    LABEL: "Square",
    SHAPE: 4,
    NECRO: true
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
        DAMAGE: 3,
        PENETRATION: 1,
        RANGE: 450,
        DENSITY: 2,
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
        RESIST: 1.6, //1.6
        RANGE: 225,
        DENSITY: 12,
        PUSHABILITY: .8,
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
    LABEL: "dev",
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
    PARENT: [exports.testbedParent],
    LABEL: "Developer"
};
exports.projects = {
    PARENT: [exports.testbedParent],
    LABEL: "Developer Projects"
};
exports.ready = {
    PARENT: [exports.testbedParent],
    LABEL: "Ready For Release"
};
exports.needbalance = {
    PARENT: [exports.testbedParent],
    LABEL: "Needed Balancing"
};
exports.needbalance2 = {
    PARENT: [exports.testbedParent],
    LABEL: "Needed Balancing"
};
exports.needbalance3 = {
    PARENT: [exports.testbedParent],
    LABEL: "Needed Balancing"
};
exports.needbalance4 = {
    PARENT: [exports.testbedParent],
    LABEL: "Needed Balancing"
};
exports.unfinished = {
    PARENT: [exports.testbedParent],
    LABEL: "Unfinished Projects"
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
    HEALTH_WITH_LEVEL: false,
    DANGER: 4
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
    ALPHA: 0.15,
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
    MAX_CHILDREN: 6,
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
exports.virus = {
    PARENT: [exports.genericTank],
    LABEL: "Virus",
    DANGER: 7,
    GUNS: [{
        POSITION: [20, 5, 1, 0, 0, 0, 0, ],
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
    DANGER: 6,
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
exports.hybrid = makeHybrid(exports.destroyer, "Hybrid");
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
    GUNS: [{
        POSITION: [19, 11, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.boxerfront]),
            TYPE: exports.bullet,
            ALT_FIRE: true
        }
    }, {
        POSITION: [16, 7, 1, 0, 2.5, 145, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.boxerback]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 7, 1, 0, -2.5, 215, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.boxerback]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 8, 1, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent, g.boxerback]),
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
    }, {
        POSITION: [19, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.fake, g.norecoil]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [5, 12, -1.2, 7.5, 0, 0, 0, ],
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.multishot, g.shotgun, g.fake, g.norecoil ]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [8, 14, -1.3, 4, 0, 0, 0],
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
}, );
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
    }, ],
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
    }, ]
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
        POSITION: [6, 8.5, -1.6, 7.8, 0, 0, 0, ],
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
        POSITION: [5, 8.5, -1.6, 7.8, 0, 0, 0, ],
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
        POSITION: [6, 8.5, -1.6, 7.8, 0, 0, 0, ],
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
exports.predator = {
    PARENT: [exports.genericTank],
    LABEL: 'Predator',
    DANGER: 7,
    BODY: {
        ACCELERATION: base.ACCEL * .9,
        FOV: base.FOV * 1.25
    },
    SCOPE: true,
    GUNS: [{
        POSITION: [24, 7, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.hunter2]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [21, 10.5, 1, 0, 0, 0, 0.175],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter, g.hunter2]),
            TYPE: exports.bullet
        },
    }, {
        POSITION: [18, 14, 1, 0, 0, 0, 0.25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.hunter]),
            TYPE: exports.bullet
        },
    }]
};
exports.dual = {
    PARENT: [exports.genericTank],
    DANGER: 7,
    LABEL: "Dual",
    BODY: {
        ACCELERATION: base.ACCEL * .95,
        FOV: base.FOV * 1.2,
        HEALHT: base.HEALTH * .975
    },
    GUNS: [{
        POSITION: [20, 5, 1, 0, 5.5, 0, 0.25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.hunter, g.hunter2, g.dual]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 5, 1, 0, -5.5, 0, 0.75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.hunter, g.hunter2, g.dual]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 7.5, 1, 0, 5.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.hunter, g.dual]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 7.5, 1, 0, -5.5, 0, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.hunter, g.dual]),
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
exports.sharpenerMissile = {
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
        for (let i = 0; i < 6; i++) {
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
        for (let i = 0; i < 3; i ++) {
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [18, 10, 1, 0, -5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [21, 10, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent]),
            TYPE: exports.bullet
        }
    }]
};
exports.pentaShot = {
    PARENT: [exports.genericTank],
    LABEL: "Penta Shot",
    DANGER: 7,
    GUNS: [{
        POSITION: [16, 8, 1, 0, -3, -30, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 8, 1, 0, 3, 30, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 8, 1, 0, -2, -15, .333],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.bent]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 8, 1, 0, 2, 15, .333],
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
exports.benthybrid = makeHybrid(exports.tripleshot, "Bent Hybrid");
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
exports.propeller = {
    PARENT: [exports.genericTank],
    LABEL: "Propeller",
    DANGER: 5,
    GUNS: [ {
        POSITION: [16, 8, 1, 0, 0, 150, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.thruster]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 210, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.thruster]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }]
};
exports.accelerator = {
    PARENT: [exports.genericTank],
    LABEL: "Accelerator",
    DANGER: 6,
    GUNS: [ {
        POSITION: [16, 8, 1, 0, 0, 150, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.thruster]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 210, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.thruster]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 180, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.thruster]),
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.tri]),
            TYPE: exports.bullet,
            LABEL: "Front"
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 150, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.thruster]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 210, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.thruster]),
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.tri]),
            TYPE: exports.bullet,
            LABEL: "Front"
        }
    }, {
        POSITION: [13, 8, 1, 0, -1, 135, .6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.thruster]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [13, 8, 1, 0, 1, 225, .6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.thruster]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 145, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.thruster]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 215, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.thruster]),
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.tri]),
            TYPE: exports.bullet,
            LABEL: "Front"
        }
    }, {
        POSITION: [16, 8, 1, 0, -1, 90, .05],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.tri]),
            TYPE: exports.bullet,
            LABEL: "Side"
        }
    }, {
        POSITION: [16, 8, 1, 0, 1, -90, .05],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.tri]),
            TYPE: exports.bullet,
            LABEL: "Side"
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 150, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.thruster]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 210, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.thruster]),
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.tri]),
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.thruster]),
            TYPE: exports.bullet,
            LABEL: gunCalcNames.thruster
        }
    }, {
        POSITION: [16, 8, 1, 0, 0, 210, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.thruster]),
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.thruster]),
            TYPE: exports.bullet,
            LABEL: "Wing"
        }
    }, {
        POSITION: [18, 8, 1, 0, 0, 230, .1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.flank, g.thruster]),
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
                SHOOT_SETTINGS: combineStats([g.trap, g.flank, g.bee, g.hiveBees]),
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
        POSITION: [18, 5, 1, 0, 0, 0, 0, ],
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
    LABEL: "Machine Gun",
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
    DANGER: 7,
    GUNS: [{
        POSITION: [25.75, 6.5, 1, 0, 0, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.spray, [1, 0.325, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 10, 1.4, 11, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.engine, [1, 0.325, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [21.25, 7, 1, 0, 0, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.spray, [1, 0.325, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.1, 1]]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 10, 1.4, 6.5, 0, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.mach, g.engine, [1, 0.325, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.1, 1]]),
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
    BODY: {
        ACCELERATION: base.ACCEL * 1.1,
    },
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
            COLOR: 11
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
            COLOR: 11
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
            COLOR: 11
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
exports.screwGun = {
    PARENT: [exports.genericTank],
    DANGER: 6,
    LABEL: "Screwgun",
    GUNS: [{
        POSITION: [19, 2, 1, 0, -2.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwGun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 2, 1, 0, 2.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwGun]),
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwGun, g.nailgun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 2, 1, 0, 2.5, 0, .667],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwGun, g.nailgun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 2, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwGun, g.nailgun]),
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.screwGun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 2, 1, 0, -2.5, 0, 1 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.screwGun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 2, 1, 0, 2.5, 0, 2 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.screwGun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 2, 1, 0, -2.5, 0, 3 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.screwGun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 2, 1, 0, 2.5, 0, 4 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.screwGun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [15, 2, 1, 0, -2.5, 0, 5 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.punt, g.screwGun]),
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwGun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 2, 1, 0, 2.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwGun]),
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwGun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 2, 1, 0, 2.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwGun]),
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwGun]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [19, 2, 1, 0, 2.5, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwGun]),
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
        for (let i = 1; i < 6; i ++) {
            output.push({
                POSITION: [10, 8, 0, 360 / 6 * i, 90, 0],
                TYPE: exports.cwisTurret
            });
        }
        return output;
    })()
};
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
exports.autoLancer = makeAuto(exports.lancer);
exports.spoopyGhost = makeHybrid(exports.lancer, "👻 Spoopy Ghost 👻");
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
        health: 15,
        damage: 2,
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
exports.nestDefenderMnemosyneHeatseeker = {
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.heatseeker, g.turret]),
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
exports.nestDefenderIapetusKraken = {
    PARENT: [exports.turretParent],
    SHAPE: 4,
    GUNS: [{
        POSITION: [20, 3, 1, 0, -4, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.sniper, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [20, 3, 1, 0, 4, 0, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper, g.sniper, g.turret]),
            TYPE: exports.bullet
        }
    }]
};
exports.nestDefenderThemisLightning = {
    PARENT: [exports.turretParent],
    MAX_CHILDREN: 4,
    GUNS: [{
        POSITION: [6, 10, 1.2, 12, 0, 0, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.lightning, [4, 1, 1, 1, 0.4, 0.4, 0.6, 0.5, 1, 1, 2, 2, 1]]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone
        }
    }, {
        POSITION: [6, 10, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.lightning, [4, 1, 1, 1, 0.4, 0.4, 0.6, 0.5, 1, 1, 2, 2, 1]]),
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
exports.serpentAutoTurret = {
    PARENT: [exports.turretParent],
    INDEPENDENT: true,
    AI: {
        SKYNET: true
    },
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
exports.fallenOverlord = {
    PARENT: [exports.miniboss],
    LABEL: "Fallen Overlord",
    BODY: bossStats(),
    SIZE: 30,
    COLOR: 6,
    VALUE: 300000,
    GUNS: [{
        POSITION: [6, 12, 1.2, 8, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overlord, g.fallenOverlord]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 8
        }
    }, {
        POSITION: [6, 12, 1.2, 8, 0, 270, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overlord, g.fallenOverlord]),
            TYPE: exports.drone,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 8
        }
    }, {
        POSITION: [6, 12, 1.2, 8, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overlord, g.fallenOverlord]),
            TYPE: [exports.drone, {
                INDEPENDENT: true,
                BODY: {
                    FOV: 3
                }
            }],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 8
        }
    }, {
        POSITION: [6, 12, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overlord, g.fallenOverlord]),
            TYPE: [exports.drone, {
                INDEPENDENT: true,
                BODY: {
                    FOV: 3
                }
            }],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 8
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
exports.deltrabladeLauncher = makeAuto({
    PARENT: [exports.turretParent],
    GUNS: [{
        POSITION: [9, 11, -.5, 12, 0, 0, 0]
    }, {
        POSITION: [19, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.launcher, g.turret]),
            TYPE: exports.launcherMissile,
            STAT_CALCULATOR: gunCalcNames.sustained,
            COLOR_OVERRIDE: 3
        }
    }, {
        POSITION: [12, 12, -1.5, 0, 0, 0, 0]
    }]
}, "Launcher", {
    type: exports.egg,
    size: 15
});
exports.deltrablade = {
    PARENT: [exports.miniboss],
    LABEL: "Deltrablade",
    COLOR: 2,
    SHAPE: shapeConfig.triBlade,
    SIZE: 45,
    BODY: bossStats(),
    GUNS: (() => {
        let output = [];
        for (let i = 0; i < 3; i++) {
            output.push({
                POSITION: [8, 4, 1, 0, 0, 360 / 3 * i + 60, 0]
            }, {
                POSITION: [2, 4, 1.4, 8, 0, 360 / 3 * i + 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pound]),
                    TYPE: exports.trap,
                    COLOR_OVERRIDE: 3
                }
            });
        }
        return output;
    })(),
    TURRETS: (() => {
        let output = [];
        for (let i = 0; i < 3; i++) {
            output.push({
                POSITION: [6, 7.5, 0, 360 / 3 * i, 240, 1],
                TYPE: exports.deltrabladeLauncher
            });
        }
        return output;
    })()
};
exports.trapeFighter = {
    PARENT: [exports.miniboss],
    LABEL: "Trape Fighter",
    SIZE: 37.5,
    BODY: bossStats(),
    FACING_TYPE: "toTarget",
    COLOR: 105,
    SHAPE: shapeConfig.grouper,
    VALUE: 250000,
    GUNS: [{
        POSITION: [14, 2, 1, 0, -2.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 3
        }
    }, {
        POSITION: [14, 2, 1, 0, 2.5, 0, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.sniper]),
            TYPE: exports.bullet,
            COLOR_OVERRIDE: 3
        }
    }, {
        POSITION: [3.5, 9, 1.2, 6, 0, 68, 1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, [0.5, 0, 1, 0.7, 0.1, 0.1, 0.8, 0.1, 1, 1, 1, 1, 1]]),
            TYPE: [exports.grouper, {
                TYPE: "drone",
                CONTROLLERS: ["nearestDifferentMaster", "hangOutNearMaster"],
                INDEPENDENT: true
            }],
            MAX_CHILDREN: 4,
            AUTOFIRE: true
        }
    }, {
        POSITION: [3.5, 9, 1.2, 6, 0, -68, 1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, [0.5, 0, 1, 0.7, 0.1, 0.1, 0.8, 0.1, 1, 1, 1, 1, 1]]),
            TYPE: [exports.grouper, {
                TYPE: "drone",
                CONTROLLERS: ["nearestDifferentMaster", "hangOutNearMaster"]
            }],
            MAX_CHILDREN: 4,
            AUTOFIRE: true
        }
    }]
};
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
exports.ek2Gunner = {
    PARENT: [exports.turretParent],
    LABEL: "Gunner",
    GUNS: [{
        POSITION: [12, 3.5, 1, 0, 7.25, 0, .5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [12, 3.5, 1, 0, -7.25, 0, .75],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 3.5, 1, 0, 3.75, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [16, 3.5, 1, 0, -3.75, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.gunner, g.turret]),
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
exports.hunterTurret = {
    PARENT: [exports.turretParent],
    LABEL: "Hunter",
    GUNS: [{
        POSITION: [20, 13.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.pound, g.turret]),
            TYPE: exports.bullet
        }
    }, {
        POSITION: [17, 16, 1, 0, 0, 0, .25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.pound, g.turret]),
            TYPE: exports.bullet
        }
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
exports.celestial = {
    PARENT: [exports.miniboss],
    LABEL: "Celestial",
    SHAPE: 9,
    SIZE: 55,
    VARIES_IN_SIZE: false,
    VALUE: 1000000,
    BODY: bossStats({
        health: 1.25,
        speed: 1
    }),
    ABILITY_IMMUNE: true,
    BROADCAST_MESSAGE: "A Celestial has been defeated!"
};
exports.eternal = {
    PARENT: [exports.miniboss],
    LABEL: 'Eternal',
    BODY: bossStats({
        health: 1.75,
        speed: 0.8,
        regen: 0.1,
        shield: 0.25
    }),
    VALUE: 5000000,
    SIZE: 85,
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
    MAX_CHILDREN: 28,
    GUNS: (() => {
        let output = [];
        for (let i = 0; i < 7; i++) output.push({
            POSITION: [4, 6.5, 1.2, 7.5, 0, ((360 / 7) * i) + (360 / 14), 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.turret]),
                TYPE: [exports.sunchip, {
                    INDEPENDENT: true,
                    BODY: {
                        FOV: 1.175
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
            SHOOT_SETTINGS: combineStats([g.bullet, g.sniper, g.rifle, g.turret]),
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
    MAX_CHILDREN: 17,
    GUNS: (() => {
        let output = [];
        for (let i = 0; i < 7; i++) output.push({
            POSITION: [4, 6.5, 1.2, 7.5, 0, ((360 / 7) * i) + (360 / 14), 2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.threeQuartSlow, g.turret]),
                TYPE: [exports.drone, {
                    INDEPENDENT: true,
                    BODY: {
                        FOV: 1.175
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
    MAX_CHILDREN: 14,
    GUNS: (() => {
        let output = [];
        for (let i = 0; i < 7; i++) output.push({
            POSITION: [4, 6.5, 1.2, 7.5, 0, ((360 / 7) * i) + (360 / 14), 2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.threeQuartSlow, g.threeQuartSlow, g.oneQuartMoreHealth, g.oneQuartMoreDamage, g.turret]),
                TYPE: [exports.pentagonDrone, {
                    INDEPENDENT: true,
                    BODY: {
                        FOV: 1.175
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
                TYPE: [exports.swarm, { INDEPENDENT: true }],
                AUTOFIRE: true,
                SUNC_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.swarm
            }
        }, {
            POSITION: [4.5, 2, 0.75, 7.5, 1.5, ((360 / 7) * i) + (360 / 14), 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.demeterSwarm, g.turret]),
                TYPE: [exports.swarm, { INDEPENDENT: true }],
                AUTOFIRE: true,
                SUNC_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.swarm
            }
        }, {
            POSITION: [6, 2, 0.75, 7.5, 0, ((360 / 7) * i) + (360 / 14), 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.demeterSwarm, g.turret]),
                TYPE: [exports.swarm, { INDEPENDENT: true }],
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
exports.aresTrapSwarmer = {
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
exports.aresTrapSwarmerBody = {
    LABEL: "Trap Swarmer",
    SHAPE: 5,
    CONTROLLERS: ["slowSpin"],
    SKILL: setBuild("0077777000"),
    INDEPENDENT: true,
    TURRETS: (() => {
        let output = [];
        for (let i = 0; i < 5; i++) output.push({
            POSITION: [9, 8, 0, (360 / 5 * i) + (360 / 10), 135, 0],
            TYPE: exports.aresTrapSwarmer
        });
        return output;
    })()
};
exports.aresSwarm = {
    PARENT: [exports.swarm],
    SHAPE: 0,
    LABEL: "Egg"
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
        TYPE: [exports.aresTrapSwarmerBody, {
            COLOR: 9
        }]
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
                SHOOT_SETTINGS: combineStats([g.drone, g.celestialHeavyWeapon, g.turret]),
                TYPE: [exports.lokiDrone, {
                    INDEPENDENT: true,
                    BODY: {
                        FOV: 1.175
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
exports.oceanusCelestial = (() => {
    const color = 135;/*(() => {
        let output = [];
        for (let i = 135; i < 155; i ++) output.push(i);
        return output.join(", ");
    })();*/
    exports.oceanusMiniSwarmer = {
        PARENT: [exports.turretParent],
        GUNS: [{
            POSITION: [12, 13, -1.2, 5, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.pound, [2, 1, 1, .8, 1.5, .8, .8, 1, 1, .8, 1, 1, 1], g.turret]),
                TYPE: exports.minihive
            }
        }, {
            POSITION: [13, 11, 1, 5, 0, 0, 0]
        }]
    };
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
    exports.oceanusCarrier = {
        PARENT: [exports.turretParent],
        GUNS: [{
            POSITION: [7, 7.5, .6, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, g.turret, g.doubleReload]),
                TYPE: exports.swarm,
                STAT_CALCULATOR: gunCalcNames.swarm
            }
        }, {
            POSITION: [7, 7.5, .6, 7, 2, 40, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, g.turret, g.doubleReload]),
                TYPE: exports.swarm,
                STAT_CALCULATOR: gunCalcNames.swarm
            }
        }, {
            POSITION: [7, 7.5, .6, 7, -2, -40, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, g.turret, g.doubleReload]),
                TYPE: exports.swarm,
                STAT_CALCULATOR: gunCalcNames.swarm
            }
        }]
    };
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
    exports.oceanusNailgun = {
        PARENT: [exports.turretParent],
        GUNS: [{
            POSITION: [17, 2, 1, 0, -2.5, 0, .667],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwGun, g.nailgun, g.turret]),
                TYPE: exports.bullet
            }
        }, {
            POSITION: [17, 2, 1, 0, 2.5, 0, .334],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwGun, g.nailgun, g.turret]),
                TYPE: exports.bullet
            }
        }, {
            POSITION: [18, 2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.pelleter, g.screwGun, g.nailgun, g.turret]),
                TYPE: exports.bullet
            }
        }, {
            POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0]
        }]
    };
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
    g.raOmegaOscillator = [4, .5, .1, 1, 1, 1, 1.5, 1.5, 1.5, 2, 2, .1, 2];
    exports.raDrone = {
        PARENT: [exports.drone],
        SHAPE: 7,
        HITS_OWN_TYPE: 'hard',
        DRAW_HEALTH: true
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
                    SHOOT_SETTINGS: combineStats([g.drone, g.pound, g.celestialHeavyWeapon]),
                    TYPE: [exports.raDrone, {
                        INDEPENDENT: true,
                        BODY: {
                            FOV: 3
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
    g.raBee = [2, 1, 1, 1, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1, 1, 1];
    exports.raMissile = {
        PARENT: [exports.skimmerMissile],
        GUNS: [{
            POSITION: [7, 9.5, .6, 7, 0, -20, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.raBee]),
                TYPE: [exports.bee, {
                    INDEPENDENT: true,
                    BODY: {
                        FOV: 2
                    }
                }],
                AUTOFIRE: true
            }
        }, {
            POSITION: [7, 9.5, .6, 7, 0, 20, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.raBee]),
                TYPE: [exports.bee, {
                    INDEPENDENT: true,
                    BODY: {
                        FOV: 2
                    }
                }],
                AUTOFIRE: true
            }
        }, {
            POSITION: [10, 9.5, .6, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.raBee]),
                TYPE: [exports.bee, {
                    INDEPENDENT: true,
                    BODY: {
                        FOV: 2
                    }
                }],
                AUTOFIRE: true
            }
        }, ...exports.skimmerMissile.GUNS]
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
            POSITION: [12, 14, -0.5, 9, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.celestialHeavyWeapon, g.threeQuartSlow, g.oneQuartMoreHealth, g.oneQuartMoreReload, g.fake, g.turret]),
                TYPE: exports.bullet
            }
        }, {
            POSITION: [10, 14, -0.5, 9, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.pound, g.celestialHeavyWeapon, g.threeQuartSlow, g.oneQuartMoreHealth, g.oneQuartMoreReload, g.turret]),
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
    exports.thorDual = {
        PARENT: [exports.turretParent],
        GUNS: [{
            POSITION: [18, 7, 1, 0, 5.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.dual, g.turret, g.oneQuartMoreReload]),
                TYPE: exports.bullet,
                LABEL: "Small"
            }
        }, {
            POSITION: [18, 7, 1, 0, -5.5, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.dual, g.turret, g.oneQuartMoreReload]),
                TYPE: exports.bullet,
                LABEL: "Small"
            }
        }, {
            POSITION: [16, 8.5, 1, 0, 5.5, 0, .25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.dual, g.turret, g.oneQuartMoreReload]),
                TYPE: exports.bullet
            }
        }, {
            POSITION: [16, 8.5, 1, 0, -5.5, 0, .75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.dual, g.turret, g.oneQuartMoreReload]),
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
                SHOOT_SETTINGS: combineStats([g.swarm, g.twin, g.gunner]),
                TYPE: [exports.swarm, {
                    PERSISTS_AFTER_DEATH: true
                }],
                STAT_CALCULATOR: gunCalcNames.thruster
            }
        }, {
            POSITION: [14, 6, 0.75, 0, 2, 210, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.swarm, g.twin, g.gunner]),
                TYPE: [exports.swarm, {
                    PERSISTS_AFTER_DEATH: true
                }],
                STAT_CALCULATOR: gunCalcNames.thruster
            }
        }, {
            POSITION: [14, 6, 1.25, 0, -2, 90, .5],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.gunner, g.pound, g.mach]),
                TYPE: [exports.bullet, {
                    PERSISTS_AFTER_DEATH: true
                }]
            }
        }, {
            POSITION: [14, 6, 1.25, 0, 2, 270, .5],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.bullet, g.twin, g.gunner, g.pound, g.mach]),
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
                SHOOT_SETTINGS: combineStats([g.bullet, g.pound, [6, 1, 1, 0.75, 2, 0.6, 1, 0.7, 0.7, 1.5, 1, 1, 2]]),
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
                SHOOT_SETTINGS: combineStats([g.spawner, [3, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 1, 1, 1, 1]]),
                TYPE: [exports.minion, {
                    INDEPENDENT: true,
                    BODY: {
                        FOV: 2
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
            SHOOT_SETTINGS: combineStats([[3, 0.8, 2, 0.6, 0.1, 0.1, 0.25, 1, 1, 1, 1, 1, 1]]),
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
    LABEL: "Square Sanctuary",
    COLOR: 13,
    SHAPE: 4,
    GUNS: [{
        POSITION: [5, 12, 1.2, 8, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([[3, 0.8, 2, 0.6, 0.1, 0.1, 0.25, 1, 1, 1, 1, 1, 1]]),
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
        POSITION: [5, 12, 1.2, 8, 0, 270, 0.5, ],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([[3, 0.8, 2, 0.6, 0.1, 0.1, 0.25, 1, 1, 1, 1, 1, 1]]),
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
        POSITION: [5, 12, 1.2, 8, 0, 0, 0.25, ],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([[3, 0.8, 2, 0.6, 0.1, 0.1, 0.25, 1, 1, 1, 1, 1, 1]]),
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
            SHOOT_SETTINGS: combineStats([[3, 0.8, 2, 0.6, 0.1, 0.1, 0.25, 1, 1, 1, 1, 1, 1]]),
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
            SHOOT_SETTINGS: combineStats([[3, 0.8, 2, 0.6, 0.1, 0.1, 0.25, 1, 1, 1, 1, 1, 1]]),
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
            SHOOT_SETTINGS: combineStats([[3, 0.8, 2, 0.6, 0.1, 0.1, 0.25, 1, 1, 1, 1, 1, 1]]),
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
            SHOOT_SETTINGS: combineStats([[3, 0.8, 2, 0.6, 0.1, 0.1, 0.25, 1, 1, 1, 1, 1, 1]]),
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
exports.killRace = {
    PARENT: [exports.bullet],
    LABEL: "Kills"
};
// TIER 1
exports.basic.UPGRADES_TIER_1 = [exports.twin, exports.sniper, exports.machine, exports.pounder, exports.flank, exports.trapper, exports.director, exports.grower, exports.pelleter, exports.lancer];
// TIER 2
exports.director.UPGRADES_TIER_2 = [exports.overseer, exports.underseer, exports.cruiser, exports.spawner, exports.lightning, exports.heatseeker, exports.navyist];
exports.flank.UPGRADES_TIER_2 = [exports.hexa, exports.arthropoda, exports.trapguard, exports.swarmguard, exports.quadtrapper];
exports.sniper.UPGRADES_TIER_2 = [exports.assassin, exports.minigun, exports.hunter, exports.clicker, exports.lightning];
exports.pounder.UPGRADES_TIER_2 = [exports.destroyer, exports.launcher, exports.miniswarmer, exports.multishot, exports.boxer, exports.botanist];
exports.trapper.UPGRADES_TIER_2 = [exports.builder, exports.trapguard, exports.boomer, exports.quadtrapper, exports.contagion];
exports.twin.UPGRADES_TIER_2 = [exports.double, exports.tripleshot, exports.boxer, exports.hewn, exports.binary, exports.twinMachine, exports.gunner];
exports.grower.UPGRADES_TIER_2 = [exports.botanist, exports.machGrower];
exports.machine.UPGRADES_TIER_2 = [exports.sprayer, exports.minigun, exports.twinMachine, exports.machGrower];
exports.pelleter.UPGRADES_TIER_2 = [exports.gunner, exports.puntGun, exports.screwGun];
exports.propeller.UPGRADES_TIER_2 = [exports.tri, exports.accelerator];
exports.lancer.UPGRADES_TIER_2 = [exports.sword, exports.axe, exports.dagger, exports.trailblazer, exports.autoLancer, exports.spoopyGhost];
// WILL GET ADDED AFTER RELEASE
// TIER 3
//Tier 3s that will get released after actual release:
exports.arthropoda.UPGRADES_TIER_3 = [exports.myriapoda];
exports.hexa.UPGRADES_TIER_3 = [exports.octo];
exports.launcher.UPGRADES_TIER_3 = [exports.skimmer, exports.twister, exports.rocketeer, exports.sidewinder, exports.swamper, exports.promenader, exports.catapult, exports.shrapnel];
exports.lightning.UPGRADES_TIER_3 = [exports.thunder, exports.flycatcher];
exports.overseer.UPGRADES_TIER_3 = [exports.overlord];
exports.heatseeker.UPGRADES_TIER_3 = [exports.flycatcher, exports.presser, exports.astronaut, exports.heatwave];
exports.spawner.UPGRADES_TIER_3 = [exports.factory, exports.protist];
exports.destroyer.UPGRADES_TIER_3 = [exports.anni, exports.hybrid, exports.superstorm];
exports.underseer.UPGRADES_TIER_3 = [exports.necromancer, exports.eggmancer, exports.trimancer];
exports.botanist.UPGRADES_TIER_3 = [exports.superstorm];
exports.cruiser.UPGRADES_TIER_3 = [exports.carrier, exports.battleship];
exports.double.UPGRADES_TIER_3 = [exports.battleship, exports.hewndouble, exports.doubleMachine];
exports.tripleshot.UPGRADES_TIER_3 = [exports.triplet, exports.pentaShot, exports.benthybrid, exports.bentMachine];
exports.twinMachine.UPGRADES_TIER_3 = [exports.bentMachine, exports.doubleMachine];
exports.boxer.UPGRADES_TIER_3 = [exports.eagle];
exports.hewn.UPGRADES_TIER_3 = [exports.hewndouble];
exports.hunter.UPGRADES_TIER_3 = [exports.predator, exports.dual];
exports.binary.UPGRADES_TIER_3 = [exports.dual];
exports.assassin.UPGRADES_TIER_3 = [exports.ranger];
exports.multishot.UPGRADES_TIER_3 = [exports.shotgun];
exports.minigun.UPGRADES_TIER_3 = [exports.streamliner];
exports.clicker.UPGRADES_TIER_3 = [exports.puncher];
exports.sprayer.UPGRADES_TIER_3 = [exports.engine];
exports.miniswarmer.UPGRADES_TIER_3 = [exports.swarmer];
exports.puntGun.UPGRADES_TIER_3 = [exports.screwPunt, exports.bandolier];
exports.screwGun.UPGRADES_TIER_3 = [exports.nailgun, exports.screwPunt];
exports.navyist.UPGRADES_TIER_3 = [exports.phaser];
exports.tri.UPGRADES_TIER_3 = [exports.booster, exports.fighter, exports.surfer, exports.bomber];
exports.accelerator.UPGRADES_TIER_3 = [exports.eagle];
exports.contagion.UPGRADES_TIER_3 = [];
exports.trapguard.UPGRADES_TIER_3 = [exports.gunnertrapper];
// TIER 4
exports.skimmer.UPGRADES_TIER_4 = [exports.hyperskimmer];
exports.twister.UPGRADES_TIER_4 = [exports.demoman];
exports.rocketeer.UPGRADES_TIER_4 = [exports.speedbump];
exports.sidewinder.UPGRADES_TIER_4 = [exports.attackMissiler];
exports.swamper.UPGRADES_TIER_4 = [exports.hovercraft];
exports.promenader.UPGRADES_TIER_4 = [exports.pather];
exports.catapult.UPGRADES_TIER_4 = [exports.trebutchet];
exports.shrapnel.UPGRADES_TIER_4 = [exports.crockett];
exports.flycatcher.UPGRADES_TIER_4 = [exports.pyramid, exports.flyswatter];
exports.heatwave.UPGRADES_TIER_4 = [exports.feverDream];
exports.cwis.UPGRADES_TIER_4 = [exports.phalanx, exports.lockheed, exports.ohmyfuckinggod];
//exports.phaser.UPGRADES_TIER_4 = [exports.treachery];
// TESTBED TANKS
exports.taurus.UPGRADES_TIER_4 = [exports.hitScan, exports.superlaser, exports.taurus2, exports.reinforcements];
exports.infestor.UPGRADES_TIER_3 = [exports.impostor];
exports.testbed.UPGRADES_TIER_1 = [exports.betaTanks, exports.projects, exports.bosses, exports.arenaClosers, exports.dominators, exports.mothership];
exports.dominators.UPGRADES_TIER_2 = [exports.destroyerDominator, exports.gunnerDominator, exports.trapperDominator];
exports.projects.UPGRADES_TIER_2 = [exports.unfinished, exports.needbalance, exports.ready];
exports.unfinished.UPGRADES_TIER_2 = [exports.propeller];
exports.needbalance.UPGRADES_TIER_2 = [exports.hovercraft, exports.pather, exports.trebutchet, exports.tornado, exports.frontier, exports.twistepult, exports.sharpener, exports.panzerf, exports.needbalance2];
exports.needbalance2.UPGRADES_TIER_2 = [exports.kiev, exports.onager, exports.jupiter, exports.saturn, exports.AIM9, exports.tornado, exports.panzerf, exports.jupiter, exports.curator, exports.frontier, exports.kiev, exports.saturn, exports.needbalance3];
exports.needbalance3.UPGRADES_TIER_2 = [exports.inventory, exports.twistepult, exports.onager, exports.AIM9, exports.mangonel, exports.curator, exports.inventory, exports.rpg, exports.icbm, exports.firecracker, exports.needbalance4];
exports.needbalance4.UPGRADES_TIER_2 = [];
exports.ready.UPGRADES_TIER_2 = [];
exports.betaTanks.UPGRADES_TIER_2 = [exports.infestor, exports.taurus, exports.steamengine, exports.cwis, exports.lancer, exports.virus];
exports.bosses.UPGRADES_TIER_2 = [exports.eliteDestroyer, exports.eliteGunner, exports.eliteSprayer, exports.eliteSprayer2, exports.eliteHunter, exports.industry, exports.eliteSkimmer, exports.summoner, exports.palisade, exports.skoll, exports.hati, exports.trapeFighter, exports.deltrablade, exports.eggSanctuary, exports.triangleSanctuary, exports.squareSanctuary];
exports.arenaClosers.UPGRADES_TIER_2 = [];
let closers = ["arenaCloser", "twinCloser", "machineCloser", "sniperCloser", "flankCloser", "directorCloser", "pounderCloser", "trapperCloser", "smasherCloser"];
for (let closer of closers) {
    makeAI(closer);
    exports.arenaClosers.UPGRADES_TIER_2.push(exports[closer]);
};
exports.baseStats = base;
