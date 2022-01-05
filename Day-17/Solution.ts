import {parseInput} from "../util/Parser.ts";
import {gaussianSum, smallest} from "../util/Util.ts";

const input: string[] = (await parseInput(Deno.args[0]))
    .split(/\n/)
    .filter(it => it != '');

const parseArea = (input: string) => input.substr(input.indexOf(':') + 1)
    .split(/,/)
    .map(it => it.trim())
    .filter(it => it.startsWith('y='))
    .map(it => it.substr(2))
    .map(it => {
        console.log(it);
        return it.split(/\.\./);
    })
    .map(val => val.map(it => parseInt(it)));

function part1(): number {
    const smth: number | undefined = parseArea(input[0])
        .map(it => it.reduce(smallest, 0))
        .find(() => true);

    return gaussianSum(Math.abs(smth ?? -1) - 1);
}

console.log(`Part 1 : ${part1()}`);

function part2(): number {


    return -1;
}

console.log(`Part 2 : ${part2()}`);
