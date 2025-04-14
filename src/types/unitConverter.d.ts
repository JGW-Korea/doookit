import { LangType } from "./translation";

// 다국어 계산기 번역 타입
export interface UnitConverterTranslations {
  [key: LangType]: UnitConverterI18nData;
}

export interface UnitConverterI18nData {
  [key: UnitConverterDataTypes]: UnitConverterType;
}

export type UnitConverterDataTypes = "length" | "weight" | "temperature";

export interface UnitConverterType {
  ariaLabel: string;
  title: string;
  legends: {
    from: string;
    to: string;
  };
  inputAriaLabel: string;
  resultAriaLabel: string;
  swapButtonAriaLabel: string;
  resultSectionTitle: string;

  conversionDescriptions?: {
    c: string;
    f: string;
  };

  labels: {
    value: string;
    result: string;
    fromUnit: string;
    toUnit: string;
  };

  units: UnitsType[];
}

export interface UnitsType {
  value: string;
  label: string;
}
