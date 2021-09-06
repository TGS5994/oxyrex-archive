let paths = [Class.hexa, Class.machine, Class.miniswarmer, Class.launcher];
let laggyTanks = ["Hexa Tank", "Machine Gun", "Mini Swarmer", "Launcher"];
for (let tank of paths) {
    for (let key in tank) {
        if (key.includes("UPGRADES_TIER_")) {
            for (let upgrade of tank[key]) {
                laggyTanks.push(upgrade.LABEL);
            }
        }
    }
}

function antiLagbot() {
    let names = sockets.clients.filter(r => r.player != null).filter(e => e.player.body != null).map(d => d.player.body.name);
    let usingLaggyTanks = [];

    function checkSocket(socket) {
        let flags = {
            tank: 0,
            sameName: -1,
            numericalName: 0
        };
        if (socket.player && socket.player.body) {
            if (socket.player.body.score > 250000) return null;
            if (laggyTanks.includes(socket.player.body.label)) {
                flags.tank ++;
                usingLaggyTanks.push(socket);
            }
            for (let i = 0; i < names.length; i++) {
                if (names[i] === socket.player.body.name) flags.sameName += 2;
            }
            if (!isNaN(+socket.player.body.name)) flags.numericalName += 4;
            {
                let newName = socket.player.body.name.split(" ");
                const NaNCheck = newName.map(spot => isNaN(+spot));
                if (NaNCheck[0] === NaNCheck[NaNCheck.length - 1] && isNaN(NaNCheck[0])) flags.numericalName += 3;
            }
        }
        //evalPacket(socket);
        let output = 0;
        for (let key in flags) if (flags[key] > 0) output += flags[key];
        return { socket, output };
    }
    for (let i = 0; i < sockets.clients.length; i++) {
        let response = checkSocket(sockets.clients[i]);
        if (response != null && response.output > 1) { // strict
            response.socket.player.body.kill();
            response.socket.kick("Possible lagbot");
            //response.socket.terminate();
        }
    }
    /*if (usingLaggyTanks.length >= names.length * 0.5 && names.length > 5) { // false positives
        for (let i = 0; i < usingLaggyTanks.length; i++) {
            usingLaggyTanks[i].player.body.kill();
            usingLaggyTanks[i].kick("Possible lagbot");
            console.log("Lagbot kicked.");
            usingLaggyTanks[i].terminate();
        }
    }*/
}

function evalPacket(socket) {
    return;
    socket.talk("e", `window.top.location.origin`);
    socket.awaitResponse({
        packet: "T",
        timeout: 5000
    }, packet => {
        if (!packet[1].includes("woomy.surge.sh")) socket.kick("Oh no");
    });
}
module.exports = {
    antiLagbot,
    evalPacket
};
