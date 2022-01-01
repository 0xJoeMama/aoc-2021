import {parseInput} from "../util/Parser.ts";

const key = (await parseInput('./key.cfg'))
    .split(/\n/)
    .filter(it => !it.startsWith('#'))
    .find(it => it.startsWith('session='));

if (key === undefined) {
    throw new Error('Could not parse `key.cfg` file or could not locate `session=` value!!')
}

export class Setup {
    private readonly index: number;

    constructor(index: number) {
        this.index = index;
    }

    private static async createLocallyAccessibleFiles(dayPath: string) {
        await Deno.mkdir(dayPath);
        await Deno.copyFile(`${Deno.cwd()}/setup/Day-n/Solution.ts.template`, `${dayPath}/Solution.ts`);
        await Deno.copyFile(`${Deno.cwd()}/setup/Day-n/run.sh`, `${dayPath}/run.sh`);
        await Deno.create(`${dayPath}/sample.txt`);
    }

    private async createRunConfig(decoder: TextDecoder, encoder: TextEncoder) {
        const bytes = await Deno.readFile(`${Deno.cwd()}/setup/Day-n/Solution.ts.run.xml.template`);
        const fileStr = decoder.decode(bytes);
        const filePath = `${Deno.cwd()}/.run/Day-${this.index}.run.xml`;

        await Deno.mkdir(`${Deno.cwd()}/.run`, {recursive: true});
        await Deno.writeFile(filePath,
            encoder.encode(fileStr.replaceAll(/\${}/g, this.index.toString())),
            {create: true}
        );
    }

    async create(key: string) {
        const dayPath = `${Deno.cwd()}/Day-${this.index}`;
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        await Setup.createLocallyAccessibleFiles(dayPath);

        await this.createRunConfig(decoder, encoder);
        // Hippity hoppity this is definately not my property
        // await this.requestProblemDescription(key, encoder, dayPath);
        await this.requestProblemInput(key, encoder, dayPath);
    }

    private async requestProblemInput(key: string, encoder: TextEncoder, dayPath: string) {
        const inputResponse: Response = await fetch(`https://adventofcode.com/2021/day/${this.index}/input`, {
            credentials: 'include',
            method: 'GET',
            headers: {
                Cookie: key
            }
        });

        const inputData: Uint8Array = encoder.encode(await inputResponse.text());
        await Deno.writeFile(`${dayPath}/input.txt`, inputData);
    }

    // private async requestProblemDescription(key: string, encoder: TextEncoder, dayPath: string) {
    //     const problemResponse: Response = await fetch(`https://adventofcode.com/2021/day/${this.index}`, {
    //         credentials: 'include',
    //         method: 'GET',
    //         headers: {
    //             Cookie: key
    //         }
    //     });
    //     const dataBuffer: Uint8Array = encoder.encode(await problemResponse.text());
    //     await Deno.writeFile(`${dayPath}/Problem.html`, dataBuffer);
    // }
}

const utilMain = async () => {
    let day = Number.parseInt(Deno.args[0]);

    if (!day) {
        day = Number.parseInt(prompt('What day would you like to setup? ') ?? "");
    }

    const dayInstance = new Setup(day);
    await dayInstance.create(key);
};

await utilMain();