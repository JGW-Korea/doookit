import { CalculatorKeypadGroup } from "../../types/calculatorTranslations";
import { Component, ComponentDataType } from "../../utils/Component";
import { isKeypadButton } from "../../utils/typeCheck";

interface FieldsetPropsType {
  [key: string]: unknown;
  group: CalculatorKeypadGroup;
}

export default class Fieldset extends Component<ComponentDataType, FieldsetPropsType> {
  constructor(payload: { props: FieldsetPropsType }) {
    super({
      tagName: "fieldset",
      props: payload.props,
    });
  }

  render() {
    // Fieldset 기본 값 설정
    this.el.setAttribute("aria-labelledby", this.props.group.id);
    const legendEl = document.createElement("legend");
    legendEl.id = this.props.group.id;
    legendEl.classList.add("sr-only");

    this.el.appendChild(legendEl);

    // 계산기 각도 모드 선택 버튼 설정
    if (this.props.group.angleMode) {
      const groupDivEl = document.createElement("div");
      groupDivEl.role = "group";
      groupDivEl.classList.add("keys");
      groupDivEl.ariaLabel = this.props.group.angleMode.ariaLabel;

      this.props.group.angleMode.options.forEach((option) => {
        const buttonEl = document.createElement("button");
        const spanEl = document.createElement("span");

        buttonEl.type = "button";
        buttonEl.classList.add("button");
        buttonEl.id = option.id;
        buttonEl.setAttribute("aria-labelledby", option.ariaLabelledby);
        buttonEl.ariaKeyShortcuts = option.shortcut;
        buttonEl.textContent = option.text;

        spanEl.id = option.ariaLabelledby;
        spanEl.classList.add("sr-only");
        spanEl.textContent = option.ariaLabel;

        groupDivEl.append(buttonEl, spanEl);

        if (option.id === "mode-rad") {
          buttonEl.ariaPressed = "true";
          const line = document.createElement("span");
          line.ariaHidden = "true";
          line.textContent = "|";
          groupDivEl.appendChild(line);
        } else buttonEl.ariaPressed = "false";
      });

      // 각도 모드 스위치 변경 이벤트 핸들러 등록
      groupDivEl.addEventListener("click", (e) => {
        if (e.currentTarget && e.currentTarget instanceof HTMLDivElement) {
          const buttons = e.currentTarget.querySelectorAll("button");
          buttons.forEach((button) => {
            if (button.ariaPressed === "true") {
              button.ariaPressed = "false";
            } else {
              button.ariaPressed = "true";
            }
          });
        }
      });

      // console.log(groupDivEl);
      this.el.appendChild(groupDivEl);
    }

    this.props.group.buttons.forEach((button) => {
      const buttonEl = document.createElement("button");
      buttonEl.type = "button";
      buttonEl.classList.add("keys", "button");

      // AC, CE 이외의 모든 버튼 종류
      if (isKeypadButton(button)) {
        buttonEl.ariaLabel = button.ariaLabel;
        buttonEl.ariaKeyShortcuts = button.shortcut;

        if (button.text === "xy") {
          buttonEl.textContent = "x";
          const sup = document.createElement("sup");
          sup.textContent = "y";
          buttonEl.appendChild(sup);
        } else {
          buttonEl.textContent = button.text;
        }

        if (/([0-9\.])/g.test(button.text)) buttonEl.classList.add("number");
        if (button.text === "=") buttonEl.classList.add("equals");
      }

      // AC, CE
      else {
        const value = "123";
        const state = value ? "AC" : "CE";
        buttonEl.id = button.id;
        buttonEl.ariaLabel = button.states[state].ariaLabel;
        buttonEl.ariaKeyShortcuts = button.states[state].shortcut;
        buttonEl.textContent = button.states[state].text;
      }

      this.el.appendChild(buttonEl);
    });
  }
}
