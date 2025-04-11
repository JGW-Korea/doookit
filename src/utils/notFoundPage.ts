import { NotPoundPageDatas } from "../data/translations/404";
import { docType } from "./docType";

const data = NotPoundPageDatas[docType()];

// HTML lang 속성 지정
const html = document.querySelector("html");
if (html) {
  html.lang = data.lang;
}

// HEAD Title, Meta[name="description"] 정보 채우기
const { children: headChildren } = document.head;
for (const child of headChildren) {
  if (child.tagName === "TITLE") {
    child.textContent = data.head.title;
  }

  if (child instanceof HTMLMetaElement && child.name === "description") {
    child.content = data.head.description;
  }
}

// Body 내부 내용 채우기
const pEl = document.querySelector("p[role='alert']");
const aEl = document.querySelector("a[role='link']");

if (pEl && aEl) {
  pEl.textContent = data.head.description;

  aEl.ariaLabel = data.notFound.homeLink;
  aEl.textContent = data.notFound.homeLink;
}
