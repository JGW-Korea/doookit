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

    const svgURL = new URL("../../assets/icons/logo-text.svg", import.meta.url).href;

    fetch(svgURL)
      .then((res) => res.text())
      .then((svgText) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const svgEl = doc.documentElement;

        svgEl.ariaHidden = "true";
        this.el.appendChild(svgEl);
      });
  }
}
