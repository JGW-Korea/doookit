export interface CalculatorTypes {
  expressionState: string;
  resultState: string;
  justEvaluatedState: boolean;
  modeState: "mode-deg" | "mode-rad";
  setExpressionState: (exp: string) => void;
  setResultState: (result: string) => void;
  setLastExpressionState: (lastExp: string) => void;
  setJustEvaluated: (flag: boolean) => void;
}
