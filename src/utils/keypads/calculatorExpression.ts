import { evaluate } from "mathjs";

// 표현식 계산 유틸 예외 처리
export const calculatorExpression = (expression: string, mode: "mode-deg" | "mode-rad" = "mode-rad", ansValue: string = ""): string | null => {
  // 표현식 마지막이 연산자로 끝나는 경우 -> 표현식 그대로 유지
  if (/[\+\-\u00d7\u00f7]$/.test(expression.trim())) {
    return null;
  }

  try {
    let parsed = expression
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/(\d+(\.\d+)?) %/g, "($1 / 100)")
      .replace(/(\d+(\.\d+)?) x!/g, "factorial($1)")
      .replace(/ln\(/g, "log(")
      .replace(/log\(/g, "log10(")
      .replace(/√\(/g, "sqrt(")
      .replace(/(\d+)\s*EXP\s*(-?\d+)/g, "$1e$2");

    // 닫는 괄호 자동 추가: 여는 괄호 수 - 닫는 괄호 수
    const openCount = (parsed.match(/\(/g) || []).length;
    const closeCount = (parsed.match(/\)/g) || []).length;
    const missing = openCount - closeCount;
    if (missing > 0) {
      parsed += ")".repeat(missing);
    }

    // 삼각 함수(sin, cos, tan) 처리
    if (mode === "mode-deg") {
      parsed = parsed.replace(/(sin|cos|tan)\(([^()]+?)\)/g, (_, fn, value) => {
        return `${fn}(${value} deg)`;
      });
    }

    if (ansValue) {
      console.log(ansValue);
      parsed = parsed.replace(/Ans/g, ansValue === "init" ? "0" : ansValue);
    }

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

export const renderFakeInput = (expression: string): void => {
  const container = document.querySelector("#fake-input");
  if (!container) return;

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const displayExpression = (expression === "init" ? "0" : expression).replace(/pi/g, "π");

  let currentSupEl: HTMLElement | null = null;

  for (let i = 0; i < displayExpression.length; i++) {
    const char = displayExpression[i];

    if (char === "^") {
      const newSup = document.createElement("sup");
      newSup.classList.add("placeholder");

      if (currentSupEl) {
        // 중첩
        currentSupEl.appendChild(newSup);
      } else {
        // 최상위
        container.appendChild(newSup);
      }

      currentSupEl = newSup;
      continue;
    }

    if (/[0-9]/.test(char)) {
      const digit = document.createElement("span");
      digit.textContent = char;

      if (currentSupEl) {
        currentSupEl.appendChild(digit);
        currentSupEl.classList.remove("placeholder");
      } else {
        container.appendChild(digit);
      }
      continue;
    }

    // 숫자도 ^도 아닌 일반 문자 → 지수 종료
    currentSupEl = null;

    const span = document.createElement("span");
    span.textContent = char;
    container.appendChild(span);
  }

  // 자동 괄호 닫기
  if (expression !== "init") {
    const openCount = (expression.match(/\(/g) || []).length;
    const closeCount = (expression.match(/\)/g) || []).length;
    const missing = openCount - closeCount;

    for (let i = 0; i < missing; i++) {
      const ghost = document.createElement("span");
      ghost.textContent = ")";
      ghost.classList.add("ghost");
      container.appendChild(ghost);
    }
  }
};
