import { CalculatorKeypadGroup, CalculatorMobileKeypads } from "../../types/calculatorTranslations";
import { Component, ComponentDataType } from "../../utils/Component";
import Fieldset from "./fieldset";

interface CalculatorKeypadsProps {
  [key: string]: unknown;
  type: boolean;
  ariaLabel: string;
  groups: CalculatorKeypadGroup[];
  mobile?: CalculatorMobileKeypads;
}

export default class CalculatorKeypads extends Component<ComponentDataType, CalculatorKeypadsProps> {
  constructor(payload: { props: CalculatorKeypadsProps }) {
    super({
      tagName: "section",
      props: {
        type: payload.props.type,
        ariaLabel: payload.props.ariaLabel,
        groups: payload.props.groups,
        mobile: payload.props.mobile,
      },
    });
  }

  render() {
    // 계산기 키패드 기본값 설정
    this.el.classList.add("calculator-keypads");
    this.el.role = "group";
    this.el.ariaLabel = this.props.ariaLabel;

    // console.log(this.props.groups);
    console.log(this.props.mobile);

    // Viewport > 768px (데스크탑, 노트북, 태블릿)
    if (!this.props.mobile) {
      this.props.groups.forEach((group) => {
        const fieldsetEl = new Fieldset({ props: { group: group } });
        this.el.appendChild(fieldsetEl.el);
      });
    }

    // Viewport <= 768px (모바일)
    else {
      const mobileKeypads = this.props.mobile!;

      const swiperEl = document.createElement("div");
      swiperEl.classList.add("swiper");
      const swiperWrapperEl = document.createElement("div");
      swiperWrapperEl.classList.add("swiper-wrapper");

      // Swiper 슬라이드 설정
      Object.keys(this.props.mobile).forEach((key) => {
        if (key === "basic" || key === "engineering") {
          const swiperSlide = document.createElement("div");
          swiperSlide.classList.add("swiper-slide");
          swiperSlide.ariaLabel = mobileKeypads[key].label;

          mobileKeypads[key].groups.forEach((group) => {
            const fieldsetEl = new Fieldset({ props: { group: group } });
            swiperSlide.appendChild(fieldsetEl.el);
          });

          swiperWrapperEl.appendChild(swiperSlide);
        }
      });

      // 슬라이드 전환 버튼 설정
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

          if (key === "basic") {
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
      this.initSwiper(swiperBtn);
    }
  }

  // 모바일 키패드 슬라이드 설정
  initSwiper(swiperBtn: HTMLDivElement) {
    // 동적 ESM 사용법
    import("swiper").then(({ default: Swiper }) => {
      import("swiper/modules").then(({ Mousewheel }) => {
        Swiper.use([Mousewheel]);

        const swiper = new Swiper(".swiper", {
          loop: false,
          slidesPerView: 1,
          direction: "horizontal",
          allowTouchMove: true,
          mousewheel: {
            forceToAxis: true,
          },
          on: {
            slideChange() {
              if (!(swiperBtn instanceof HTMLElement)) return;

              const buttons = swiperBtn.querySelectorAll("button");
              buttons.forEach((btn) => {
                const value = btn.dataset.value;
                const isBasic = value === "basic" && swiper.activeIndex === 0;
                const isEngineering = value === "engineering" && swiper.activeIndex === swiper.slides.length - 1;

                btn.classList.toggle("active", isBasic || isEngineering);
              });
            },
          },
        });

        swiperBtn.addEventListener("click", (event: Event) => {
          if (!(event.target instanceof HTMLElement)) return;

          const clickedValue = event.target.dataset.value;
          if (!clickedValue) return;

          if (clickedValue === "basic" && swiper.activeIndex === 0) swiper.slideTo(swiper.slides.length - 1);
          else if (clickedValue === "basic" && swiper.activeIndex === swiper.slides.length - 1) swiper.slideTo(0);
          else if (clickedValue === "engineering" && swiper.activeIndex === swiper.slides.length - 1) swiper.slideTo(0);
          else swiper.slideTo(swiper.slides.length - 1);
        });
      });
    });
  }
}
