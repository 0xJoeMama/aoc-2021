import {parseInput} from "../util/Parser.ts";
import {sum} from "../util/Util.ts";

const input: string[] = (await parseInput(Deno.args[0]))
    .split(/\n/)
    .filter(it => it != '');

type Key = {
    [num: number]: string;
};

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
    const contains = (measurement: string, key: string) =>
        key.split('').every(char => measurement.includes(char));
    const countMatchingPoints = (measurement: string, key: string) =>
        key.split('').reduce((acc, it) => acc + (measurement.includes(it) ? 1 : 0), 0);
    const containsAll = (test: string, seq: string) =>
        test.split('').every(char => seq.includes(char)) && test.length === seq.length;

    const parseUnique = (keys: Key, measurements: string[]) => {
        keys[1] = measurements[0];
        keys[7] = measurements[1];
        keys[4] = measurements[2];
        keys[8] = measurements[9];
    };

    const parseSixDigits = (keys: Key, measurements: string[]) => {
        const sixDigits = measurements.slice(6, 9);
        keys[9] = sixDigits.find(it => contains(it, keys[4])) as string;
        keys[0] = sixDigits.find(it => it !== keys[9] && contains(it, keys[1])) as string;
        keys[6] = sixDigits.find(it => it !== keys[9] && it !== keys[0]) as string;
    };

    const parseFiveDigits = (keys: Key, measurements: string[]) => {
        const fiveDigits = measurements.slice(3, 6);
        keys[3] = fiveDigits.find(it => contains(it, keys[1])) as string;
        keys[5] = fiveDigits.find(it => it !== keys[3] && countMatchingPoints(it, keys[9]) === 5) as string;
        keys[2] = fiveDigits.find(it => it !== keys[3] && it !== keys[5]) as string;
    };

    const parseKeys = (measurements: string[]) => {
        const keys: Key = [];
        parseUnique(keys, measurements);
        parseSixDigits(keys, measurements);
        parseFiveDigits(keys, measurements);
        return keys;
    };

    const findValue = (key: Key, sequence: string) => {
        const foundEntry = Object.entries(key).find(it => containsAll(sequence, it[1]));
        if (foundEntry === undefined) {
            throw new Error('Could not find key for value ' + sequence);
        }
        return Number.parseInt(foundEntry[0]);
    };

    const decode = (seq: string[], key: Key) => {
        let res = 0;
        for (let i = 0; i < seq.length; i++) {
            res += Math.pow(10, seq.length - i - 1) * findValue(key, seq[i]);
        }
        return res;
    }

    const measurements: string[][] = input.map(it => it.split(/\|/)[0].trim().split(/ /))
        .map(it => it.sort((s1, s2) => s1.length - s2.length));
    const keys: Key[] = measurements.map(it => parseKeys(it));
    const outputs: string[][] = input.map(it => it.split(/\|/)[1].trim().split(/ /));

    return outputs.map((it, index) => decode(it, keys[index])).reduce(sum);
}

console.log(`Part 2 : ${part2()}`);
