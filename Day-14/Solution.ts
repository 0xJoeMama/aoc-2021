import {parseInput} from "../util/Parser.ts";
import {smallestToGreatest} from "../util/Util.ts";

const input: string[] = (await parseInput(Deno.args[0]))
    .split(/\n/)
    .filter(it => it != '');

type InsertionMap = {
    [pair: string]: string;
};

const parseInsertions = (insertions: string[]): InsertionMap => {
    const ret: InsertionMap = {};

    while (insertions.length > 0) {
        const [pair, insert] = (insertions.pop() ?? '').split(/->/).map(it => it.trim());
        ret[pair] = pair.split('').join(insert);
    }

    return ret;
};

const step = (polymer: string[], insertionRecipes: InsertionMap): string[] => {
    const polyString = polymer.join('');

    if (insertionRecipes[polyString] !== undefined || polyString.length === 2) {
        return insertionRecipes[polyString].split('') ?? polyString;
    }

    const firstMol = [...step(polymer.slice(0, Math.floor(polymer.length / 2) + 1), insertionRecipes)];
    firstMol.pop();
    const newPolymer: string[] = [
        ...firstMol,
        ...step(polymer.slice(Math.floor(polymer.length / 2)), insertionRecipes)
    ];
    insertionRecipes[polyString] = newPolymer.join('');
    return newPolymer;
};

const countAtoms = (polymer: string[]) => {
    const atomIngredients: { [atom: string]: number } = {};
    polymer.forEach(char => atomIngredients[char] = (atomIngredients[char] ?? 0) + 1);
    return Object.values(atomIngredients).sort(smallestToGreatest);
};

function part1(): number {
    let polymer = input[0].split('');
    const insertions = parseInsertions(input.slice(1));

    for (let i = 0; i < 10; i++) {
        polymer = step(polymer, insertions);
    }

    const sortedValues = countAtoms(polymer);
    return sortedValues[sortedValues.length - 1] - sortedValues[0];
}

console.log(`Part 1 : ${part1()}`);

function part2(): number {
    let polymer = input[0].split('');
    const insertions = parseInsertions(input.slice(1));

    for (let i = 0; i < 40; i++) {
        console.log(`i = ${i}`);
        polymer = step(polymer, insertions);
    }

    const sortedValues = countAtoms(polymer);
    return sortedValues[sortedValues.length - 1] - sortedValues[0];
}

console.log(`Part 2 : ${part2()}`);
