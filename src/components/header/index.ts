import { LayoutDatas } from "../../data";
import { HeaderType } from "../../types/layoutTranslations";
import { Component, ComponentDataType } from "../../utils/Component";
import { MAIN_PATH } from "../../utils/constant";
import { docType } from "../../utils/docType";
import Logo from "../logo";
import Nav from "../nav";

export default class Header extends Component<ComponentDataType, ComponentDataType> {
  constructor() {
    super({
      tagName: "header",
    });
  }

  render(): void {
    // /, /de, /es, /fr, /hi, /it, /ja, /ko, /zh -> Main Type
    // 조건 판별 #1 -> split("/").length <= 2
    // 조건 판별 #2 -> Set(/, /de, /es, /fr, /hi, /it, /ja, /ko, /zh).has(path) ✅
    const isMainType: HeaderType = MAIN_PATH.has(location.pathname) ? "main" : "sub"; // 헤더(Header) 타입 판별

    const layoutData = LayoutDatas[docType()];

    const LogoEl = new Logo({ props: { type: "header", ariaLabel: layoutData.logo.link.ariaLabel } });

    // 메인 헤더 타입에 대한 컴포넌트 스타일 지정
    if (isMainType === "main") {
      const navProps = layoutData.header.type[isMainType].nav;
      const NavEl = new Nav({ props: { type: "header", ariaLabel: navProps.ariaLabel, items: navProps.items } });
      this.el.append(LogoEl.el, NavEl.el);
    }

    // 서브 헤더 레이아웃 타입에 대한 컴포넌트 스타일 지정
    else {
      const arrowLeftSvg = new URL("../../assets/icons/arrow-left.svg", import.meta.url).href;

      // 뒤로가기 버튼 location.href 지정
      const backBtnEl = document.createElement("button");
      backBtnEl.addEventListener("click", () => {
        location.href = "/";
      });
      backBtnEl.classList.add("arrow");

      // SVG 파일 변환
      fetch(arrowLeftSvg)
        .then((res) => res.text())
        .then((svgText) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(svgText, "image/svg+xml");
          const svgEl = doc.documentElement;

          svgEl.ariaHidden = "true";
          backBtnEl.appendChild(svgEl);
        });

      backBtnEl.ariaLabel = layoutData.header.type[isMainType].backButton.ariaLabel;

      this.el.classList.add("non-main");
      this.el.append(backBtnEl, LogoEl.el);
    }
  }
}
