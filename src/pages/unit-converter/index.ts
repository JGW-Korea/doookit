import { Header, Footer } from "../../components";
import { UnitConverterDatas } from "../../data/translations/unit-converter";
import { UnitConverterDataTypes } from "../../types/unitConverter";
import { panel } from "../../utils/converter/converterPanel";
import ConvertVariable from "../../utils/converter/converterVariable";
import { docType } from "../../utils/docType";
// import { lengthPanel } from "../../utils/converter/converterPanel";

const convert = new ConvertVariable();

const conversionPanelSection = document.getElementById("conversion-panel");

// 탭 네비게이션에 맞는 탭 항목 변경 렌더링
function randerTabWrapperChange() {
  const currentPanelDivEl = conversionPanelSection?.querySelector("div");
  if (currentPanelDivEl) {
    const nextPanel: HTMLElement = panel(convert.getConvertType, convert); // 선택된 탭 항목 내용 HTMLElement 요소 생성
    if (!nextPanel) return;

    currentPanelDivEl.replaceWith(nextPanel);

    const fromValueInputEl = nextPanel.querySelector("input#from-value") as HTMLInputElement;
    const fromValueSelectEl = nextPanel.querySelector("select#from-unit") as HTMLSelectElement;
    const toValueInputEl = nextPanel.querySelector("input#to-value") as HTMLInputElement;
    const toValueSelectEl = nextPanel.querySelector("select#to-unit") as HTMLSelectElement;
    const outputEl = nextPanel.querySelector("output#conversion-result") as HTMLOutputElement;
    const swapBtnEl = nextPanel.querySelector("button#swap") as HTMLButtonElement;

    if (fromValueInputEl) {
      fromValueInputEl.addEventListener("input", (event) => handleInputValue(event, toValueInputEl, outputEl));
    }

    if (fromValueSelectEl) {
      fromValueSelectEl.addEventListener("change", (event) => handleChangeFromSelect(event, toValueInputEl, toValueSelectEl, outputEl));
    }

    if (toValueSelectEl) {
      toValueSelectEl.addEventListener("change", (event) => handleChangeToSelect(event, toValueInputEl, fromValueSelectEl, outputEl));
    }

    if (swapBtnEl) {
      swapBtnEl.addEventListener("click", () => handlerBtnSwap(fromValueSelectEl, toValueInputEl, toValueSelectEl, outputEl));
    }
  }
}

// fromValue Input 값 변경 시
function handleInputValue(event: Event, toInputEl: HTMLInputElement, outputEl: HTMLOutputElement) {
  if (event.target instanceof HTMLInputElement) {
    convert.setFromValue = event.target.value; // fromValue 값 수정
    toInputEl.value = String(convert.getToValue()); // 1. toValue 값 변경

    // 2. output 값 변경
    switch (convert.getConvertType) {
      case "length":
        outputEl.textContent = `${convert.getFromValue} ${convert.getConvertLength.from} = ${convert.getToValue()} ${convert.getConvertLength.to}`;
        break;
      case "weight":
        outputEl.textContent = `${convert.getFromValue} ${convert.getConvertWeight.from} = ${convert.getToValue()} ${convert.getConvertWeight.to}`;
        break;

      // Temperature output은 섭씨 -> 화씨 또는 화씨 -> 섭씨 값으로 수식만 알려주기 때문에 변경 불필요 (즉, swap 시에만 output 텍스트 변경 필요)
    }
  }
}

