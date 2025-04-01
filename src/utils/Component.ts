/**
 *
 */
export default abstract class Component<State extends ComponentDataType, Props extends ComponentDataType> {
  public el: HTMLElement;
  public state: State;
  public props: Props;

  constructor(public payload: { tagName: string; state?: State; props?: Props }) {
    const { tagName, state = {} as State, props = {} as Props } = payload;

    this.el = document.createElement(tagName || ""); // 기본 요소(Element) 초기화
    this.state = state; // state 값 초기화
    this.props = props; // props 값 초기화
  }

  // 상태 값을 변경하고 리렌더링을 발생하는 메서드
  setState(newState: ComponentDataType): void {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  abstract render(): void; // 자식 컴포넌트에서 오버라이딩하여 렌더링 로직 작성
}

interface ComponentDataType {
  [key: string]: unknown;
}
