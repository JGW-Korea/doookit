import debounce from "lodash.debounce";

import { Component, ComponentDataType } from "../../utils/Component";
import { en, de, es, fr, hi, it, ja, ko, zh } from "../../data";
import { langType, TranslationsTypes } from "../../types/translation";
import { isLangType } from "../../utils/typeCheck";
import CalculatorDisplay from "./calculator-display";

export default class Calculator extends Component<ComponentDataType, ComponentDataType> {
  private isMobileView = false; // 모바일 화면 확인 용도
  private debouncedResize: () => void;

  constructor() {
    super({
      tagName: "section",
      autoRender: false,
    });

    this.checkViewport();

    // debounce된 resize 핸들러 생성
    this.debouncedResize = debounce(this.handleResize.bind(this), 200);
    window.addEventListener("resize", this.debouncedResize);

    // 명시적으로 컴포넌트 렌더링
    this.render();
  }

  // 뷰포트 상태 판단
  private checkViewport() {
    this.isMobileView = window.matchMedia("(max-width: 768px)").matches;
  }

  // 리사이즈 시 호출
  private handleResize() {
    const prev = this.isMobileView;
    this.checkViewport();
    if (prev !== this.isMobileView) {
      this.render(); // 뷰포트 변경 시 다시 렌더링
    }
  }

  render() {
    // 지원하는 언어 중 하나를 가져온다.
    const browserLang: string = navigator.language.split("-")[0];
    const lang: langType = isLangType(browserLang) ? browserLang : "en";

    const translations = { en, de, es, fr, hi, it, ja, ko, zh } as const satisfies TranslationsTypes;
    const currentLanguage = translations[lang];

    this.el.ariaLabel = currentLanguage["calculator"]["ariaLabel"];
    const calculatorDisplay = new CalculatorDisplay({ props: currentLanguage["calculator"]["calculator-display"] }).el;

    // 모바일 화면일 경우 아닐 경우에 대한 Keypads 조건부 렌더링
    const calculatorKeypads = this.isMobileView ? "Mobile" : "Desktop";

    this.el.appendChild(calculatorDisplay);

    // const keypads = this.isMobileView ? "mobile" : "desktop";
    // console.log(keypads);
  }
}
