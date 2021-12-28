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

// Position related functions
export type Position = {
    x: number,
    y: number;
};

export const posToString = (pos: Position) => `(${pos.x}, ${pos.y})`;
export const posEq = (pos1: Position, pos2: Position) => pos1.x === pos2.x && pos1.y === pos2.y;