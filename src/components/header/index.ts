import { LayoutDatas } from "../../data";
import { HeaderType } from "../../types/layoutTranslations";
import { LangType } from "../../types/translation";
import { Component, ComponentDataType } from "../../utils/Component";
import { MAIN_PATH } from "../../utils/constant";
import { docType } from "../../utils/docType";
import Logo from "../logo";
import Nav from "../nav";
// import { isLangType } from "../../utils/typeCheck";
// import Logo from "../logo";
// import Nav from "../nav";
// import { langType, TranslationsTypes } from "../../types/translation";
// import { isLangType } from "../../utils/typeCheck";

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
    const docLangType: LangType = docType();

    console.log(LayoutDatas[docLangType].logo);

    const LogoEl = new Logo({ props: { type: "header", ariaLabel: LayoutDatas[docLangType].logo.link.ariaLabel } });

    if (isMainType === "main") {
      const navProps = LayoutDatas[docLangType].header.type[isMainType].nav;
      const NavEl = new Nav({ props: { type: "header", ariaLabel: navProps.ariaLabel, items: navProps.items } });
      this.el.append(LogoEl.el, NavEl.el);
    } else {
    }

    // const type: boolean = location.pathname === "/"; // Main | Outer
    // // 지원하는 언어 중 하나를 가져온다.

    // const translations = { en, de, es, fr, hi, it, ja, ko, zh } as const satisfies TranslationsTypes;
    // const currentLanguage = translations[lang];
    // const logo = new Logo({ props: { tag: "header", ariaLabel: currentLanguage["header"].a.ariaLabel } }).el; // 타입에 상관없이 사용될 로고는 생성
    // // 현재 헤더의 위치가 메인 페이지일 경우
    // if (type) {
    //   // Navigator 리스트 하위 컴포넌트 구성
    //   const navEl = new Nav({
    //     props: {
    //       type: "header",
    //       items: currentLanguage["header"].nav.items,
    //       ariaLabel: currentLanguage["header"].nav.ariaLabel,
    //     },
    //   });
    //   this.el.append(logo, navEl.el);
    // }
    // // 헤더의 위치가 메인 페이지가 아닐 경우
    // else {
    //   const arrowLeft = new URL("../../assets/icons/arrow-left.svg", import.meta.url).href;
    //   const aEl = document.createElement("a");
    //   aEl.href = "/";
    //   const imgEl = document.createElement("img");
    //   imgEl.src = arrowLeft;
    //   imgEl.alt = currentLanguage["header"].arrow.ariaLabel;
    //   aEl.classList.add("arrow");
    //   aEl.appendChild(imgEl);
    //   aEl.ariaLabel = currentLanguage["header"].nav.ariaLabel;
    //   this.el.classList.add("non-main");
    //   this.el.append(aEl, logo);
    // }
    // // this.el.appendChild(new Logo({ props: { tag: "header" } }).el);
    // // const navEl = document.createElement("nav");
    // // navEl.setAttribute("aria-label", "메인 메뉴");
    // // const ulEl = document.createElement("ul");
    // // ["Tools", "About"].forEach((title, idx) => {
    // //   const liEl = document.createElement("li");
    // //   const anchorEl = document.createElement("a");
    // //   anchorEl.textContent = title;
    // //   if (idx === 0) anchorEl.href = "#tools";
    // //   if (idx === 1) anchorEl.href = "#about";
    // //   liEl.appendChild(anchorEl);
    // //   ulEl.appendChild(liEl);
    // // });
    // // navEl.appendChild(ulEl);
    // // this.el.appendChild(navEl);
  }
}
