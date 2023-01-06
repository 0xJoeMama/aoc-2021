/**
 * Run script for either a specific day, a number of days or all days
 *
 * @author 0xJoeMama
 * @since 2021
 */
import {
  enterGuidedMode,
  getAllExistingDays,
  runDay,
  runDays,
} from "./util/RunUtil.ts";

const aocMain = async () => {
  if (Deno.args.length == 0) {
    enterGuidedMode();
  } else if (Deno.args.length >= 1) {
    switch (Deno.args[0].toLowerCase()) {
      case "all": {
        const allDays: number[] = await getAllExistingDays();
        await runDays(allDays.sort((num1, num2) => num1 - num2));
        break;
      }
      case "latest": {
        getAllExistingDays().then((res) => {
          runDay(res.reduce((prev, curr) => curr > prev ? curr : prev));
        });
        break;
      }
      default: {
        const days: number[] = Deno.args.map((num) => Number.parseInt(num));
        await runDays(days);
      }
    }
  }
};

await aocMain();
