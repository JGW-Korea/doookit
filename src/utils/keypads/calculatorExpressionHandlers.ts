import { CalculatorTypes } from "../../types/calculatorTypes";
import { calculatorExpression } from "./calculatorExpression";
import { canAddDot, isDot, isNumber, isOperator } from "./calculatorUtils";

// 키패드 클릭 이벤트 핸들러
export const handleKeypadClick = (e: Event, props: CalculatorTypes) => {
  const target = e.target as HTMLElement;
  const buttonEl = target.closest("button");

  const EXCLUDED_KEY_VALUES = ["Inv", "Deg", "Rad", "engineering", "basic"];

  // 버튼 태그일 경우
  if (buttonEl) {
    const { value } = buttonEl.dataset;
    if (!value || EXCLUDED_KEY_VALUES.includes(value)) return;

    // 지금까지 입력된 표현식 문자열 상태
    const current: string = props.expressionState === "init" ? "" : props.expressionState;

    // 계산 직후 처리 상태
    // 1. 숫자 입력 시 초기화
    // 2. 연산자 입력 시 결과에 연산자 붙이기
    if (props.justEvaluatedState) {
      const handle: boolean = handleJustEvaluatedInput(value, props.resultState, props.setExpressionState, props.setJustEvaluated);
      if (handle) return;
    }

    // AC | CE 버튼 클릭 시
    if (buttonEl.id === "clear-toggle") {
      const next = handleClearToggle(current, value as "AC" | "CE");
      props.setExpressionState(next);
      return;
    }

    // 결과 출력
    if (value === "=") {
      const result = calculatorExpression(current);

      if (result === null) return; // 미완성 표현식일 경우 계산 안함
      props.setLastExpressionState(current);
      props.setResultState(result);
      props.setExpressionState(result);
      props.setJustEvaluated(true);
      return;
    }

    const next = handleInput(value, current);
    if (next) props.setExpressionState(next);
  }
};

// 숫자, 연산자, 소수점 입력
export const handleInput = (value: string, expression: string): string | null => {
  const current = expression;

  const isStartingNegative = current === "-";
  const lastChar = current[current.length - 1];
  const isLastCharOperator = isOperator(lastChar);

  // 초기 상태 연산자 처리
  if (current === "") {
    if (value === "-") return "-"; // - 기호는 단독으로 허용
    if (isOperator(value)) return "0 " + value; // 그 외 연산자 -> 0 +, 0 -, 등으로 시작
    if (isNumber(value) || isDot(value)) return value; // 숫자, 소수점은 그대로 입력
  }

  if (isDot(value) && !canAddDot(current)) return null; // 소수점 입력 시 중복 방지

  // 연산자 연속 입력 시 마지막 연산자 교체
  if (isOperator(value) && isLastCharOperator && !isStartingNegative) {
    return current.slice(0, current.length - 1) + value;
  }

  // 0 입력 후 숫자 입력 시 불필요한 0 제거
  if (isNumber(value)) {
    const tokens = current.trim().split(" ");
    const lastToken = tokens[tokens.length - 1];

    if (lastToken === "0" && value === "0") {
      return expression; // 무시
    }

    if (lastToken === "0" && value !== "0") {
      tokens[tokens.length - 1] = value;
      return tokens.join(" ");
    }
  }

  if (isOperator(value)) return current + " " + value; // 연산자 입력 시 띄어쓰기 추가
  if (isStartingNegative) return "-" + value; // 음수 시작 처리
  if (isLastCharOperator) return current + " " + value; // 연산자 뒤 숫자 등 붙이기

  return current + value;
};

// AC | CE 값 처리
export const handleClearToggle = (expression: string, clearType: "AC" | "CE"): string => {
  if (clearType === "AC") return "init"; // 전체 초기화

  // CE 처리
  const trimmed = expression.trimEnd();

  // 마지막 공백 + 연산자인 경우
  if (/[+\-\u00d7\u00f7]$/.test(trimmed)) return trimmed.slice(0, -2) || "init";
  else {
    // 일반 문자 한 글자 삭제
    const result = trimmed.slice(0, -1);
    return result.length ? result : "init";
  }
};

// 계산 직후 상태 처리
export const handleJustEvaluatedInput = (
  value: string,
  result: string,
  setExpressionState: (exp: string) => void,
  setJustEvaluatedState: (flag: boolean) => void,
): boolean => {
  // 숫자 입력 시 초기화
  if (isNumber(value)) {
    setExpressionState(value);
    setJustEvaluatedState(false);
    return true;
  }

  // 연산자 입력 시 결과에 연산자 붙이기
  if (isOperator(value)) {
    setExpressionState(result + " " + value);
    setJustEvaluatedState(false);
    return true;
  }

  // 그 외 입력은 처리 안 함 -> 기존 로직 계속 실행
  return false;
};
