const isProduction: boolean = location.hostname !== "localhost";
const supportedLangs = ["ko", "ja", "fr", "it", "es", "de", "zh", "hi"];
const toolPaths = ["calc", "converter", "bmi", "timer", "color-picker", "px-converter"];

// 브라우저 언어에서 기본 언어 코드 추출
function getBrowserLang(): string {
  const langCode = navigator.language.split("-")[0];
  return supportedLangs.includes(langCode) ? langCode : "en";
}

// 언어 기반 도구 경로 리디렉션
function redirectToLocalizedTool(tool: string, lang: string) {
  const url = lang === "en" ? `/tools/${tool}` : `/${lang}/tools/${tool}`;
  location.replace(url);
}

// 도구명 포함한 언어 경로 리디렉션
function redirectToLangTools(lang: string, tool: string) {
  location.replace(`/${lang}/tools/${tool}`);
}

// 404 페이지 이동
function redirectTo404() {
  if (location.pathname === "/404") return; // 무한 루프 방지
  location.replace("/404");
}

// ✅ 메인 실행
if (!isProduction) {
  const lang = getBrowserLang();
  const path = location.pathname;
  const segments = path.split("/").filter(Boolean);
  const [first, second, third, ...rest] = segments;

  // ✅ 무조건 브라우저 언어 기준으로 덮어씌우기
  // 1. 브라우저 언어와 맞지 않으면 리디렉션
  if (lang !== "en" && (!first || first !== lang)) {
    // 도구 경로가 있는 경우
    if (toolPaths.includes(first)) {
      redirectToLocalizedTool(first, lang);
    }

    // /tools/calc → /{lang}/tools/calc
    if (first === "tools" && toolPaths.includes(second)) {
      redirectToLocalizedTool(second, lang);
    }

    // /en, /fr, /it 등 언어 루트만 있을 경우
    if (supportedLangs.includes(first) && !second) {
      location.replace(`/${lang}`);
    }

    // /{lang}/{tool} → /{lang}/tools/{tool}
    if (supportedLangs.includes(first) && toolPaths.includes(second)) {
      redirectToLangTools(lang, second);
    }

    // 나머지도 전부 강제 리디렉션
    location.replace(`/${lang}`);
  }

  // ✅ 이제 브라우저 언어와 일치하는 상태에서 → 경로 검사
  // ex: /ko/tools/calc/asd → 404
  if (supportedLangs.includes(first) && second === "tools" && toolPaths.includes(third)) {
    if (rest.length > 0) {
      redirectTo404();
    }
  }

  // /{lang}/tools → 도구 없음 → 404
  if (supportedLangs.includes(first) && second === "tools" && !toolPaths.includes(third)) {
    redirectTo404();
  }

  // /{lang}/{invalid} → 404
  if (supportedLangs.includes(first) && second && !toolPaths.includes(second)) {
    redirectTo404();
  }
}

// const isProduction: boolean = location.hostname !== "localhost";
// const supportedLangs = ["ko", "ja", "fr", "it", "es", "de", "zh", "hi"];

// // 브라우저 언어 기반 리다이렉트 실행
// function redirect(path: string, language: string) {
//   const langCode = language.split("-")[0];

//   if (!supportedLangs.includes(langCode)) {
//     location.replace(`${path !== "" ? `/${path}` : "/"}`);
//     return; // 포함되지 않는 서비스 언어일 경우 함수 종료
//   }

//   const redirectUrl = `/${langCode}${path !== "" ? `/${path}` : ""}`;

//   // 이미 언어 경로로 접속한 경우면 리다이렉트 안 함
//   if (!location.pathname.startsWith(`/${langCode}`)) {
//     location.replace(redirectUrl);
//   }
// }

// // 실제 배포 환경에서만 실행
// if (isProduction) {
//   const pathVariable: string = location.pathname.split("/").at(-1) || ""; // 경로를 가져옴
//   const broswerLanguage: string = navigator.language; // 사용자 브라우저의 언어를 가져옴

//   switch (pathVariable) {
//     case "":
//     case "calc":
//     case "convert":
//     case "bmi":
//     case "timer":
//     case "color-picker":
//     case "px":
//       redirect(pathVariable, broswerLanguage);
//       break;
//     default:
//       console.log("404 Page");
//   }
// }
