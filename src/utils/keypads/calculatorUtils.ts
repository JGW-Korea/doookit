export const isOperator = (value: string): boolean => /[+\-\u00d7\u00f7]/.test(value); // 연산자 판별 정규 표현식
export const isNumber = (value: string): boolean => /[0-9]$/.test(value); // 0-9 범위 내의 숫자 판별 정규 표현식
export const isDot = (value: string): boolean => value === "."; // 소수점 판별 정규 표현식

export const isPercentage = (value: string): boolean => value === "%";
export const isFactorial = (value: string): boolean => value === "x!";

export const isOpenBracket = (value: string): boolean => value === "(";
export const isCloseBracket = (value: string): boolean => value === ")";

export const isTrigFunction = (value: string): boolean => ["sin", "cos", "tan"].includes(value);
export const isLogOrSqrt = (value: string): boolean => ["ln", "log", "√"].includes(value);

export const isConstant = (value: string): boolean => value === "π" || value === "e";

export const isExp = (value: string): boolean => value === "EXP";
export const isNagativeSign = (value: string): boolean => value === "-";

// 표현식 마지막 값 반환
export const getLastToken = (expression: string): string => {
  const tokens = expression.trim().split(" ");
  return tokens[tokens.length - 1] || "";
};

export const replaceConstants = (expression: string): string => expression.replace(/\bpi\b/g, "π").replace(/\bEXP\b/g, "×10^");

// 소수점 중복 방지
export const canAddDot = (expression: string): boolean => {
  return !getLastToken(expression).includes(".");
};
