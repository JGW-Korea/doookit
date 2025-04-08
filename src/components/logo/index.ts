import { Component, ComponentDataType } from "../../utils/Component";

interface LogoProps {
  [key: string]: unknown;
  type: "header" | "footer";
  ariaLabel: string;
}

export default class Logo extends Component<ComponentDataType, LogoProps> {
  constructor(payload: { props: LogoProps }) {
    super({
      tagName: "a",
      props: payload.props,
    });
  }

  render(): void {
    if (this.el instanceof HTMLAnchorElement) this.el.href = "/"; // 요소의 DOM 인터페이스 구조가 HTMLAnchorElement일 경우에 대한 타입 가드

    this.el.ariaLabel = this.props.ariaLabel;
    this.el.classList.add("logo");

    const titleSpanEl = document.createElement("span");

    // 이미지 용량 최적화를 위해 최신 포맷부터 순차적으로 적용되는 <picture> 요소 생성
    const pictureEl = document.createElement("picture");
    const imgAvifMimiUrl = new URL("/public/assets/images/favicon.avif", import.meta.url);
    const imgWebpMimiUrl = new URL("/public/assets/images/favicon.webp", import.meta.url);
    const imgPngMimiUrl = new URL("/public/assets/images/favicon.png", import.meta.url);

    // 각 이미지 포맷에 따라 적절한 HTML 요소(<source> 또는 <img>)를 생성하고 <picture> 요소에 추가
    // - 마지막 요소(PNG)는 fallback용 <img>로 삽입
    // - AVIF와 WebP는 <source>로 삽입하며, MIME 타입을 명시
    [imgAvifMimiUrl, imgWebpMimiUrl, imgPngMimiUrl].forEach((url, idx, arr) => {
      const imgEl: HTMLSourceElement | HTMLImageElement = idx !== arr.length - 1 ? document.createElement("source") : document.createElement("img");

      if (imgEl instanceof HTMLSourceElement) {
        imgEl.srcset = url.href;
        imgEl.type = url.pathname.endsWith("avif") ? "image/avif" : "image/webp";
      } else {
        imgEl.src = url.href;
        imgEl.width = this.props.type === "header" ? 32 : 24;
        imgEl.height = this.props.type === "header" ? 32 : 24;
        imgEl.alt = "favicon";
      }

      imgEl.classList.add("favicon");
      pictureEl.appendChild(imgEl);
    });

    const spanEl = document.createElement("span");
    spanEl.textContent = "DoooKit";
    titleSpanEl.append(pictureEl, spanEl);

    this.el.appendChild(titleSpanEl);
  }
}
