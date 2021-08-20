/*jslint node: true */
/*jshint -W061 */
/*global goog, Map, let */
"use strict";
// General requires
require('google-closure-library');
goog.require('goog.structs.PriorityQueue');
goog.require('goog.structs.QuadTree');
const WebSocket = require("ws");
const http = require("http");
const url = require("url");
const fetch = require("node-fetch");
const clientAddress = "woomy.surge.sh";
const httpServer = http.createServer(function(request, response) {
    const path = url.parse(request.url).pathname;
    switch (path) {
        case "/":
            response.writeHead(200);
            response.end(`
                <!DOCTYPE html>
                <html>
                    <h2>Why hello there, what are you doing here?</h2>
                    Play <a href="${clientAddress}">here</a>!
                    <script>
                        function redirect() {
                            location.href = "${clientAddress}";
                        };
                        setTimeout(redirect, 25000);
                    </script>
                </html>
            `);
            break;
        case "/mockups.json":
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.writeHead(200);
            response.end(mockupJsonData);
            break;
        case "/gamemodeData.json":
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.writeHead(200);
            response.end(JSON.stringify({
                gameMode: c.gameModeName,
                players: views.length,
                code: [c.MODE, c.MODE === "ffa" ? "f" : c.TEAMS, c.secondaryGameMode].join("-")
            }));
            break;
        default:
            response.writeHead(404);
            response.end();
            break;
    };
});
const webSocketServer = (function() {
    function httpServerListener() {
        util.log(`${new Date()}. HTTP + WebSocket Server turned on, listening on port ${httpServer.address().port}.`);
    };
    httpServer.listen(c.port, httpServerListener);
    return new WebSocket.Server({
        server: httpServer
    });
})().on("connection", sockets.connect);
module.exports = {
    webSocketServer,
    httpServer
};
