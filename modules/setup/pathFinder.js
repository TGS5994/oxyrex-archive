//http://gregtrowbridge.com/a-basic-pathfinding-algorithm/
//Original code there, optimized by me (Oblivion Q. Plain).
var findShortestPath = function(startCoordinates, grid) {
    var distanceFromTop = startCoordinates[0];
    var distanceFromLeft = startCoordinates[1];
    var location = {
        distanceFromTop: distanceFromTop,
        distanceFromLeft: distanceFromLeft,
        path: [],
        status: "Start"
    };
    var queue = [location];
    do {
        var currentLocation = queue.shift();
        let locs = ["North", "East", "South", "West"];
        let i = 0;
        do {
            var newLocation = exploreInDirection(currentLocation, locs[i], grid);
            switch (newLocation.status) {
                case "Goal":
                    return newLocation.path;
                case "Valid":
                    queue.push(newLocation);
                    break;
                default:
                    break;
            }
            i++;
        } while (i < locs.length);
    } while (queue.length > 0);
    return false;
};

var locationStatus = function(location, grid) {
    var gridSize = grid.length;
    var dft = location.distanceFromTop;
    var dfl = location.distanceFromLeft;
    switch (true) {
        case (location.distanceFromLeft < 0 || location.distanceFromLeft >= gridSize || location.distanceFromTop < 0 || location.distanceFromTop >= gridSize):
            return "Invalid";
        case (grid[dft][dfl] === "Goal"):
            return "Goal";
        case (grid[dft][dfl] !== "Empty"):
            return "Blocked";
        default:
            return "Valid";
    }
};

var exploreInDirection = function(currentLocation, direction, grid) {
    var newPath = currentLocation.path.slice();
    newPath.push(direction);
    var dft = currentLocation.distanceFromTop;
    var dfl = currentLocation.distanceFromLeft;
    switch (direction) {
        case "North":
            dfl--;
            break;
        case "East":
            dft++;
            break;
        case "South":
            dfl++;
            break;
        case "West":
            dft--;
            break;
        default:
            break;
    }
    var newLocation = {
        distanceFromTop: dft,
        distanceFromLeft: dfl,
        path: newPath,
        status: "Unknown"
    };
    newLocation.status = locationStatus(newLocation, grid);
    if (newLocation.status === "Valid") grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = "Visited";
    return newLocation;
};

module.exports = (start, end) => {
    console.log(start, end);
    const grid = JSON.parse(JSON.stringify(mazeGridData)).map(line => line.map(entry => entry ? "Obstacle" : "Empty"));
    grid[start[0]][start[1]] = "Start"
    grid[end[0]][end[1]] = "Goal";
    let path = [];
    let state = {
        x: start[0],
        y: start[1]
    };
    let foundPath = findShortestPath([...start], grid);
    if (foundPath === false) return [start];
    for (let dir of foundPath) {
        switch (dir) {
            case "North":
                state.y--;
                break;
            case "South":
                state.y++;
                break;
            case "West":
                state.x--;
                break;
            case "East":
                state.x++;
                break;
            default:
                break;
        }
        path.push([state.x, state.y]);
    }
    return path;
};