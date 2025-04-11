import { evaluate } from "mathjs";
import { CalculatorTypes } from "../../types/calculatorTypes";
import { calculatorExpression, renderFakeInput } from "./calculatorExpression";
import { canAddDot, isConstant, isDot, isExp, isFactorial, isLogOrSqrt, isNumber, isOperator, isPercentage, isTrigFunction } from "./calculatorUtils";

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
      const handle: boolean = handleJustEvaluatedInput(
        value,
        props.resultState,
        props.setExpressionState,
        props.setJustEvaluated,
        props.expressionState,
      );
      if (handle) {
        renderFakeInput(value);
        return;
      }
    }

    // AC | CE 버튼 클릭 시
    if (buttonEl.id === "clear-toggle") {
      if (value === "AC") {
        props.setExpressionState("init");
        props.setJustEvaluated(false);
        props.setResultState("init");
        props.setLastExpressionState("");

        renderFakeInput("init");
        return;
      }

      // CE 처리는 마지막 글자를 제거한 문자를 반환 받음
      const next = handleClearToggle(current);
      props.setExpressionState(next);
      renderFakeInput(next);
      return;
    }

    if (value === "random") {
      const random = evaluate("random()").toFixed(7).toString();

      const current = props.expressionState === "init" ? "" : props.expressionState;
      const updated = current === "" ? random : `${current} × ${random}`;

      props.setExpressionState(updated);
      props.setResultState(random);
      props.setJustEvaluated(false);

      renderFakeInput(updated, random);
      return;
    }

    // 결과 출력
    if (value === "=") {
      // 자동 괄호 추가된 수식
      const openCount = (current.match(/\(/g) || []).length;
      const closeCount = (current.match(/\)/g) || []).length;
      const missing = openCount - closeCount;
      const expressionForDisplay = missing > 0 ? current + ")".repeat(missing) : current;

      const result = calculatorExpression(current, props.modeState, props.resultState);
      if (result === null) return; // 미완성 표현식일 경우 계산 안함

      props.setLastExpressionState(expressionForDisplay);
      props.setResultState(result);
      props.setExpressionState(result);
      props.setJustEvaluated(true);
      renderFakeInput(result);
      return;
    }

    const next = handleInput(value, current);
    if (next) {
      props.setExpressionState(next);
      renderFakeInput(next);
    }
  }
};

// 숫자, 연산자, 소수점 입력
// 예: 함수 키 판단 (sin, cos, tan, asin, acos, atan, log, e^{x}, 10^{x} 및 필요에 따라 "(")
const isFunctionKey = (value: string): boolean => {
  const funcs = ["sin", "cos", "tan", "asin", "acos", "atan", "log", "e^{x}", "10^{x}"];
  return funcs.includes(value) || value === "(";
};

