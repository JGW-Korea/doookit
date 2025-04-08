import { ClearToggleButton, KeypadButton } from "../types/calculatorTranslations";
import { LangType } from "../types/translation";
import { SUPPORT_LANG } from "./constant";

// 주어진 문자열이 지원하는 언어 타입인지 확인하는 타입 가드 함수
export function isLangType(lang: string): lang is LangType {
  return SUPPORT_LANG.includes(lang as LangType);
}

// 해당 객체가 KeypadButton 타입인지 확인하는 타입 가드 함수
export function isKeypadButton(button: KeypadButton | ClearToggleButton): button is KeypadButton {
  return typeof button === "object" && "text" in button && "value" in button && "ariaLabel" in button && "shortcut" in button;
}
