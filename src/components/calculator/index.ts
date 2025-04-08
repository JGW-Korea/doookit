import debounce from "lodash.debounce";

import { Component, ComponentDataType } from "../../utils/Component";
import { CalculatorDatas } from "../../data";
import { docType } from "../../utils/docType";
import CalculatorDisplay from "./calculator-display";
import CalculatorKeypads from "./calculator-keypads";
// import { LangType, CalculatorTranslations } from "../../types/calculatorI18nData";
// import { isLangType } from "../../utils/typeCheck";
// import { isLangType } from "../../utils/typeCheck";
// import CalculatorDisplay from "./calculator-display";

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
    const calculatorTranslationData = CalculatorDatas[docType()]; // 계산기 언어 데이터 가져오기

    const { ariaLabel: mainAriaLabel, display, keypads } = CalculatorDatas[docType()]; // 계산기 언어 데이터 가져오기

    // 계산기 전체 영역 기본값 세팅
    this.el.classList.add("calculator-container");
    if (this.isMobileView || this.el.classList.contains("mobile")) this.el.classList.toggle("mobile");
    this.el.ariaLabel = mainAriaLabel;

    console.log(calculatorTranslationData);

    const calcDisplay: HTMLElement = new CalculatorDisplay({ props: display }).el;
    const calcKeypads: HTMLElement = new CalculatorKeypads({
      props: {
        type: this.isMobileView,
        ariaLabel: keypads.ariaLabel,
        groups: keypads.desktop.groups,
        mobile: this.isMobileView ? keypads.mobile : undefined,
      },
    }).el;

    this.el.replaceChildren(calcDisplay, calcKeypads);
  }
}
