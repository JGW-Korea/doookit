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
      .replace(/\[IDX\](\d*)√(\d+)/g, (_, index, radicand) => {
        const idx = index || "2";
        return `nthRoot(${radicand}, ${idx})`;
      }) // ✅ 핵심
      .replace(/√\(/g, "sqrt(")
      .replace(/√/g, "sqrt(")
      .replace(/\%\%/g, "^")
      .replace(/(\d+)\s*EXP\s*(-?\d+)/g, "$1e$2")
      .replace(/exp\^/g, "exp(")
      .replace(/10\^/g, "10^")
      .replace(/\[IDX\]/g, "");

    console.log(parsed);

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
      parsed = parsed.replace(/Ans/g, ansValue === "init" ? "0" : ansValue);
    }

    if (/(\^|exp\()$/.test(expression.trim())) {
      return null;
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

export const renderFakeInput = (expression: string, lastRandomValue?: string): void => {
  const container = document.querySelector("#fake-input");
  if (!container) return;

  // 기존 컨테이너 비우기
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // displayExpression: 'init'일 때 '0'으로, 'pi'를 'π'로 변경
  const displayExpression = (expression === "init" ? "0" : expression).replace(/pi/g, "π");

  let currentSupEl: HTMLElement | null = null;
  let supStack: HTMLElement[] = [];

  // ✅ √ 인덱스 입력 처리
  // 🔥 정확하게 "[IDX]"가 있고, 뒤에 "√"도 있을 경우에만 실행
  if (displayExpression.includes("[IDX]")) {
    const idxStart = displayExpression.indexOf("[IDX]");
    const sqrtStart = displayExpression.indexOf("√", idxStart);

    // √가 없는 경우 → fallback
    if (sqrtStart === -1) {
      // 그냥 루프 돌게 둠
    } else {
      const indexContent = displayExpression.slice(idxStart + 5, sqrtStart); // "2345"
      const radicand = displayExpression.slice(sqrtStart + 1); // "45"

      const placeholder = document.createElement("span");
      placeholder.classList.add("index-placeholder");
      placeholder.textContent = indexContent;

      // ✅ placeholder 클래스를 제거할지 유지할지 판단
      if (indexContent.trim().length > 0) {
        placeholder.classList.remove("placeholder");
      } else {
        placeholder.classList.add("placeholder");
      }

      const sqrtSymbol = document.createElement("span");
      sqrtSymbol.textContent = "√";

      container.appendChild(placeholder);
      container.appendChild(sqrtSymbol);

      for (let i = 0; i < radicand.length; i++) {
        const span = document.createElement("span");
        span.textContent = radicand[i];
        container.appendChild(span);
      }

      return;
    }
  }

  for (let i = 0; i < displayExpression.length; i++) {
    // ── 인덱스 편집 모드 marker "[IDX]" 처리 ──
    if (displayExpression.slice(i, 5) === "[IDX]") {
      i += 5; // marker "[IDX]" 건너뛰기

      // 인덱스 입력 영역은 marker 바로 뒤부터 최초로 나타나는 "√" 기호 전까지로 간주합니다.
      const sqrtPos = displayExpression.indexOf("√", i);
      let indexContent = "";
      if (sqrtPos === -1) {
        // 만약 "√"가 없다면 나머지 전체를 인덱스 내용으로 간주
        indexContent = displayExpression.substring(i);
        i = displayExpression.length;
      } else {
        indexContent = displayExpression.substring(i, sqrtPos);
        i = sqrtPos; // "√" 기호부터 다음 처리 대상으로
      }

      // 인덱스 영역은 별도의 div 요소(placeholder)를 생성합니다.
      const placeholderEl = document.createElement("span");
      placeholderEl.classList.add("placeholder", "index-placeholder");
      // 내용이 없으면 빈 문자열로 두어 CSS 스타일(예, dotted border)이 그대로 보이게 합니다.
      placeholderEl.textContent = indexContent.trim();
      container.appendChild(placeholderEl);
      // i += 2;
      continue; // i는 이미 업데이트했으므로 바로 다음 반복
    }

    // ── marker "%%2" 처리 ──
    if (displayExpression.slice(i, i + 3) === "%%2") {
      // '^' 기호 없이 2만 윗첨자로 출력
      const supEl = document.createElement("sup");
      supEl.appendChild(document.createTextNode("2"));
      container.appendChild(supEl);
      // marker 길이만큼 인덱스 증가 (문자열 "%%2"는 3글자)
      i += 2;
      continue;
    }

    // ── exp^ 처리 (기존 로직 그대로) ──
    if (displayExpression.slice(i, i + 4) === "exp^") {
      const newSup = document.createElement("sup");
      newSup.classList.add("placeholder");
      const base = document.createElement("span");
      base.textContent = "e";
      if (currentSupEl) {
        currentSupEl.appendChild(base);
        currentSupEl.appendChild(newSup);
      } else {
        container.appendChild(base);
        container.appendChild(newSup);
      }
      newSup.classList.remove("placeholder");
      supStack.push(newSup);
      currentSupEl = newSup;
      i += 3;
      continue;
    }

    // ── 10^ 처리 ──
    if (displayExpression.slice(i, i + 3) === "10^") {
      const newSup = document.createElement("sup");
      newSup.classList.add("placeholder");
      const base = document.createElement("span");
      base.textContent = "10";
      if (currentSupEl) {
        currentSupEl.appendChild(base);
        currentSupEl.appendChild(newSup);
      } else {
        container.appendChild(base);
        container.appendChild(newSup);
      }
      newSup.classList.remove("placeholder");
      supStack.push(newSup);
      currentSupEl = newSup;
      i += 2;
      continue;
    }

    // ── 닫는 괄호 처리 ──
    // 사용자가 직접 입력한 닫는 괄호는 sup 영역과 관계없이 항상 일반 텍스트로 출력
    if (displayExpression[i] === ")") {
      if (supStack.length > 0) {
        supStack.pop();
        currentSupEl = supStack[supStack.length - 1] || null;
      }
      const span = document.createElement("span");
      span.textContent = ")";
      container.appendChild(span);
      continue;
    }

    // ── '^' 기호 처리 ──
    // (다른 경우를 위해 남겨두었지만, x²의 경우엔 marker "%%2" 사용하므로 여기서 실행되면 평상시의 제곱 연산 처리로 봅니다.)
    if (displayExpression[i] === "^") {
      const newSup = document.createElement("sup");
      newSup.classList.add("placeholder");
      if (currentSupEl) {
        currentSupEl.appendChild(newSup);
      } else {
        container.appendChild(newSup);
      }
      currentSupEl = newSup;
      continue;
    }

    // ── 숫자 처리 ──
    if (/[0-9]/.test(displayExpression[i])) {
      let token = displayExpression[i];
      while (i + 1 < displayExpression.length && /[0-9.]/.test(displayExpression[i + 1])) {
        token += displayExpression[++i];
      }
      const span = document.createElement("span");
      span.textContent = lastRandomValue && token === lastRandomValue ? "randomValue" : token;
      if (currentSupEl) {
        currentSupEl.appendChild(span);
        if (currentSupEl.classList.contains("placeholder")) {
          currentSupEl.classList.remove("placeholder");
        }
      } else {
        container.appendChild(span);
      }
      continue;
    }

    // ── 기본 문자 처리 ──
    // 알파벳은 currentSupEl 내부에 추가, 그 외 기호는 sup 영역 종료 후 컨테이너에 추가합니다.
    const spanEl = document.createElement("span");
    spanEl.textContent = displayExpression[i];

    if (/[a-zA-Z]/.test(displayExpression[i])) {
      if (currentSupEl) {
        currentSupEl.appendChild(spanEl);
      } else {
        container.appendChild(spanEl);
      }
    } else {
      currentSupEl = null;
      container.appendChild(spanEl);
    }
  }

  if (currentSupEl && !currentSupEl.textContent) {
    currentSupEl.classList.add("placeholder");
  }

  // ── 자동 괄호 닫기 (수식이 "init"이 아닐 경우) ──
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
