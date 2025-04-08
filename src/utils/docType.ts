import { LangType } from "../types/translation";
import { isLangType } from "./typeCheck";

export function docType(): LangType {
  const lang: string = navigator.language.split("-")[0]; // 문서의 언어를 가져옴
  const langType: LangType = isLangType(lang) ? lang : "en";

  // 문서의 언어를 반환
  return langType;
}
