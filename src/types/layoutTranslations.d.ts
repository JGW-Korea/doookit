import { LangType } from "./translation";

export interface LayoutTranslations {
  [key: LangType]: LayoutI18nData;
}

// 계산기 전체 타입 정의
export interface LayoutI18nData {
  display: {
    regionLabel: string;
    prevResultButtonLabel: string;
    inputLabel: string;
    inputRoleDescription: string;
  };
}
