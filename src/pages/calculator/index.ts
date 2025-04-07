import Swiper from "swiper";
import { Mousewheel } from "swiper/modules";

import { Header } from "../../components";

import "swiper/swiper-bundle.min.css";

// import { Header, Footer, Calculator } from "../../components";

document.body.insertAdjacentElement("afterbegin", new Header().el);
// document.body.insertAdjacentElement("beforeend", new Footer().el);

// new Calculator();

Swiper.use([Mousewheel]);

// Swiper Options 구성
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

// Switch 효과 구현
const swiperBtn = swiper.el.querySelector(".swiper-btn");
if (swiperBtn) {
  swiperBtn.addEventListener("click", (event: Event) => {
    if (!(event.target instanceof HTMLElement)) return;

    const clickedValue = event.target.dataset.value;
    if (!clickedValue) return;

    if (clickedValue === "basic" && swiper.activeIndex === 0) swiper.slideTo(swiper.slides.length - 1);
    else if (clickedValue === "basic" && swiper.activeIndex === swiper.slides.length - 1) swiper.slideTo(0);
    else if (clickedValue === "engineering" && swiper.activeIndex === swiper.slides.length - 1) swiper.slideTo(0);
    else swiper.slideTo(swiper.slides.length - 1);
  });
}
