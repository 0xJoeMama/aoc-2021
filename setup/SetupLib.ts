export class Setup {
  private readonly index: number;

  constructor(index: number) {
    this.index = index;
  }

  private static async createLocallyAccessibleFiles(dayPath: string) {
    await Deno.mkdir(dayPath);
    await Deno.copyFile(
      `${Deno.cwd()}/setup/Day-n/Solution.ts.template`,
      `${dayPath}/Solution.ts`,
    );
    await Deno.copyFile(
      `${Deno.cwd()}/setup/Day-n/run.sh.template`,
      `${dayPath}/run.sh`,
    );
    await Deno.create(`${dayPath}/sample.txt`);
  }

  async createRunConfig(
    decoder: TextDecoder,
    encoder: TextEncoder,
    cwd = Deno.cwd(),
  ) {
    const bytes = await Deno.readFile(
      `${cwd}/setup/Day-n/Solution.ts.run.xml.template`,
    );
    const fileStr = decoder.decode(bytes);
    const filePath = `${cwd}/.run/Day-${this.index}.run.xml`;

    await Deno.mkdir(`${cwd}/.run`, { recursive: true });
    await Deno.writeFile(
      filePath,
      encoder.encode(fileStr.replaceAll(/\${}/g, this.index.toString())),
      { create: true },
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

  private async requestProblemInput(
    key: string,
    encoder: TextEncoder,
    dayPath: string,
  ) {
    const inputResponse: Response = await fetch(
      `https://adventofcode.com/2021/day/${this.index}/input`,
      {
        credentials: "include",
        method: "GET",
        headers: {
          Cookie: key,
        },
      },
    );

    const inputData: Uint8Array = encoder.encode(await inputResponse.text());
    await Deno.writeFile(`${dayPath}/input.txt`, inputData);
  }
}
