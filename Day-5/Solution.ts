import {parseInput} from "../util/Parser.ts";

const input: string[] = (await parseInput(Deno.args[0])).split(/\n/).filter(it => it !== '');

type Position = {
    x: number,
    y: number;
};

type Map = { [pos: string]: number; };

const toString = (pos: Position) => `(${pos.x}, ${pos.y})`;
const count = (map: Map) => Object.values(map).filter(it => it >= 2).length;

function createCoordPair(sPair: string[]): [Position, Position] {
    const firstCoords: string[] = sPair[0].split(/,/);
    const secondCoords: string[] = sPair[1].split(/,/);
    return [
        createPos(firstCoords),
        createPos(secondCoords)
    ];
}

const createPos = (coords: string[]) => {
    return {
        x: Number.parseInt(coords[0]),
        y: Number.parseInt(coords[1])
    }
}

const insertPosesToMap = (coordPair: [Position, Position], map: Map) => {
    const dx = coordPair[0].x - coordPair[1].x;
    const dy = coordPair[0].y - coordPair[1].y;

    const step = {
        xStep: dx / Math.abs(dx),
        yStep: dy / Math.abs(dy)
    };

    if (isNaN(step.xStep)) {
        step.xStep = 0;
    }

    if (isNaN(step.yStep)) {
        step.yStep = 0;
    }

    for (let i = 0, j = 0; i - step.xStep != dx || j - step.yStep != dy; i += step.xStep, j += step.yStep) {
        const pos: Position = {
            x: coordPair[0].x - i,
            y: coordPair[0].y - j
        };

        map[toString(pos)] = (map[toString(pos)] ?? 0) + 1;
    }
}

function part1(): number {
    const coords: [Position, Position][] = input.map(it => it.split(/->/).map(s => s.trim()))
        .map(it => createCoordPair(it))
        .filter(it => it[0].x === it[1].x || it[0].y === it[1].y);

    const map: Map = {};
    coords.forEach(it => insertPosesToMap(it, map));

    return count(map);
}

console.log(`Part 1 : ${part1()}`);

function part2(): number {
    const coords: [Position, Position][] = input.map(it => it.split(/->/).map(s => s.trim()))
        .map(it => createCoordPair(it));

    const map: Map = {};
    coords.forEach(it => insertPosesToMap(it, map));

    return count(map);
}

console.log(`Part 2 : ${part2()}`);