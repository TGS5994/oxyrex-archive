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
    defaults.maxPlayers = 20;
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

function setup(options = {}) {
    if (options.width == null) options.width = defaults.X_GRID;
    if (options.height == null) options.height = defaults.Y_GRID;
    if (options.nestWidth == null) options.nestWidth = Math.floor(options.width / 4) + (options.width % 2);
    if (options.nestHeight == null) options.nestHeight = Math.floor(options.height / 4) + (options.height % 2);
    if (options.rockScatter == null) options.rockScatter = .175;
    options.rockScatter = 1 - options.rockScatter;
    const output = [];
    const nest = {
        sx: Math.floor(options.width / 2 - options.nestWidth / 2),
        sy: Math.floor(options.height / 2 - options.nestHeight / 2),
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
        const teams = 2 + (Math.random() * 3 | 0);
        const bases = getBaseShuffling(teams);
        const map = (Math.random() > .5 ? [
            ["roid", "rock", "norm", "norm", "norm", "norm", id(bases[0], 1), id(bases[0], 0), id(bases[0], 1), "norm", "norm", "norm", "norm", "rock", "roid"],
            ["rock", "roid", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "roid", "rock"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "nest", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            [id(bases[2], 1), "norm", "norm", "norm", "norm", "rock", "nest", "nest", "nest", "rock", "norm", "norm", "norm", "norm", id(bases[3], 1)],
            [id(bases[2], 0), "norm", "norm", "norm", "norm", "nest", "nest", "nest", "nest", "nest", "norm", "norm", "norm", "norm", id(bases[3], 0)],
            [id(bases[2], 1), "norm", "norm", "norm", "norm", "rock", "nest", "nest", "nest", "rock", "norm", "norm", "norm", "norm", id(bases[3], 1)],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "nest", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["rock", "roid", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "rock", "norm"],
            ["roid", "rock", "norm", "norm", "norm", "norm", id(bases[1], 1), id(bases[1], 0), id(bases[1], 1), "norm", "norm", "norm", "norm", "rock", "roid"]
        ] : [
            [id(bases[0], 0), id(bases[0], 1), "norm", "norm", "norm", "norm", "rock", "roid", "rock", "norm", "norm", "norm", "norm", id(bases[3], 1), id(bases[3], 0)],
            [id(bases[0], 1), "roid", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "roid", id(bases[3], 1)],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "rock", "roid", "rock", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "nest", "nest", "nest", "nest", "nest", "norm", "norm", "norm", "norm", "norm"],
            ["rock", "norm", "norm", "norm", "rock", "nest", "nest", "nest", "nest", "nest", "rock", "norm", "norm", "norm", "rock"],
            ["roid", "norm", "norm", "norm", "roid", "nest", "nest", "nest", "nest", "nest", "roid", "norm", "norm", "norm", "roid"],
            ["rock", "norm", "norm", "norm", "rock", "nest", "nest", "nest", "nest", "nest", "rock", "norm", "norm", "norm", "rock"],
            ["norm", "norm", "norm", "norm", "norm", "nest", "nest", "nest", "nest", "nest", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "rock", "roid", "rock", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            [id(bases[2], 1), "roid", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "rock", id(bases[1], 1)],
            [id(bases[2], 0), id(bases[2], 1), "norm", "norm", "norm", "norm", "rock", "roid", "rock", "norm", "norm", "norm", "norm", id(bases[1], 1), id(bases[1], 0)]
        ]);
        return {
            MODE: "tdm",
            TEAMS: teams,
            X_GRID: 15,
            Y_GRID: 15,
            ROOM_SETUP: map
        }
    })(),
    "Open TDM": {
        MODE: "tdm",
        TEAMS: 2 + (Math.random() * 3 | 0),
        ROOM_SETUP: setup()
    },
    "Kill Race": {
        MODE: "tdm",
        TEAMS: 2 + (Math.random() * 3 | 0),
        ROOM_SETUP: setup(),
        KILL_RACE: true,
        secondaryGameMode: "killRace"
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
        secondaryGameMode: "hideAndSeek"
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
        secondaryGameMode: "soccer"
    },
    "Survival": {
        SURVIVAL: true,
        BOTS: -1,
        WIDTH: 7500,
        HEIGHT: 7500,
        X_GRID: 20,
        Y_GRID: 20,
        ROOM_SETUP: setup({
            width: 20,
            height: 20,
            rockScatter: .5
        }),
    },
    "Mothership": {
        MODE: "tdm",
        TEAMS: (Math.random() * 3 | 0) + 2,
        ROOM_SETUP: setup(),
        MOTHERSHIP_LOOP: true,
        secondaryGameMode: "Mothership"
    },
    "Tag": {
        MODE: "tdm",
        TEAMS: (Math.random() * 3 | 0) + 2,
        ROOM_SETUP: setup(),
        TAG: true,
        secondaryGameMode: "Tag"
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
            ROOM_SETUP: (function() {
                const output = setup({
                    width: width,
                    height: height
                });
                const mapType = Math.round(Math.random());// + width % 2; // For alt map type
                const bases = getBaseShuffling(teams);
                width --;
                height --;
                switch (mapType) {
                    case 0: {
                        const majorWidth = Math.floor(width / 2);
                        const minorWidth = Math.floor(width / 6 );
                        const majorHeight = Math.floor(height / 2);
                        const minorHeight = Math.floor(height / 6);
                        output[minorHeight][majorWidth] = "dom0";
                        output[height - minorHeight][majorWidth] = "dom0";
                        output[majorHeight][minorWidth] = "dom0";
                        output[majorHeight][width - minorWidth] = "dom0";
                        if ((width + 1) % 2) {
                            output[majorHeight][majorWidth] = "dom0";
                        }
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
                        const majorWidth = Math.floor(width / 2);
                        const minorWidth = Math.floor(width / 6 );
                        const majorHeight = Math.floor(height / 2);
                        const minorHeight = Math.floor(height / 6);
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
            secondaryGameMode: "Domination"
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
        secondaryGameMode: "Space"
    },
    "Boss Rush": {
        MODE: "tdm",
        TEAMS: 1,
        SPECIAL_BOSS_SPAWNS: true,
        WIDTH: 5500,
        HEIGHT: 5500,
        X_GRID: 18,
        Y_GRID: 18,
        ROOM_SETUP: setup({
            width: 18,
            height: 18,
            rockScatter: .225
        }),
        secondaryGameMode: "Boss Rush"
    },
    "Naval Battle": {
        NAVAL_SHIPS: true,
        WIDTH: 7500,
        HEIGHT: 7500,
        FOOD_AMOUNT: 0,
        MODE: "tdm",
        TEAMS: 2
    }
};

const choiceTable = {
    "FFA": 10,
    "TDM": 9,
    "Open TDM": 8,
    "Kill Race": 4,
    "Hide and Seek": 2,
    "Soccer": 6,
    "Survival": 3,
    "Mothership": 5,
    "Tag": 6,
    "Domination": 7,
    "Naval Battle": 4,
    "Boss Rush": 6,
    "Space": 1
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
    return "Boss Rush";//table[Math.floor(Math.random() * table.length)];
})();

const mode = gamemodes[gamemode];
let output = {};
for (let key in defaults) {
    output[key] = defaults[key];
    if (mode[key] != null) output[key] = mode[key];
}
output.gameModeName = gamemode;
if (gamemode.includes("TDM")) {
    output.gameModeName = output.gameModeName.replace("TDM", output.TEAMS + " TDM");
}
if (["Kill Race", "Mothership", "Tag", "Domination"].includes(gamemode)) {
    output.gameModeName = output.TEAMS + " TDM " + gamemode;
}
module.exports = {
    output
};
