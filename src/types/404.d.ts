import { LangType } from "./translation";

export interface NotPoundPageTranslations {
  [key: LangType]: NotPoundPageI18nData;
}

export interface NotPoundPageI18nData {
  lang: string;
  head: {
    title: string;
    description: string;
  };
  notFound: {
    homeLink: string;
  };
}
