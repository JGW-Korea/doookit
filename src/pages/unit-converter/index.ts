import { Header, Footer } from "../../components";

document.body.insertAdjacentElement("afterbegin", new Header().el);
document.body.insertAdjacentElement("beforeend", new Footer().el);

const tabList: HTMLElement | null = document.querySelector("nav[role='tablist']");
const tabs: NodeList | null = document.querySelectorAll("button[role='tab']");

let tabType;

// Tab List, Tabs 요소가 있을 경우에만 실행하는 타입 가드(Type Guard)
if (tabList && tabs) {
  let testCurrentTabEl: HTMLElement;
  tabs.forEach((tabEl) => {
    if (tabEl instanceof HTMLElement && tabEl.classList.contains("active")) {
      testCurrentTabEl = tabEl;
      tabType = tabEl.dataset.value;
    }
  });

  console.log(tabType);

  tabs.forEach((tabEl) => {
    // 각 탭 클릭 이벤트 핸들러 등록
    tabEl.addEventListener("click", (event) => {
      if (event.currentTarget instanceof HTMLElement) {
        // 1. 현재 선택된 요소가 클릭 되었을 경우 -> 무시
        if (testCurrentTabEl === event.currentTarget) return;
        // 2. 다른 탭을 선택했을 경우 -> 해당 탭으로 전환
        else {
          if (testCurrentTabEl) {
            testCurrentTabEl.ariaSelected = "false";
            testCurrentTabEl.tabIndex = -1;
            testCurrentTabEl.classList.remove("active");

            event.currentTarget.ariaSelected = "true";
            event.currentTarget.tabIndex = 0;
            event.currentTarget.classList.add("active");

            testCurrentTabEl = event.currentTarget;
          }
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

      const currentTabEl = tabs[currentTabIdx] as HTMLElement;
      const newTabEl = tabs[newTabIdx] as HTMLElement;

      if (tabs[currentTabIdx] && newTabEl) {
        currentTabEl.ariaSelected = "false";
        currentTabEl.tabIndex = -1;
        currentTabEl.classList.remove("active");

        newTabEl.ariaSelected = "true";
        newTabEl.tabIndex = 0;
        newTabEl.classList.add("active");
        newTabEl.focus();

        testCurrentTabEl = newTabEl;
      }
    }
  });
}
