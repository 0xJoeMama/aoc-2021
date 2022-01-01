import { parseInput } from "../util/Parser.ts";
import {Position} from "../util/Util.ts";

const input: string[] = (await parseInput(Deno.args[0]))
    .split(/\n/)
    .filter(it => it != '');

type Node = {
    readonly pos: Position,
    readonly riskLevel: number,
    children: Position[];
};

function part1(): number {
    const nodes = parseAsNodes(input);
    return 0;
}

console.log(`Part 1 : ${part1()}`);

function part2(): number {
    return 0;
}

console.log(`Part 2 : ${part2()}`);
