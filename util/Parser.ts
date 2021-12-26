export const parseInput: (path: string) => Promise<string> = async (path) => {
    let input: string | undefined;
    const decoder = new TextDecoder();

    await Deno.readFile(path).then(content => {
        input = decoder.decode(content);
    });

    return input ?? '';
}