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
        ret[pair] = insert;
    }

    return ret;
}

const step = (polymer: string[], insertionRecipes: InsertionMap, tracked: InsertionMap) => {
    const polyString = polymer.join('');
    const insertions: { [index: number]: string } = {};

    let lastIndex = 0;
    Object.entries(tracked).forEach(([input, result]) => {
        const index = polyString.indexOf(input);
        if (index >= 0) {
            insertions[index] = result;
            lastIndex += input.length;
        }
    });
    for (let i = 0; i < polymer.length; i++) {
        const atom1 = polymer[i];
        const atom2 = polymer[i + 1];
        const insert = insertionRecipes[[atom1, atom2].join('')];

        if (insert !== undefined) {
            insertions[i + 1] = insert;
        }
    }

    let inserted = 0;
    Object.entries(insertions).filter(([_, atoms]) => atoms.length === 1).forEach(([index, atom]) => {
        polymer.splice(Number.parseInt(index) + inserted, 0, atom);
        inserted++;
    });
    tracked[polyString] = polymer.join('');
};

const countAtoms = (polymer: string[]) => {
    const atomIngredients: { [atom: string]: number } = {};
    polymer.forEach(char => atomIngredients[char] = (atomIngredients[char] ?? 0) + 1);
    return Object.values(atomIngredients).sort(smallestToGreatest);
}


function part1(): number {
    const polymer = input[0].split('');
    const insertions = parseInsertions(input.slice(1));
    const tracked: InsertionMap = {};

    for (let i = 0; i < 10; i++) {
        step(polymer, insertions, tracked);
    }

    const atomIngredients: { [atom: string]: number } = {};
    polymer.forEach(char => atomIngredients[char] = (atomIngredients[char] ?? 0) + 1);

    const sortedValues = Object.values(atomIngredients).sort(smallestToGreatest);
    console.log(atomIngredients);
    return sortedValues[sortedValues.length - 1] - sortedValues[0];
}

console.log(`Part 1 : ${part1()}`);

function part2(): number {
    const polymer = input[0].split('');
    const insertions = parseInsertions(input.slice(1));
    const tracked: InsertionMap = {};

    // for (let i = 0; i < 40; i++) {
    //     step(polymer, insertions, tracked);
    // }

    const sortedValues = countAtoms(polymer);
    return sortedValues[sortedValues.length - 1] - sortedValues[0];
}

console.log(`Part 2 : ${part2()}`);
