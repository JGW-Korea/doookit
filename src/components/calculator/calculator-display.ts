import { Component, ComponentDataType } from "../../utils/Component";

interface CalculatorDisplayProps {
  [key: string]: unknown;
  container: string;
  back: string;
  fakeInput: string;
}

export default class CalculatorDisplay extends Component<ComponentDataType, CalculatorDisplayProps> {
  constructor(paylaod: { props: CalculatorDisplayProps }) {
    super({
      tagName: "div",
      props: paylaod.props,
    });
  }

  render() {
    this.el.classList.add("calculator-display");
    this.el.role = "region";
    this.el.ariaLabel = this.props.container;

    // 뒤로 가기 버튼 생성
    const buttonEl = document.createElement("button");
    buttonEl.ariaLabel = this.props.back;

    const arrow = new URL("../../assets/icons/arrow-left.svg", import.meta.url).href;
    const imgEl = document.createElement("img");
    imgEl.src = arrow;
    imgEl.ariaHidden = "true";

    buttonEl.appendChild(imgEl);

    // 계산 결과 Div 요소 생성
    const divEl = document.createElement("div");
    const outputEl = document.createElement("output");
    outputEl.id = "expression-output";
    outputEl.ariaLive = "polite";

    const fakeInputDivEl = document.createElement("div");
    fakeInputDivEl.id = "fake-input";
    fakeInputDivEl.role = "textbox";
    fakeInputDivEl.ariaLabel = this.props.fakeInput;
    fakeInputDivEl.ariaDescription = "expression-output";
    fakeInputDivEl.tabIndex = 0;

    const resultInlineEl = document.createElement("span");
    fakeInputDivEl.appendChild(resultInlineEl);

    divEl.append(outputEl, resultInlineEl);

    this.el.append(buttonEl, divEl);
  }
}
