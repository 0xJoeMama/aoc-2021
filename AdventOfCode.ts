/**
 * Run script for either a specific day, a number of days or all days
 *
 * @author 0xJoeMama
 * @since 2021
 */
import ProcessStatus = Deno.ProcessStatus;

async function main() {
    async function runDay(day: number): Promise<ProcessStatus> {
        console.log(`Running Day ${day}`);
        const proc = Deno.run({
            cmd: [
                "deno", "run", "--allow-read", `Day-${day}/Solution.ts`, `${Deno.cwd()}/Day-${day}/input.txt`
            ]
        });

        return await proc.status();
    }

    function enterGuidedMode() {
        const day = prompt('Which day do you want to execute? Enter a value: ');
        runDay(Number.parseInt(day ? day : "")).then(() => console.log("Done!"));
    }

    async function runDays(days: number[]) {
        for (const day of days) {
            console.log(`Running Day ${day} through terminal.`);
            console.log("ASSUMING INPUT EXISTS AND HASN'T CHANGED");

            await runDay(day);
            console.log(`Day ${day} is done!`);
            console.log("=======================");
        }
    }

    async function getAllExistingDays() {
        const allDays: number[] = [];

        for await (const dir of Deno.readDir(Deno.cwd())) {
            const dayStr = 'Day-';
            if (dir.name.startsWith(dayStr)) {
                allDays.push(Number.parseInt(dir.name.substring(dayStr.length)));
            }
        }
        return allDays;
    }

    if (Deno.args.length == 0) {
        enterGuidedMode();
    } else if (Deno.args.length >= 1) {
        switch (Deno.args[0].toLowerCase()) {
            case 'all': {
                const allDays: number[] = await getAllExistingDays();

                await runDays(allDays.sort((num1, num2) => num1 - num2));
                break;
            }
            case 'latest': {
                getAllExistingDays().then(res => {
                    runDay(res.reduce(
                        (prev, curr) => curr > prev ? curr : prev
                    ));
                });
                break;
            }
            default: {
                const days: number[] = Deno.args.map(num => Number.parseInt(num));
                await runDays(days);
            }
        }
    }
}

await main();
