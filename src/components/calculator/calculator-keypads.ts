import { CalculatorKeypadGroup } from "../../types/calculatorTranslations";
import { Component, ComponentDataType } from "../../utils/Component";
import Fieldset from "./fieldset";

interface CalculatorKeypadsProps {
  [key: string]: unknown;
  ariaLabel: string;
  groups: CalculatorKeypadGroup[];
}

export default class CalculatorKeypads extends Component<ComponentDataType, CalculatorKeypadsProps> {
  constructor(payload: { props: CalculatorKeypadsProps }) {
    super({
      tagName: "section",
      props: {
        ariaLabel: payload.props.ariaLabel,
        groups: payload.props.groups,
      },
    });
  }

  render() {
    // 계산기 키패드 기본값 설정
    this.el.classList.add("calculator-keypads");
    this.el.role = "group";
    this.el.ariaLabel = this.props.ariaLabel;

    this.props.groups.forEach((group) => {
      const fieldsetEl = new Fieldset({ props: { group: group } });
      this.el.appendChild(fieldsetEl.el);
    });
  }
}
