import {parseInput} from "../util/Parser.ts";

const input: string[] = (await parseInput("./input.txt")).split('\n')

function part1(): number {
    let gammaRate = ''
    let epsilonRate = ''

    const binaryLength: number = input[0].length

    for (let i = 0; i < binaryLength; i++) {
        const metValues = {
            metOne: 0,
            metZero: 0
        }
        input.forEach(bin => {
            switch (bin[i]) {
                case '1':
                    metValues.metOne++
                    break
                case '0':
                    metValues.metZero++
                    break
            }
        })

        gammaRate += metValues.metOne > metValues.metZero ? '1' : '0'
        epsilonRate += metValues.metOne > metValues.metZero ? '0' : '1'
    }

    console.log(gammaRate)
    return Number.parseInt(gammaRate, 2) * Number.parseInt(epsilonRate, 2)
}

console.log(`Part 1: ${part1()}`)

function part2(): number {
    console.assert(false, 'TODO: Not implemented yet')
    return 0
}

console.log(`Part 2 : ${part2()}`)