import { LangType } from "./translation";

// 다국화 레이아웃 데이터 타입 정의
export interface LayoutTranslations {
  [key: LangType]: LayoutI18nData;
}

// 레이아웃 전체 데이터 타입 정의
export interface LayoutI18nData {
  header: {
    type: {
      [key: HeaderType]: {
        nav: {
          ariaLabel: string;
          items: NavItem[];
        };
      };
      [key: HeaderType]: {
        backButton: {
          ariaLabel: string;
        };
      };
    };
  };
  logo: {
    link: {
      ariaLabel: string;
    };
  };
}

type NavItem = { text: string; ariaLabel: string };
type HeaderType = "main" | "sub";
