export const parseInput: (path: string) => Promise<string> = async (path) => {
    let input = ""

    await Deno.readFile(path).then(content => {
        content.forEach(code => {
            input += String.fromCharCode(code.valueOf())
        })
    })

    return input
}