import { langType } from "../types/translation";
import { SUPPORT_LANG } from "./constant";

export function isLangType(lang: string): lang is langType {
  return SUPPORT_LANG.includes(lang as langType);
}
