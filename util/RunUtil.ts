import ProcessStatus = Deno.ProcessStatus;

export async function runDay(day: number, args: string[] = ['input.txt']): Promise<ProcessStatus> {
    console.log(`Running Day ${day}`);
    const proc = Deno.run({
        cmd: [
            "deno",
            "run",
            `--allow-read`,
            `Day-${day}/Solution.ts`,
            ...args
        ],
    });

    return await proc.status();
}

export function enterGuidedMode() {
    const day = prompt("Which day do you want to execute? Enter a value: ");
    runDay(Number.parseInt(day ? day : "")).then(() => console.log("Done!"));
}

export async function runDays(days: number[]) {
    for (const day of days) {
        console.log(`Running Day ${day} through terminal.`);
        console.log("ASSUMING INPUT EXISTS AND HASN'T CHANGED");

        await runDay(day, [`Day-${day}/input.txt`]);
        console.log(`Day ${day} is done!`);
        console.log("=======================");
    }
}

export async function getAllExistingDays(cwd = Deno.cwd()): Promise<number[]> {
    const allDays: number[] = [];
    const dayStr = "Day-";

    for await (const dir of Deno.readDir(cwd)) {
        if (dir.name.startsWith(dayStr)) {
            allDays.push(Number.parseInt(dir.name.substring(dayStr.length)));
        }
    }
    return allDays;
}