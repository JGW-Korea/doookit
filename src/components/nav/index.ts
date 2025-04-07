import { NavItem } from "../../types/layoutTranslations";
import { Component, ComponentDataType } from "../../utils/Component";

interface NavProps {
  [key: string]: unknown;
  type: "header" | "footer";
  ariaLabel: string;
  items: NavItem[];
}

export default class Nav extends Component<ComponentDataType, NavProps> {
  constructor(payload: { props: NavProps }) {
    super({
      tagName: "nav",
      props: payload.props,
    });
  }

  render(): void {
    const ulEl = document.createElement("ul");

    // 헤더(Header) 네비게이터 링크 표시
    if (this.props.type === "header") {
      this.props.items.forEach((item, idx) => {
        const liEl = document.createElement("li");
        const aEl = document.createElement("a");

        if (idx === 0) aEl.href = "#tools";
        if (idx === 1) aEl.href = "#about";
        aEl.textContent = item.text;

        liEl.ariaLabel = item.ariaLabel;
        liEl.appendChild(aEl);
        ulEl.appendChild(liEl);
      });
    }

    this.el.ariaLabel = this.props.ariaLabel;
    this.el.appendChild(ulEl);
  }
}
