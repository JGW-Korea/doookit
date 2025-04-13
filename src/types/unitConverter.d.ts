import { LangType } from "./translation";

// 다국어 계산기 번역 타입
export interface UnitConverterTranslations {
  [key: LangType]: UnitConverterI18nData;
}

export interface UnitConverterI18nData {
  length: UnitConverterType;
  weight: UnitConverterType;
  temperature: UnitConverterType;
}

export interface UnitConverterType {
  ariaLabel: string;
  title: string;
  legends: {
    from: string;
    to: string;
  };
  inputAriaLabel: string;
  resultAriaLabel: string;
  units: UnitsType[];
}

export interface UnitsType {
  value: string;
  label: string;
}
