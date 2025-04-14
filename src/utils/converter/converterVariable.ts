import { UnitConverterDataTypes } from "../../types/unitConverter";
import { convertLength, convertTemp, convertWeight } from "./converterUntil";

export const setFromValue = (value: number) => (fromValue = value);

export let fromValue = 1; // 길이 값
export let toValue = 0; // 결과값

// 현재 단위
export let lengthFrom = "cm";
export let lengthTo = "in";

export let weightFrom = "kg";
export let weightTo = "lb";

export let tempFrom = "c";
export let tempTo = "f";

type LengthUnit = "cm" | "in" | "m" | "ft" | "km" | "mi"; // 길이 단위 타입
type WeightUnit = "kg" | "lb" | "g" | "oz"; // 무게 단위 타입
type TempUnit = "c" | "f"; // 온도 단위 타입

export default class ConvertVariable {
  private fromValue = 1;
  private toValue = 0;

  private convertLength: { from: LengthUnit; to: LengthUnit } = { from: "cm", to: "in" };
  private convertWeigth: { from: WeightUnit; to: WeightUnit } = { from: "kg", to: "lb" };
  private convertTemp: { from: TempUnit; to: TempUnit } = { from: "c", to: "f" };

  private currentType: UnitConverterDataTypes = "length";

  // 단위 스왑(Swap) 버튼 클릭 이벤트
  swap(): void {
    let temp;

    switch (this.currentType) {
      case "length":
        temp = this.convertLength.from;
        this.convertLength.from = this.convertLength.to;
        this.convertLength.to = temp;
        break;
      case "weight":
        temp = this.convertWeigth.from;
        this.convertWeigth.from = this.convertWeigth.to;
        this.convertWeigth.to = temp;
        break;
      case "temperature":
        temp = this.convertTemp.from;
        this.convertTemp.from = this.convertTemp.to;
        this.convertTemp.to = temp;
        break;
    }
  }

  // 단위 변환 결과값 반환
  getToValue(type?: UnitConverterDataTypes): number {
    const convertType = type ? type : this.currentType;

    // 현재 타입에 맞는 결과값 계산 후 결과값 반환
    switch (convertType) {
      case "length":
        this.toValue = convertLength(this.fromValue, this.convertLength.from, this.convertLength.to);
        break;
      case "weight":
        this.toValue = convertWeight(this.fromValue, this.convertWeigth.from, this.convertWeigth.to);
        break;
      case "temperature":
        this.toValue = convertTemp(this.fromValue, this.convertTemp.from);
        break;
    }

    return this.toValue;
  }

  // Getter 프로퍼티
  // 단위 변환 현재 값 반환
  get getFromValue(): number {
    return fromValue;
  }

  get getConvertType(): UnitConverterDataTypes {
    return this.currentType;
  }

  // 길이 단위 반환
  get getConvertLength(): { from: string; to: string } {
    return { from: this.convertLength.from, to: this.convertLength.to };
  }

  // 무게 단위 반환
  get getConvertWeight(): { from: string; to: string } {
    return { from: this.convertWeigth.from, to: this.convertWeigth.to };
  }

  // 온도 단위 반환
  get getConvertTemp(): { from: string; to: string } {
    return { from: this.convertTemp.from, to: this.convertTemp.to };
  }

  // Setter 프로퍼티
  // 단위 값 수정
  set setFromValue(value: string) {
    this.fromValue = Number(value);
  }

  // 길이 단위 변환
  set setConvertLength(convert: { from: LengthUnit; to: LengthUnit }) {
    this.convertLength.from = convert.from;
    this.convertLength.to = convert.to;
  }

  // 무게 단위 변환
  set setConvertWeigth(convert: { from: WeightUnit; to: WeightUnit }) {
    this.convertWeigth.from = convert.from;
    this.convertWeigth.to = convert.to;
  }

  // 온도 단위 변환
  set setConvertTemp(convert: { from: TempUnit; to: TempUnit }) {
    this.convertTemp.from = convert.from;
    this.convertTemp.to = convert.to;
  }

  // 단위 변환
  set setConvertType(type: UnitConverterDataTypes) {
    this.currentType = type;
  }
}
