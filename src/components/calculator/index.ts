import debounce from "lodash.debounce";

import { Component, ComponentDataType } from "../../utils/Component";
import { CalculatorDatas } from "../../data";
import { docType } from "../../utils/docType";
import CalculatorDisplay from "./calculator-display";
import CalculatorKeypads from "./calculator-keypads";

interface CalculatorStateVariable {
  [key: string]: unknown;
  result: string;
  expression: string; // 표현식 상태 변수
  mode: string;
  slide: string;
  _animateSwiper: boolean;
}

export default class Calculator extends Component<CalculatorStateVariable, ComponentDataType> {
  private isMobileView = false; // 모바일 화면 확인 용도
  private lastRenderedMobileView?: boolean;
  private debouncedResize: () => void;

  constructor() {
    super({
      tagName: "section",
      state: {
        result: "init",
        expression: "init",
        mode: "mode-rad",
        slide: "basic",
        _animateSwiper: false,
      },
    });

    this.checkViewport();

    // debounce된 resize 핸들러 생성
    this.debouncedResize = debounce(this.handleResize.bind(this), 200);
    window.addEventListener("resize", this.debouncedResize);

    requestAnimationFrame(() => {
      // 명시적으로 컴포넌트 렌더링
      this.render();
    });
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
    if (this.lastRenderedMobileView === this.isMobileView) return;
    this.lastRenderedMobileView = this.isMobileView;

    const { ariaLabel: mainAriaLabel, display, keypads } = CalculatorDatas[docType()]; // 계산기 언어 데이터 가져오기

    // 계산기 전체 영역 기본값 세팅
    this.el.classList.add("calculator-container");
    if (this.isMobileView) this.el.classList.add("mobile");
    else this.el.classList.remove("mobile");
    this.el.ariaLabel = mainAriaLabel;

    // 계산기 하위 컴포넌트 정의
    const calcDisplay: HTMLElement = new CalculatorDisplay({
      props: { display, resultState: this.state.result, expressionState: this.state.expression },
    }).el;

    const calcKeypads: HTMLElement = new CalculatorKeypads({
      props: {
        type: this.isMobileView,
        ariaLabel: keypads.ariaLabel,
        groups: keypads.desktop.groups,
        mobile: this.isMobileView ? keypads.mobile : undefined,
        modeState: this.state.mode,
        slideState: this.state.slide,
        expression: this.state.expression,
        setModeState: (newModeState: string) => this.setState({ mode: newModeState }),
        setSlideState: (newSlideState: string) => this.setState({ slide: newSlideState, _animateSwiper: true }),
        setExpressionState: (newExpressionState: string) => this.setState({ expression: newExpressionState }),
      },
    }).el;

    this.el.replaceChildren(calcDisplay, calcKeypads);
  }
}
