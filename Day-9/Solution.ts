import {parseInput} from "../util/Parser.ts";
import {flatten, largestToSmallest, Position, posToString, product, sum, posEq} from "../util/Util.ts";

const input: string[] = (await parseInput(Deno.args[0]))
    .split(/\n/)
    .filter(it => it != '');

type PosSet = {
    [pos: string]: boolean;
};

const createPos = (x: number, y: number) => {
    return {
        x: x,
        y: y
    }
};
const isLow = (pos: Position, nums: number[][]) => getNeighbours(nums, pos.x, pos.y)
    .map(neighbour => nums[neighbour.x][neighbour.y])
    .every(it => it > nums[pos.x][pos.y]);

const getNeighbours = (nums: number[][], x: number, y: number): Position[] => {
    const pos: Position = createPos(x, y);
    return [
        createPos(Math.max(0, x - 1), y),
        createPos(Math.min(nums.length - 1, x + 1), y),
        createPos(x, Math.max(0, y - 1)),
        createPos(x, Math.min(nums[x].length - 1, y + 1))
    ].filter(it => !posEq(pos, it));
};

function part1(): number {
    const numbers: number[][] = input.map(it => it.split('').map(itt => Number.parseInt(itt)));
    return numbers.map(
        (it, x) => it.filter((_, y) => isLow(createPos(x, y), numbers))
    ).reduce(flatten, []).map(it => it + 1).reduce(sum);
}

console.log(`Part 1 : ${part1()}`);

function part2(): number {
    const numbers: number[][] = input.map(it => it.split('').map(itt => Number.parseInt(itt)));
    const getBasin = (pos: Position, nums: number[][], knownPoses: PosSet = {}): PosSet => {
        const neighbours = getNeighbours(nums, pos.x, pos.y)
            .filter(it => nums[it.x][it.y] < 9 && !knownPoses[posToString(it)]);

        if (neighbours.length === 0) {
            return knownPoses;
        }

        neighbours.forEach(neighbour => knownPoses[posToString(neighbour)] = true);
        return neighbours.map(it => getBasin(it, nums, knownPoses))
            .reduce((acc, it) => {
                Object.keys(it).forEach(pos => acc[pos] = true)
                return acc;
            });
    };

    return numbers
        .map((it, x) => it
            .map((_, y) => createPos(x, y))
            .filter(pos => isLow(pos, numbers))
        )
        .reduce(flatten, []).map(point => getBasin(point, numbers))
        .map(it => Object.keys(it).length)
        .sort(largestToSmallest)
        .slice(0, 3)
        .reduce(product);
}

console.log(`Part 2 : ${part2()}`);
