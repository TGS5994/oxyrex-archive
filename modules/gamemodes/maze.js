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

function convertMapString(mapString) {
    const map = mapString.trim().split('\n').map(r => r.trim().split('').map(r => r === '#' ? 1.5 : r === '@'));
    return Array(map[0].length).fill().map((_, y) => Array(map.length).fill().map((_, x) => map[x][y]));
}

function generateMaze(size) {
    const groupWalls = (typeof size !== "string");
    let maze;
    function clearRing(ring) {
        for (let i = ring; i < size - ring - 1; i ++) {
            maze[ring][i] = false;
            maze[size - ring - 1][i] = false;
            maze[i][ring] = false;
            maze[i][size - ring - 1] = false;
        }
        maze[size - ring - 1][size - ring - 1] = false;
    }
    function randomPosition(typeSearch) {
        let x = Math.floor(Math.random() * size),
        y = Math.floor(Math.random() * size);
        while (maze[x][y] != typeSearch) {
            x = Math.floor(Math.random() * size);
            y = Math.floor(Math.random() * size);
        }
        return [x, y];
    }
    if (typeof size === "string") {
        maze = JSON.parse(JSON.stringify(convertMapString(size)));
        size = maze.length;
    } else {
        maze = JSON.parse(JSON.stringify(Array(size).fill(Array(size).fill(true))));
        for (let i = 0; i < size; i ++) {
            maze[0][i] = false;
            maze[size - 1][i] = false;
            maze[i][0] = false;
            maze[i][size - 1] = false;
        }
        clearRing(7);
    }
    const scale = room.width / size;
    for (let x = 0; x < size; x ++) {
        for (let y = 0; y < size; y ++) {
            for (let loc of locsToAvoid) {
                if (room.isIn(loc, {
                    x: (x * scale) + (scale * 0.5),
                    y: (y * scale) + (scale * 0.5)
                })) maze[x][y] = false;
            }
        }
    }
    let cells = 0;
    for (let row of maze)
        for (let cell of row)
            if (cell) cells++;
    let eroded = 1;
    let toErode = cells * .625;
    function path(x, y, direction, length) {
        for (let pathdistance = 0; pathdistance < length; pathdistance ++) {
            if (Math.random() > .5) {
                const newDirs = [0, 1, 2, 3].sort(() => 0.5 - Math.random()).filter(entry => {
                    if (entry !== direction) {
                        const tx = entry === 0 ? x + 1 : entry === 2 ? x - 1 : x;
                        const ty = entry === 1 ? y + 1 : entry === 3 ? y - 1 : y;
                        if (tx >= size || ty >= size || tx < 1 || ty < 1) return false;
                        if (!maze[tx][ty]) return false;
                        if (maze[x][y] == 1.5 || maze[tx][ty] == 1.5) return false;
                        return true;
                    }
                    return false;
                });
                if (newDirs.length) {
                    direction = newDirs.shift();
                    newDirs.forEach(dir => {
                        path(x, y, dir, Math.random() * 6);
                    });
                }
            }
            const tx = direction === 0 ? x + 1 : direction === 2 ? x - 1 : x;
            const ty = direction === 1 ? y + 1 : direction === 3 ? y - 1 : y;
            if (tx >= size || ty >= size || tx < 1 || ty < 1) break;
            if (!maze[tx][ty]) break;
            if (maze[x][y] == 1.5 || maze[tx][ty] == 1.5) break;
            maze[tx][ty] = false;
            eroded++;
            x = tx;
            y = ty;
        }
    }
    for (let i = 0; i < toErode; i++) {
        if (eroded >= toErode) {
            console.log("Done!");
            break;
        }
        for (let i = 0; i < 1000; i++) {
            let direction = Math.floor(Math.random() * 4);
            let [x, y] = randomPosition(false);
            if ((x === 0 || x === size - 1) && (y === 0 || y === size - 1)) continue;
            if (x === 0) direction = 0;
            if (y === 0) direction = 1;
            if (x === size - 1) direction = 2;
            if (y === size - 1) direction = 3;
            const pathSize = Math.floor(Math.random() * 9) + 8;
            path(x, y, direction, pathSize);
            break;
        }
    }
    if (eroded) {
        // Group rectangles...
        function findBiggest() {
            let best = {
                x: 0,
                y: 0,
                size: 0
            };
            for (let x = 0; x < size - 1; x ++) {
                for (let y = 0; y < size - 1; y ++) {
                    if (!maze[x][y]) {
                        continue;
                    }
                    let sqrArea = 1;
                    loop: while (x + sqrArea < size - 1 && y + sqrArea < size - 1) {
                        for (let i = 0; i < sqrArea; i ++) {
                            if (!maze[x + sqrArea][y + i] || !maze[x + i][y + sqrArea]) {
                                break loop;
                            }
                            sqrArea ++;
                        }
                    }
                    if (sqrArea > best.size) {
                        best = { x, y, size: sqrArea };
                    }
                }
            }
            return best;
        }
        let newMaze = [];
        let biggest;
        while ((biggest = findBiggest()) && !newMaze.includes(biggest) && biggest.size > 0) {
            for (let i = 0; i < biggest.size; i ++) {
                for (let j = 0; j < biggest.size; j ++) {
                    maze[biggest.x + i][biggest.y + j] = false;
                }
            }
            newMaze.push(biggest);
        }
        function cellLookup(x, y, size = 1) {
            return newMaze.find(cell => (cell.x === x && cell.y === y && cell.size === size));
        }
        function removeCell(cell) {
            newMaze = newMaze.filter(entry => entry != cell);
        }
        let i = 0;
        while (i < newMaze.length) {
            const my = newMaze[i];
            let width = 1;
            for (let x = my.x + my.size; x < size - 1; x += my.size) {
                const other = cellLookup(x, my.y, my.size);
                if (!other) {
                    break;
                }
                removeCell(other);
                width ++;
            }
            my.width = width;
            i ++;
        }
        i = 0;
        while (i < newMaze.length) {
            const my = newMaze[i];
            let height = 1;
            for (let y = my.y + my.size; y < size - 1; y += my.size) {
                const other = cellLookup(my.x, y, my.size);
                if (!other) {
                    break;
                }
                removeCell(other);
                height ++;
            }
            my.height = height;
            i ++;
        }
        /*for (let x = 0; x < size - 1; x++) {
            for (let y = 0; y < size - 1; y++) {
                if (maze[x][y] && maze[x + 1][y] && maze[x + 2][y] && maze[x][y + 1] && maze[x][y + 2] && maze[x + 1][y + 2] && maze[x + 2][y + 1] && maze[x + 1][y + 1] && maze[x + 2][y + 2]) {
                    maze[x][y] = 3;
                    maze[x + 1][y] = false;
                    maze[x][y + 1] = false;
                    maze[x + 2][y] = false;
                    maze[x][y + 2] = false;
                    maze[x + 2][y + 1] = false;
                    maze[x + 1][y + 2] = false;
                    maze[x + 1][y + 1] = false;
                    maze[x + 2][y + 2] = false;
                } else if (maze[x][y] && maze[x + 1][y] && maze[x][y + 1] && maze[x + 1][y + 1]) {
                    maze[x][y] = 2;
                    maze[x + 1][y] = false;
                    maze[x][y + 1] = false;
                    maze[x + 1][y + 1] = false;
                }
            }
        }*/
        // Group walls...
        /*if (groupWalls) {
            for (let x = 0; x < size; x ++) {
                for (let y = 0; y < size; y ++) {
                    if (maze[x][y] && maze[x][y] != 1.5) {
                        {
                            let i = x + 1;
                            let size = 1;
                            while (maze[i][y] && maze[i][y] != 1.5) {
                                maze[i][y] = false;
                                size ++;
                                i ++;
                            }
                            if (size > 1) {
                                maze[x][y] = [x + size / 2 - 0.5, y, size, 1];
                            }
                        } {
                            let i = y + 1;
                            let size = 1;
                            while (maze[x][i] && maze[x][i] != 1.5) {
                                maze[x][i] = false;
                                size ++;
                                i ++;
                            }
                            if (size > 1) {
                                maze[x][y] = [x, y + size / 2 - 0.5, 1, size];
                            }
                        }
                    }
                }
            }
        }*/
        for (const placement of newMaze) {
            const width = placement.width || 1;
            const height = placement.height || 1;
            let o = new Entity({
                x: placement.x * scale + (scale / 2 * placement.size * width),
                y: placement.y * scale + (scale / 2 * placement.size * height)
            });
            o.define(Class.mazeWall);
            o.SIZE = placement.size * scale / 2 + placement.size * 2;
            o.width = width;
            o.height = height;
            o.team = -101;
            o.alwaysActive = true;
            o.protect();
            o.life();
        }
        /*for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                let spawnWall = true;
                let d = {};
                if (Array.isArray(maze[x][y])) {
                    if (maze[x][y].length === 3) {
                        const [xx, yy, ss] = maze[x][y];
                        d = {
                            x: (xx * scale) + (scale * ss / 2),
                            y: (yy * scale) + (scale * ss / 2),
                            s: scale * ss,
                            sS: ss === 1 ? 1 : ((ss - 1) * 2.5)
                        }
                    } else {
                        const [X, Y, W, H] = maze[x][y];
                        d = {
                            x: (X * scale) + (scale * 0.5),
                            y: (Y * scale) + (scale * 0.5),
                            s: scale,
                            sS: 1,
                            width: W,
                            height: H
                        };
                    }
                } else if (maze[x][y] === 3) {
                    d = {
                        x: (x * scale) + (scale * 1.5),
                        y: (y * scale) + (scale * 1.5),
                        s: scale * 3,
                        sS: 5
                    }
                } else if (maze[x][y] === 2) {
                    d = {
                        x: (x * scale) + scale,
                        y: (y * scale) + scale,
                        s: scale * 2,
                        sS: 2.5
                    }
                } else if (maze[x][y]) {
                    d = {
                        x: (x * scale) + (scale * 0.5),
                        y: (y * scale) + (scale * 0.5),
                        s: scale,
                        sS: 1
                    }
                } else spawnWall = false;
                if (spawnWall) {
                    let o = new Entity({
                        x: d.x,
                        y: d.y
                    });
                    o.define(Class.mazeWall);
                    o.SIZE = (d.s * 0.5) + d.sS;
                    if (d.width) {
                        o.width = d.width;
                        o.height = d.height;
                    }
                    o.team = -101;
                    o.alwaysActive = true;
                    o.protect();
                    o.life();
                }
            }
        }*/
    }
};
module.exports = {
    generateMaze
};
