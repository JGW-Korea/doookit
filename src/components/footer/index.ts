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

    const copyrightEl = document.createElement("p"); // 저작권 문구
    copyrightEl.textContent = "\u00A9 2025 DoooKit. All righs reserved.";

    const layoutData = LayoutDatas[docType()];
    divEl.append(new Logo({ props: { type: "footer", ariaLabel: layoutData.logo.link.ariaLabel } }).el, copyrightEl);

    // 푸터 컨테이너에 (로고 및 저작권) + (네비게이션) 추가
    footerContainerEl.append(
      divEl,
      new Nav({ props: { type: "footer", ariaLabel: layoutData.footer.nav.ariaLabel, items: layoutData.footer.nav.items } }).el,
    );

    // 최종 반영
    this.el.appendChild(footerContainerEl);
  }
}
