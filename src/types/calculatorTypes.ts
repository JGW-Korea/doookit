export interface CalculatorTypes {
  expressionState: string;
  resultState: string;
  justEvaluatedState: boolean;
  setExpressionState: (exp: string) => void;
  setResultState: (result: string) => void;
  setLastExpressionState: (lastExp: string) => void;
  setJustEvaluated: (flag: boolean) => void;
}
