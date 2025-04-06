export type langType = "en" | "de" | "es" | "fr" | "hi" | "it" | "ja" | "ko" | "zh";

export interface TranslationsTypes {
  [key: langType]: {
    header: {
      a: {
        ariaLabel: string;
      };
      nav: {
        items: string[];
        ariaLabel: string;
      };
      arrow: {
        ariaLabel: string;
      };
    };
  };
}
