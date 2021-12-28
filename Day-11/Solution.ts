import {parseInput} from "../util/Parser.ts";
import {flatten, posEq, Position, posToString} from "../util/Util.ts"

const input: string[] = (await parseInput(Deno.args[0]))
    .split(/\n/)
    .filter(it => it != '');

const gridSize = {
    xSize: 10,
    ySize: 10
}

type Grid = {
    [pos: string]: Octopus;
};

type Octopus = {
    neighbours: Position[],
    readonly position: Position,
    hasFlashed: boolean,
    energyLevel: number
};

const createOctopus = (x: number, y: number, grid: number[][]): Octopus => {
    const pos: Position = {x: x, y: y};
    const neighbours: Position[] = [];

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const currentNeighbour = {
                x: Math.min(gridSize.xSize - 1, Math.max(pos.x + i, 0)),
                y: Math.min(gridSize.ySize - 1, Math.max(pos.y + j, 0))
            };
            if (!posEq(currentNeighbour, pos) && neighbours.every(it => !posEq(it, currentNeighbour))) {
                neighbours.push(currentNeighbour);
            }
        }
    }

    return {position: pos, neighbours: neighbours, energyLevel: grid[pos.x][pos.y], hasFlashed: false}
};

const flash = (octopus: Octopus, grid: Grid, callback: () => void) => {
    if (octopus.energyLevel > 9 && !octopus.hasFlashed) {
        callback();
        octopus.hasFlashed = true;
        octopus.neighbours.forEach(neigPos => {
            const neighbour = grid[posToString(neigPos)];
            neighbour.energyLevel++;
            flash(neighbour, grid, callback);
        });
    }
};

const step = (grid: Grid, callback: () => void = () => {}) => {
    const octopi = Object.values(grid);
    octopi.forEach(octopus => {
        octopus.energyLevel++;
        flash(octopus, grid, callback);
    });
    octopi.filter(octopi => octopi.hasFlashed).forEach(it => {
        it.energyLevel = 0;
        it.hasFlashed = false;
    });
};

const createGrid = (input: string[]) => input
    .map(line => line.split('').map(it => Number.parseInt(it)))
    .map((line, x, arr) =>
        line.map((_, y) => createOctopus(x, y, arr))
    )
    .reduce(flatten)
    .reduce((grid, it) => {
        grid[posToString(it.position)] = it;
        return grid;
    }, {} as Grid);


function part1(): number {
    const grid: Grid = createGrid(input);
    let flashes = 0;

    for (let i = 0; i < 100; i++) {
        step(grid, () => flashes++);
    }
    return flashes;
}

console.log(`Part 1 : ${part1()}`);

function part2(): number {
    const grid: Grid = createGrid(input);
    let currentStep = 0;

    while (Object.values(grid).some(octopus => octopus.energyLevel !== 0)) {
        step(grid);
        currentStep++;
    }
    return currentStep;
}

console.log(`Part 2 : ${part2()}`);