// Select 값이 변경될 때 발생하는 이벤트
function handleChangeFromSelect(event: Event, toInputEl: HTMLInputElement, toSelectEl: HTMLSelectElement, outputEl: HTMLOutputElement) {
  if (!event.target || !(event.target instanceof HTMLSelectElement)) return;

  // Length | Weight | Temp select 옵션 변경
  switch (convert.getConvertType) {
    case "length":
      // 동일한 옵션을 선택했을 경우
      if (event.target.value === convert.getConvertLength.from) return;
      // 변환될 단위와 동일한 단위를 선택했을 경우
      else if (event.target.value === convert.getConvertLength.to) {
        convert.swap();
        const { options } = toSelectEl;

        // to 옵션을 from 옵션으로 수정
        for (let i = 0; i < options.length; i++) {
          if (options[i].value === convert.getConvertLength.to) {
            options[i].selected = true;
          }
        }
      }

      // 이외 cm | in | m | ft | km | mi 옵션을 선택할 경우
      else if (event.target.value === "cm") convert.setConvertLength = { from: event.target.value, to: convert.getConvertLength.to };
      else if (event.target.value === "in") convert.setConvertLength = { from: event.target.value, to: convert.getConvertLength.to };
      else if (event.target.value === "m") convert.setConvertLength = { from: event.target.value, to: convert.getConvertLength.to };
      else if (event.target.value === "ft") convert.setConvertLength = { from: event.target.value, to: convert.getConvertLength.to };
      else if (event.target.value === "km") convert.setConvertLength = { from: event.target.value, to: convert.getConvertLength.to };
      else if (event.target.value === "mi") convert.setConvertLength = { from: event.target.value, to: convert.getConvertLength.to };

      toInputEl.value = String(convert.getToValue());
      outputEl.textContent = `${convert.getFromValue} ${convert.getConvertLength.from} = ${convert.getToValue()} ${convert.getConvertLength.to}`;
      break;
    case "weight":
      // 동일한 옵션을 선택했을 경우
      if (event.target.value === convert.getConvertWeight.from) return;
      // 변환될 단위와 동일한 단위를 선택했을 경우
      else if (event.target.value === convert.getConvertWeight.to) {
        convert.swap();
        const { options } = toSelectEl;

        // to 옵션을 from 옵션으로 수정
        for (let i = 0; i < options.length; i++) {
          if (options[i].value === convert.getConvertWeight.to) {
            options[i].selected = true;
          }
        }
      }

      // 이외 g | kg | lb | t | oz 옵션을 선택할 경우
      else if (event.target.value === "g") convert.setConvertWeigth = { from: event.target.value, to: convert.getConvertWeight.to };
      else if (event.target.value === "kg") convert.setConvertWeigth = { from: event.target.value, to: convert.getConvertWeight.to };
      else if (event.target.value === "lb") convert.setConvertWeigth = { from: event.target.value, to: convert.getConvertWeight.to };
      else if (event.target.value === "t") convert.setConvertWeigth = { from: event.target.value, to: convert.getConvertWeight.to };
      else if (event.target.value === "oz") convert.setConvertWeigth = { from: event.target.value, to: convert.getConvertWeight.to };

      toInputEl.value = String(convert.getToValue());
      outputEl.textContent = `${convert.getFromValue} ${convert.getConvertWeight.from} = ${convert.getToValue()} ${convert.getConvertWeight.to}`;
      break;

    case "temperature":
      // 동일한 옵션을 선택했을 경우
      if (event.target.value === convert.getConvertTemp.from) return;
      // 변환될 단위와 동일한 단위를 선택했을 경우
      else if (event.target.value === convert.getConvertTemp.to) {
        convert.swap();
        const { options } = toSelectEl;

        // to 옵션을 from 옵션으로 수정
        for (let i = 0; i < options.length; i++) {
          if (options[i].value === convert.getConvertTemp.to) {
            options[i].selected = true;
          }
        }
      }

      toInputEl.value = String(convert.getToValue());
      outputEl.textContent =
        convert.getConvertTemp.from === "c"
          ? UnitConverterDatas[docType()]["temperature"].conversionDescriptions.c
          : UnitConverterDatas[docType()]["temperature"].conversionDescriptions.f;

      break;
  }
}

