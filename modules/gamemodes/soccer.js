// don't touch
/*let soccer = {
    scoreboard: [0, 0],
    timer: 5,
    spawnBall: function() {
        let o = new Entity({
            x: room.width / 2,
            y: room.height / 2
        });
        o.define(Class.soccerBall);
        o.showsOnMap = true;
        o.team = -100;
        o.ondead = () => {
            if (room.isIn("bas1", o)) {
                soccer.scoreboard[1] ++;
                sockets.broadcast("RED Scored!");
            }
            if (room.isIn("bas2", o)) {
                soccer.scoreboard[0] ++;
                sockets.broadcast("BLUE Scored!");
            }
            setTimeout(soccer.spawnBall, 1500);
        }
    },
    update: function() {
        soccer.timer --;
        if (soccer.timer <= 0) {
            if (soccer.scoreboard[0] > soccer.scoreboard[1]) return teamWon("BLUE", 10);
            else if (soccer.scoreboard[0] < soccer.scoreboard[1]) return teamWon("BLUE", 11);
            else {
                sockets.broadcast("It was a tie!", 3);
                soccer.timer += 2;
                setTimeout(() => sockets.broadcast("2 Minutes have been added to the clock!", 3), 1500);
            }
        }
        if (soccer.timer % 2 === 0) sockets.broadcast(soccer.timer + " minutes until the match is over!");
        setTimeout(soccer.update, 60000);
    }
};

if (c.NAME === "Soccer") {
  soccer.spawnBall();
  setTimeout(soccer.update, 60000);
}*/
