/*jslint node: true */
/*jshint -W061 */
/*global goog, Map, let */
"use strict";
// General requires
require('google-closure-library');
goog.require('goog.structs.PriorityQueue');
goog.require('goog.structs.QuadTree');
let locsToAvoid = ["nest", "port", "dom0", "edge"];
for (let i = 1; i < 5; i++) locsToAvoid.push("bas" + i), locsToAvoid.push("bap" + i), locsToAvoid.push("dom" + i);

class MazeRemap {
    constructor(maze) {
        this._ref = JSON.parse(JSON.stringify(maze));
        this.maze = maze;
        this.blocks = [];
        this.offset = {
            x: 0,
            y: 0
        };
    }
    get width() {
        return this.maze.length;
    }
    get height() {
        return this.maze.length === 0 ? 0 : this.maze[0].length;
    }
    trim() {
        while (this.maze.length > 0 && this.maze[0].every(block => !block)) {
            this.offset.x++;
            this.maze.shift();
        }

        while (this.maze.length > 0 && this.maze[this.maze.length - 1].every(block => !block)) {
            this.maze.pop();
        }
        let minY = Infinity,
            maxY = -Infinity;
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (!this.maze[x][y]) {
                    continue;
                }
                minY = y < minY ? y : minY;
                maxY = y > maxY ? y : maxY;
            }
        }
        this.offset.y += minY;
        if (minY === Infinity) {
            this.maze = [];
        } else {
            this.maze = this.maze.map(row => row.slice(minY, maxY + 1));
        }
    }
    findBiggest() {
        let best = {
            x: 0,
            y: 0,
            size: 0
        };
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (!this.maze[x][y]) {
                    continue;
                }
                let size = 1;
                loop: while (x + size < this.width && y + size < this.height) {
                    for (let i = 0; i <= size; i++) {
                        if (!this.maze[x + size][y + i] || !this.maze[x + i][y + size]) {
                            break loop
                        }
                    }
                    size++
                }
                if (size > best.size) {
                    best = {
                        x: x,
                        y: y,
                        size: size
                    };
                }
            }
        }
        for (let x = 0; x < best.size; x++) {
            for (let y = 0; y < best.size; y++) {
                this.maze[best.x + x][best.y + y] = false;
            }
        }
        return {
            x: best.x + this.offset.x,
            y: best.y + this.offset.y,
            size: best.size,
            width: 1,
            height: 1
        };
    }
    lookup(x, y, size, width, height) {
        return this.blocks.find(cell => (cell.x === x && cell.y === y && cell.size === size && cell.width === width && cell.height === height));
    }
    remove(id) {
        this.blocks = this.blocks.filter(entry => entry.id != id);
        return this.blocks;
    }
    remap() {
        this.blocks = [];
        let biggest;
        while ((biggest = this.findBiggest()) && !this.blocks.includes(biggest) && biggest.size > 0) {
            this.blocks.push(biggest);
        }
        this.blocks.forEach((block, i) => {
            block.id = i;
        });
        let i = 0;
        while (i < this.blocks.length) {
            const my = this.blocks[i];
            if ( /*my.size === 1 && my.width === 1 && my.height === 1*/ true) {
                let width = 1;
                for (let x = my.x + my.size; x <= this.width - my.size; x += my.size) {
                    const other = this.lookup(x, my.y, my.size, my.width, my.height);
                    if (!other) {
                        break;
                    }
                    this.remove(other.id);
                    width++;
                }
                my.width = width;
            }
            i++;
        }
        i = 0;
        while (i < this.blocks.length) {
            const my = this.blocks[i];
            if ( /*my.size === 1 && my.width === 1 && my.height === 1*/ true) {
                let height = 1;
                for (let y = my.y + my.size; y <= this.height - my.size; y += my.size) {
                    const other = this.lookup(my.x, y, my.size, my.width, my.height);
                    if (!other) {
                        break;
                    }
                    this.remove(other.id);
                    height++;
                }
                my.height = height;
            }
            i++;
        }
        return this.blocks;
    }
}
class MazeGenerator {
    constructor(options = {}) {
        if (options.erosionPattern == null) {
            options.erosionPattern = {
                amount: .5,
                getter: (i, max) => {
                    if (i > max * .6) {
                        return [Math.random() > .3 ? 2 : Math.random() > .5 ? 1 : 0, Math.random() > .1 ? 2 : (Math.random() * 2 | 0)];
                    } else {
                        return [+(Math.random() > .8), (Math.random() * 3 | 0)];
                    }
                }
            };
        } else {
            if (options.erosionPattern.amount == null) {
                options.erosionPattern.amount = .5;
            }
            if (options.erosionPattern.getter == null) {
                options.erosionPattern.getter = (i, max) => {
                    if (i > max * .5) {
                        return [(Math.random() * 3 | 0), 2];
                    } else {
                        return [(Math.random() * 2 | 0), (Math.random() * 2 | 0) * 2];
                    }
                };
            }
        }
        this.options = options;
        this.maze = options.mapString != null ? this.parseMapString(options.mapString) : JSON.parse(JSON.stringify(Array(options.width || 32).fill(Array(options.height || 32).fill(true))));
        this.offset = {
            x: 0,
            y: 0
        };
        const scale = room.width / this.width;
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                for (let loc of locsToAvoid) {
                    if (room.isIn(loc, {
                        x: (x * scale) + (scale * 0.5),
                        y: (y * scale) + (scale * 0.5)
                    })) {
                        this.maze[x][y] = false;
                    }
                }
            }
        }
        if (options.mapString == null) {
            this.clearRing(0);
            this.clearRing(5);
            let cx = this.width / 2 | 0,
                cy = this.height / 2 | 0,
                cs = this.width / 5 | 0;
            if (cs % 2) {
                cs++;
            }
            for (let i = cx - cs / 2; i < cx + cs / 2; i++) {
                for (let j = cy - cs / 2; j < cy + cs / 2; j++) {
                    this.maze[i | 0][j | 0] = false;
                }
            }
        }
        const max = this.maze.flat().length * options.erosionPattern.amount;
        for (let i = 0; i < max; i++) {
            this.randomErosion(...options.erosionPattern.getter(i, max));
        }
    }
    get width() {
        return this.maze.length;
    }
    get height() {
        return this.maze.length === 0 ? 0 : this.maze[0].length;
    }
    parseMapString(mapString) {
        const map = mapString.trim().split('\n').map(r => r.trim().split('').map(r => r === '#' ? 1 : r === '@'));
        return Array(map[0].length).fill().map((_, y) => Array(map.length).fill().map((_, x) => map[x][y]));
    }
    randomPosition(typeSearch) {
        let x = Math.floor(Math.random() * this.width),
            y = Math.floor(Math.random() * this.height);
        while (this.maze[x][y] != typeSearch) {
            x = Math.floor(Math.random() * this.width);
            y = Math.floor(Math.random() * this.height);
        }
        return [x, y];
    }
    clearRing(dist) {
        for (let i = dist; i < this.width - dist; i++) {
            this.maze[i][dist] = false;
            this.maze[i][this.width - 1 - dist] = false;
        }
        for (let i = dist; i < this.height - dist; i++) {
            this.maze[dist][i] = false;
            this.maze[this.height - 1 - dist][i] = false;
        }
    }
    randomErosion(side, corner) {
        for (let i = 0; i < 750; i++) {
            const [x, y] = this.randomPosition(false);
            if ((x === 0 || x === this.width - 1) && (y === 0 || y === this.height - 1)) {
                continue;
            }
            let dir = Math.random() * 4 | 0;
            if (x === 0) {
                dir = 0;
            } else if (y === 0) {
                dir = 1;
            } else if (x === this.width - 1) {
                dir = 2;
            } else if (y === this.height - 1) {
                dir = 3;
            }
            let tx = dir === 0 ? x + 1 : dir === 2 ? x - 1 : x,
                ty = dir === 1 ? y + 1 : dir === 3 ? y - 1 : y;
            if (this.test(tx, ty) !== true) {
                continue;
            }
            if (corner !== null) {
                let left = this.maze[dir === 2 || dir === 3 ? x - 1 : x + 1][dir === 0 || dir === 3 ? y - 1 : y + 1],
                    right = this.maze[dir === 1 || dir === 2 ? x - 1 : x + 1][dir === 2 || dir === 3 ? y - 1 : y + 1];
                if ((corner === true && (left || right)) || (corner === +left + +right)) {} else {
                    continue;
                }
            }
            if (side !== null) {
                let left = this.maze[dir === 3 ? x + 1 : dir === 1 ? x - 1 : x][dir === 0 ? y + 1 : dir === 2 ? y - 1 : y],
                    right = this.maze[dir === 1 ? x + 1 : dir === 3 ? x - 1 : x][dir === 2 ? y + 1 : dir === 0 ? y - 1 : y];
                if ((side === true && (left || right)) || (side === +left + +right)) {} else {
                    continue;
                }
            }
            this.maze[tx][ty] = false;
            return;
        }
    }
    test(x, y) {
        return this.maze[x][y];
    }
}

function generateMaze(options) {
    const maze = new MazeGenerator(options);
    const remapped = new MazeRemap(maze.maze).remap();
    const scale = room.width / maze.width;
    for (const placement of remapped) {
        const width = placement.width || 1;
        const height = placement.height || 1;
        let o = new Entity({
            x: placement.x * scale + (scale / 2 * placement.size * width),
            y: placement.y * scale + (scale / 2 * placement.size * height)
        });
        o.define(Class.mazeWall);
        o.SIZE = placement.size * scale / 2 + placement.size * 2;
        o.width = width - (width > 1 ? ((width - (width / 1.1)) * .1) : 0);
        o.height = height - (height > 1 ? ((height - (height / 1.1)) * .1) : 0);
        o.team = -101;
        o.alwaysActive = true;
        o.protect();
        o.life();
    }
}

module.exports = {
    generateMaze,
    MazeGenerator,
    MazeRemap
};