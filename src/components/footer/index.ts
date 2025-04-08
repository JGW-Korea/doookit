import { LayoutDatas } from "../../data";
import { Component, ComponentDataType } from "../../utils/Component";
import { docType } from "../../utils/docType";
import Logo from "../logo";
import Nav from "../nav";

export default class Footer extends Component<ComponentDataType, ComponentDataType> {
  constructor() {
    super({
      tagName: "footer",
    });
  }

  render() {
    const footerContainerEl = document.createElement("div");
    footerContainerEl.classList.add("container");

    // 로고 및 저작권 영역을 담을 <div> 생성
    const divEl = document.createElement("div");

    const layoutData = LayoutDatas[docType()];
    divEl.appendChild(new Logo({ props: { type: "footer", ariaLabel: layoutData.logo.link.ariaLabel } }).el);

    const copyrightEl = document.createElement("p");
    copyrightEl.textContent = "\u00A9 2025 DoooKit. All rights reserved.";
    copyrightEl.style.marginTop = "0.5rem";
    copyrightEl.style.fontSize = "0.875rem";
    copyrightEl.style.fontFamily = "system-ui,sans-serif";

    divEl.appendChild(copyrightEl);

    // 푸터 네비게이션 생성
    const navEl = new Nav({ props: { type: "footer", ariaLabel: layoutData.footer.nav.ariaLabel, items: layoutData.footer.nav.items } }).el;
    footerContainerEl.append(divEl, navEl);

    // // 최종 반영
    this.el.appendChild(footerContainerEl);
    this.el.style.visibility = "hidden";

    setTimeout(() => {
      this.el.style.visibility = "visible";
    }, 100);
  }
}
