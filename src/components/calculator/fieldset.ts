import { CalculatorKeypadGroup } from "../../types/calculatorTranslations";
import { Component, ComponentDataType } from "../../utils/Component";
import { isKeypadButton } from "../../utils/typeCheck";

interface FieldsetPropsType {
  [key: string]: unknown;
  group: CalculatorKeypadGroup;
  modeState: string;
  setModeState: (mode: string) => void;
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
        buttonEl.dataset.value = option.value;

        spanEl.id = option.ariaLabelledby;
        spanEl.classList.add("sr-only");
        spanEl.textContent = option.ariaLabel;

        groupDivEl.append(buttonEl, spanEl);

        buttonEl.ariaPressed = this.props.modeState === option.id ? "true" : "false";

        // 구분선은 Mode-Rad일 때만 추가
        if (option.id === "mode-rad") {
          const line = document.createElement("span");
          line.ariaHidden = "true";
          line.textContent = "|";
          groupDivEl.appendChild(line);
        }
      });

      // 각도 모드 스위치 변경 이벤트 핸들러 등록
      groupDivEl.addEventListener("click", () => {
        const nextMode = this.props.modeState === "mode-rad" ? "mode-deg" : "mode-rad";
        this.props.setModeState(nextMode);
      });

      // console.log(groupDivEl);
      this.el.appendChild(groupDivEl);
    }

    // 각 그룹 버튼에 대한 fieldset 하위 버튼 생성
    this.props.group.buttons.forEach((button) => {
      const buttonEl = document.createElement("button");
      buttonEl.type = "button";
      buttonEl.classList.add("keys", "button");

      // 1. 일반 버튼(text, ariaLabel, value, shorcut)
      if (isKeypadButton(button)) {
        buttonEl.ariaLabel = button.ariaLabel;
        buttonEl.ariaKeyShortcuts = button.shortcut;
        buttonEl.dataset.value = button.value;
        buttonEl.textContent = button.text;

        if (/([0-9\.])/g.test(button.text)) buttonEl.classList.add("number");
        if (button.text === "=") buttonEl.classList.add("equals");
      }

      // 2. 상태 전환 버튼(states, clear-toggle)
      else {
        // AC, CE 버튼
        if (button.id === "clear-toggle") {
          console.log("Hello");
        }
        // 이외 Inv을 통해 값이 변화되는 버튼
      }

      // AC, CE
      // else {
      //   const value = "123";
      //   const state = value ? "AC" : "CE";
      //   buttonEl.id = button.id;
      //   buttonEl.ariaLabel = button.states[state].ariaLabel;
      //   buttonEl.ariaKeyShortcuts = button.states[state].shortcut;
      //   buttonEl.textContent = button.states[state].text;
      //   buttonEl.dataset.value = button.states[state].value;
      // }

      this.el.appendChild(buttonEl);
    });
  }
}
