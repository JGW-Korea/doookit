export const convertLength = (value: number, from: string, to: string): number => {
  let result = "";

  if (from === "cm") {
    switch (to) {
      case "cm":
        result = value.toString();
        break;
      case "in":
        result = (value / 2.54).toFixed(2);
        break;
      case "m":
        result = (value / 100).toFixed(2);
        break;
      case "ft":
        result = (value / 30.48).toFixed(2);
        break;
      case "km":
        result = (value / 100000).toExponential(6);
        break;
      case "mi":
        result = (value / 160934.4).toExponential(6);
        break;
    }
  }

  if (from === "in") {
    switch (to) {
      case "cm":
        result = (value * 2.54).toFixed(2);
        break;
      case "in":
        result = value.toString();
        break;
      case "m":
        result = (value * 0.0254).toFixed(4);
        break;
      case "ft":
        result = (value / 12).toFixed(4);
        break;
      case "km":
        result = (value * 0.0000254).toExponential(6);
        break;
      case "mi":
        result = (value * 0.000015783).toExponential(6);
        break;
    }
  }

  if (from === "m") {
    switch (to) {
      case "cm":
        result = (value * 100).toFixed(2);
        break;
      case "in":
        result = (value / 0.0254).toFixed(2);
        break;
      case "m":
        result = value.toString();
        break;
      case "ft":
        result = (value * 3.28084).toFixed(4);
        break;
      case "km":
        result = (value / 1000).toFixed(4);
        break;
      case "mi":
        result = (value / 1609.344).toExponential(6);
        break;
    }
  }

  if (from === "ft") {
    switch (to) {
      case "cm":
        result = (value * 30.48).toFixed(2);
        break;
      case "in":
        result = (value * 12).toFixed(2);
        break;
      case "m":
        result = (value * 0.3048).toFixed(4);
        break;
      case "ft":
        result = value.toString();
        break;
      case "km":
        result = (value * 0.0003048).toExponential(6);
        break;
      case "mi":
        result = (value * 0.000189394).toExponential(6);
        break;
    }
  }

  if (from === "km") {
    switch (to) {
      case "cm":
        result = (value * 100000).toFixed(0);
        break;
      case "in":
        result = (value * 39370.1).toFixed(2);
        break;
      case "m":
        result = (value * 1000).toFixed(2);
        break;
      case "ft":
        result = (value * 3280.84).toFixed(2);
        break;
      case "km":
        result = value.toString();
        break;
      case "mi":
        result = (value * 0.621371).toFixed(6);
        break;
    }
  }

  if (from === "mi") {
    switch (to) {
      case "cm":
        result = (value * 160934.4).toFixed(2);
        break;
      case "in":
        result = (value * 63360).toFixed(0);
        break;
      case "m":
        result = (value * 1609.344).toFixed(2);
        break;
      case "ft":
        result = (value * 5280).toFixed(0);
        break;
      case "km":
        result = (value * 1.609344).toFixed(6);
        break;
      case "mi":
        result = value.toString();
        break;
    }
  }

  return Number(result);
};

export const convertWeight = (value: number, from: string, to: string): number => {
  let result = "";

  if (from === "kg") {
    switch (to) {
      case "kg":
        result = value.toString();
        break;
      case "lb":
        result = (value * 2.20462).toFixed(4);
        break;
      case "g":
        result = (value * 1000).toFixed(2);
        break;
      case "oz":
        result = (value * 35.27396).toFixed(4);
        break;
    }
  }

  if (from === "lb") {
    switch (to) {
      case "kg":
        result = (value * 0.453592).toFixed(4);
        break;
      case "lb":
        result = value.toString();
        break;
      case "g":
        result = (value * 453.592).toFixed(2);
        break;
      case "oz":
        result = (value * 16).toFixed(2);
        break;
    }
  }

  if (from === "g") {
    switch (to) {
      case "kg":
        result = (value / 1000).toFixed(4);
        break;
      case "lb":
        result = (value * 0.00220462).toFixed(4);
        break;
      case "g":
        result = value.toString();
        break;
      case "oz":
        result = (value * 0.035274).toFixed(4);
        break;
    }
  }

  if (from === "oz") {
    switch (to) {
      case "kg":
        result = (value * 0.0283495).toFixed(4);
        break;
      case "lb":
        result = (value * 0.0625).toFixed(4);
        break;
      case "g":
        result = (value * 28.3495).toFixed(2);
        break;
      case "oz":
        result = value.toString();
        break;
    }
  }

  return Number(result);
};

export const convertTemp = (value: number, from: string): number => {
  let result = "";

  // 섭씨 -> 화씨
  if (from === "c") {
    result = ((value * 9) / 5 + 32).toString();
  }

  // 화씨 -> 섭씨
  else {
    result = (((value - 32) * 5) / 9).toFixed();
  }

  return Number(result);
};
