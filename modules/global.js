/*jslint node: true */
/*jshint -W061 */
/*global goog, Map, let */
"use strict";

// General requires
require('google-closure-library');
goog.require('goog.structs.PriorityQueue');
goog.require('goog.structs.QuadTree');

// Global Utilities Requires
global.c = require("./setup/config.js").output;
global.ran = require(".././lib/random.js");
global.util = require(".././lib/util.js");
global.hshg = require(".././lib/hshg.js");
global.protocol = require(".././lib/fasttalk.js");

// Global Variables (These must come before we import from the modules folder.)
global.roomSpeed = c.gameSpeed;
global.fps = "Unknown";
global.minimap = [];
global.entities = [];
global.views = [];
global.entitiesToAvoid = [];
global.grid = new hshg.HSHG();
global.arenaClosed = false;
global.mockupsLoaded = false;
global.nextTagBotTeam = false;
global.getTeam = () => {
  let teamData = {};
  for (let i = 1; i < c.TEAMS + 1; i++) teamData[i] = 0;
  for (let o of entities) {
    if (o.type !== "tank") continue;
    if (![-1, -2, -3, -4].includes(o.team)) continue;
    teamData[-o.team]++;
  }
  let toSort = [];
  for (let team in teamData) toSort.push([team, teamData[team]]);
  toSort = toSort.filter(e => !global.defeatedTeams.includes(-e[0])).sort((a, b) => a[1] - b[1]);
  if (!toSort.length) return (Math.random() * c.TEAMS | 0) + 1;
  return toSort[0][0];
};

global.loopThrough = function(array, callback = () => {}) {
  for (let index = 0, length = array.length; index < length; index ++) callback(array[index], index);
};

global.isEven = function isEven(number) {
  let string = number.toString();
  let last =  string[string.length - 1];
  return [0, 2, 4, 6, 8].includes(Number(last));
};

global.rotatePoint = function rotatePoint({x, y}, angle) {
  const dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  const rad = Math.atan2(y, x) + angle;
  return {
    x: Math.cos(rad) * dist,
    y: Math.sin(rad) * dist,
  };
};

// Now that we've set up the global variables, we import all the modules, then put them into global varialbles and then export something just so this file is run.
const requires = [
  "./setup/room.js", // These are the basic room functions, set up by config.json
  "./physics/relative.js", // Some basic physics functions that are used across the game.
  "./live/entitySubFunctions.js", // Skill, HealthType and other functions related to entities are here.
  "./live/controllers.js", // The AI of the game.
  "./live/entity.js", // The actual Entity constructor.
  "./setup/mockups.js", // This file loads the mockups.
  "./physics/collisionFunctions.js", // The actual collision functions that make the game work.
  "./network/sockets.js", // The networking that helps players interact with the game.
  "./network/webServer.js", // The networking that actually hosts the server.
  "./debug/logs.js", // The logging pattern for the game. Useful for pinpointing lag.
  "./debug/speedLoop.js", // The speed check loop lmao.
  "./gamemodes/bossRush.js", // Boss Rush
  "./gamemodes/maze.js", // Maze
  "./gamemodes/mothership.js", // The mothership mode
  "./gamemodes/domination.js", // The Domination mode
  "./gamemodes/gamemodeLoop.js", // The gamemode loop.
  "./gamemodes/groups.js", // Duos/Trios/Squads
  "./gamemodes/tag.js", // Tag
  "./gamemodes/closeArena.js", // Arena Closing mechanics
  "./debug/antibot.js", // Antibot :DDD
  "./bot/main.js" // Discord Bot
];

for (let file of requires) {
  const module = require(file);
  for (let key in module) if (module.hasOwnProperty(key)) global[key] = module[key];
}

module.exports = {
  creationDate: new Date(),
  creationTime: new Date().getTime()
};
