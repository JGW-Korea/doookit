import { evaluate } from "mathjs";

// 표현식 계산 유틸 예외 처리
export const calculatorExpression = (expression: string): string | null => {
  // 표현식 마지막이 연산자로 끝나는 경우 -> 표현식 그대로 유지
  if (/[\+\-\u00d7\u00f7]$/.test(expression.trim())) {
    return null;
  }

  try {
    const parsed = expression.replace(/×/g, "*").replace(/÷/g, "/"); // ×, ÷ -> math.js가 이해할 수 있는 문자로 수정
    const result = evaluate(parsed);

    // 결과 값이 NaN일 경우
    if (Number.isNaN(result)) {
      return "Error";
    }

    // 표현식 결과 반환
    return String(result);
  } catch {
    return "Error";
  }
};
