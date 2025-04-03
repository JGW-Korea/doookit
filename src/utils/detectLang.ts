const isProduction: boolean = location.hostname !== "localhost";
const supportedLangs = ["ko", "ja", "fr", "it", "es", "de", "zh", "hi"];

// 브라우저 언어 기반 리다이렉트 실행
function redirect(path: string, language: string) {
  const langCode = language.split("-")[0];

  if (!supportedLangs.includes(langCode)) {
    location.replace(`${path !== "" ? `/${path}` : "/"}`);
    return; // 포함되지 않는 서비스 언어일 경우 함수 종료
  }

  const redirectUrl = `/${langCode}${path !== "" ? `/${path}` : ""}`;

  // 이미 언어 경로로 접속한 경우면 리다이렉트 안 함
  if (!location.pathname.startsWith(`/${langCode}`)) {
    location.replace(redirectUrl);
  }
}

// 실제 배포 환경에서만 실행
if (isProduction) {
  const pathVariable: string = location.pathname.split("/").at(-1) || ""; // 경로를 가져옴
  const broswerLanguage: string = navigator.language; // 사용자 브라우저의 언어를 가져옴

  switch (pathVariable) {
    case "":
    case "calc":
    case "convert":
    case "bmi":
    case "timer":
    case "color-picker":
    case "px":
      redirect(pathVariable, broswerLanguage);
      break;
    default:
      console.log("404 Page");
  }
}
