/*jslint node: true */
/*jshint -W061 */
/*global goog, Map, let */
"use strict";
// General requires
require('google-closure-library');
goog.require('goog.structs.PriorityQueue');
goog.require('goog.structs.QuadTree');
const express = require("express");
const fingerprint = require("express-fingerprint");
const expressWs = require("express-ws");
const cors = require("cors");
const server = express();
server.use(fingerprint());
expressWs(server);
server.use(cors());
server.ws("/", sockets.connect);
server.get("/", function(request, response) {
    response.send(`<script>location.href = "${c.clientAddresses[0]}"</script>`);
});
server.get("/mockups.json", function(request, response) {
    response.send(mockupJsonData);
});
server.get("/gamemodeData.json", function(request, response) {
    response.send(JSON.stringify({
        gameMode: c.gameModeName,
        players: views.length,
        maxPlayers: c.maxPlayers,
        code: [c.MODE, c.MODE === "ffa" ? "f" : c.TEAMS, c.secondaryGameMode].join("-")
    }));
});
server.listen(process.env.PORT || c.port, function() {
    console.log("Express + WS server listening on port", process.env.PORT || c.port);
    console.log("Tracking:", ...Object.entries(c.tracking));
    console.log("Accepting requests from:", c.clientAddresses.join(", "));
});
module.exports = {
    server
};
