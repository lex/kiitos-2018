const kelvinToCelsius = kelvin => kelvin - 273.15;
const kelvinToFahrenheit = kelvin => kelvin * 9 / 5 - 459.67;
const celsiusToKelvin = celsius => celsius + 273.15;
const fahrenheitToKelvin = fahrenheit => (fahrenheit + 459.67) * 5 / 9;

export {
  kelvinToCelsius,
  kelvinToFahrenheit,
  celsiusToKelvin,
  fahrenheitToKelvin
};
