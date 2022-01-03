import { parseInput } from "../util/Parser.ts";

const input: string[] = (await parseInput(Deno.args[0]))
    .split(/\n/)
    .filter(it => it != '');

function part1(): number {
    return 0;
}

console.log(`Part 1 : ${part1()}`);

function part2(): number {
    return 0;
}

console.log(`Part 2 : ${part2()}`);
