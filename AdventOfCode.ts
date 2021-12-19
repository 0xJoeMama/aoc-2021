/**
 * Run script for either a specific day, a number of days or all days
 *
 * @author 0xJoeMama
 * @since 2021
 */
import ProcessStatus = Deno.ProcessStatus;

async function main() {
    async function runDay(day: number): Promise<ProcessStatus> {
        const proc = Deno.run({
            cmd: [
                "deno", "run", "--allow-read", `Day-${day}/Solution.ts`, `${Deno.cwd()}/Day-${day}/input.txt`
            ]
        });

        return await proc.status();
    }

    async function enterGuidedMode() {
        const day = prompt('Which day do you want to execute? Enter a value: ');
        runDay(Number.parseInt(day ? day : "")).then(() => console.log("Done!"));
    }

    if (Deno.args.length == 0) {
        enterGuidedMode();
    } else {
        const days = Deno.args.map(num => Number.parseInt(num))

        for (const day of days) {
            console.log(`Running Day ${day} through terminal.`);
            console.log("ASSUMING INPUT EXISTS AND HASN'T CHANGED");

            await runDay(day);
            console.log(`Day ${day} is done!`);
            console.log("=======================");
        }
    }
}

await main();
