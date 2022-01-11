/*jslint node: true */
/*jshint -W061 */
/*global goog, Map, let */
"use strict";
// General requires
require('google-closure-library');
goog.require('goog.structs.PriorityQueue');
goog.require('goog.structs.QuadTree');
/*const room = {
    lastCycle: undefined,
    cycleSpeed: 1000 / roomSpeed / 30,
    width: c.WIDTH,
    height: c.HEIGHT,
    setup: c.ROOM_SETUP,
    xgrid: c.ROOM_SETUP[0].length,
    ygrid: c.ROOM_SETUP.length,
    xgridWidth: c.WIDTH / c.ROOM_SETUP[0].length,
    ygridHeight: c.HEIGHT / c.ROOM_SETUP.length,
    gameMode: c.MODE,
    skillBoost: c.SKILL_BOOST,
    scale: {
        square: c.WIDTH * c.HEIGHT / 100000000,
        linear: Math.sqrt(c.WIDTH * c.HEIGHT / 100000000),
    },
    maxFood: c.WIDTH * c.HEIGHT / 100000 * c.FOOD_AMOUNT,
    topPlayerID: -1,
    cellTypes: (function() {
        let output = ["nest", "norm", "rock", "roid", "port", "wall", "door", "edge"];
        for (let i = 1; i <= 8; i++) output.push("bas" + i), output.push("bap" + i);
        for (let i = 0; i < c.ROOM_SETUP.length; i++)
            for (let j = 0; j < c.ROOM_SETUP[i].length; j++)
                if (!output.includes(c.ROOM_SETUP[i][j])) output.push(c.ROOM_SETUP[i][j]);
        return output;
    })(),
    partyHash: Number(((Math.random() * 1000000 | 0) + 1000000).toString().replace("0.", "")),
    blackHoles: []
};
// Room functions. These functions must be defined after the room variable is created do to how they work.
room.isInRoom = function(location) {
    if (c.ARENA_TYPE === "cirlce")  {
        return util.getDistance(location, {
            x: room.width / 2,
            y: room.height / 2
        }) < room.width / 2;
    }
    return location.x >= 0 && location.x <= room.width && location.y >= 0 && location.y <= room.height;
}
room.findType = function(type) {
    let output = [];
    for (let i = 0; i < room.setup.length; i++)
        for (let j = 0; j < room.setup[i].length; j++) {
            let cell = room.setup[i][j];
            if (cell === type) output.push({
                x: (j + 0.5) * room.width / room.xgrid,
                y: (i + 0.5) * room.height / room.ygrid,
                id: j * room.xgrid + i
            });
        }
    room[type] = output;
};
room.setType = function(type, location) {
    if (!room.isInRoom(location)) return false;
    let a = Math.floor((location.y * room.ygrid) / room.height);
    let b = Math.floor((location.x * room.xgrid) / room.width);
    const oldType = room.setup[a][b];
    room.setup[a][b] = type;
    room.findType(type);
    room.findType(oldType);
    sockets.broadcastRoom();
};
room.random = function() {
    let x = ran.irandom(room.width);
    let y = ran.irandom(room.height);
    if (c.ARENA_TYPE === "circle") {
        let i = 5;
        do {
            x = ran.irandom(room.width);
            y = ran.irandom(room.height);
            i--;
        } while (util.getDistance({
                x,
                y
            }, {
                x: room.width / 2,
                y: room.height / 2
            }) > room.width * 0.475 && i);
    }
    return {
        x,
        y
    };
};
room.near = function(position, radius) {
    let x = position.x + ((Math.random() * (radius * 2) | 0) - radius);
    let y = position.y + ((Math.random() * (radius * 2) | 0) - radius);
    return {
        x,
        y
    };
};
room.randomType = function(type) {
    if (!room[type]) return room.random();
    let selection = room[type][ran.irandom(room[type].length - 1)];
    if (c.ARENA_TYPE === "circle") {
        let loc = JSON.parse(JSON.stringify(selection));
        let i = 5;
        do {
            loc = {
                x: ran.irandom(0.5 * room.width / room.xgrid) * ran.choose([-1, 1]) + selection.x,
                y: ran.irandom(0.5 * room.height / room.ygrid) * ran.choose([-1, 1]) + selection.y
            };
            i--;
        } while (util.getDistance(loc, selection) > (room.width / room.xgrid) * 0.45 && i);
        return loc;
    }
    return {
        x: ran.irandom(0.5 * room.width / room.xgrid) * ran.choose([-1, 1]) + selection.x,
        y: ran.irandom(0.5 * room.height / room.ygrid) * ran.choose([-1, 1]) + selection.y,
    };
};
room.isIn = function(type, location) {
    if (!room.isInRoom(location)) return false;
    let a = Math.floor(location.y * room.ygrid / room.height);
    let b = Math.floor(location.x * room.xgrid / room.width);
    if (!room.setup[a]) return false;
    if (!room.setup[a][b]) return false;
    if (c.ARENA_TYPE === "circle") {
        let cell = room[room.setup[a][b]].sort(function(a, b) {
            return util.getDistance(a, location) - util.getDistance(b, location);
        })[0];
        if (util.getDistance(cell, location) > (room.width / room.xgrid) * 0.5) return false;
    }
    return type === room.setup[a][b];
};
room.isAt = function(location) {
    if (!room.isInRoom(location)) return false;
    let x = Math.floor(location.x * room.xgrid / room.width);
    let y = Math.floor(location.y * room.ygrid / room.height);
    return {
        x: (x + .5) / room.xgrid * room.width,
        y: (y + .5) / room.ygrid * room.height,
        id: x * room.xgrid + y
    };
};
room.isInNorm = function(location) {
    if (!room.isInRoom(location)) return false;
    let a = Math.floor(location.y * room.ygrid / room.height);
    let b = Math.floor(location.x * room.xgrid / room.width);
    if (!room.setup[a]) return false;
    if (!room.setup[a][b]) return false;
    const v = room.setup[a][b];
    return v !== 'norm' && v !== 'roid' && v !== 'rock' && v !== 'wall' && v !== 'edge'
};
room.gauss = function(clustering) {
    let output,
        i = 15;
    do {
        output = {
            x: ran.gauss(room.width / 2, room.height / clustering),
            y: ran.gauss(room.width / 2, room.height / clustering),
        };
        i --;
    } while (!room.isInRoom(output) && i > 0);
    return output;
};
room.gaussInverse = function(clustering) {
    let output,
        i = 5;
    do {
        output = {
            x: ran.gaussInverse(0, room.width, clustering),
            y: ran.gaussInverse(0, room.height, clustering),
        };
        i --;
    } while (!room.isInRoom(output), i > 0);
    return output;
};
room.gaussRing = function(radius, clustering) {
    let output,
        i = 5;
    do {
        output = ran.gaussRing(room.width * radius, clustering);
        output = {
            x: output.x + room.width / 2,
            y: output.y + room.height / 2,
        };
        i --;
    } while (!room.isInRoom(output) && i > 0);
    return output;
};
room.gaussType = function(type, clustering) {
    if (!room[type]) return room.random();
    let selection = room[type][ran.irandom(room[type].length - 1)];
    let location = {},
        i = 5;
    do {
        location = {
            x: ran.gauss(selection.x, room.width / room.xgrid / clustering),
            y: ran.gauss(selection.y, room.height / room.ygrid / clustering),
        };
        i --;
    } while (!room.isIn(type, location) && i > 0);
    return location;
};
room.resize = function(width, height, resetObstacles = true) {
    room.width = width;
    room.height = height;
    for (let type of room.cellTypes) {
        room[type] = [];
        room.findType(type);
    }
    sockets.broadcastRoom();
    if (resetObstacles) {
        entities.forEach(entity => entity.type === "wall" && entity.kill());
        placeRoids();
    }
}
for (let type of room.cellTypes) room.findType(type);
room.nestFoodAmount = 7.5 * Math.sqrt(room.nest.length) / room.xgrid / room.ygrid;*/
class Room {
    constructor(config) {
        this.config = config;
        this.width = config.WIDTH;
        this.height = config.HEIGHT;
        this.setup = config.ROOM_SETUP;
        this.xgrid = this.setup[0].length;
        this.ygrid = this.setup.length;
        this.xgridWidth = this.width / this.xgrid;
        this.ygridHeight = this.height / this.ygrid;
        this.lastCycle = undefined;
        this.cycleSpeed = 1000 / roomSpeed / 30;
        this.gameMode = config.MODE;
        this.supportsRecords = ["ffa", "tdm", "d", "t", "m", "cc", "gp"].includes(this.config.secondaryGameMode);
        this.skillBoost = config.SKILL_BOOST;
        this.topPlayerID = -1;
        this.cellTypes = (() => {
            const output = ["nest", "norm", "rock", "roid", "port", "wall", "door", "edge"];
            for (let i = 1; i <= 8; i++) {
                output.push("bas" + i);
                output.push("bap" + i);
            }
            for (let i = 0; i < this.ygrid; i ++) {
                for (let j = 0; j < this.xgrid; j ++) {
                    if (!output.includes(this.setup[i][j])) {
                        output.push(this.setup[i][j]);
                    }
                }
            }
            return output;
        })();
        for (let type of this.cellTypes) {
            this.findType(type);
        }
        this.maxFood = this.width * this.height / 100000 * config.FOOD_AMOUNT;
        this.nestFoodAmount = 7.5 * Math.sqrt(this.nest.length) / this.xgrid / this.ygrid;
        this.partyHash = Number(((Math.random() * 1000 | 0) + 1000).toString().replace("0.", ""));
        this.blackHoles = [];
        this.scale = {
            square: this.width * this.height / 100000000,
            linear: Math.sqrt(c.WIDTH * c.HEIGHT / 100000000)
        };
    }
    isInRoom(location) {
        if (this.config.ARENA_TYPE === "cirlce")  {
            const x = (this.width / 2) - location.x;
            const y = (this.height / 2) - location.y;
            return Math.sqrt(x ** x + y ** y) < this.width / 2;
        }
        return location.x >= 0 && location.x <= this.width && location.y >= 0 && location.y <= this.height;
    }
    findType(type) {
        const output = [];
        for (let i = 0; i < this.setup.length; i ++) {
            for (let j = 0; j < this.setup[i].length; j ++) {
                if (this.setup[i][j] === type) {
                    output.push({
                        x: (j + 0.5) * this.width / this.xgrid,
                        y: (i + 0.5) * this.height / this.ygrid,
                        id: j * this.xgrid + i
                    });
                }
            }
        }
        this[type] = output;
    }
    setType(type, location) {
        if (!this.isInRoom(location)) {
            return false;
        }
        const a = ((location.y * this.ygrid) / this.height) | 0;
        const b = ((location.x * this.xgrid) / this.width) | 0;
        const oldType = this.setup[a][b];
        this.setup[a][b] = type;
        this.findType(type);
        this.findType(oldType);
        sockets.broadcastRoom();
    }
    random() {
        if (this.config.ARENA_TYPE === "circle") {
            const dist = ran.irandom(this.width / 2.667);
            const angle = Math.random() * Math.PI * 2;
            return {
                x: (this.width / 2) + Math.cos(angle) * dist,
                y: (this.height / 2) + Math.sin(angle) * dist
            }
        }
        return {
            x: ran.irandom(this.width),
            y: ran.irandom(this.height)
        }
    }
    near(position, radius) {
        return {
            x: position.x + ((Math.random() * (radius * 2) | 0) - radius),
            y: position.y + ((Math.random() * (radius * 2) | 0) - radius)
        }
    }
    randomType(type) {
        if (!this[type] || !this[type].length) {
            return this.random();
        }
        const selection = this[type][Math.random() * this[type].length | 0];
        if (this.config.ARENA_TYPE === "circle") {
            const dist = ran.irandom(.5 * this.width / this.xgrid);
            const angle = Math.random() * Math.PI * 2;
            return {
                x: selection.x + Math.cos(angle) * dist,
                y: selection.y + Math.sin(angle) * dist
            }
        }
        return {
            x: ran.irandom(this.width / this.xgrid) + selection.x - (.5 * this.width / this.xgrid),
            y: ran.irandom(this.height / this.ygrid) + selection.y - (.5 * this.width / this.xgrid),
        }
    }
    isIn(type, location) {
        if (!this.isInRoom(location)) {
            return false;
        }
        const a = (location.y * this.ygrid / this.height) | 0;
        const b = (location.x * this.xgrid / this.width) | 0;
        if (!this.setup[a] || !this.setup[a][b]) {
            return false;
        }
        if (this.config.ARENA_TYPE === "circle") {
            const me = this.isAt(location);
            return (Math.sqrt((location.x - me.x) ** 2 + (location.y - me.y) ** 2) < (this.xgridWidth / 2)) && type === this.setup[a][b];
        }
        return type === this.setup[a][b];
    }
    isAt(location) {
        if (!this.isInRoom(location)) {
            return false;
        }
        const x = (location.x * this.xgrid / this.width) | 0;
        const y = (location.y * this.ygrid / this.height) | 0;
        return {
            x: (x + .5) / this.xgrid * this.width,
            y: (y + .5) / this.ygrid * this.height,
            id: x * this.xgrid + y
        }
    }
    isInNorm(location) {
        if (!this.isInRoom(location)) {
            return false;
        }
        const a = (location.y * this.ygrid / this.height) | 0;
        const b = (location.x * this.xgrid / this.width) | 0;
        if (!this.setup[a] || !this.setup[a][b]) {
            return false;
        }
        const v = this.setup[a][b];
        return v !== 'norm' && v !== 'roid' && v !== 'rock' && v !== 'wall' && v !== 'edge';
    }
    gauss(clustering) {
        let output,
            i = 5;
        do {
            output = {
                x: ran.gauss(this.width / 2, this.height / clustering),
                y: ran.gauss(this.width / 2, this.height / clustering),
            };
            i --;
        } while (!this.isInRoom(output) && i > 0);
        return output;
    }
    gaussInverse(clustering) {
        let output,
            i = 5;
        do {
            output = {
                x: ran.gaussInverse(0, this.width, clustering),
                y: ran.gaussInverse(0, this.height, clustering),
            };
            i --;
        } while (!this.isInRoom(output), i > 0);
        return output;
    }
    gaussRing(radius, clustering) {
        let output,
            i = 5;
        do {
            output = ran.gaussRing(this.width * radius, clustering);
            output = {
                x: output.x + this.width / 2,
                y: output.y + this.height / 2,
            };
            i --;
        } while (!this.isInRoom(output) && i > 0);
        return output;
    }
    gaussType(type, clustering) {
        if (!this[type] || !this[type].length) {
            return this.random();
        }
        const selection = this[type][Math.random() * this[type].length | 0];
        let location = {},
            i = 5;
        do {
            location = {
                x: ran.gauss(selection.x, this.width / this.xgrid / clustering),
                y: ran.gauss(selection.y, this.height / this.ygrid / clustering),
            };
            i --;
        } while (!this.isIn(type, location) && i > 0);
        return location;
    }
    resize(width, height, resetObstacles = true) {
        this.width = width;
        this.height = height;
        for (let type of this.cellTypes) {
            this[type] = [];
            this.findType(type);
        }
        sockets.broadcastRoom();
        if (resetObstacles) {
            this.regenerateObstacles();
        }
    }
    regenerateObstacles() {
        entities.forEach(entity => entity.type === "wall" && entity.kill());
        if (this.config.MAZE && typeof this.config.MAZE !== "boolean") {
            generateMaze(c.MAZE);
        } else {
            placeRoids();
        }
    }
}
module.exports = {
    room: new Room(c),
    roomSpeed
};
