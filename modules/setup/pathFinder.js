// UNFINISHED DO NOT TOUCH



// Key:
// [Goal, Valid, Invalid, Blocked, Empty, Start, "Visited"]
// [North, South, East, West]

const key = {
    Goal: 0,
    Valid: 1,
    Invalid: 2,
    Blocked: 3,
    Empty: 4,
    Start: 5,
    Visited: 6,
    Unknown: 7
};

function findShortestPath(startCoordinates, grid) {
    console.log(startCoordinates);
    const queue = [{
        distanceFromTop: startCoordinates[0],
        distanceFromLeft: startCoordinates[1],
        path: [],
        status: key.Start
    }];
    let ticks = 0;
    do {
        const currentLocation = queue.shift();
        for (let i = 0; i < 4; i ++) {
            const newLocation = exploreInDirection(currentLocation, i, grid);
            switch (newLocation.status) {
                case key.Goal:
                    return newLocation.path;
                case key.Valid:
                    queue.push(newLocation);
                    break;
            }
        }
    } while (queue.length > 0 && ticks ++ < 50);
    return false;
}

function locationStatus(location, grid) {
    const size = grid.length;
    const dft = location.distanceFromTop;
    const dfl = location.distanceFromLeft;
    if (dfl < 0 || dfl >= size || dft < 0 || dft >= size) return key.Invalid;
    if (grid[dft][dfl] === key.Goal) return key.Goal;
    if (grid[dft][dfl] === key.Empty) return key.Blocked;
    return key.Valid;
}

function exploreInDirection(currentLocation, direction, grid) {
    const newPath = currentLocation.path.slice();
    newPath.push(direction);
    let dft = currentLocation.distanceFromTop,
        dfl = currentLocation.distanceFromLeft;
    switch (direction) {
        case 0: dfl --; break;
        case 1: dfl ++; break;
        case 2: dft ++; break;
        case 3: dft --; break;
    }
    const newLocation = {
        distanceFromTop: dft,
        distanceFromLeft: dfl,
        path: newPath,
        status: key.Unknown
    };
    newLocation.status = locationStatus(newLocation, grid);
    if (newLocation.status === "Valid") grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = "Visited";
    return newLocation;
}
