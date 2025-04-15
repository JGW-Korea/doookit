import { UnitConverterDatas } from "../../data/translations/unit-converter";
import { UnitConverterDataTypes, UnitConverterType } from "../../types/unitConverter";
import { docType } from "../docType";
import ConvertVariable from "./converterVariable";

// 단위 변환 길이 계산 결과 컴포넌트
function PanelResultSection(type: UnitConverterDataTypes, data: UnitConverterType, convert: ConvertVariable): HTMLElement {
  const resultSectionEl = document.createElement("section");
  resultSectionEl.setAttribute("aria-labelledby", "conversion-result-label");

  const resultSectionHeading = document.createElement("h2");
  resultSectionHeading.id = "conversion-result-label";
  resultSectionHeading.classList.add("sr-only");
  resultSectionHeading.textContent = data.resultSectionTitle;

  const outputEl = document.createElement("output");
  outputEl.id = "conversion-result";
  outputEl.ariaLive = "polite";
  outputEl.ariaAtomic = "true";

  // output 초기값 지정
  if (data.conversionDescriptions)
    outputEl.textContent = convert.getConvertTemp.from === "c" ? data.conversionDescriptions.c : data.conversionDescriptions.f;
  else {
    const unit = type === "length" ? convert.getConvertLength : convert.getConvertWeight;
    outputEl.textContent = `${convert.getFromValue} ${unit.from} = ${convert.getToValue(type)} ${unit.to}`;
  }

  resultSectionEl.append(resultSectionHeading, outputEl);

  return resultSectionEl;
}

// 단위 변환 선택 컴포넌트
function PanelConvertFrom(convertType: UnitConverterDataTypes, data: UnitConverterType, convert: ConvertVariable): HTMLElement {
  // fieldset 컴포넌트
  // type: boolean -> true: From / false: To
  function Fieldset(key: string, type: boolean): HTMLFieldSetElement {
    const fieldsetEl = document.createElement("fieldset");
    const legendEl = document.createElement("legend");
    legendEl.textContent = data.legends[key as keyof typeof data.legends];

    const groupDivEl = document.createElement("div");
    groupDivEl.role = "group";

    const groupLabelSpanEl = document.createElement("span");
    groupLabelSpanEl.classList.add("sr-only");

    groupDivEl.setAttribute("aria-labelledby", type ? "from-group-label" : "to-group-label");

    groupLabelSpanEl.id = type ? "from-group-label" : "to-group-label";
    groupLabelSpanEl.textContent = type ? data.inputAriaLabel : data.resultAriaLabel;

    const inputLabel = document.createElement("label");
    inputLabel.setAttribute("for", type ? "from-value" : "to-value");
    inputLabel.classList.add("sr-only");
    inputLabel.textContent = type ? data.labels.value : data.labels.result;

    const inputEl = document.createElement("input");
    inputEl.type = "number";
    inputEl.id = type ? "from-value" : "to-value";
    inputEl.value = type ? convert.getFromValue.toString() : convert.getToValue(convertType).toString();
    inputEl.inputMode = type ? "decimal" : "";
    inputEl.disabled = !type;

    const selectLabel = document.createElement("label");
    selectLabel.setAttribute("for", type ? "from-unit" : "to-unit");
    selectLabel.classList.add("sr-only");
    selectLabel.textContent = type ? data.labels.fromUnit : data.labels.toUnit;

    const selectEl = document.createElement("select");
    selectEl.id = type ? "from-unit" : "to-unit";

    data.units.forEach(({ value, label }, idx) => {
      const optionEl = document.createElement("option");
      optionEl.value = value;
      optionEl.textContent = label;
      if (type && idx === 0) optionEl.selected = true;
      if (!type && idx === 1) optionEl.selected = true;

      selectEl.appendChild(optionEl);
    });

    groupDivEl.append(groupLabelSpanEl, inputLabel, inputEl, selectLabel, selectEl);
    fieldsetEl.append(legendEl, groupDivEl);

    return fieldsetEl;
  }

  // Swap Btn 생성
  function ConvertSwapButton() {
    const buttonEl = document.createElement("button");
    buttonEl.id = "swap";
    buttonEl.type = "button";
    buttonEl.ariaLabel = data.swapButtonAriaLabel;

    // 단위 변환 아이콘 SVG 파일 DOM 노드로 변환
    const convertSvgURL = new URL("../../assets/icons/si_swap-horiz-fill.svg", import.meta.url).href;
    fetch(convertSvgURL)
      .then((res) => res.text())
      .then((svgText) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const svgEl = doc.documentElement;

        svgEl.ariaHidden = "true";
        buttonEl.appendChild(svgEl);
      });

    return buttonEl;
  }

  const panelConvertForm = document.createElement("form");
  panelConvertForm.ariaLabel = data.ariaLabel;
  panelConvertForm.append(...[Fieldset("from", true), ConvertSwapButton(), Fieldset("to", false)]);

  return panelConvertForm;
}

// 변환 단위 컴포넌트 컨테이너 생성
function PanelConverterWrapper(type: UnitConverterDataTypes, convert: ConvertVariable): HTMLElement {
  const data = UnitConverterDatas[docType()][type]; // length | weigth | temp 타입에 맞는 데이터 정보 가져옴

  const panelWrapperEl = document.createElement("div");

  // Converter Title 요소 지정
  const panelHeaderEl = document.createElement("h2");
  panelHeaderEl.id = "conversion-title";
  panelHeaderEl.classList.add("sr-only");
  panelHeaderEl.textContent = data.title;

  panelWrapperEl.append(panelHeaderEl, PanelConvertFrom(type, data, convert), PanelResultSection(type, data, convert));

  return panelWrapperEl;
}

export const panel = (type: UnitConverterDataTypes, convert: ConvertVariable) => {
  return PanelConverterWrapper(type, convert);
};
