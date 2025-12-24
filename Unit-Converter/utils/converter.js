// utils/converter.js

function convertUnits(value, fromUnit, toUnit, type) {
  if (isNaN(value)) return "Invalid number";

  let result;

  switch (type) {
    case "length":
      result = convertLength(value, fromUnit, toUnit);
      break;
    case "weight":
      result = convertWeight(value, fromUnit, toUnit);
      break;
    case "temperature":
      result = convertTemperature(value, fromUnit, toUnit);
      break;
    default:
      result = "Invalid conversion type.";
  }

  return result;
}

//  LENGTH CONVERSION 
function convertLength(value, from, to) {
  const conversions = {
    millimeter: 0.001,
    centimeter: 0.01,
    meter: 1,
    kilometer: 1000,
    inch: 0.0254,
    foot: 0.3048,
    yard: 0.9144,
    mile: 1609.34,
  };

  if (!conversions[from] || !conversions[to]) return "Invalid unit";

  const valueInMeters = value * conversions[from];
  const result = valueInMeters / conversions[to];
  return result.toFixed(4);
}

//  WEIGHT CONVERSION 
function convertWeight(value, from, to) {
  const conversions = {
    milligram: 0.001,
    gram: 1,
    kilogram: 1000,
    ounce: 28.3495,
    pound: 453.592,
  };

  if (!conversions[from] || !conversions[to]) return "Invalid unit";

  const valueInGrams = value * conversions[from];
  const result = valueInGrams / conversions[to];
  return result.toFixed(4);
}

//  TEMPERATURE CONVERSION 
function convertTemperature(value, from, to) {
  let celsius;

  if (from === "Celsius") celsius = value;
  else if (from === "Fahrenheit") celsius = (value - 32) * (5 / 9);
  else if (from === "Kelvin") celsius = value - 273.15;
  else return "Invalid unit";

  let result;
  if (to === "Celsius") result = celsius;
  else if (to === "Fahrenheit") result = celsius * (9 / 5) + 32;
  else if (to === "Kelvin") result = celsius + 273.15;
  else return "Invalid unit";

  return result.toFixed(2);
}

module.exports = { convertUnits };
