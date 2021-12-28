/*jslint node: true */
/*jshint -W061 */
/*global goog, Map, let */
"use strict";
// General requires
require('google-closure-library');
goog.require('goog.structs.PriorityQueue');
goog.require('goog.structs.QuadTree');
const defaults = require("../../config.json");
if (global.fingerPrint.digitalOcean) {
    defaults.WIDTH = 6750;
    defaults.HEIGHT = 6750;
    defaults.maxPlayers = 35;
}

function getBaseShuffling(teams) {
    const output = [];
    for (let i = 1; i < 5; i++) {
        output.push(i > teams ? 0 : i);
    }
    return output.sort(function() {
        return .5 - Math.random();
    });
}

function id(i, level = true, norm = false) {
    if (i && !norm) {
        return !!level ? `bas${i}` : `bap${i}`;
    } else {
        const list = ["rock", "rock", "roid"];
        return list[Math.floor(Math.random() * list.length)];
    }
}

function oddify(number, multiplier = 1) {
    return number + ((number % 2) * multiplier);
}

function setup(options = {}) {
    if (options.width == null) options.width = defaults.X_GRID;
    if (options.height == null) options.height = defaults.Y_GRID;
    if (options.nestWidth == null) options.nestWidth = Math.floor(options.width / 4) + (options.width % 2);
    if (options.nestHeight == null) options.nestHeight = Math.floor(options.height / 4) + (options.height % 2);
    if (options.rockScatter == null) options.rockScatter = .175;
    options.rockScatter = 1 - options.rockScatter;
    const output = [];
    const nest = {
        sx: oddify(Math.floor(options.width / 2 - options.nestWidth / 2), -1 * ((options.width % 2 === 0) && Math.floor(options.width / 2) % 2 === 1)),
        sy: oddify(Math.floor(options.height / 2 - options.nestHeight / 2), -1 * ((options.height % 2 === 0) && Math.floor(options.height / 2) % 2 === 1)),
        ex: Math.floor(options.width / 2 - options.nestWidth / 2) + options.nestWidth,
        ey: Math.floor(options.height / 2 - options.nestHeight / 2) + options.nestHeight
    };

    function testIsNest(x, y) {
        if (x >= nest.sx && x <= nest.ex) {
            if (y >= nest.sy && y <= nest.ey) {
                return true;
            }
        }
        return false;
    }
    for (let i = 0; i < options.height; i++) {
        const row = [];
        for (let j = 0; j < options.width; j++) {
            row.push(testIsNest(j, i) ? "nest" : Math.random() > options.rockScatter ? Math.random() > .5 ? "roid" : "rock" : "norm");
        }
        output.push(row);
    }
    return output;
}