function handleChangeToSelect(event: Event, toInputEl: HTMLInputElement, fromSelectEl: HTMLSelectElement, outputEl: HTMLOutputElement) {
  if (!event.target || !(event.target instanceof HTMLSelectElement)) return;

  // Length | Weight | Temp select 옵션 변경
  switch (convert.getConvertType) {
    case "length":
      // 동일한 옵션을 선택했을 경우
      if (event.target.value === convert.getConvertLength.to) return;
      // 변환될 단위와 동일한 단위를 선택했을 경우
      else if (event.target.value === convert.getConvertLength.from) {
        convert.swap();
        const { options } = fromSelectEl;

        // to 옵션을 from 옵션으로 수정
        for (let i = 0; i < options.length; i++) {
          if (options[i].value === convert.getConvertLength.from) {
            options[i].selected = true;
          }
        }
      }

      // 이외 cm | in | m | ft | km | mi 옵션을 선택할 경우
      else if (event.target.value === "cm") convert.setConvertLength = { from: convert.getConvertLength.from, to: event.target.value };
      else if (event.target.value === "in") convert.setConvertLength = { from: convert.getConvertLength.from, to: event.target.value };
      else if (event.target.value === "m") convert.setConvertLength = { from: convert.getConvertLength.from, to: event.target.value };
      else if (event.target.value === "ft") convert.setConvertLength = { from: convert.getConvertLength.from, to: event.target.value };
      else if (event.target.value === "km") convert.setConvertLength = { from: convert.getConvertLength.from, to: event.target.value };
      else if (event.target.value === "mi") convert.setConvertLength = { from: convert.getConvertLength.from, to: event.target.value };

      toInputEl.value = String(convert.getToValue());
      outputEl.textContent = `${convert.getFromValue} ${convert.getConvertLength.from} = ${convert.getToValue()} ${convert.getConvertLength.to}`;
      break;
    case "weight":
      // 동일한 옵션을 선택했을 경우
      if (event.target.value === convert.getConvertWeight.to) return;
      // 변환될 단위와 동일한 단위를 선택했을 경우
      else if (event.target.value === convert.getConvertWeight.from) {
        convert.swap();
        const { options } = fromSelectEl;

        // to 옵션을 from 옵션으로 수정
        for (let i = 0; i < options.length; i++) {
          if (options[i].value === convert.getConvertWeight.from) {
            options[i].selected = true;
          }
        }
      }

      // 이외 g | kg | lb | t | oz 옵션을 선택할 경우
      else if (event.target.value === "g") convert.setConvertWeigth = { from: convert.getConvertWeight.from, to: event.target.value };
      else if (event.target.value === "kg") convert.setConvertWeigth = { from: convert.getConvertWeight.from, to: event.target.value };
      else if (event.target.value === "lb") convert.setConvertWeigth = { from: convert.getConvertWeight.from, to: event.target.value };
      else if (event.target.value === "t") convert.setConvertWeigth = { from: convert.getConvertWeight.from, to: event.target.value };
      else if (event.target.value === "oz") convert.setConvertWeigth = { from: convert.getConvertWeight.from, to: event.target.value };

      toInputEl.value = String(convert.getToValue());
      outputEl.textContent = `${convert.getFromValue} ${convert.getConvertWeight.from} = ${convert.getToValue()} ${convert.getConvertWeight.to}`;
      break;

    case "temperature":
      // 동일한 옵션을 선택했을 경우
      if (event.target.value === convert.getConvertTemp.to) return;
      // 변환될 단위와 동일한 단위를 선택했을 경우
      else if (event.target.value === convert.getConvertTemp.from) {
        convert.swap();
        const { options } = fromSelectEl;

        // to 옵션을 from 옵션으로 수정
        for (let i = 0; i < options.length; i++) {
          if (options[i].value === convert.getConvertTemp.from) {
            options[i].selected = true;
          }
        }
      }

      toInputEl.value = String(convert.getToValue());
      // outputEl.textContent =
      //   convert.getConvertTemp.from === "c"
      //     ? UnitConverterDatas[docType()]["temperature"].conversionDescriptions.c
      //     : UnitConverterDatas[docType()]["temperature"].conversionDescriptions.f;

      break;
  }
}

