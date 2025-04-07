import { CalculatorDisplayType } from "../../types/calculatorTranslations";
import { Component, ComponentDataType } from "../../utils/Component";

// CalculatorDisplayType 타입 상속
interface CalculatorDisplayProps extends CalculatorDisplayType {
  [key: string]: unknown;
}

export default class CalculatorDisplay extends Component<ComponentDataType, CalculatorDisplayType> {
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
    this.el.ariaLabel = this.props.regionLabel;

    // 이전 결과 버튼 생성
    const backBtnEl = document.createElement("button");
    backBtnEl.type = "button";
    backBtnEl.ariaLabel = this.props.prevResultButtonLabel;

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
    outputEl.textContent = "Ans = 123";

    // 계산 입력창
    const fakeInputEl = document.createElement("div");
    fakeInputEl.id = "fake-input";
    fakeInputEl.role = "textbox";
    fakeInputEl.ariaLabel = this.props.inputLabel;
    fakeInputEl.ariaRoleDescription = this.props.inputRoleDescription;
    fakeInputEl.setAttribute("aria-describedby", outputEl.id);
    fakeInputEl.tabIndex = 0;
    fakeInputEl.textContent = "0";

    displayContainerEl.append(outputEl, fakeInputEl);
    this.el.appendChild(displayContainerEl);
  }
}
