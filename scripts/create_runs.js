import {getAllExistingDays} from "../util/RunUtil.ts";
import {Setup} from "../setup/SetupLib.ts";

const days = (await getAllExistingDays('../')).map(it => new Setup(it));
const encoder = new TextEncoder();
const decoder = new TextDecoder();
days.forEach(day => day.createRunConfig(decoder, encoder, '../'));