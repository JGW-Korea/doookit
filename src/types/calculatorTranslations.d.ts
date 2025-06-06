import { LangType } from "./translation";

// 다국어 계산기 번역 타입
export interface CalculatorTranslations {
  [key: LangType]: CalculatorI18nData;
}

// 계산기 전체 타입 정의
export interface CalculatorI18nData {
  ariaLabel: string;
  display: CalculatorDisplayType;
  keypads: {
    ariaLabel: string;
    desktop: {
      groups: CalculatorKeypadGroup[];
    };
    mobile: CalculatorMobileKeypads;
  };
}

// 계산 결과 영역 타입 정의
export interface CalculatorDisplayType {
  regionLabel: string;
  prevResultButtonLabel: string;
  inputLabel: string;
  inputRoleDescription: string;
}

// 모바일 계산기 키패드 타입 정의
export interface CalculatorMobileKeypads {
  basic: {
    label: string;
    groups: CalculatorKeypadGroup[];
  };
  engineering: {
    label: string;
    groups: CalculatorKeypadGroup[];
  };
  tabs: {
    basic: string;
    engineering: string;
    ariaLabel: string;
  };
}

// 계산기 키패드 타입 정의
export interface CalculatorKeypadGroup {
  id: string;
  legend: string;
  angleMode?: {
    ariaLabel: string;
    options: {
      id: string;
      ariaLabelledby: string;
      value: string;
      text: string;
      ariaLabel: string;
      shortcut: string;
    }[];
  };
  buttons: (KeypadButton | StateButton)[];
}

export interface KeypadButton {
  text: string;
  ariaLabel: string;
  shortcut: string;
  value: string;
}

export interface StateButton {
  id: string;
  states: {
    default: KeypadButton;
    inv: KeypadButton;
  };
}
