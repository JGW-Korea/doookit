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
  expression: string;
  setModeState: (mode: string) => void;
  setSlideState: (slide: string) => void;
  setExpressionState: (expresion: string) => void;
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
          props: { group: group, modeState: this.props.modeState, setModeState: this.props.setModeState },
        });
        this.el.appendChild(fieldsetEl.el);
      });
    }

    // Viewport <= 768px 환경 계산기 키패드 컴포넌트 구성
    else {
      console.log("mobile");
      console.log("!");
      // console.log("Mobile");
      // const mobileKeypads = this.props.mobile!;
      // const swiperEl = document.createElement("div");
      // swiperEl.classList.add("swiper");
      // const swiperWrapperEl = document.createElement("div");
      // swiperWrapperEl.classList.add("swiper-wrapper");
      // // 슬라이드 영역 요소 생성
      // Object.keys(mobileKeypads).forEach((key) => {
      //   if (key === "basic" || key === "engineering") {
      //     const swiperSlide = document.createElement("div");
      //     swiperSlide.classList.add("swiper-slide");
      //     swiperSlide.ariaLabel = mobileKeypads[key].label;
      //     mobileKeypads[key].groups.forEach((group) => {
      //       const fieldsetEl = new Fieldset({
      //         props: { group: group, modeState: this.props.modeState, setModeState: this.props.setModeState },
      //       });
      //       swiperSlide.appendChild(fieldsetEl.el);
      //     });
      //     swiperWrapperEl.appendChild(swiperSlide);
      //   }
      // });
      // // 슬라이드 전환 토글 버튼 생성
      // const swiperBtn = document.createElement("div");
      // swiperBtn.classList.add("swiper-btn");
      // swiperBtn.role = "tablist";
      // swiperBtn.ariaLabel = mobileKeypads.tabs.ariaLabel;
      // Object.keys(mobileKeypads.tabs).forEach((key) => {
      //   if (key === "basic" || key === "engineering") {
      //     const buttonEl = document.createElement("button");
      //     buttonEl.role = "tab";
      //     buttonEl.dataset.value = key;
      //     buttonEl.textContent = mobileKeypads.tabs[key];
      //     if (this.props.slideState === key) {
      //       buttonEl.ariaSelected = "true";
      //       buttonEl.classList.add("active");
      //     } else {
      //       buttonEl.ariaSelected = "false";
      //     }
      //     swiperBtn.appendChild(buttonEl);
      //   }
      // });
      // swiperEl.append(swiperWrapperEl, swiperBtn);
      // this.el.appendChild(swiperEl);
      // // 키패드의 버튼을 클릭했을 경우
      // this.el.addEventListener("click", (event) => {
      //   const button = event.target as HTMLElement;
      //   if (button.tagName === "BUTTON" && button.role !== "tab") {
      //     const { dataset } = button;
      //     if (!dataset.value) return;
      //     if (this.props.expression === "init") {
      //       this.props.setExpressionState(dataset.value);
      //     } else {
      //       this.props.setExpressionState(this.props.expression + dataset.value);
      //     }
      //   }
      // });
      // this.initSwiper(swiperBtn, this.props.slideState, this.props.setSlideState);
    }
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
