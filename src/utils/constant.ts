import { LangType } from "../types/translation";

export const MAIN_PATH: Set<string> = new Set(["/", "/de", "/es", "/fr", "/hi", "/it", "/ja", "/ko", "/zh"]);
export const SUPPORT_LANG = ["en", "de", "es", "fr", "hi", "it", "ja", "ko", "zh"] satisfies LangType[];
export const BROSWER_LANGUAGE: string = navigator.language.split("-")[0];
