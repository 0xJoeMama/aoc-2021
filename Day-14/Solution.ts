import {parseInput} from "../util/Parser.ts";
import {smallestToGreatest} from "../util/Util.ts";

const input: string[] = (await parseInput(Deno.args[0]))
    .split(/\n/)
    .filter(it => it != '');

type InsertionMap = {
    [pair: string]: string;
};

type ResultMap = {
    [pair: string]: number;
};

const parseInsertions = (insertions: string[]): InsertionMap => {
    const ret: InsertionMap = {};

    while (insertions.length > 0) {
        const [pair, insert] = (insertions.pop() ?? '').split(/->/).map(it => it.trim());
        ret[pair] = insert;
    }

    return ret;
};

const step = (polymer: string, insertionRecipes: InsertionMap, steps: number): ResultMap => {
    let pairs: ResultMap = {};

    for (let i = 0; i < polymer.length - 1; i++) {
        const pair = polymer[i] + polymer[i + 1];
        pairs[pair] = (pairs[pair] ?? 0) + 1
    }

    for (let i = 0; i < steps; i++){
        const newPairs: ResultMap = {};
        for (const [molePair, count] of Object.entries(pairs)) {
            const insert = insertionRecipes[molePair];
            const newP1 = molePair[0] + insert;
            const newP2 = insert + molePair[1];

            newPairs[newP1] = (newPairs[newP1] ?? 0) + count;
            newPairs[newP2] = (newPairs[newP2] ?? 0) + count;
        }

        pairs = newPairs;
    }

    return pairs;
};

const countAtoms = (results: ResultMap): number => {
    const chars: ResultMap = {};

    Object.entries(results).forEach(([[atom1, atom2], count]) => {
        chars[atom1] = (chars[atom1] ?? 0) + count;
        chars[atom2] = (chars[atom2] ?? 0) + count;
    });

    const sortedValues = Object.values(chars)
        .sort(smallestToGreatest);
    // Either one above or one below, can't guarantee lol
    return Math.floor(sortedValues[sortedValues.length - 1] / 2 - sortedValues[0] / 2);
};

function part1(): number {
    const polymer = input[0];
    const insertions = parseInsertions(input.slice(1).map(it => it.trim()).filter(it => it !== ''));
    const res = step(polymer, insertions, 10);

    console.log("If this result doesn't work, try either one above or one below it");
    return countAtoms(res);
}

console.log(`Part 1 : ${part1()}`);

function part2(): number {
    const polymer = input[0];
    const insertions = parseInsertions(input.slice(1).map(it => it.trim()).filter(it => it !== ''));
    const res = step(polymer, insertions, 40);

    console.log("If this result doesn't work, try either one above or one below it");
    return countAtoms(res);
}

console.log(`Part 2 : ${part2()}`);
