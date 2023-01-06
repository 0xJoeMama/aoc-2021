import { parseInput } from "../util/Parser.ts";

const input: string[] = (await parseInput(Deno.args[0]))
  .split(/\n/)
  .filter((it) => it != "");

function part1(): number {
  console.log(
    "For now day 15 is implemented in kotlin\n" +
      "because I could not find the available data structures in stdlib for typescript.",
  );
  return -1;
}

console.log(`Part 1 : ${part1()}`);

function part2(): number {
  console.log(
    "For now day 15 is implemented in kotlin\n" +
      "because I could not find the available data structures in stdlib for typescript.",
  );
  return -1;
}

console.log(`Part 2 : ${part2()}`);