// 단위 Swap 버튼 클릭 이벤트 핸들러
function handlerBtnSwap(fromSelectEl: HTMLSelectElement, toInputEl: HTMLInputElement, toSelectEl: HTMLSelectElement, outputEl: HTMLOutputElement) {
  convert.swap();

  switch (convert.getConvertType) {
    case "length": // 현재 단위가 Length일 경우
      const { options: fromOptions } = fromSelectEl;
      const { options: toOptions } = toSelectEl;
      const { from, to } = convert.getConvertLength;

      outer: for (let i = 0; i < fromOptions.length; i++) {
        for (let j = 0; j < toOptions.length; j++) {
          if (fromOptions[i].value === from && toOptions[j].value === to) {
            fromOptions[i].selected = true;
            toOptions[j].selected = true;
            break outer;
          }
        }
      }

      toInputEl.value = String(convert.getToValue());
      outputEl.textContent = `${convert.getFromValue} ${convert.getConvertLength.from} = ${convert.getToValue()} ${convert.getConvertLength.to}`;
      break;

    case "weight": // 현재 단위가 Weight일 경우
      const { options: fromWeigthOptions } = fromSelectEl;
      const { options: toWeightOptions } = toSelectEl;
      const { from: fromWeight, to: toWeight } = convert.getConvertWeight;

      outer: for (let i = 0; i < fromWeigthOptions.length; i++) {
        for (let j = 0; j < toWeightOptions.length; j++) {
          if (fromWeigthOptions[i].value === fromWeight && toWeightOptions[j].value === toWeight) {
            fromWeigthOptions[i].selected = true;
            toWeightOptions[j].selected = true;
            break outer;
          }
        }
      }

      toInputEl.value = String(convert.getToValue());
      outputEl.textContent = `${convert.getFromValue} ${convert.getConvertWeight.from} = ${convert.getToValue()} ${convert.getConvertWeight.to}`;
      break;

    case "temperature": // 현재 단위가 Temperature일 경우
      const { options: fromTempOptions } = fromSelectEl;
      const { options: toTempOptions } = toSelectEl;
      const { from: fromTemp, to: toTemp } = convert.getConvertTemp;

      outer: for (let i = 0; i < fromTempOptions.length; i++) {
        for (let j = 0; j < toTempOptions.length; j++) {
          if (fromTempOptions[i].value === fromTemp && toTempOptions[j].value === toTemp) {
            fromTempOptions[i].selected = true;
            toTempOptions[j].selected = true;
            break outer;
          }
        }
      }

      toInputEl.value = String(convert.getToValue());
      outputEl.textContent =
        convert.getConvertTemp.from === "c"
          ? UnitConverterDatas[docType()]["temperature"].conversionDescriptions.c
          : UnitConverterDatas[docType()]["temperature"].conversionDescriptions.f;
      break;
  }
}

// 초기 단위 변환 판넬 반영
if (conversionPanelSection) {
  conversionPanelSection.appendChild(panel(convert.getConvertType, convert));

  const fromValueInputEl = document.querySelector("input#from-value") as HTMLInputElement;
  const fromValueSelectEl = document.querySelector("select#from-unit") as HTMLSelectElement;
  const toValueInputEl = conversionPanelSection.querySelector("input#to-value") as HTMLInputElement;
  const toValueSelectEl = conversionPanelSection.querySelector("select#to-unit") as HTMLSelectElement;
  const outputEl = conversionPanelSection.querySelector("output#conversion-result") as HTMLOutputElement;

  if (fromValueInputEl) {
    fromValueInputEl.addEventListener("input", (event) => handleInputValue(event, toValueInputEl, outputEl));
  }

  if (fromValueSelectEl) {
    fromValueSelectEl.addEventListener("change", (event) => handleChangeFromSelect(event, toValueInputEl, toValueSelectEl, outputEl));
  }

  if (toValueSelectEl) {
    toValueSelectEl.addEventListener("change", (event) => handleChangeToSelect(event, toValueInputEl, fromValueSelectEl, outputEl));
  }

  const swapBtnEl = conversionPanelSection.querySelector("button#swap");
  if (swapBtnEl) {
    swapBtnEl.addEventListener("click", () => handlerBtnSwap(fromValueSelectEl, toValueInputEl, toValueSelectEl, outputEl));
  }
}

