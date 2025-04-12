import { Header, Footer } from "../../components";

document.body.insertAdjacentElement("afterbegin", new Header().el);
document.body.insertAdjacentElement("beforeend", new Footer().el);

// 탭 네비게이션 방향키 전환
const tabList: HTMLElement | null = document.querySelector("nav[role='tablist']");
const tabs: NodeList | null = document.querySelectorAll("button[role='tab']");

// Tab List, Tabs 요소가 있을 경우에만 실행하는 타입 가드(Type Guard)
if (tabList && tabs) {
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
      }
    }
  });
}
