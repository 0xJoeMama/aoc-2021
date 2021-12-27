import {parseInput} from "../util/Parser.ts";

const input: string[] = (await parseInput(Deno.args[0])).split("\n")
    .map(it => it.trim())
    .filter(it => it !== '');

function part1(): number {
    let gammaRate = "";
    let epsilonRate = "";

    const binaryLength: number = input[0].length;

    for (let i = 0; i < binaryLength; i++) {
        const metValues = {
            metOne: 0,
            metZero: 0,
        };
        input.forEach((bin) => {
            switch (bin[i]) {
                case "1":
                    metValues.metOne++;
                    break;
                case "0":
                    metValues.metZero++;
                    break;
            }
        });

        gammaRate += metValues.metOne > metValues.metZero ? "1" : "0";
        epsilonRate += metValues.metOne > metValues.metZero ? "0" : "1";
    }

    return Number.parseInt(gammaRate, 2) * Number.parseInt(epsilonRate, 2);
}

console.log(`Part 1: ${part1()}`);

function part2(): number {
    const numbers = input.map(num => Number.parseInt(num, 2));
    const binSize = input[0].length;

    function o2(nums: number[], totalDepth: number, depth = 0): number {
        if (nums.length === 1) {
            return nums[0];
        }

        const ones: number[] = [];

        for (const bin of nums) {
            const bit = bin >> (totalDepth - depth - 1);

            if (bit & 0b1) {
                ones.push(bin);
            }
        }

        if (ones.length >= (nums.length - ones.length)) {
            return o2(ones, totalDepth, depth + 1);
        } else {
            return o2(nums.filter(bin => !ones.includes(bin)), totalDepth, depth + 1);
        }
    }

    function co2(nums: number[], totalDepth: number, depth = 0): number {
        if (nums.length === 1) {
            return nums[0];
        }

        const zeros: number[] = [];

        for (const bin of nums) {
            const bit = bin >> (totalDepth - depth - 1);

            if (!(bit & 0b1)) {
                zeros.push(bin);
            }
        }

        if (zeros.length <= (nums.length - zeros.length)) {
            return co2(zeros, totalDepth, depth + 1);
        } else {
            return co2(nums.filter(bin => !zeros.includes(bin)), totalDepth, depth + 1);
        }
    }

    return co2(numbers, binSize) * o2(numbers, binSize);
}

console.log(`Part 2 : ${part2()}`);
