// Utility Functions
import { Stringable } from "./DataLib.ts";

export const sum = (acc: number, it: number) => acc + it;
export const greatest = (acc: number, it: number) => it > acc ? it : acc;
export const smallest = (acc: number, it: number) => it > acc ? acc : it;
export const flatten = <A>(acc: A[], it: A[]) => {
  acc.push(...it);
  return acc;
};
export const product = (acc: number, it: number) => acc * it;
export const largestToSmallest = (num1: number, num2: number) => num2 - num1;
export const smallestToGreatest = (num1: number, num2: number) => num1 - num2;
export const forr = (
  begin: number,
  end: number,
  consumer: (i: number) => void,
): number => {
  consumer(begin);
  return begin + 1 < end ? forr(begin + 1, end, consumer) : begin;
};
export const gaussianSum = (n: number) => n * (n + 1) / 2;

export class Position extends Object implements Stringable {
  constructor(public x: number, public y: number) {
    super();
  }

  toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}

export const createPos = (x: number, y: number): Position => new Position(x, y);
export const posToString = (pos: Position) => `(${pos.x}, ${pos.y})`;
export const posEq = (pos1: Position, pos2: Position) =>
  pos1.x === pos2.x && pos1.y === pos2.y;
