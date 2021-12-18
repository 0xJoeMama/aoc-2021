import {parseInput} from "../util/Parser.ts";

const input: string = await parseInput("./input.txt");

function part1(): number {
    let increased = 0;
    let lastValue: number | null = null;

    for (const value of input.split("\n").map((string) => Number.parseInt(string))) {
        if (lastValue == null) {
            lastValue = value;
            continue;
        }

        if (value > lastValue) {
            increased++;
        }
        lastValue = value;
    }

    return increased;
}

console.log(`Part 1 : ${part1()}`);

function part2(): number {
    let increased = 0;
    const values: number[] = input.split("\n").map((s) => Number.parseInt(s));

    for (let i = 0, maxValue = 0; i < values.length - 2; i++) {
        const currentSum = values[i] + values[i + 1] + values[i + 2];

        if (i > 0 && currentSum > maxValue) {
            increased++;
        }
        maxValue = currentSum;
    }
    return increased;
}

console.log(`Part 2 : ${part2()}`);
