const isProduction: boolean = location.hostname !== "localhost";

// 사용자 언어에 맞는 주소로 리다이렉트
function redirect(path: string, language: string) {
  const startLanguage = "/" + language.split("-")[0];
  location.replace(startLanguage + path);
}

// 실제 배포 환경일 경우
if (isProduction) {
  const pathVariable = location.pathname; // 경로를 가져옴
  const broswerLanguage = navigator.language; // 사용자 브라우저의 언어를 가져옴

  // 언어에 따른 리다이렉션
  switch (pathVariable) {
    case "/":
      redirect(pathVariable, broswerLanguage);
      break;
  }
}
