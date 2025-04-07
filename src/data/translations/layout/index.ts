import { LayoutTranslations } from "../../../types/layoutTranslations";
import de from "./de.json";
import en from "./en.json";
import es from "./es.json";
import fr from "./fr.json";
import hi from "./hi.json";
import it from "./it.json";
import ja from "./ja.json";
import ko from "./ko.json";
import zh from "./zh.json";

// 전체 레이아웃 JSON 데이터 모듈로 반환
export const LayoutDatas = { de, en, es, fr, hi, it, ja, ko, zh } satisfies LayoutTranslations;
