import { UnitConverterDatas } from "../../data/translations/unit-converter";
import { UnitConverterDataTypes, UnitConverterType } from "../../types/unitConverter";
import { docType } from "../docType";
import ConvertVariable, { tempFrom, fromValue } from "./converterVariable";

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
  if (data.conversionDescriptions) outputEl.textContent = tempFrom === "c" ? data.conversionDescriptions.c : data.conversionDescriptions.f;
  else {
    const unit = type === "length" ? convert.getConvertLength : convert.getConvertWeight;
    outputEl.textContent = `${convert.getFromValue} ${unit.from} = ${convert.getToValue(type)} ${unit.to}`;
  }

  resultSectionEl.append(resultSectionHeading, outputEl);

  return resultSectionEl;
}

// 단위 변환 선택 컴포넌트
function PanelConvertFrom(data: UnitConverterType): HTMLElement {
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
    inputEl.value = type ? fromValue.toString() : "2";
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

  panelWrapperEl.append(panelHeaderEl, PanelConvertFrom(data), PanelResultSection(type, data, convert));

  return panelWrapperEl;
}

export const panel = (type: UnitConverterDataTypes, convert: ConvertVariable) => {
  return PanelConverterWrapper(type, convert);
};

// const LENGHT_DATA = UnitConverterDatas[docType()].length;
// // const WEIGHT_DATA = UnitConverterDatas[docType()].weight;
// // const TEMPERATURE_DATA = UnitConverterDatas[docType()].temperature;

// // Length Panel 컴포넌트 반환
// export const lengthPanel = () => {
//   const panelWrapperEl = document.createElement("div");

//   const panelHeaderEl = document.createElement("h2");
//   panelHeaderEl.id = "conversion-title";
//   panelHeaderEl.classList.add("sr-only");
//   panelHeaderEl.textContent = LENGHT_DATA.title;

//   const panelConvertForm = document.createElement("form");
//   panelConvertForm.ariaLabel = LENGHT_DATA.ariaLabel;

//   Object.keys(LENGHT_DATA.legends).forEach((key, idx) => {
//     const fieldsetEl = document.createElement("fieldset");
//     const legendEl = document.createElement("legend");
//     legendEl.textContent = LENGHT_DATA.legends[key as keyof typeof LENGHT_DATA.legends];

//     const groupDivEl = document.createElement("div");
//     groupDivEl.role = "group";

//     const groupLabelSpanEl = document.createElement("span");
//     groupLabelSpanEl.classList.add("sr-only");

//     if (idx === 0) {
//       groupDivEl.setAttribute("aria-labelledby", "from-group-label");

//       groupLabelSpanEl.id = "from-group-label";
//       groupLabelSpanEl.textContent = LENGHT_DATA.inputAriaLabel;

//       const inputLabel = document.createElement("label");
//       inputLabel.setAttribute("for", "from-value");
//       inputLabel.classList.add("sr-only");
//       inputLabel.textContent = LENGHT_DATA.labels.value;

//       const inputEl = document.createElement("input");
//       inputEl.type = "number";
//       inputEl.id = "from-value";
//       inputEl.value = "1";
//       inputEl.inputMode = "decimal";

//       const selectLabel = document.createElement("label");
//       selectLabel.setAttribute("for", "from-unit");
//       selectLabel.classList.add("sr-only");
//       selectLabel.textContent = LENGHT_DATA.labels.fromUnit;

//       const selectEl = document.createElement("select");
//       selectEl.id = "from-unit";

//       LENGHT_DATA.units.forEach(({ value, label }) => {
//         const optionEl = document.createElement("option");
//         optionEl.value = value;
//         optionEl.textContent = label;
//         optionEl.selected = value === "cm";

//         selectEl.appendChild(optionEl);
//       });

//       groupDivEl.append(groupLabelSpanEl, inputLabel, inputEl, selectLabel, selectEl);
//       fieldsetEl.append(legendEl, groupDivEl);

//       // 첫 번째 fieldset의 형제로 단위 변환 버튼이 있어야 됨
//       const buttonEl = document.createElement("button");
//       buttonEl.type = "button";
//       buttonEl.ariaLabel = LENGHT_DATA.swapButtonAriaLabel;

//       const convertSvgURL = new URL("../../assets/icons/si_swap-horiz-fill.svg", import.meta.url).href;
//       fetch(convertSvgURL)
//         .then((res) => res.text())
//         .then((svgText) => {
//           const parser = new DOMParser();
//           const doc = parser.parseFromString(svgText, "image/svg+xml");
//           const svgEl = doc.documentElement;

//           svgEl.ariaHidden = "true";
//           buttonEl.appendChild(svgEl);
//         });

//       panelConvertForm.append(fieldsetEl, buttonEl);
//       // panelWrapperEl.append(panelHeaderEl, );
//     }
//     if (idx === 1) {
//       groupDivEl.setAttribute("aria-labelledby", "to-group-label");

//       groupLabelSpanEl.id = "to-group-label";
//       groupLabelSpanEl.textContent = LENGHT_DATA.resultAriaLabel;

//       const inputLabel = document.createElement("label");
//       inputLabel.setAttribute("for", "to-value");
//       inputLabel.classList.add("sr-only");
//       inputLabel.textContent = LENGHT_DATA.labels.result;

//       const inputEl = document.createElement("input");
//       inputEl.type = "number";
//       inputEl.id = "to-value";
//       inputEl.disabled = true;
//       inputEl.value = (1 / 2.54).toFixed(2);

//       const selectLabel = document.createElement("label");
//       selectLabel.setAttribute("for", "to-unit");
//       selectLabel.classList.add("sr-only");
//       selectLabel.textContent = LENGHT_DATA.labels.toUnit;

//       const selectEl = document.createElement("select");
//       selectEl.id = "to-unit";

//       LENGHT_DATA.units.forEach(({ value, label }) => {
//         const optionEl = document.createElement("option");
//         optionEl.value = value;
//         optionEl.textContent = label;
//         optionEl.selected = value === "in";

//         selectEl.appendChild(optionEl);
//       });

//       groupDivEl.append(groupLabelSpanEl, inputLabel, inputEl, selectLabel, selectEl);
//       fieldsetEl.append(legendEl, groupDivEl);
//       panelConvertForm.append(fieldsetEl);
//     }
//   });

//   const resultSectionEl = document.createElement("section");
//   resultSectionEl.setAttribute("aria-labelledby", "conversion-result-label");

//   const resultSectionHeading = document.createElement("h2");
//   resultSectionHeading.id = "conversion-result-label";
//   resultSectionHeading.classList.add("sr-only");
//   resultSectionHeading.textContent = LENGHT_DATA.resultSectionTitle;

//   const outputEl = document.createElement("output");
//   outputEl.id = "conversion-result";
//   outputEl.ariaLive = "polite";
//   outputEl.ariaAtomic = "true";
//   outputEl.textContent = "1 cm = 0.3937in";
//   resultSectionEl.append(resultSectionHeading, outputEl);

//   panelWrapperEl.append(panelHeaderEl, panelConvertForm, resultSectionEl);

//   return panelWrapperEl;
// };