const gamemodes = {
    "FFA": {}, // "defaults" is already FFA.
    "TDM": (function() {
        const teams = (Math.random() * 3 | 0) + 2;
        let width = 15,
            height = 15;
        return {
            MODE: "tdm",
            TEAMS: teams,
            X_GRID: width,
            Y_GRID: height,
            ALLOW_MAZE: true,
            ROOM_SETUP: (function() {
                const output = setup({
                    width: width,
                    height: height
                });
                const mapType = Math.round(Math.random());
                const bases = getBaseShuffling(teams);
                width --;
                height --;
                switch (mapType) {
                    case 0: {
                        output.isOpen = true;
                    } break;
                    case 1: {
                        output[0][0] = id(bases[0], 0);
                        output[0][1] = output[1][0] = id(bases[0], 1);
                        output[0][width] = id(bases[1], 0);
                        output[0][width - 1] = output[1][width] = id(bases[1], 1);
                        output[height][width] = id(bases[2], 0);
                        output[height][width - 1] = output[height - 1][width] = id(bases[2], 1);
                        output[height][0] = id(bases[3], 0);
                        output[height][1] = output[height - 1][0] = id(bases[3], 1);
                    }
                    break;
                }
                return output;
            })()
        };
    })(),
    "Kill Race": {
        MODE: "tdm",
        TEAMS: 2 + (Math.random() * 3 | 0),
        ROOM_SETUP: setup(),
        KILL_RACE: true,
        ALLOW_MAZE: true,
        secondaryGameMode: "kr"
    },
    "Hide and Seek": {
        MODE: "tdm",
        TEAMS: 2,
        WIDTH: 7500,
        HEIGHT: 7500,
        MAZE: 32,
        X_GRID: 16,
        Y_GRID: 16,
        ROOM_SETUP: setup({
            width: 16,
            height: 16,
            rockScatter: 0
        }),
        HIDE_AND_SEEK: true,
        secondaryGameMode: "hs"
    },
    "Soccer": {
        MODE: "tdm",
        TEAMS: 2,
        SOCCER: true,
        WIDTH: 6500,
        HEIGHT: 6500 * .75,
        X_GRID: 12,
        Y_GRID: 9,
        ROOM_SETUP: [
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["bas1", "norm", "norm", "norm", "norm", "nest", "nest", "norm", "norm", "norm", "norm", "bas2"],
            ["bas1", "norm", "norm", "norm", "norm", "nest", "nest", "norm", "norm", "norm", "norm", "bas2"],
            ["bas1", "norm", "norm", "norm", "norm", "nest", "nest", "norm", "norm", "norm", "norm", "bas2"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"]
        ],
        secondaryGameMode: "sc"
    },
    "Survival": {
        SURVIVAL: true,
        BOTS: -1,
        ROOM_SETUP: setup({
            rockScatter: .3
        }),
    },
    "Mothership": {
        MODE: "tdm",
        TEAMS: (Math.random() * 3 | 0) + 2,
        ROOM_SETUP: setup(),
        MOTHERSHIP_LOOP: true,
        secondaryGameMode: "m"
    },
    "Tag": {
        MODE: "tdm",
        TEAMS: (Math.random() * 3 | 0) + 2,
        ROOM_SETUP: setup(),
        TAG: true,
        ALLOW_MAZE: true,
        secondaryGameMode: "t"
    },
    "Domination": (function() {
        const teams = (Math.random() * 3 | 0) + 2;
        let width = 15,
            height = 15;
        return {
            MODE: "tdm",
            TEAMS: teams,
            X_GRID: width,
            Y_GRID: height,
            ALLOW_MAZE: true,
            ROOM_SETUP: (function() {
                const output = setup({
                    width: width,
                    height: height
                });
                const mapType = Math.round(Math.random());// + width % 2; // For alt map type
                const bases = getBaseShuffling(teams);
                width --;
                height --;
                const majorWidth = Math.floor(width / 2);
                const minorWidth = Math.floor(width / 6);
                const majorHeight = Math.floor(height / 2);
                const minorHeight = Math.floor(height / 6);
                switch (mapType) {
                    case 0: {
                        output[minorHeight][majorWidth] = "dom0";
                        output[height - minorHeight][majorWidth] = "dom0";
                        output[majorHeight][minorWidth] = "dom0";
                        output[majorHeight][width - minorWidth] = "dom0";
                        if ((width + 1) % 2) {
                            output[majorHeight][majorWidth] = "dom0";
                        }
                        output.isOpen = true;
                    } break;
                    case 1: {
                        output[0][0] = id(bases[0], 0);
                        output[0][1] = output[1][0] = id(bases[0], 1);
                        output[0][width] = id(bases[1], 0);
                        output[0][width - 1] = output[1][width] = id(bases[1], 1);
                        output[height][width] = id(bases[2], 0);
                        output[height][width - 1] = output[height - 1][width] = id(bases[2], 1);
                        output[height][0] = id(bases[3], 0);
                        output[height][1] = output[height - 1][0] = id(bases[3], 1);
                        output[minorHeight][majorWidth] = "dom0";
                        output[height - minorHeight][majorWidth] = "dom0";
                        output[majorHeight][minorWidth] = "dom0";
                        output[majorHeight][width - minorWidth] = "dom0";
                        output[majorHeight][majorWidth] = "dom0";
                    }
                    break;
                }
                return output;
            })(),
            DOMINATOR_LOOP: true,
            secondaryGameMode: "d"
        };
    })(),
    "Space": {
        ARENA_TYPE: "circle",
        SPACE_MODE: true,
        WIDTH: 5000,
        HEIGHT: 5000,
        X_GRID: 5,
        Y_GRID: 5,
        SPACE_PHYSICS: true,
        ROOM_SETUP: [
            ["norm", "norm", "roid", "norm", "norm"],
            ["norm", "rock", "norm", "rock", "norm"],
            ["roid", "norm", "nest", "norm", "roid"],
            ["norm", "rock", "norm", "rock", "norm"],
            ["norm", "norm", "roid", "norm", "norm"],
        ],
        secondaryGameMode: "sp"
    },
    "Boss Rush": {
        MODE: "tdm",
        TEAMS: 1,
        SPECIAL_BOSS_SPAWNS: true,
        WIDTH: 5500,
        HEIGHT: 5500,
        X_GRID: 16,
        Y_GRID: 16,
        MAZE: `
            --------------------------------
            --------------------------------
            --@@@@@@@@@@@@@@@@@@@@@@@@@@@@--
            --@@@@@@@@@@@@@@@@@@@@@@@@@@@@--
            --@@########################@@--
            --@@#@@@@@@@@@@@@@@@@@@@@@@#@@--
            --@@#@@@@@@@@@@@@@@@@@@@@@@#@@--
            --@@#@@@@@@----------@@@@@@#@@--
            --@@#@@@@@@----------@@@@@@#@@--
            --@@#@@@@@------------@@@@@#@@--
            --@@#@@@@--------------@@@@#@@--
            --@@#@@@----------------@@@#@@--
            --@@#@@------------------@@#@@--
            --@@#@@------------------@@#@@--
            --@@#@@------------------@@#@@--
            --@@#@@------------------@@#@@--
            --@@#@@------------------@@#@@--
            --@@#@@------------------@@#@@--
            --@@#@@------------------@@#@@--
            --@@#@@------------------@@#@@--
            --@@#@@------------------@@#@@--
            --@@#@@------------------@@#@@--
            --@@#@@------------------@@#@@--
            --@@#@@------------------@@#@@--
            --@@#@@------------------@@#@@--
            --@@#@@@@@@@@@@@@@@@@@@@@@@#@@--
            --@@#@@@@@@@@@@@@@@@@@@@@@@#@@--
            --@@########################@@--
            --@@@@@@@@@@@@@@@@@@@@@@@@@@@@--
            --@@@@@@@@@@@@@@@@@@@@@@@@@@@@--
            --------------------------------
            --------------------------------
        `,
        ROOM_SETUP: [
            ["outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb"],
            ["outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb"],
            ["outb", "outb", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "outb", "outb"],
            ["outb", "outb", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "outb", "outb"],
            ["outb", "outb", "norm", "norm", "norm", "bas1", "nest", "nest", "nest", "nest", "bas1", "norm", "norm", "norm", "outb", "outb"],
            ["outb", "outb", "norm", "norm", "norm", "nest", "nest", "nest", "nest", "nest", "nest", "norm", "norm", "norm", "outb", "outb"],
            ["outb", "outb", "norm", "norm", "norm", "nest", "nest", "nest", "nest", "nest", "nest", "norm", "norm", "norm", "outb", "outb"],
            ["outb", "outb", "norm", "norm", "norm", "bas1", "nest", "nest", "nest", "nest", "bas1", "norm", "norm", "norm", "outb", "outb"],
            ["outb", "outb", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "outb", "outb"],
            ["outb", "outb", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "outb", "outb"],
            ["outb", "outb", "norm", "norm", "boss", "boss", "boss", "boss", "boss", "boss", "boss", "boss", "norm", "norm", "outb", "outb"],
            ["outb", "outb", "norm", "norm", "boss", "boss", "boss", "boss", "boss", "boss", "boss", "boss", "norm", "norm", "outb", "outb"],
            ["outb", "outb", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "outb", "outb"],
            ["outb", "outb", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "outb", "outb"],
            ["outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb"],
            ["outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb"]
        ],
        secondaryGameMode: "br",
        DO_BASE_DAMAGE: false,
        FOOD_AMOUNT: .3
    },
    "Center Control": {
        MODE: "tdm",
        TEAMS: 2,
        WIDTH: 5000,
        HEIGHT: 5000,
        X_GRID: 7,
        Y_GRID: 7,
        ROOM_SETUP: [
            ["norm", "norm", "roid", "norm", "roid", "norm", "norm"],
            ["norm", "rock", "norm", "rock", "norm", "rock", "norm"],
            ["roid", "norm", "nest", "nest", "nest", "norm", "roid"],
            ["norm", "rock", "nest", "dom0", "nest", "rock", "norm"],
            ["roid", "norm", "nest", "nest", "nest", "norm", "roid"],
            ["norm", "rock", "norm", "rock", "norm", "rock", "norm"],
            ["norm", "norm", "roid", "norm", "roid", "norm", "norm"],
        ],
        EPICENTER: true,
        secondaryGameMode: "cc"
    },
    "Naval Battle": {
        NAVAL_SHIPS: true,
        WIDTH: 7500,
        HEIGHT: 7500,
        FOOD_AMOUNT: 0,
        MODE: "tdm",
        TEAMS: 2,
        secondaryGameMode: "nb"
    },
    "Trench Battle": {
        MODE: "tdm",
        TEAMS: 2,
        WIDTH: 5500,
        HEIGHT: 5500,
        X_GRID: 16,
        Y_GRID: 16,
        MAZE: `
            --------------------------------
            -@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@-
            -@############################@-
            -@#####@@@@@@@@@@@@@@@@@@@@@@#@-
            -@##-----@@----@@----@@-----@#@-
            -@##--@@----@@----@@----@@--@#@-
            -@#@--########################@-
            -@#@----@@@@@@@@@@@@@@@@@@@@@#@-
            -@#@@@@@@@@@@@@@@@@@@@@@@@@@@#@-
            -@#@@@@@@@@@@@@@@@@@@@@@@@@@@#@-
            -@#@@@@@@@@@@@@@@@@@@@@@@@@@@#@-
            -@#@@@@@@@@@@@@@@@@@@@@@@@@@@#@-
            -@#@@@@@@@@@@@@@@@@@@@@@@@@@@#@-
            -@#@@@@@@@@@@@@@@@@@@@@@@@@@@#@-
            -@#@@@@@@@@@@@@@@@@@@@@@@@@@@#@-
            -@#@@@@@@@@@@@@@@@@@@@@@@@@@@#@-
            -@#@@@@@@@@@@@@@@@@@@@@@@@@@@#@-
            -@#@@@@@@@@@@@@@@@@@@@@@@@@@@#@-
            -@#@@@@@@@@@@@@@@@@@@@@@@@@@@#@-
            -@#@@@@@@@@@@@@@@@@@@@@@@@@@@#@-
            -@#@@@@@@@@@@@@@@@@@@@@@@@@@@#@-
            -@#@@@@@@@@@@@@@@@@@@@@@@@@@@#@-
            -@#@@@@@@@@@@@@@@@@@@@@@@@@@@#@-
            -@#@@@@@@@@@@@@@@@@@@@@@@@@@@#@-
            -@#@@@@@@@@@@@@@@@@@@@@@----@#@-
            -@########################--@#@-
            -@#@--@@----@@----@@----@@--##@-
            -@#@-----@@----@@----@@-----##@-
            -@#@@@@@@@@@@@@@@@@@@@@@@#####@-
            -@############################@-
            -@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@-
            --------------------------------
        `,
        ROOM_SETUP: [
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "dom0", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "bas1", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "nest", "nest", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "nest", "nest", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "bas2", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "dom0", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"]
        ],
        secondaryGameMode: "tb",
        DO_BASE_DAMAGE: false,
        TRENCH_WARFARE: true
    },
    "Infection": {
        MODE: "tdm",
        TEAMS: 1,
        WIDTH: 3500,
        HEIGHT: 3500,
        X_GRID: 75,
        Y_GRID: 75,
        INFECTION_LOOP: true,
        ROOM_SETUP: (() => {
            let output = [];
            for (let i = 0; i < 75; i ++) {
                let row = [];
                for (let j = 0; j < 75; j ++) {
                    row.push("norm");
                }
                output.push(row);
            }
            for (let i = 0; i < 10; i ++) {
                output[Math.random() * 75 | 0][Math.random() * 75 | 0] = "nest";
            }
            return output
        })(),
        secondaryGameMode: "if"
    },
    "Sandbox": {
        WIDTH: 3500,
        HEIGHT: 3500,
        X_GRID: 3,
        Y_GRID: 3,
        ROOM_SETUP: [
            ["norm", "norm", "norm"],
            ["norm", "nest", "norm"],
            ["norm", "norm", "norm"]
        ],
        SANDBOX: true,
        secondaryGameMode: "sb"
    },
    "Closed Beta": {
        MODE: "tdm",
        TEAMS: 4,
        BETA: 1,
        WIDTH: 8000,
        HEIGHT: 8000,
        ROOM_SETUP: [
            ["bas1", "bas1", "norm", "norm", "norm", "norm", "norm", "norm", "roid", "edge", "edge", "roid", "norm", "norm", "norm", "norm", "norm", "norm", "bas2", "bas2"],
            ["bas1", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "edge", "edge", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "bas2"],
            ["norm", "norm", "norm", "norm", "roid", "norm", "norm", "norm", "norm", "edge", "edge", "norm", "norm", "norm", "norm", "roid", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "nest", "nest", "nest", "norm", "norm", "norm", "edge", "edge", "norm", "norm", "norm", "nest", "nest", "nest", "norm", "norm", "norm"],
            ["norm", "norm", "roid", "nest", "port", "nest", "roid", "norm", "norm", "edge", "edge", "norm", "norm", "roid", "nest", "port", "nest", "roid", "norm", "norm"],
            ["norm", "norm", "norm", "nest", "nest", "nest", "norm", "norm", "norm", "edge", "edge", "norm", "norm", "norm", "nest", "nest", "nest", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "roid", "norm", "norm", "norm", "norm", "edge", "edge", "norm", "norm", "norm", "norm", "roid", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "edge", "edge", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["roid", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "roid", "edge", "edge", "roid", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "roid"],
            ["edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge"],
            ["edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge"],
            ["roid", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "roid", "edge", "edge", "roid", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "roid"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "edge", "edge", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "roid", "norm", "norm", "norm", "norm", "edge", "edge", "norm", "norm", "norm", "norm", "roid", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "nest", "nest", "nest", "norm", "norm", "norm", "edge", "edge", "norm", "norm", "norm", "nest", "nest", "nest", "norm", "norm", "norm"],
            ["norm", "norm", "roid", "nest", "port", "nest", "roid", "norm", "norm", "edge", "edge", "norm", "norm", "roid", "nest", "port", "nest", "roid", "norm", "norm"],
            ["norm", "norm", "norm", "nest", "nest", "nest", "norm", "norm", "norm", "edge", "edge", "norm", "norm", "norm", "nest", "nest", "nest", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "roid", "norm", "norm", "norm", "norm", "edge", "edge", "norm", "norm", "norm", "norm", "roid", "norm", "norm", "norm", "norm"],
            ["bas4", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "edge", "edge", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "bas3"],
            ["bas4", "bas4", "norm", "norm", "norm", "norm", "norm", "norm", "roid", "edge", "edge", "roid", "norm", "norm", "norm", "norm", "norm", "norm", "bas3", "bas3"]
        ],
        DIVIDER_LEFT: 3600,
        DIVIDER_RIGHT: 4400,
        DIVIDER_TOP: 3600,
        DIVIDER_BOTTOM: 4400
    }
};

const choiceTable = {
    "FFA": 10,
    "TDM": 9,
    "Kill Race": 4,
    "Hide and Seek": 2,
    "Soccer": 6,
    "Survival": 3,
    "Mothership": 5,
    "Tag": 6,
    "Domination": 7,
    "Naval Battle": 2,
    "Infection": 5,
    "Boss Rush": 6,
    "Space": 1,
    "Center Control": 5
};

const gamemode = (function() {
    const table = [];
    for (const key in choiceTable) {
        if (gamemodes[key]) {
            for (let i = 0; i < choiceTable[key]; i ++) {
                table.push(key);
            }
        } else {
            throw new ReferenceError(key + " isn't a valid gamemode!");
        }
    }
    return global.fingerPrint.herokuC ? "Closed Beta" : table[Math.floor(Math.random() * table.length)];
})();

const mode = gamemodes[gamemode];
let changedToMaze = false;
if (mode.ALLOW_MAZE && Math.random() > .5) {
    mode.MAZE = (mode.X_GRID || defaults.X_GRID) * 2;
    changedToMaze = true;
}
let output = {};
for (let key in defaults) {
    output[key] = defaults[key];
    if (mode[key] != null) output[key] = mode[key];
}
output.gameModeName = gamemode;
if (gamemode.includes("TDM")) {
    output.gameModeName = output.gameModeName.replace("TDM", output.TEAMS + " TDM");
}
if (["Kill Race", "Mothership", "Tag", "Domination", "Center Control"].includes(gamemode)) {
    output.gameModeName = output.TEAMS + " TDM " + gamemode;
}
if (changedToMaze) {
    for (let y = 0; y < output.ROOM_SETUP.length; y ++) {
        for (let x = 0; x < output.ROOM_SETUP[y].length; x ++) {
            if (["rock", "roid"].includes(output.ROOM_SETUP[y][x])) {
                output.ROOM_SETUP[y][x] = "norm";
            }
        }
    }
    output.gameModeName = "Maze " + output.gameModeName;
    output.secondaryGameMode = "m_" + output.secondaryGameMode;
}
if (output.ROOM_SETUP.isOpen) {
    output.gameModeName = "Open " + output.gameModeName;
    output.secondaryGameMode = "o_" + output.secondaryGameMode;
}

module.exports = {
    output
};
