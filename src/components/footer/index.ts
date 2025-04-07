// import { langType, TranslationsTypes } from "../../types/translation";
import { Component, ComponentDataType } from "../../utils/Component";
// import { isLangType } from "../../utils/typeCheck";
// import { en, de, es, fr, hi, it, ja, ko, zh } from "../../data";
// import Logo from "../logo";

export default class Footer extends Component<ComponentDataType, ComponentDataType> {
  constructor() {
    super({
      tagName: "footer",
    });
  }

  render() {
    // const containerEl = document.createElement("div");
    // const divEl = document.createElement("div");
    // const copyrightEl = document.createElement("p");
    // copyrightEl.textContent = "\u00A9 2025 DoooKit. All righs reserved.";
    // // 지원하는 언어 중 하나를 가져온다.
    // const browserLang: string = navigator.language.split("-")[0];
    // const lang: langType = isLangType(browserLang) ? browserLang : "en";
    // const translations = { en, de, es, fr, hi, it, ja, ko, zh } as const satisfies TranslationsTypes;
    // const currentLanguage = translations[lang];
    // divEl.append(new Logo({ props: { tag: "footer", ariaLabel: currentLanguage["header"].a.ariaLabel } }).el, copyrightEl);
    // containerEl.appendChild(divEl);
    // const navEl = document.createElement("nav");
    // navEl.setAttribute("aria-label", "Footer Navigation");
    // const ulEl = document.createElement("ul");
    // ["Privacy", "Terms", "Github"].forEach((title, idx) => {
    //   const liEl = document.createElement("li");
    //   const anchorEl = document.createElement("a");
    //   anchorEl.textContent = title;
    //   if (idx === 0) anchorEl.href = "#tools";
    //   if (idx === 1) anchorEl.href = "#about";
    //   if (idx === 2) anchorEl.href = "https://github.com/JGW-Korea/doookit";
    //   liEl.appendChild(anchorEl);
    //   ulEl.appendChild(liEl);
    // });
    // navEl.appendChild(ulEl);
    // containerEl.appendChild(navEl);
    // this.el.appendChild(containerEl);
  }
}
