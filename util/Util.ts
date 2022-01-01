// Utility Functions
export const sum = (acc: number, it: number) => acc + it;
export const greatest = (acc: number, it: number) => it > acc ? it : acc;
export const flatten = <A>(acc: A[], it: A[]) => {
    acc.push(...it);
    return acc;
};
export const product = (acc: number, it: number) => acc * it;
export const largestToSmallest = (num1: number, num2: number) => num2 - num1;
export const smallestToGreatest = (num1: number, num2: number) => num1 - num2;
export const forr = (begin: number, end: number, consumer: (i: number) => void): number => {
    consumer(begin);
    return begin + 1 < end ? forr(begin + 1, end, consumer) : begin;
};

export class Position extends Object implements Stringable {
    constructor(public x: number, public y: number) {
        super();
    }

    toString(): string {
        return `(${this.x}, ${this.y})`
    }
}

export const createPos = (x: number, y: number): Position => new Position(x, y);
export const posToString = (pos: Position) => `(${pos.x}, ${pos.y})`;
export const posEq = (pos1: Position, pos2: Position) => pos1.x === pos2.x && pos1.y === pos2.y;

export interface Stringable {
    toString(): string;
}

export class StringMap<K extends Stringable, V> {
    private readonly _values: {
        [key: string]: V;
    };

    constructor() {
        this._values = {};
    }

    get(key: K): V {
        return this._values[key.toString()];
    }

    put(key: K, value: V): V {
        this._values[key.toString()] = value;
        return value;
    }

    copy(): StringMap<K, V> {
        const this$ = JSON.parse(JSON.stringify(this));
        this$.copy = this.copy;
        this$.get = this.get;
        this$.put = this.put;
        this$.values = this.values;
        this$.entries = this.entries;

        return this$;
    }

    contains(key: K): boolean {
        return this._values[key.toString()] !== undefined;
    }

    values(): V[] {
        return Object.values(this._values);
    }

    entries(): [string, V][] {
        return Object.entries(this._values);
    }
}

export class StringSet<E extends Stringable> {
    private readonly map: StringMap<E, number>;

    constructor() {
        this.map = new StringMap();
    }

    add(el: E): E {
        this.map.put(el, -1);
        return el;
    }

    remove(el: E): E {
        this.map.put(el, 0);
        return el;
    }

    contains(el: E): boolean {
        return this.map.get(el) === -1;
    }

    copy(): StringSet<E> {
        const this$ = JSON.parse(JSON.stringify(this));
        this$.add = this.add;
        this$.contains = this.contains;
        this$.remove = this.remove;
        this$.copy = this.copy;
        this$.map.get = this.map.get;
        this$.map.put = this.map.put;

        return this$;
    }
}