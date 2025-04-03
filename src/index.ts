import { Header, Footer } from "./components/index";

document.body.insertAdjacentElement("afterbegin", new Header().el);
document.body.insertAdjacentElement("beforeend", new Footer().el);
