import {parseInput} from "../util/Parser.ts";
import {Position, sum} from "../util/Util.ts";

const input: string[] = (await parseInput(Deno.args[0])).split("\n");
const randomNumbers = input[0].split(',').map(it => Number.parseInt(it));

const nullPos: Position = {
    x: -1,
    y: -1
};

class Board {
    public static readonly boardStrings: string[] = input
        .filter((_, index) => index != 0)
        .join('\n')
        .split(/\n\n/)
        .map(s => s.split(/\n/).filter(it => it !== '').join());
    private static readonly size: { xSize: number, ySize: number } = {
        xSize: 5,
        ySize: 5
    };
    private readonly _index: number;
    private readonly _cells: Map<number, Position>;

    constructor(index: number) {
        this._index = index;
        this._cells = new Map<number, Position>();
        this.initializeCells();
    }

    get index(): number {
        return this._index;
    }

    get cells() {
        return this._cells;
    }

    static createAllBoards(): Set<Board> {
        const ret: Set<Board> = new Set<Board>();
        Board.boardStrings.forEach((_, index) => {
            ret.add(new Board(index));
        });

        return ret;
    }

    /**
     * Crosses out a number and returns true if the board won
     * @param number The number to cross out
     */
    crossOut(number: number): boolean {
        if (this._cells.get(number) !== nullPos) {
            this.cells.set(number, nullPos);
            return this.checkIfWon();
        } else {
            throw new Error(`Number ${number} has already been crossed out on board ${this._index}`);
        }
    }

    countScore(lastRng: number): number {
        return lastRng * [...this.cells.entries()].filter(cell => cell[1] !== nullPos)
            .map(it => it[0])
            .reduce(sum);
    }

    private initializeCells() {
        const boardString = Board.boardStrings[this._index];

        for (let i = 0, lines = boardString.split(/,/); i < lines.length; i++) {
            for (let j = 0, cells = lines[i].split(/ /).filter(it => it !== ''); j < cells.length; j++) {
                this._cells.set(Number.parseInt(cells[j]), {
                    x: j,
                    y: i
                });
            }
        }
    }

    private checkIfWon(): boolean {
        return this.wonHorizontal() || this.wonVertical();
    }

    private wonHorizontal(): boolean {
        for (let i = 0; i < Board.size.ySize; i++) {
            if ([...this._cells].filter(entry => entry[1].y === i).map(it => it[1]).every(it => it === nullPos)) {
                return true;
            }
        }

        return false;
    }

    private wonVertical(): boolean {
        for (let i = 0; i < Board.size.xSize; i++) {
            if ([...this._cells].filter(entry => entry[1].x === i).map(it => it[1]).every(it => it === nullPos)) {
                return true;
            }
        }

        return false;
    }
}

function part1(): number {
    const boards: Board[] = [...Board.createAllBoards()];
    for (const i of randomNumbers) {
        const boardThatWon: Board | undefined = boards.find(board => board.crossOut(i));

        if (boardThatWon !== undefined) {
            console.log(`Board ${boardThatWon.index} won at number ${i}`)
            return boardThatWon.countScore(i);
        }
    }

    return -1;
}

console.log(`Part 1: ${part1()}`);

function part2(): number {
    const boards: Set<Board> = Board.createAllBoards();

    for (const i of randomNumbers) {
        const oldBoards = [...boards];

        for (const board of oldBoards) {
            if (board.crossOut(i)) {
                switch (boards.size) {
                    case 1:
                        console.log(`Board ${board.index} was the last to win at ${i}`)
                        return board.countScore(i);
                    default:
                        boards.delete(board);
                }
            }
        }
    }

    return -1;
}

console.log(`Part 2 : ${part2()}`);
