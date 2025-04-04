import { en, de, es, fr, hi, it, ja, ko, zh } from "../../data";
import { Component, ComponentDataType } from "../../utils/Component";
import Logo from "../logo";
import Nav from "../nav";

export default class Header extends Component<ComponentDataType, ComponentDataType> {
  constructor() {
    super({
      tagName: "header",
    });
  }

  render(): void {
    const type: boolean = location.pathname === "/"; // Main | Outer
    const lang: string = navigator.language.split("-")[0] || "en"; // 브라우저 언어를 가져온다.

    const country = { en, de, es, fr, hi, it, ja, ko, zh };
    const currentLanguage = country[lang];

    const logo = new Logo({ props: { tag: "header", ariaLabel: currentLanguage["header"].a.ariaLabel } }).el; // 타입에 상관없이 사용될 로고는 생성

    // 현재 헤더의 위치가 메인 페이지일 경우
    if (type) {
      // Navigator 리스트 하위 컴포넌트 구성
      const navEl = new Nav({
        props: {
          type: "header",
          items: currentLanguage["header"].nav.items,
          ariaLabel: currentLanguage["header"].nav.ariaLabel,
        },
      });

      this.el.append(logo, navEl.el);
    }

    // 헤더의 위치가 메인 페이지가 아닐 경우
    else {
      // const icon = new URL(arrowLeft, import.meta.url);
      // console.log(arrowLeft);
      const arrowLeft = new URL("../../assets/icons/arrow-left.svg", import.meta.url).href;

      const aEl = document.createElement("a");
      aEl.href = "/";
      const imgEl = document.createElement("img");
      imgEl.src = arrowLeft;
      aEl.classList.add("arrow");
      aEl.appendChild(imgEl);
      this.el.classList.add("non-main");
      this.el.append(aEl, logo);
    }

    // this.el.appendChild(new Logo({ props: { tag: "header" } }).el);

    // const navEl = document.createElement("nav");
    // navEl.setAttribute("aria-label", "메인 메뉴");
    // const ulEl = document.createElement("ul");
    // ["Tools", "About"].forEach((title, idx) => {
    //   const liEl = document.createElement("li");
    //   const anchorEl = document.createElement("a");
    //   anchorEl.textContent = title;
    //   if (idx === 0) anchorEl.href = "#tools";
    //   if (idx === 1) anchorEl.href = "#about";
    //   liEl.appendChild(anchorEl);
    //   ulEl.appendChild(liEl);
    // });

    // navEl.appendChild(ulEl);
    // this.el.appendChild(navEl);
  }
}
