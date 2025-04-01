import { Component, ComponentDataType } from "../../utils/Component";

export default class Logo extends Component<ComponentDataType, ComponentDataType> {
  constructor() {
    super({
      tagName: "a",
    });
  }

  render(): void {
    this.el.setAttribute("href", "/");
    this.el.setAttribute("aria-label", "DoooKit 메인 페이지로 이동");

    const h1El = document.createElement("h1");

    const imgEl = document.createElement("img");
    const imgUrl = new URL("/public/asstes/images/favicon.png", import.meta.url);

    imgEl.src = imgUrl.href;
    imgEl.classList.add("favicon");
    imgEl.alt = "favicon";

    const spanEl = document.createElement("span");
    spanEl.textContent = "DoooKit";

    h1El.append(imgEl, spanEl);
    this.el.append(h1El);
  }
}
