/**
 *
 */
export abstract class Component<State extends ComponentDataType, Props extends ComponentDataType> {
  public el: HTMLElement;
  public state: State;
  public props: Props;
  private isRenderScheduled = false; // 렌더링 예약 여부 플래그

  constructor(public payload: { tagName: string; state?: State; props?: Props }) {
    const { tagName, state = {} as State, props = {} as Props } = payload;

    this.el = document.createElement(tagName || "div"); // 기본 요소(Element) 초기화
    this.state = this.makeReactive(state); // state 값 초기화
    this.props = props; // props 값 초기화
    this.render();
  }

  // 상태 객체를 Proxy로 감싸서 각 변경 시 자동으로 렌더링을 예약
  private makeReactive(state: State): State {
    return new Proxy(state, {
      set: (target, key, value) => {
        const typedKey = key as keyof State;

        // 값이 실제로 변경되었을 때만 업데이트합니다.
        if (target[typedKey] !== value) {
          target[typedKey] = value;
          this.scheduleRender();
        }
        return true;
      },
    });
  }

  // 렌더링 배치: requestAnimationFrame을 사용하여 한 프레임 내 여러 상태 변경을 하나의 렌더링으로 묶음
  private scheduleRender(): void {
    if (!this.isRenderScheduled) {
      this.isRenderScheduled = true;
      requestAnimationFrame(() => {
        this.render();
        this.isRenderScheduled = false;
      });
    }
  }

  // 외부에서 상태 업데이트 시, Proxy가 내부적으로 각 변경을 감지
  setState(newState: Partial<State>): void {
    Object.assign(this.state, newState);
  }

  abstract render(): void; // 자식 컴포넌트에서 재정의하여 실제 렌더링 로직을 구현
}

export interface ComponentDataType {
  [key: string]: unknown;
}
