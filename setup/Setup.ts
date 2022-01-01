import {parseInput} from "../util/Parser.ts";
import {Setup} from "./SetupLib.ts";

const key = (await parseInput('./key.cfg'))
    .split(/\n/)
    .filter(it => !it.startsWith('#'))
    .find(it => it.startsWith('session='));

if (key === undefined) {
    throw new Error('Could not parse `key.cfg` file or could not locate `session=` value!!')
}

const utilMain = async () => {
    let day = Number.parseInt(Deno.args[0]);

    if (!day) {
        day = Number.parseInt(prompt('What day would you like to setup? ') ?? "");
        if (isNaN(day)) {
            throw new Error('Invalid identifier. Could not parse day. You MUST input a number for the setup to begin!');
        }
    }

    const dayInstance = new Setup(day);
    await dayInstance.create(key);
};

await utilMain();