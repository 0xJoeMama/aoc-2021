import {parseInput} from "../util/Parser.ts";
import {greatest, sum} from "../util/Util.ts";

const input: string[] = (await parseInput(Deno.args[0])).split(/\n/).filter(it => it !== '');

type FuelFormula = (pos: number, crabPos: number) => number;

function calculateFuel(pos: number, crabPoses: number[], fuelCalc: FuelFormula): number {
    return crabPoses.map(it => fuelCalc(pos, it)).reduce(sum);
}

function part1(): number {
    const crabPoses: number[] = input.join()
        .split(/,/)
        .map(it => Number.parseInt(it));
    let leastFuelUsage = -1;

    for (let i = crabPoses.reduce(greatest); i >= 0; i--) {
        const currentFuelUsage = calculateFuel(i, crabPoses, (pos, crabPos) => Math.abs(pos - crabPos));

        if (leastFuelUsage === -1 || currentFuelUsage < leastFuelUsage) {
            leastFuelUsage = currentFuelUsage;
        }
    }

    return leastFuelUsage ?? -1;
}

console.log(`Part 1 : ${part1()}`);

function part2(): number {
    const crabPoses: number[] = input.join().split(/,/).map(it => Number.parseInt(it));
    let leastFuelUsage = -1;

    for (let i = crabPoses.reduce(greatest); i >= 0; i--) {
        const currentFuelUsage = calculateFuel(i, crabPoses, (pos, crabPos) => {
            const dx = Math.abs(pos - crabPos);
            // Triangle number
            return (dx * (dx + 1)) / 2
        });

        if (leastFuelUsage === -1 || currentFuelUsage < leastFuelUsage) {
            leastFuelUsage = currentFuelUsage;
        }
    }

    return leastFuelUsage ?? -1;
}

console.log(`Part 2 : ${part2()}`);
