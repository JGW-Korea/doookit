import { UnitConverterDatas } from "../../data/translations/unit-converter";
import { docType } from "../docType";

const LENGHT_DATA = UnitConverterDatas[docType()].length;
// const WEIGHT_DATA = UnitConverterDatas[docType()].weight;
// const TEMPERATURE_DATA = UnitConverterDatas[docType()].temperature;

// Length Panel 컴포넌트 반환
export const lengthPanel = () => {
  const panelWrapperEl = document.createElement("div");

  const panelHeaderEl = document.createElement("h2");
  panelHeaderEl.id = "conversion-title";
  panelHeaderEl.classList.add("sr-only");
  panelHeaderEl.textContent = LENGHT_DATA.title;

  const panelConvertForm = document.createElement("form");
  panelConvertForm.ariaLabel = LENGHT_DATA.ariaLabel;

  Object.keys(LENGHT_DATA.legends).forEach((key, idx) => {
    const fieldsetEl = document.createElement("fieldset");
    const legendEl = document.createElement("legend");
    legendEl.textContent = LENGHT_DATA.legends[key as keyof typeof LENGHT_DATA.legends];

    const groupDivEl = document.createElement("div");
    groupDivEl.role = "group";

    const groupLabelSpanEl = document.createElement("span");
    groupLabelSpanEl.classList.add("sr-only");

    if (idx === 0) {
      groupDivEl.setAttribute("aria-labelledby", "from-group-label");

      groupLabelSpanEl.id = "from-group-label";
      groupLabelSpanEl.textContent = LENGHT_DATA.inputAriaLabel;

      const inputLabel = document.createElement("label");
      inputLabel.setAttribute("for", "from-value");
      inputLabel.classList.add("sr-only");
      inputLabel.textContent = "Value";

      const inputEl = document.createElement("input");
      inputEl.type = "number";
      inputEl.id = "from-value";
      inputEl.value = "1";
      inputEl.inputMode = "decimal";

      const selectLabel = document.createElement("label");
      selectLabel.setAttribute("for", "from-unit");
      selectLabel.classList.add("sr-only");
      selectLabel.textContent = "From Unit";

      const selectEl = document.createElement("select");
      selectEl.id = "from-unit";

      LENGHT_DATA.units.forEach(({ value, label }) => {
        const optionEl = document.createElement("option");
        optionEl.value = value;
        optionEl.textContent = label;
        optionEl.selected = value === "cm";

        selectEl.appendChild(optionEl);
      });

      groupDivEl.append(groupLabelSpanEl, inputLabel, inputEl, selectLabel, selectEl);
      fieldsetEl.appendChild(groupDivEl);

      // 첫 번째 fieldset의 형제로 단위 변환 버튼이 있어야 됨
      const buttonEl = document.createElement("button");
      buttonEl.type = "button";

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

      panelConvertForm.append(fieldsetEl, buttonEl);
      // panelWrapperEl.append(panelHeaderEl, );
    }
    if (idx === 1) {
      groupDivEl.setAttribute("aria-labelledby", "to-group-label");

      groupLabelSpanEl.id = "to-group-label";
      groupLabelSpanEl.textContent = LENGHT_DATA.resultAriaLabel;

      const inputLabel = document.createElement("label");
      inputLabel.setAttribute("for", "to-value");
      inputLabel.classList.add("sr-only");
      inputLabel.textContent = "Result";

      const inputEl = document.createElement("input");
      inputEl.type = "number";
      inputEl.id = "to-value";
      inputEl.disabled = true;

      const selectLabel = document.createElement("label");
      selectLabel.setAttribute("for", "to-unit");
      selectLabel.classList.add("sr-only");
      selectLabel.textContent = "To Unit";

      const selectEl = document.createElement("select");
      selectEl.id = "to-unit";

      LENGHT_DATA.units.forEach(({ value, label }) => {
        const optionEl = document.createElement("option");
        optionEl.value = value;
        optionEl.textContent = label;
        optionEl.selected = value === "in";

        selectEl.appendChild(optionEl);
      });

      groupDivEl.append(groupLabelSpanEl, inputLabel, inputEl, selectLabel, selectEl);
      fieldsetEl.appendChild(groupDivEl);
      panelConvertForm.append(fieldsetEl);
    }
  });

  panelWrapperEl.append(panelHeaderEl, panelConvertForm);

  return panelWrapperEl;
};
