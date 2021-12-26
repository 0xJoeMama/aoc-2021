import { parseInput } from "../util/Parser.ts";

const input: string[] = (await parseInput(Deno.args[0])).split(/\n/).filter(it => it != '');

type Digit = {
    activeSegments: string,
    number: number;
}

function part1(): number {
    const uniqueLengths = [2, 4, 3, 7];
    const uniqueFilter = (it: string, _: number, __: string[]) =>
        uniqueLengths.findIndex(itt => itt === it.length) !== -1;
    return input.map(it => it.split(/\|/))
        .map(it => it[1])
        .map(it => it.trim().split(/ /).filter(uniqueFilter))
        .reduce((acc, it) => acc + it.length, 0);
}

console.log(`Part 1 : ${part1()}`);

function part2(): number {
    return 0;
}

console.log(`Part 1 : ${part2()}`);