document.body.insertAdjacentElement("afterbegin", new Header().el);
document.body.insertAdjacentElement("beforeend", new Footer().el);

const tabList: HTMLElement | null = document.querySelector("nav[role='tablist']");
const tabs: NodeList | null = document.querySelectorAll("button[role='tab']");

// Tab List, Tabs 요소가 있을 경우에만 실행하는 타입 가드(Type Guard)
if (tabList && tabs) {
  // conversionPanelSection.appendChild(lengthPanel());

  // 초기 상태 Tab 항목
  let currentStateTapEl: HTMLElement;
  tabs.forEach((tabEl) => {
    if (tabEl instanceof HTMLElement && tabEl.classList.contains("active")) {
      currentStateTapEl = tabEl;
      // tabType = tabEl.dataset.value;
    }
  });

  tabs.forEach((tabEl) => {
    // 각 탭 클릭 이벤트 핸들러 등록
    tabEl.addEventListener("click", (event) => {
      if (event.currentTarget instanceof HTMLElement && currentStateTapEl) {
        // 1. 현재 선택된 요소가 클릭 되었을 경우 -> 무시
        if (currentStateTapEl === event.currentTarget) return;
        // 2. 다른 탭을 선택했을 경우 -> 해당 탭으로 전환
        else {
          currentStateTapEl.ariaSelected = "false";
          currentStateTapEl.tabIndex = -1;
          currentStateTapEl.classList.remove("active");

          event.currentTarget.ariaSelected = "true";
          event.currentTarget.tabIndex = 0;
          event.currentTarget.classList.add("active");

          currentStateTapEl = event.currentTarget;
          convert.setConvertType = event.currentTarget.dataset.value as UnitConverterDataTypes;
          randerTabWrapperChange();
          // renderConvertPanel();
        }
      }
    });
  });

  // 탭 네비게이션 방향키 전환
  tabList.addEventListener("keydown", (event) => {
    const activeTab = document.activeElement;

    // 현재 탭 포커스가 활성화 된 탭 요소에 대한
    if (activeTab && activeTab.matches(":focus-visible")) {
      let currentTabIdx: number = [...tabs].indexOf(activeTab); // 현재 탭 포커스가 활성화된 인덱스 가져옴
      let newTabIdx: number; // 새로운 탭 포커스가 활성화될 요소 인덱스 값

      // KeyBoardEvent 발생한 유혀
      switch (event.key) {
        case "ArrowRight":
          newTabIdx = (currentTabIdx + 1) % tabs.length; // 다음 탭으로 이동
          break;
        case "ArrowLeft":
          newTabIdx = (currentTabIdx - 1 + tabs.length) % tabs.length; // 이전 탭으로 이동
          break;
        case "Home":
          newTabIdx = 0;
          break;
        case "End":
          newTabIdx = tabs.length - 1;
          break;
        default: // 다른 키는 무시
          return;
      }

      const currentTab = tabs[currentTabIdx] as HTMLElement;
      const newTab = tabs[newTabIdx] as HTMLElement;

      if (tabs[currentTabIdx] && newTab) {
        currentTab.ariaSelected = "false";
        currentTab.tabIndex = -1;
        currentTab.classList.remove("active");

        newTab.ariaSelected = "true";
        newTab.tabIndex = 0;
        newTab.classList.add("active");
        newTab.focus();

        currentStateTapEl = newTab;
        convert.setConvertType = newTab.dataset.value as UnitConverterDataTypes;
        randerTabWrapperChange();
        // renderConvertPanel();
      }
    }
  });
}
