import { LangType } from "./translation";

// 다국어 계산기 번역 타입
export interface CalculatorTranslations {
  [key: LangType]: CalculatorI18nData;
}

// 계산기 전체 타입 정의
export interface CalculatorI18nData {
  ariaLabel: string;
  display: CalculatorDisplayType;
}

// 계산 결과 영역 타입 정의
export interface CalculatorDisplayType {
  [key: string]: unknown;
  regionLabel: string;
  prevResultButtonLabel: string;
  inputLabel: string;
  inputRoleDescription: string;
}
