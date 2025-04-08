// import Swiper from "swiper";
// import { Mousewheel } from "swiper/modules";

import { Header, Footer, Calculator } from "../../components";

import "swiper/swiper-bundle.min.css";

document.body.insertAdjacentElement("afterbegin", new Header().el);
document.body.insertAdjacentElement("beforeend", new Footer().el);

// 계산기 컴포넌트 렌더링
const mainEl = document.querySelector("main");
if (mainEl) mainEl.appendChild(new Calculator().el);

// const modBtn = document.querySelector("div[role='group']");
// if (modBtn) {

// }

// Swiper.use([Mousewheel]);

// // Swiper Options 구성
// const swiper = new Swiper(".swiper", {
//   loop: false,
//   slidesPerView: 1,
//   direction: "horizontal",
//   allowTouchMove: true,
//   mousewheel: {
//     forceToAxis: true,
//   },
//   on: {
//     slideChange() {
//       if (!(swiperBtn instanceof HTMLElement)) return;

//       const buttons = swiperBtn.querySelectorAll("button");
//       buttons.forEach((btn) => {
//         const value = btn.dataset.value;
//         const isBasic = value === "basic" && swiper.activeIndex === 0;
//         const isEngineering = value === "engineering" && swiper.activeIndex === swiper.slides.length - 1;

//         btn.classList.toggle("active", isBasic || isEngineering);
//       });
//     },
//   },
// });

// // Switch 효과 구현
// const swiperBtn = swiper.el.querySelector(".swiper-btn");
// if (swiperBtn) {

// }
