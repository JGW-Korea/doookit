const isProduction = location.hostname !== "localhost";
// 지원하는 총 9개 언어 (en 포함)
const supportedLangs = ["en", "ko", "ja", "fr", "it", "es", "de", "zh", "hi"];
const toolPaths = ["calc", "converter", "bmi", "timer", "color-picker", "px-converter"];

// 브라우저 언어로부터 기본 언어 코드 추출 (지원 목록에 없으면 en 사용)
function getBrowserLang(): string {
  const langCode = navigator.language.split("-")[0];
  return supportedLangs.includes(langCode) ? langCode : "en";
}

function redirectTo(url: string) {
  location.replace(url);
}

function redirectTo404() {
  // 무한 루프 방지를 위해 현재가 이미 /404라면 처리하지 않음
  if (location.pathname !== "/404") {
    redirectTo("/404");
  }
}

if (!isProduction) {
  const browserLang = getBrowserLang();
  const path = location.pathname;
  const segments = path.split("/").filter(Boolean);

  console.log(segments);

  // ─── 1. 메인 페이지 ("/") ─────────────────────────────────────
  if (segments.length === 0) {
    console.log("Hello");

    // 영어 사용자는 "/" 그대로, 그 외 언어라면 언어별 루트로 이동
    if (browserLang === "en") {
      // 아무것도 하지 않음
    } else {
      redirectTo(`/${browserLang}`);
    }
  }
  // ─── 2. 단일 세그먼트 (예: "/calc" 또는 "/ko") ───────────────────
  else if (segments.length === 1) {
    const [first] = segments;

    // 만약 사용자가 언어 코드(예: "/hi")로 접근한 경우:
    if (supportedLangs.includes(first)) {
      // 브라우저 언어와 일치하지 않으면 강제 리디렉션
      if (first !== browserLang) {
        // 브라우저 언어가 en이면 영어 루트는 "/" 입니다.
        if (browserLang === "en") {
          redirectTo("/");
        } else {
          redirectTo(`/${browserLang}`);
        }
      } else {
        // 일치하는 경우에도, 영어의 경우 "/"가 올바른 루트입니다.
        if (browserLang === "en") {
          redirectTo("/");
        }
        // 일치하는 비영어 언어라면 아무것도 하지 않음 (올바른 언어 루트)
      }
    }
    // 예: 도구 이름만 입력된 경우 ("/calc" 등)
    else if (toolPaths.includes(first)) {
      if (browserLang === "en") {
        redirectTo(`/tools/${first}`);
      } else {
        redirectTo(`/${browserLang}/tools/${first}`);
      }
    } else {
      redirectTo404();
    }
  }
  // ─── 3. 두 세그먼트 (예: "/tools/calc" 또는 "/ko/calc") ──────────────
  else if (segments.length === 2) {
    const [first, second] = segments;

    // 패턴: /tools/{tool} (영어 기본 경로)
    if (first === "tools" && toolPaths.includes(second)) {
      if (browserLang !== "en") {
        // 영어가 아닌 사용자는 언어별 경로로 이동
        redirectTo(`/${browserLang}/tools/${second}`);
      }
      // 영어 사용자는 그대로 유지
    }
    // 패턴: /{lang}/{tool} (언어 코드가 포함됐지만 tools 누락)
    else if (supportedLangs.includes(first) && toolPaths.includes(second)) {
      if (first === "en") {
        // 영어의 경우 올바른 경로는 /tools/{tool}
        redirectTo(`/tools/${second}`);
      } else {
        redirectTo(`/${first}/tools/${second}`);
      }
    } else {
      redirectTo404();
    }
  }
  // ─── 4. 세 세그먼트 (예: "/ko/tools/calc" 또는 "/en/tools/calc") ──────
  else if (segments.length === 3) {
    const [first, second, third] = segments;
    // 올바른 패턴은: {lang}/tools/{tool}
    if (!supportedLangs.includes(first) || second !== "tools" || !toolPaths.includes(third)) {
      redirectTo404();
    } else {
      // 영어의 경우 올바른 경로는 "/tools/{tool}" (즉, "/en/tools/xxx"은 잘못된 경로)
      if (first === "en") {
        redirectTo(`/tools/${third}`);
      }
      // 그 외 언어는 그대로 유효
    }
  }
  // ─── 5. 그 외: 유효하지 않은 경로 ──────────────────────────────────────
  else {
    redirectTo404();
  }
}
