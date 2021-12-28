import {parseInput} from "../util/Parser.ts";
import {smallestToGreatest, sum} from "../util/Util.ts";

const input: string[] = (await parseInput(Deno.args[0]))
    .split(/\n/)
    .filter(it => it != '');

const chunkMap: { [opening: string]: string } = {
    '[': ']',
    '<': '>',
    '(': ')',
    '{': '}'
};
const openingTokens = Object.keys(chunkMap);
const peek = <T> (stack: T[]): T => stack[stack.length - 1];

function part1(): number {
    const illegalValueMap: { [closing: string]: number } = {
        ')': 3,
        ']': 57,
        '}': 1197,
        '>': 25137
    };

    const illegalTokens: string[] = [];
    for (const line of input) {
        const stack: string[] = [];

        for (const token of line.split('')) {
            if (openingTokens.includes(token)) {
                stack.push(token);
            } else {
                if (chunkMap[peek(stack)] === token) {
                    stack.pop();
                } else {
                    illegalTokens.push(token);
                    break;
                }
            }
        }
    }
    return illegalTokens.map(it => illegalValueMap[it]).reduce(sum);
}

console.log(`Part 1 : ${part1()}`);

function part2(): number {
    const completingReward: { [closing: string]: number } = {
        ')': 1,
        ']': 2,
        '}': 3,
        '>': 4
    };
    return input
        .map(line => {
            let stack: string[] = [];
            line.split('').some(token => {
                if (openingTokens.includes(token)) {
                    stack.push(token);
                } else {
                    if (chunkMap[peek(stack)] === token) {
                        stack.pop();
                    } else {
                        stack = [];
                        return true;
                    }
                }
            });

            return stack;
        })
        .filter(it => it.length > 1)
        .map(stack => {
            const ret = [];
            while (stack.length > 0) {
                ret.push(chunkMap[stack.pop() ?? -1]);
            }
            return ret;
        })
        .map(completing => completing.map(it => completingReward[it]).reduce((acc, it) => 5 * acc + it, 0))
        .sort(smallestToGreatest)
        .find((_, index, array) => index === Math.floor(array.length / 2)) ?? -1;
}

console.log(`Part 2 : ${part2()}`);
