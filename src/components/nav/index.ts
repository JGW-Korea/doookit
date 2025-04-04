import { Component, ComponentDataType } from "../../utils/Component";

export default class Nav extends Component<ComponentDataType, ComponentDataType> {
  constructor(payload: { props: ComponentDataType }) {
    super({
      tagName: "nav",
      props: payload.props,
    });
  }

  render(): void {
    const ulEl = document.createElement("ul");

    if (this.props.type === "header") {
      this.props.items.forEach((item, idx) => {
        const liEl = document.createElement("li");
        const aEl = document.createElement("a");

        if (idx === 0) aEl.href = "#tools";
        else aEl.href = "#about";
        aEl.textContent = item;

        liEl.appendChild(aEl);
        ulEl.appendChild(liEl);
      });
    }

    this.el.ariaLabel = this.props.ariaLabel;
    this.el.appendChild(ulEl);

    // this.props.forEach((prop) => {
    //   console.log(prop);

    //   // aEl.textContent = prop;
    //   // console.log(aEl);
    // });
  }
}
