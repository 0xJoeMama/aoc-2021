import { parseInput } from "../util/Parser.ts";
import { createPos, greatest, Position } from "../util/Util.ts";

const input: string[] = (await parseInput(Deno.args[0]))
  .split(/\n/);

type Fold = {
  axis: "x" | "y";
  foldPoint: number;
};

type CustomSet = {
  [key: string]: Position;
};

const collectToSet = <T>(acc: CustomSet, it: Position): CustomSet => {
  acc[it.toString()] = it;
  return acc;
};
const parseFold = (foldLine: string): Fold => {
  const importantPart = foldLine.slice("fold along ".length);
  return <Fold> {
    axis: importantPart[0],
    foldPoint: Number.parseInt(importantPart.slice(2)),
  };
};

const fold = (set: CustomSet, fold: Fold): CustomSet => {
  switch (fold.axis) {
    case "x":
      return [...Object.values(set)].map((pos) => {
        if (pos.y >= fold.foldPoint) {
          return new Position(pos.x, 2 * fold.foldPoint - pos.y);
        }
        return pos;
      }).reduce(collectToSet, {} as CustomSet);
    case "y":
      return [...Object.values(set)].map((pos) => {
        if (pos.x >= fold.foldPoint) {
          return new Position(2 * fold.foldPoint - pos.x, pos.y);
        }
        return pos;
      }).reduce(collectToSet, {} as CustomSet);
  }
};

function part1(): number {
  const coords = input.slice(0, input.findIndex((it) => it === ""))
    .map((it) => it.split(/,/))
    .map(([y, x]) => createPos(Number.parseInt(x), Number.parseInt(y)))
    .reduce(collectToSet, {} as CustomSet);
  return Object.values(
    fold(coords, parseFold(input.find((it) => it.startsWith("fold")) ?? "")),
  ).length;
}

console.log(`Part 1 : ${part1()}`);

function part2(): number | string {
  let coords = input.slice(0, input.findIndex((it) => it === ""))
    .map((it) => it.split(/,/))
    .map(([y, x]) => createPos(Number.parseInt(x), Number.parseInt(y)))
    .reduce(collectToSet, {} as CustomSet);
  input.slice(input.findIndex((it) => it === ""))
    .filter((line) => line.startsWith("fold"))
    .map((foldInstruction) => parseFold(foldInstruction))
    .forEach((foldInstr) => {
      coords = fold(coords, foldInstr);
    });

  const size = {
    xSize: Object.values(coords).map((pos) => pos.x).reduce(greatest) + 1,
    ySize: Object.values(coords).map((pos) => pos.y).reduce(greatest) + 1,
  };

  const lines: string[][] = [];
  for (let i = 0; i < size.xSize; i++) {
    lines.push([]);

    for (let j = 0; j < size.ySize; j++) {
      lines[lines.length - 1][j] = "   ";
    }
  }

  Object.values(coords).forEach((pos) => {
    lines[pos.x][pos.y] = "###";
  });

  lines.map((it) => it.join("")).forEach((line) => console.log(line));
  return "The answer is described above";
}

console.log(`Part 2 : ${part2()}`);
