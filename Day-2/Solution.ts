import { parseInput } from "../util/Parser.ts";

const input: string[] = (await parseInput(Deno.args[0]))
  .split("\n")
  .filter((it) => it !== "");

function part1(): number {
  const position = {
    horizontal: 0,
    depth: 0,
  };

  for (const line of input.map((line) => line.split(" "))) {
    const direction: string = line[0];
    const steps: number = Number.parseInt(line[1]);

    switch (direction) {
      case "forward":
        position.horizontal += steps;
        break;
      case "down":
        position.depth += steps;
        break;
      case "up":
        position.depth -= steps;
    }
  }

  return position.horizontal * position.depth;
}

console.log(`Part 1: ${part1()}`);

function part2(): number {
  const position = {
    horizontal: 0,
    depth: 0,
    aim: 0,
  };
  for (const line of input.map((line) => line.split(" "))) {
    const direction: string = line[0];

    const steps: number = Number.parseInt(line[1]);
    switch (direction) {
      case "forward":
        position.horizontal += steps;
        position.depth += position.aim * steps;
        break;
      case "down":
        position.aim += steps;
        break;
      case "up":
        position.aim -= steps;
    }
  }
  return position.horizontal * position.depth;
}

console.log(`Part 2 : ${part2()}`);
