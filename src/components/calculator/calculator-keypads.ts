import { CalculatorKeypadGroup, CalculatorMobileKeypads } from "../../types/calculatorTranslations";
import { Component, ComponentDataType } from "../../utils/Component";
import { handleKeypadClick } from "../../utils/keypads/calculatorExpressionHandlers";
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
  resultState: string;
  justEvaluatedState: boolean;
  setModeState: (mode: string) => void;
  setSlideState: (slide: string) => void;
  setExpressionState: (expresion: string) => void;
  setInvState: (inv: boolean) => void;
  setLastExpressionState: (lastExpression: string) => void;
  setResultState: (result: string) => void;
  setJustEvaluated: (justEvaluated: boolean) => void;
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
            justEvaluatedState: this.props.justEvaluatedState,
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
                justEvaluatedState: this.props.justEvaluatedState,
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
      handleKeypadClick(e, {
        expressionState: this.props.expressionState,
        resultState: this.props.resultState,
        justEvaluatedState: this.props.justEvaluatedState,
        setExpressionState: this.props.setExpressionState,
        setResultState: this.props.setResultState,
        setLastExpressionState: this.props.setLastExpressionState,
        setJustEvaluated: this.props.setJustEvaluated,
      });
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
