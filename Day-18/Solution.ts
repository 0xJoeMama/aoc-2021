import {parseInput} from "../util/Parser.ts";
import {greatest} from "../util/Util.ts";

const input: string[] = (await parseInput(Deno.args[0]))
    .split(/\n/)
    .filter(it => it != '');

type Node = {
    value: number,
    depth: number
};

type SnailfishNumber = {
    values: Node[]
};

const parseAsSnailfishNumber = (line: string) => {
    const number: SnailfishNumber = {
        values: []
    }
    let currDepth = 0;
    for (const char of line.split('').map(it => it.trim()).filter(it => it !== ',')) {
        if (char === '[') {
            currDepth++
            continue;
        } else if (char === ']') {
            currDepth--;
            continue;
        }

        number.values.push({value: parseInt(char), depth: currDepth});
    }

    return number;
};

const step = (node: Node): Node => {
    return {value: node.value, depth: node.depth + 1};
};

const reduce = (invalid: SnailfishNumber): SnailfishNumber => {
    const copy: SnailfishNumber = {values: [...invalid.values]};
    do {
        const explode = copy.values.findIndex(
            (it, i, arr) => it.depth > 4 && arr[i + 1].depth > 4
        );
        const split = copy.values.findIndex((it) => it.value > 9);

        if (explode >= 0) {
            const explodingPair = [copy.values[explode], copy.values[explode + 1]];
            if (explode !== 0) {
                copy.values[explode - 1].value += explodingPair[0].value;
            }

            if (explode < copy.values.length - 2) {
                copy.values[explode + 2].value += explodingPair[1].value;
            }

            copy.values.splice(explode, 2, {value: 0, depth: explodingPair[0].depth - 1});
        } else if (split >= 0) {
            const node = copy.values[split];
            copy.values.splice(split, 1,
                {value: Math.floor(node.value / 2), depth: node.depth + 1},
                {value: Math.ceil(node.value / 2), depth: node.depth + 1}
            );
        } else {
            break;
        }
    } while (true);

    return copy;
};

const add = (num1: SnailfishNumber, num2: SnailfishNumber): SnailfishNumber => {
    return reduce({
        values: [...num1.values.map(step), ...num2.values.map(step)]
    });
};

type BinNode = {
    left: BinNode | undefined,
    right: BinNode | undefined,
    value: number | undefined
};

const sumValues = (tree: BinNode): number => {
    if (tree.value !== undefined) {
        return tree.value;
    } else if (tree.left && tree.right) {
        return 3 * sumValues(tree.left) + 2 * sumValues(tree.right);
    } else {
        return -1;
    }
};

const ins = (value: number, depth: number, tree: BinNode): boolean => {
    if (depth === 0) {
        if (tree.value === undefined && tree.left === undefined && tree.right === undefined) {
            tree.value = value;
            return true;
        } else {
            return false;
        }
    }

    tree.left = tree.left ?? {
        left: undefined,
        right: undefined,
        value: undefined
    };

    tree.right = tree.right ?? {
        left: undefined,
        right: undefined,
        value: undefined
    };

    const leftIns = ins(value, depth - 1, tree.left);
    return leftIns ? true : ins(value, depth - 1, tree.right);
};

const calcMagnitude = (num: SnailfishNumber) => sumValues(
    num.values.reduce((tree, it) => {
        ins(it.value, it.depth, tree);
        return tree;
    }, {
        left: undefined,
        right: undefined,
        value: undefined
    } as BinNode)
);

function part1(): number {
    const snailfishNumbers = input.map(parseAsSnailfishNumber);
    return calcMagnitude(snailfishNumbers.reduce((acc, it) => add(acc, it)));
}

console.log(`Part 1 : ${part1()}`);

function part2(): number {
    const snailfishNumbers = input.map(parseAsSnailfishNumber);
    const results = [];

    for (let i = 0; i < snailfishNumbers.length; i++) {
        for (let j = 0; j < snailfishNumbers.length; j++) {
            if (i !== j) {
                results.push(calcMagnitude(add(snailfishNumbers[i], snailfishNumbers[j])));
            }
        }
    }

    return results.reduce(greatest);
}

console.log(`Part 2 : ${part2()}`);
