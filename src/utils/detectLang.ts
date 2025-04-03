const isProduction: boolean = location.hostname !== "localhost";
const supportedLangs = ["ko", "ja", "fr", "it", "es", "de", "zh", "hi"];
const toolPaths = ["calc", "converter", "bmi", "timer", "color-picker", "px-converter"];

// 브라우저 언어에서 기본 언어 코드 추출
function getBrowserLang(): string {
  const langCode = navigator.language.split("-")[0];
  return supportedLangs.includes(langCode) ? langCode : "en";
}

// 언어 자동 리디렉션: /calc → /ko/tools/calc
function redirectToLocalizedTool(tool: string) {
  const lang = getBrowserLang();
  const redirectUrl = lang === "en" ? `/tools/${tool}` : `/${lang}/tools/${tool}`;
  location.replace(redirectUrl);
}

// /{lang}/{tool} → /{lang}/tools/{tool}
function redirectToLangTools(lang: string, tool: string) {
  location.replace(`/${lang}/tools/${tool}`);
}

// 404 페이지 이동
function redirectTo404() {
  if (location.pathname === "/404") return; // 무한 루프 방지
  location.replace("/404");
}

// ✅ 메인 실행
if (isProduction) {
  const browserLang = getBrowserLang();

  // 1. 루트 또는 index.html 접근 시 → /ko, /fr 등으로 이동
  if (location.pathname === "/" || location.pathname === "/index.html") {
    if (browserLang !== "en") {
      location.replace(`/${browserLang}`);
    }
  } else {
    const segments = location.pathname.split("/").filter(Boolean);
    const [first, second, third, ...rest] = segments;

    // 2. /calc → /ko/tools/calc
    if (toolPaths.includes(first)) {
      redirectToLocalizedTool(first);
    }

    // 3. /tools/calc → /ko/tools/calc
    else if (first === "tools" && toolPaths.includes(second)) {
      redirectToLocalizedTool(second);
    }

    // 4. /{lang}/tools/{tool} → 정상 경로 or /404
    else if (supportedLangs.includes(first) && second === "tools" && toolPaths.includes(third)) {
      if (rest.length > 0) {
        redirectTo404(); // ex: /ko/tools/calc/asd → 404
      }
      // else: 정상 경로 → 유지
    }

    // 5. /{lang}/{tool} → /{lang}/tools/{tool}
    else if (supportedLangs.includes(first) && toolPaths.includes(second)) {
      redirectToLangTools(first, second);
    }

    // ✅ 6. /{lang} 만 있는 경우 → 지역화 홈 → 유지
    else if (supportedLangs.includes(first) && !second) {
      // ex: /ko → /i18n/ko/index.html (정상 경로니까 유지)
    }

    // 7. /{lang}/tools → 도구 없음 → 404
    else if (supportedLangs.includes(first) && second === "tools" && !toolPaths.includes(third)) {
      redirectTo404();
    }

    // 8. /{lang}/{invalid} → 404
    else if (supportedLangs.includes(first) && second && !toolPaths.includes(second)) {
      redirectTo404();
    }

    // 9. 그 외 모두 404
    else {
      redirectTo404();
    }
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
