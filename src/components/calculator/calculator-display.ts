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

    // 이전 결과 버튼 생성
    const backBtnEl = document.createElement("button");
    backBtnEl.type = "button";
    backBtnEl.ariaLabel = this.props.display.prevResultButtonLabel;

    const imgEl = document.createElement("img");
    imgEl.src = new URL("../../assets/icons/rewind-time.svg", import.meta.url).href;
    imgEl.ariaHidden = "true";
    imgEl.width = 22;
    imgEl.height = 22;

    backBtnEl.appendChild(imgEl);

    // 계산 결과 영역 생성
    const displayContainerEl = document.createElement("div");

    // 계산 결과
    const outputEl = document.createElement("output");
    outputEl.id = "expression-output";
    outputEl.role = "status";
    outputEl.ariaLive = "polite";
    outputEl.ariaAtomic = "true";

    // 계산 결과 -> init -> null
    if (this.props.resultState === "init") {
      outputEl.textContent = "";
    }

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
    fakeInputEl.textContent = this.props.expressionState;

    displayContainerEl.append(outputEl, fakeInputEl);
    this.el.append(backBtnEl, displayContainerEl);
  }
}
