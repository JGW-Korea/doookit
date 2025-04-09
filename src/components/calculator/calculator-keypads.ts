import { CalculatorKeypadGroup, CalculatorMobileKeypads } from "../../types/calculatorTranslations";
import { Component, ComponentDataType } from "../../utils/Component";
import Fieldset from "./fieldset";

interface CalculatorKeypadsProps {
  [key: string]: unknown;
  type: boolean;
  ariaLabel: string;
  groups: CalculatorKeypadGroup[];
  mobile?: CalculatorMobileKeypads;
  modeState: string;
  slideState: string;
  expressionState: string;
  invState: boolean;
  setModeState: (mode: string) => void;
  setSlideState: (slide: string) => void;
  setExpressionState: (expresion: string) => void;
  setInvState: (inv: boolean) => void;
}

export default class CalculatorKeypads extends Component<ComponentDataType, CalculatorKeypadsProps> {
  constructor(payload: { props: CalculatorKeypadsProps }) {
    super({
      tagName: "section",
      props: payload.props,
    });
  }

  render() {
    // 계산기 키패드 기본값 설정
    this.el.classList.add("calculator-keypads");
    this.el.role = "group";
    this.el.ariaLabel = this.props.ariaLabel;

    // Viewport > 768px 환경 계산기 키패드 컴포넌트 구성
    if (!this.props.type) {
      // 데스크탑 환경: 각 그룹마다 필드셋 생성
      this.props.groups.forEach((group) => {
        const fieldsetEl = new Fieldset({
          props: {
            group: group,
            modeState: this.props.modeState,
            setModeState: this.props.setModeState,
            invState: this.props.invState,
            setInvState: this.props.setInvState,
            expressionState: this.props.expressionState,
          },
        });
        this.el.appendChild(fieldsetEl.el);
      });
    }

    // Viewport <= 768px 환경 계산기 키패드 컴포넌트 구성
    else {
      const mobileKeypads = this.props.mobile!;

      const swiperEl = document.createElement("div");
      swiperEl.classList.add("swiper");
      const swiperWrapperEl = document.createElement("div");
      swiperWrapperEl.classList.add("swiper-wrapper");

      // 슬라이드 영역 요소 생성
      Object.keys(mobileKeypads).forEach((key) => {
        if (key === "basic" || key === "engineering") {
          const swiperSlide = document.createElement("div");
          swiperSlide.classList.add("swiper-slide");
          swiperSlide.ariaLabel = mobileKeypads[key].label;
          mobileKeypads[key].groups.forEach((group) => {
            const fieldsetEl = new Fieldset({
              props: {
                group: group,
                modeState: this.props.modeState,
                setModeState: this.props.setModeState,
                invState: this.props.invState,
                setInvState: this.props.setInvState,
                expressionState: this.props.expressionState,
              },
            });
            swiperSlide.appendChild(fieldsetEl.el);
          });
          swiperWrapperEl.appendChild(swiperSlide);
        }
      });

      // 슬라이드 전환 토글 버튼 생성
      const swiperBtn = document.createElement("div");
      swiperBtn.classList.add("swiper-btn");
      swiperBtn.role = "tablist";
      swiperBtn.ariaLabel = mobileKeypads.tabs.ariaLabel;
      Object.keys(mobileKeypads.tabs).forEach((key) => {
        if (key === "basic" || key === "engineering") {
          const buttonEl = document.createElement("button");
          buttonEl.role = "tab";
          buttonEl.dataset.value = key;
          buttonEl.textContent = mobileKeypads.tabs[key];
          if (this.props.slideState === key) {
            buttonEl.ariaSelected = "true";
            buttonEl.classList.add("active");
          } else {
            buttonEl.ariaSelected = "false";
          }
          swiperBtn.appendChild(buttonEl);
        }
      });

      swiperEl.append(swiperWrapperEl, swiperBtn);
      this.el.appendChild(swiperEl);

      // Swiper 슬라이더 초기화
      this.initSwiper(swiperBtn, this.props.slideState, this.props.setSlideState);
    }

    // 키패드 버튼 클릭 이벤트 핸들러 등록
    this.el.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const buttonEl = target.closest("button");

      // 버튼 요소일 경우에만 해당
      if (buttonEl) {
        const value = buttonEl.dataset.value;
        if (!value) return;

        let current = this.props.expressionState === "init" ? "" : this.props.expressionState;

        if (buttonEl.id === "clear-toggle") {
          // 전체 초기화
          if (value === "AC") {
            this.props.setExpressionState("init");
            return;
          }

          // 마지막 항목 제거
          if (value === "CE") {
            let next = current.trimEnd();

            // 마지막이 공백 + 연산자면 한꺼번에 제거 (예: "123 +")
            if (/ [+\-×÷]$/.test(next)) {
              next = next.slice(0, -2); // 연산자 포함 공백 제거
            } else {
              next = next.slice(0, -1); // 일반 문자 한 글자 삭제
            }

            this.props.setExpressionState(next.length ? next : "init");
            return;
          }
        }

        // 일반 상태 정규표현식 등록(연산자, 숫자, 소수점)
        const isOperator = /[+\-×÷]/.test(value);
        const isDot = value === ".";
        const isNumber = /^[0-9]$/.test(value);

        // 표현식의 마지막 값이 연산자일 경우
        const lastChar = current[current.length - 1];
        const isLastCharOperator = /[+\-×÷]/.test(lastChar);
        const isStartingNegative = current === "-";

        // 초기 상태 예외 처리
        if (this.props.expressionState === "init") {
          // 초기 상태에서 소수점 눌렀을 경우
          if (isDot) {
            this.props.setExpressionState(".");
            return;
          }

          // 초기 상태에서 연산자 눌렀을 경우
          if (isOperator) {
            if (value === "-") {
              this.props.setExpressionState("-");
            } else {
              this.props.setExpressionState("0 " + value);
            }

            return;
          }

          // 초기 상태에서 숫자 눌렀을 경우
          this.props.setExpressionState(value);
          return;
        }

        // 소수점 중복 방지
        if (isDot) {
          const tokens = current.split(" ");
          const lastToken = tokens[tokens.length - 1];
          if (lastToken.includes(".")) return;
        }

        // 연산자 교체 (단, "-"만 단독으로 있는 경우는 제외)
        if (isOperator && isLastCharOperator && !isStartingNegative) {
          this.props.setExpressionState(current.slice(0, -1) + value);
          return;
        }

        // ✅ 숫자 입력 시 0 자동 제거
        if (isNumber) {
          const tokens = current.trim().split(" ");
          const lastToken = tokens[tokens.length - 1];

          // 예: "0" -> "8" → "8"
          if (lastToken === "0" && value !== "0") {
            tokens[tokens.length - 1] = value;
            this.props.setExpressionState(tokens.join(" "));
            return;
          }
        }

        let nextExpression = "";

        if (isOperator) {
          nextExpression = current + " " + value;
        } else {
          if (isStartingNegative) {
            nextExpression = "-" + value;
          } else if (isLastCharOperator) {
            nextExpression = current + " " + value;
          } else {
            nextExpression = current + value;
          }
        }

        this.props.setExpressionState(nextExpression);
      }
    });
  }

  // 모바일 키패드 슬라이드 설정
  initSwiper(swiperBtn: HTMLDivElement, slideState: string, setSlideState: (v: string) => void) {
    import("swiper").then(({ default: Swiper }) => {
      import("swiper/modules").then(({ Mousewheel }) => {
        Swiper.use([Mousewheel]);

        const swiper = new Swiper(".swiper", {
          loop: false,
          slidesPerView: 1,
          direction: "horizontal",
          allowTouchMove: true,
          mousewheel: { forceToAxis: true },
          initialSlide: slideState === "basic" ? 0 : 1,
        });

        swiper.on("slideChange", () => {
          const { activeIndex } = swiper;
          const newSlide = activeIndex === 0 ? "basic" : "engineering";

          // 버튼 UI만 즉시 반영
          const buttons = swiperBtn.querySelectorAll("button");
          buttons.forEach((btn) => {
            const isActive = btn.dataset.value === newSlide;
            btn.classList.toggle("active", isActive);
            btn.ariaSelected = isActive.toString();
          });
        });

        // 상태 변경은 전환 완료 후
        swiper.on("slideChangeTransitionEnd", () => {
          const { activeIndex } = swiper;
          const newSlide = activeIndex === 0 ? "basic" : "engineering";

          if (newSlide !== slideState) {
            setSlideState(newSlide); // 이건 여전히 애니메이션 후
          }
        });

        swiperBtn.addEventListener("click", () => {
          const currentIndex = swiper.activeIndex;
          const newIndex = currentIndex === 0 ? 1 : 0;

          swiper.slideTo(newIndex); // 상태는 slideChange에서 처리됨
        });
      });
    });
  }
}
