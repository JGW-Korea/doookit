import { Component, ComponentDataType } from "../../utils/Component";

export default class Logo extends Component<ComponentDataType, ComponentDataType> {
  constructor() {
    super({
      tagName: "a",
      // props: { ...payload.props },
    });
  }

  render(): void {
    this.el.setAttribute("href", "/");
    this.el.setAttribute("aria-label", "DoooKit 메인 페이지로 이동");

    const h1El = document.createElement("h1");
    const pictureEl = document.createElement("picture");

    const imgAvifMimiUrl = new URL("/public/assets/images/favicon.avif", import.meta.url);
    const imgWebpMimiUrl = new URL("/public/assets/images/favicon.webp", import.meta.url);
    const imgPngMimiUrl = new URL("/public/assets/images/favicon.png", import.meta.url);

    [imgAvifMimiUrl, imgWebpMimiUrl, imgPngMimiUrl].forEach((url, idx, arr) => {
      const imgEl: HTMLSourceElement | HTMLImageElement =
        idx !== arr.length - 1 ? document.createElement("source") : document.createElement("img");

      if (imgEl instanceof HTMLSourceElement) {
        imgEl.srcset = url.href;
        imgEl.type = url.pathname.endsWith("avif") ? "image/avif" : "image/webp";
      } else {
        // 새로 만든 img 요소가 HTMLSourceElement가 아닌 HTMLImageElement 인터페이스일 경우
        imgEl.src = url.href; // 이미지 주소 삽입
        imgEl.width = 32;
        imgEl.height = 32;
        imgEl.alt = "favicon";
      }

      imgEl.classList.add("favicon"); // 이미지 클래스 삽입
      pictureEl.appendChild(imgEl);
    });

    const spanEl = document.createElement("span");
    spanEl.textContent = "DoooKit";

    h1El.append(pictureEl, spanEl);
    this.el.append(h1El);
  }
}
