// SVG 파일을 문자열 모듈로 인식
declare module "*.svg" {
  const content: string;
  export default content;
}
