import {parseInput} from "../util/Parser.ts";
import {flatten, sum} from "../util/Util.ts";

const input: string[] = (await parseInput(Deno.args[0]))
    .split(/\n/)
    .filter(it => it != '');

type Position = {
    readonly x: number,
    readonly y: number
};

const areEqual = (pos1: Position, pos2: Position): boolean => pos1.x === pos2.x && pos1.y === pos2.y;
const getNeighbours = (nums: number[][], x: number, y: number): Position[] => {
    const pos: Position = {x: x, y: y};
    return [
        {x: Math.max(0, x - 1), y: y},
        {x: Math.min(nums.length - 1, x + 1), y: y},
        {x: x, y: Math.max(0, y - 1)},
        {x: x, y: Math.min(nums[x].length - 1, y + 1)}
    ].filter(it => !areEqual(pos, it));
};

function part1(): number {
    const numbers: number[][] = input.map(it => it.split('').map(itt => Number.parseInt(itt)));
    return numbers.map((it, x) => it.filter(
        (tube, y) =>
            getNeighbours(numbers, x, y).every(neighour => numbers[neighour.x][neighour.y] > tube))
    ).reduce(flatten, []).map(it => it + 1).reduce(sum);
}

console.log(`Part 1 : ${part1()}`);

function part2(): number {
    const numbers: number[][] = input.map(it => it.split('').map(itt => Number.parseInt(itt)));
    const getBasin = (nums: number[][], pos: Position, knownPoses: Position[] = []): Position[] => {
        return [];
    };
    return 0;
}

console.log(`Part 2 : ${part2()}`);