export const handleInput = (value: string, expression: string): string | null => {
  const indexMarker = "[IDX]";
  const isIndexEditing = expression.includes(indexMarker);

  // ── [IDX] 편집 모드가 활성화된 경우 ──
  // ── [IDX] 편집 모드가 활성화된 경우 ──
  if (isIndexEditing) {
    const sqrtPos = expression.indexOf("√");
    if (sqrtPos === -1) return expression;

    const markerStart = expression.indexOf(indexMarker);
    const prefix = expression.slice(0, markerStart);
    const currentIndex = expression.slice(markerStart + indexMarker.length, sqrtPos);
    const suffix = expression.slice(sqrtPos);

    // ✅ 숫자 또는 상수 입력 시: [IDX] 영역 안에 계속 누적
    if (isNumber(value) || isConstant(value)) {
      const newIndex = currentIndex + value;
      return prefix + indexMarker + newIndex + suffix;
    }

    // ✅ 연산자나 괄호 → 인덱스 입력 종료
    if (isOperator(value) || value === "%" || value === "(" || value === ")") {
      const finalized = prefix + currentIndex + suffix;
      return finalized + " " + value;
    }

    // ✅ 함수 키 삽입
    if (isFunctionKey(value)) {
      const newIndex = currentIndex + value + "()";
      return prefix + newIndex + indexMarker + suffix;
    }

    // ❗ 기타 기본 입력 → index 안에 계속 누적
    const newIndex = currentIndex + value;
    return prefix + indexMarker + newIndex + suffix;
  }

  // √( 버튼 처리: 마지막 토큰을 radicand로 사용하고, 인덱스 편집 시작 marker를 삽입합니다.
  if (value === "√(") {
    if (expression === "" || expression === "init") return "[IDX]√0";

    const tokens = expression.trim().split(" ");
    const lastToken = tokens.pop() || "";
    const rest = tokens.length > 0 ? tokens.join(" ") + " " : "";

    return rest + "[IDX]√" + lastToken;
  }

  // 그 외 일반 입력은 기존 방식대로 처리
  // (숫자, 소수점, 연산자, 함수 등)
  if (isNumber(value)) {
    // ✅ 초기 단항 음수 처리
    if (expression === "-") return "-" + value;

    const tokens = expression.trim().split(" ");
    const lastToken = tokens[tokens.length - 1];
    const secondLastToken = tokens[tokens.length - 2];

    // ✅ case 1: "5 + -" → "5 + -3"
    if (lastToken === "-" && (secondLastToken === "+" || secondLastToken === "×" || secondLastToken === "÷")) {
      tokens[tokens.length - 1] = "-" + value;
      return tokens.join(" ");
    }

    // ✅ case 2: "5 - -" or "- -3" → "5 - - 3"
    if (lastToken === "-") {
      return expression + " " + value;
    }

    // ✅ case 3: "-34"에 계속 숫자 붙이기
    if (/^-\d+$/.test(lastToken)) {
      tokens[tokens.length - 1] = lastToken + value;
      return tokens.join(" ");
    }

    // ✅ case 4: 마지막이 연산자일 경우 → 공백 후 숫자
    if (isOperator(lastToken)) {
      return expression + " " + value;
    }

    // ✅ case 5: 0 처리
    if (lastToken === "0" && value === "0") return expression;
    if (lastToken === "0" && value !== "0") {
      tokens[tokens.length - 1] = value;
      return tokens.join(" ");
    }

    // ✅ 기본
    return expression + value;
  }

  // 기타 기존 로직 (연산자, 괄호 등)
  const isStartingNegative = expression === "-";
  const lastChar = expression[expression.length - 1];
  const isLastCharOperator = isOperator(lastChar);

  if (expression === "") {
    if (value === "-") return "-";
    if (isOperator(value)) return "0 " + value;
    if (isNumber(value) || isDot(value)) return value;
  }

  if (isDot(value) && !canAddDot(expression)) return null;
  if (isPercentage(value)) return expression + "%";
  if (isFactorial(value)) {
    const operand = expression === "" || expression === "init" ? "0" : expression;
    return operand + "!";
  }

  // 👉 연산자 처리
  if (isOperator(value)) {
    const tokens = expression.trim().split(" ");
    const lastToken = tokens[tokens.length - 1];

    // [A] 새로운 연산자가 '-'가 아닌 경우
    if (value !== "-") {
      // 만약 토큰 배열의 마지막 두 토큰이 [연산자, "-"] 형태라면,
      // 예: ["3", "-", "12134", "*", "-"] 인 경우 → 새 연산자 입력 시 이 패턴을 제거
      if (tokens.length >= 2) {
        const secondLast = tokens[tokens.length - 2];
        // "*"가 포함될 수 있도록 "*"도 체크 (여기서는 "*" 또는 "×", "÷", "+" 등)
        if (["+", "*", "×", "÷"].includes(secondLast) && lastToken === "-") {
          tokens.splice(tokens.length - 2, 2); // 마지막 두 토큰 제거
          tokens.push(value); // 새 연산자 추가
          return tokens.join(" ");
        }
      }
    }

    // [B] '-' 입력 처리
    if (value === "-") {
      // 1. 초기 상태이면 단독 "-" 입력 허용
      if (expression === "" || expression === "init") return "-";
      // 2. 만약 마지막 토큰이 이미 '-'이면 중복 입력 무시 (즉, 연속 '-' 입력 방지)
      if (lastToken === "-") return expression;
      // 3. 그 외에는 연산자 토큰으로서 '-'를 추가
      return expression + " " + "-";
    }

    // ✅ 초기 상태 단항 음수 숫자 하나만 있는 경우 → 연산자 추가
    if (/^-\d+(\.\d+)?$/.test(expression)) {
      return expression + " " + value;
    }

    // ✅ 단항 음수 시작: 연산자 + - 로 구성 중
    if (value === "-" && isOperator(lastToken)) {
      return expression + " " + value;
    }

    // ✅ 직전이 단항 음수인 숫자인 경우 → 대체 안함
    if (tokens.length >= 2) {
      const last = tokens[tokens.length - 1];
      const secondLast = tokens[tokens.length - 2];
      if (isOperator(secondLast) && /^-\d+(\.\d+)?$/.test(last)) {
        return expression + " " + value;
      }
    }

    // ✅ 연산자 대체
    if (isOperator(lastToken)) {
      tokens[tokens.length - 1] = value;
      return tokens.join(" ");
    }

    return expression + " " + value;
  }

  if (value === "(") return expression + value;
  if (value === ")") {
    const openCount = (expression.match(/\(/g) || []).length;
    const closeCount = (expression.match(/\)/g) || []).length;
    if (closeCount >= openCount) return null;
  }
  if (isLogOrSqrt(value)) return expression + value + "(";
  if (isTrigFunction(value)) return expression + value + "(";
  if (isConstant(value)) {
    const constant = value === "π" ? "pi" : "e";
    return expression + constant;
  }
  if (isExp(value)) {
    const tokens = expression.trim().split(" ");
    const lastToken = tokens[tokens.length - 1];
    if (isNumber(lastToken)) return expression + "E";
    return null;
  }
  if (value === "exp^") {
    const expCount = (expression.match(/exp\^/g) || []).length;
    if (expCount < 4) return expression + "exp^";
    return expression + "e";
  }
  if (value === "10^") {
    const tenPowerCount = (expression.match(/10\^/g) || []).length;
    if (tenPowerCount < 4) return expression + "10^";
    return expression + "10";
  }
  if (value === "^") {
    if (expression === "" || expression === "init") return "0^";

    const validLast = /(\d|\)|pi|e|Ans)$/;
    const exponentCount = (expression.match(/\^/g) || []).length;
    if (validLast.test(expression) && exponentCount < 4) return expression + "^";
    return null;
  }
  if (value === "Ans") {
    if (expression === "" || /[\+\-\×÷\(]$/.test(expression)) return expression + "Ans";
    else return expression + " × Ans";
  }
  if (isStartingNegative) return "-" + value;
  if (isLastCharOperator) return expression + " " + value;

  return expression + value;
};

// CE 값 처리
export const handleClearToggle = (expression: string): string => {
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
  currentExpression: string,
): boolean => {
  // 숫자 입력 시, expression이 result와 같을 경우에만 초기화
  if (isNumber(value)) {
    if (currentExpression === result) {
      setExpressionState(value);
    } else {
      setExpressionState(currentExpression + value);
    }

    setJustEvaluatedState(false);
    return true;
  }

  // 연산자 입력 시 결과에 연산자 붙이기
  if (isOperator(value)) {
    setExpressionState(result + " " + value);
    setJustEvaluatedState(false);
    return true;
  }

  // 여는 괄호 및 함수/상수와 같이 결과를 대체해야 하는 키들
  const REPLACE_KEYS = new Set(["(", "sin", "cos", "tan", "asin", "acos", "atan", "log", "pi", "e", "sqrt(", "Ans", "exp("]);
  if (REPLACE_KEYS.has(value)) {
    // 연산 결과를 덮어쓰고 새 입력으로 시작
    setExpressionState(value);
    setJustEvaluatedState(false);
    return true;
  }

  // 그 외 입력은 처리 안 함 -> 기존 로직 계속 실행
  return false;
};
