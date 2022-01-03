import {parseInput} from "../util/Parser.ts";
import {forr, greatest, product, smallest, sum} from "../util/Util.ts";

const input: string[] = (await parseInput(Deno.args[0]))
    .split(/\n/)
    .filter(it => it != '');

interface Packet {
    version: number,
    typeId: number,
    bitSize: number,
    value: number
}

class LiteralPacket implements Packet {
    public readonly typeId: number = 4;
    private _bitSize: number;
    public readonly value: number;

    constructor(public readonly version: number, content: string) {
        this._bitSize = 6;
        this.value = this.calcValue(content);
    }

    private calcValue(content: string): number {
        let ret = '';
        let current;
        let i = 0;
        do {
            this._bitSize += 5;
            current = content.substr(5 * i, 5)
            ret += current.substr(1);
            i++;
        } while (current.startsWith('1'));

        return parseInt(ret, 2);
    }

    public static isLiteral(packetS: string) {
        return parseInt(packetS.substr(3, 3), 2) === 4;
    }

    public static parseLiteral(str: string): LiteralPacket | undefined {
        if (this.isLiteral(str)) {
            const version = parseInt(str.substr(0, 3), 2);
            return new LiteralPacket(version, str.substr(6));
        }

        return undefined;
    }

    get bitSize(): number {
        return this._bitSize;
    }
}

enum LengthType {
    LITERAL,
    COUNT
}

enum OperatorType {
    SUM = 0,
    PRODUCT = 1,
    MIN = 2,
    MAX = 3,
    GREATER_THAN = 5,
    LESS_THAN = 6,
    EQ
}

class OperatorPacket implements Packet {

    public readonly children: Packet[];
    public readonly bitSize: number;

    constructor(
        public readonly version: number,
        public readonly typeId: OperatorType,
        public readonly lengthType: LengthType,
        public readonly specialNumber: number,
        content: string
    ) {
        this.children = this.parseChildren(content);
        this.bitSize = this.children.map(it => it.bitSize).reduce(sum) + 7 + (this.lengthType ? 11 : 15);

        switch (this.lengthType){
            case LengthType.LITERAL:
                if (this.children.map(it => it.bitSize).reduce(sum) !== this.specialNumber) {
                    throw new Error('Invalid bit size');
                }
                break;
            case LengthType.COUNT:
                if (this.specialNumber !== this.children.length) {
                    throw new Error('Invalid packet contents');
                }
                break;
        }
    }

    private parseChildren(content: string): Packet[] {
        const ret = [];
        let i = 0;
        let currentRemainingString = content;
        while (currentRemainingString !== '' && (this.lengthType || i < this.specialNumber)) {
            if (currentRemainingString.split('').every(it => it === '0') ||
                (this.lengthType === LengthType.COUNT && ret.length === this.specialNumber)) {
                return ret;
            }
            const packet = LiteralPacket.isLiteral(currentRemainingString)
                ? LiteralPacket.parseLiteral(currentRemainingString)
                : OperatorPacket.parseOperator(currentRemainingString);

            if (packet !== undefined) {
                currentRemainingString = currentRemainingString.substr(packet.bitSize);
                i += packet.bitSize;
                ret.push(packet);
            } else {
                currentRemainingString = '';
            }
        }

        return ret;
    }

    public static parseOperator(str: string): OperatorPacket | undefined {
        if (LiteralPacket.isLiteral(str)) {
            return undefined;
        }

        let caret = 0;
        const version = parseInt(str.substr(caret, 3), 2);
        caret += 3;
        const typeId = parseInt(str.substr(caret, 3), 2);
        caret += 3;
        const lengthType: LengthType = parseInt(str.substr(caret, 1), 2) as LengthType;
        caret += 1;
        const length = str.substr(caret, lengthType ? 11 : 15);
        const specialNumber = parseInt(length, 2);
        caret += length.length;

        return new OperatorPacket(version, typeId, lengthType, specialNumber, str.substr(caret));
    }

    get value(): number {
        const childrenValues = this.children.map(it => it.value);
        switch (this.typeId) {
            case OperatorType.SUM:
                return childrenValues.reduce(sum);
            case OperatorType.PRODUCT:
                return childrenValues.reduce(product);
            case OperatorType.MIN:
                return childrenValues.reduce(smallest);
            case OperatorType.MAX:
                return childrenValues.reduce(greatest);
            case OperatorType.GREATER_THAN:
                return this.children[0].value > this.children[1].value ? 1 : 0;
            case OperatorType.LESS_THAN:
                return this.children[0].value < this.children[1].value ? 1 : 0;
            case OperatorType.EQ:
                return this.children[0].value === this.children[1].value ? 1 : 0;
        }

        throw new Error('Invalid packet!!!');
    }
}

const getBin = (input: string): string => input
    .split('')
    .map(it => Number.parseInt(it, 16).toString(2))
    .map(it => {
        if (it.length === 4) {
            return it;
        }

        const remLength = 4 - it.length;
        let ret = '';
        forr(0, remLength, () => ret += '0');
        return ret + it;
    })
    .join('');

function part1(): number {
    const getVersionSum = (packet: Packet): number => {
        if (packet instanceof LiteralPacket) {
            return packet.version;
        }

        return packet.version + (packet as OperatorPacket).children.map(it => getVersionSum(it)).reduce(sum);
    };

    const bin = getBin(input[0]);
    const parsed = OperatorPacket.parseOperator(bin);
    if (parsed === undefined) {
        return -1;
    }

    return getVersionSum(parsed);
}

console.log(`Part 1 : ${part1()}`);

function part2(): number {
    const bin = getBin(input[0]);
    const parsed = OperatorPacket.parseOperator(bin);
    if (parsed === undefined) {
        return -1;
    }

    return parsed.value;
}

console.log(`Part 2 : ${part2()}`);
