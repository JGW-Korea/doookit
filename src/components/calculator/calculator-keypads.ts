import { Component, ComponentDataType } from "../../utils/Component";

export default class CalculatorKeypads extends Component<ComponentDataType, ComponentDataType> {
  constructor() {
    super({
      tagName: "section",
    });
  }
  render() {
    this.el.classList.add("calculator-keypads");
    this.el.role = "group";
    this.el.ariaLabel = "계산기 키패드";
  }
}
