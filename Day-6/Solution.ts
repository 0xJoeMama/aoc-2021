import {parseInput} from "../util/Parser.ts";
import {sum} from "../util/Util.ts";

const input: string[] = (await parseInput(Deno.args[0]))
    .split(/\n/)
    .filter(it => it !== '');

type FishMap = {
    [fishNumber: number]: number
};

const simulateDay = (fishMap: FishMap, newFishMap: FishMap) => {
    for (const [age, numberOfFish] of Object.entries(fishMap).map(it => [Number.parseInt(it[0]), it[1]])) {
        if (age === 0) {
            newFishMap[6] = numberOfFish;
            newFishMap[8] = numberOfFish;
        } else {
            newFishMap[age - 1] = (newFishMap[age - 1] ?? 0) + numberOfFish;
        }
    }
}

function part1(): number {
    const lanternFish: number[] = input.join()
        .split(/,/)
        .map(it => Number.parseInt(it));
    let fishMap: FishMap = {};
    lanternFish.forEach(it => fishMap[it] = (fishMap[it] ?? 0) + 1);

    let newFishMap: FishMap = {};
    for (let i = 0; i < 80; i++) {
        simulateDay(fishMap, newFishMap);
        fishMap = newFishMap;
        newFishMap = {};
    }

    return Object.values(fishMap).reduce(sum);
}

console.log(`Part 1 : ${part1()}`);

function part2(): number {
    const lanternFish: number[] = input.join()
        .split(/,/)
        .map(it => Number.parseInt(it));
    let fishMap: FishMap = {};
    lanternFish.forEach(it => fishMap[it] = (fishMap[it] ?? 0) + 1);

    let newFishMap: FishMap = {};
    for (let i = 0; i < 256; i++) {
        simulateDay(fishMap, newFishMap);
        fishMap = newFishMap;
        newFishMap = {};
    }

    return Object.values(fishMap).reduce(sum);
}

console.log(`Part 2 : ${part2()}`);
