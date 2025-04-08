import { CalculatorDisplayType } from "../../types/calculatorTranslations";
import { Component, ComponentDataType } from "../../utils/Component";

// CalculatorDisplayType 타입 상속
interface CalculatorDisplayProps {
  [key: string]: unknown;
  display: CalculatorDisplayType;
  resultState: string;
  expressionState: string; // 표현식 값
}

export default class CalculatorDisplay extends Component<ComponentDataType, CalculatorDisplayProps> {
  constructor(paylaod: { props: CalculatorDisplayProps }) {
    super({
      tagName: "div",
      props: paylaod.props,
    });
  }

  render() {
    // 계산 결과 영역 기본 값 설정
    this.el.classList.add("calculator-display");
    this.el.role = "region";
    this.el.ariaLabel = this.props.display.regionLabel;
    // this.el.ariaLabel = this.props.;

    const displayContainerEl = document.createElement("div");

    // 이전 결과 버튼 생성
    const backBtnEl = document.createElement("button");
    backBtnEl.type = "button";
    backBtnEl.ariaLabel = this.props.display.prevResultButtonLabel;

    // 이미지 SVG 요소로 변환
    const rewindTimeSvg = new URL("../../assets/icons/rewind-time.svg", import.meta.url).href;

    fetch(rewindTimeSvg)
      .then((res) => res.text())
      .then((svgText) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const svgEl = doc.documentElement;

        svgEl.ariaHidden = "true";
        backBtnEl.appendChild(svgEl);
      });

    // 계산 결과 영역 생성
    const outputEl = document.createElement("output");
    outputEl.id = "expression-output";
    outputEl.role = "status";
    outputEl.ariaLive = "polite";
    outputEl.ariaAtomic = "true";

    // 계산 결과 -> init -> null
    if (this.props.resultState === "init") {
      outputEl.textContent = "";
    }

    displayContainerEl.append(backBtnEl, outputEl);
    displayContainerEl.classList.add("output");

    // 계산 결과 -> = -> 표현식(예: 1 + 2 =)
    // 계산 결과 -> 입력 중 -> Ans = N

    // outputEl.textContent = "Ans = 123";

    // 계산 입력창
    const fakeInputEl = document.createElement("div");
    fakeInputEl.id = "fake-input";
    fakeInputEl.role = "textbox";
    fakeInputEl.ariaLabel = this.props.display.inputLabel;
    fakeInputEl.ariaRoleDescription = this.props.display.inputRoleDescription;
    fakeInputEl.setAttribute("aria-describedby", outputEl.id);
    fakeInputEl.tabIndex = 0;
    fakeInputEl.textContent = this.props.expressionState === "init" ? "0" : this.props.expressionState;

    // 인풋 박스 넘어갈 시 자동으로 오른쪽 스크롤 위치
    requestAnimationFrame(() => {
      fakeInputEl.scrollLeft = fakeInputEl.scrollWidth;
    });

    this.el.append(displayContainerEl, fakeInputEl);
  }
}
