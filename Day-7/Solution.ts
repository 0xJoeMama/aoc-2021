import {parseInput} from "../util/Parser.ts";

const input: string[] = (await parseInput(Deno.args[0])).split(/\n/).filter(it => it !== '');

type UsageMap = {
    [pos: number]: number;
};

type FuelFormula = (pos: number, crabPos: number) => number;

function calculateFuel(pos: number, crabPoses: number[], fuelCalc: FuelFormula): number {
    return crabPoses.map(it => fuelCalc(pos, it)).reduce((acc, val) => acc + val);
}

function part1(): number {
    const crabPoses: number[] = input.join().split(/,/).map(it => Number.parseInt(it));
    const usages: UsageMap = {};

    for (let i = crabPoses.reduce((acc, it) => acc < it ? it : acc); i >= 0; i--) {
        usages[i] = calculateFuel(i, crabPoses, (pos, crabPos) => Math.abs(pos - crabPos));
    }

    return Object.values(usages).reduce((acc, val) => acc > val ? val : acc);
}

console.log(`Part 1 : ${part1()}`);

function part2(): number {
    const crabPoses: number[] = input.join().split(/,/).map(it => Number.parseInt(it));
    const usages: UsageMap = {};

    for (let i = crabPoses.reduce((acc, it) => acc < it ? it : acc); i >= 0; i--) {
        usages[i] = calculateFuel(i, crabPoses, (pos, crabPos) => {
            const diff = Math.abs(pos - crabPos);
            // Triangle number
            return (diff * (diff + 1)) / 2
        });
    }

    return Object.values(usages).reduce((acc, val) => acc > val ? val : acc);
}

console.log(`Part 1 : ${part2()}`);
