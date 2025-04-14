import { Header, Footer } from "../../components";
import { UnitConverterDataTypes } from "../../types/unitConverter";
import { panel } from "../../utils/converter/converterPanel";
import ConvertVariable from "../../utils/converter/converterVariable";
// import { lengthPanel } from "../../utils/converter/converterPanel";

const conversionPanelSection = document.getElementById("conversion-panel");

function renderConvertPanel() {
  const currentPanelDivEl = conversionPanelSection?.querySelector("div");
  if (!currentPanelDivEl) return;

  let nextPanel: HTMLElement | null = null;

  switch (convert.getConvertType) {
    case "length":
      nextPanel = lengthPanel;
      break;
    case "weight":
      nextPanel = weightPanel;
      break;
    case "temperature":
      nextPanel = temperaturePanel;

      break;
  }

  if (!nextPanel) return;

  currentPanelDivEl.replaceWith(nextPanel);

  const toValueInputEl = nextPanel.querySelector("input#to-value");
  if (toValueInputEl && toValueInputEl instanceof HTMLInputElement) {
    toValueInputEl.value = convert.getToValue().toString();
  }
}

document.body.insertAdjacentElement("afterbegin", new Header().el);
document.body.insertAdjacentElement("beforeend", new Footer().el);

const tabList: HTMLElement | null = document.querySelector("nav[role='tablist']");
const tabs: NodeList | null = document.querySelectorAll("button[role='tab']");

const convert = new ConvertVariable();

const lengthPanel = panel("length", convert);
const weightPanel = panel("weight", convert);
const temperaturePanel = panel("temperature", convert);

// 초기 단위 변환 판넬 반영?
if (conversionPanelSection) {
  conversionPanelSection.appendChild(lengthPanel);
}

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
          renderConvertPanel();
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
        renderConvertPanel();
      }
    }
  });
}
