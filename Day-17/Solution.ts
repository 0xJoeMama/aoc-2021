import {parseInput} from "../util/Parser.ts";
import {gaussianSum, greatest, Position, smallest} from "../util/Util.ts";
import {StringSet} from "../util/DataLib.ts";

const input: string[] = (await parseInput(Deno.args[0]))
    .split(/\n/)
    .filter(it => it != '');

const parseArea = (input: string) => input.substr(input.indexOf(':') + 1)
    .split(/,/)
    .map(it => it.trim())
    .map(it => it.substr(2))
    .map(it => it.split(/\.\./))
    .map(val => val.map(it => parseInt(it)));

function part1(): number {
    const smth: number | undefined = parseArea(input[0])[1]
        .reduce(smallest);

    return gaussianSum(Math.abs(smth ?? -1) - 1);
}

console.log(`Part 1 : ${part1()}`);

function part2(): number {
    const arr = parseArea(input[0]);
    const area = {
        xBegin: arr[0].reduce(smallest),
        xEnd: arr[0].reduce(greatest),
        yBegin: arr[1].reduce(greatest),
        yEnd: arr[1].reduce(smallest)
    };

    const canLandIn = (area: any, velocity: Position): boolean => {
        const currV = new Position(velocity.x, velocity.y);
        const pos = new Position(0, 0);

        do {
            pos.x += currV.x;
            pos.y += currV.y;

            if (currV.x > 0) {
                currV.x--;
            }
            currV.y--;

            if (pos.x >= area.xBegin && pos.x <= area.xEnd && pos.y <= area.yBegin && pos.y >= area.yEnd) {
                return true;
            }
        } while (pos.x <= area.xEnd && pos.y >= area.yEnd);
        return false;
    };

    const found: StringSet<Position> = new StringSet();
    for (let i = 0; i <= area.xEnd; i++) {
        for (let j = Math.abs(area.yEnd); j >= 0; j--) {
            const v = new Position(i, j);
            const vOppY = new Position(v.x, -v.y);
            if (canLandIn(area, v)) {
                found.add(v);
            }
            if (canLandIn(area, vOppY)) {
                found.add(vOppY);
            }
        }
    }

    return found.length;
}

console.log(`Part 2 : ${part2()}`);
