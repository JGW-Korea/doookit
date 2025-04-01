import { Component, ComponentDataType } from "../../utils/Component";
import Logo from "../logo";

export default class Header extends Component<ComponentDataType, ComponentDataType> {
  constructor() {
    super({
      tagName: "header",
    });
  }

  render(): void {
    this.el.appendChild(new Logo().el);

    const navEl = document.createElement("nav");
    navEl.setAttribute("aria-label", "메인 메뉴");
    const ulEl = document.createElement("ul");
    ["Tools", "About"].forEach((title, idx) => {
      const liEl = document.createElement("li");
      const anchorEl = document.createElement("a");
      anchorEl.textContent = title;
      if (idx === 0) anchorEl.href = "#tools";
      if (idx === 1) anchorEl.href = "#about";
      liEl.appendChild(anchorEl);
      ulEl.appendChild(liEl);
    });

    navEl.appendChild(ulEl);
    this.el.appendChild(navEl);
  }
}
