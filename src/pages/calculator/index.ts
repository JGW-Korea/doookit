import { Header, Footer, Calculator } from "../../components";
import "swiper/swiper-bundle.min.css";

document.body.insertAdjacentElement("afterbegin", new Header().el);
document.body.insertAdjacentElement("beforeend", new Footer().el);

// 계산기 컴포넌트 렌더링
const mainEl = document.querySelector("main");
if (mainEl) mainEl.appendChild(new Calculator().el);
