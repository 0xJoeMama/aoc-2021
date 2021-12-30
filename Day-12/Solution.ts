import {parseInput} from "../util/Parser.ts";
import {Stringable, StringMap, StringSet} from "../util/Util.ts";

const input: string[] = (await parseInput(Deno.args[0]))
    .split(/\n/)
    .filter(it => it != '');

class Cave implements Stringable {
    private readonly _children: Cave[];
    public readonly isBig: boolean;

    constructor(public readonly value: string) {
        this._children = [];
        this.isBig = value === value.toUpperCase();
    }

    toString = () => `${this.value}`;
    addChild = (child: Cave) => this._children.push(child);

    get children(): Cave[] {
        return this._children;
    }
}

const parseCaveMap = (input: string[]) => input.map(connection => connection.split(/-/))
    .reduce((acc, [begin, end]) => {
        const cave1: Cave = acc.get(begin) ?? acc.put(begin, new Cave(begin));
        const cave2: Cave = acc.get(end) ?? acc.put(end, new Cave(end));
        cave1.addChild(cave2);
        cave2.addChild(cave1);
        return acc;
    }, new StringMap<string, Cave>());


function part1(): number {
    const findPaths = (start: Cave, visited: StringSet<Cave>, callback: () => void) => {
        const validChildren = start.children.filter(it => it.value !== 'start' && (it.isBig || !visited.contains(it)));
        if (start.value === 'end') {
            callback();
            return;
        }

        visited.add(start);
        validChildren.forEach(child => {
            findPaths(child, visited.copy(), callback);
        });
    };

    const caves = parseCaveMap(input);
    let counter = 0;
    findPaths(caves.get('start'), new StringSet<Cave>(), () => counter++);
    return counter;
}

console.log(`Part 1 : ${part1()}`);

function part2(): number {
    const findPaths = (start: Cave, visited: StringMap<Cave, number>, callback: () => void) => {
        if (start.value === 'end') {
            callback();
            return;
        }

        const canDoDouble = visited.entries().filter(it => it[0] !== it[0].toUpperCase())
            .filter(it => it[0] !== start.value).map(it => it[1]).every(timesVisited => timesVisited < 2);
        if (!start.isBig && (visited.get(start) ?? 0) === 1 && !canDoDouble) return;
        const validChildren = start.children
            .filter(it => it.value !== 'start' && (it.isBig || (visited.get(it) ?? 0) < 2));

        visited.put(start, (visited.get(start) ?? 0) + 1);
        validChildren.forEach(child => {
            findPaths(child, visited.copy(), callback);
        });
    };

    const caves = parseCaveMap(input);
    let counter = 0;
    findPaths(caves.get('start'), new StringMap<Cave, number>(), () => counter++);
    return counter;
}

console.log(`Part 2 : ${part2()}`);
