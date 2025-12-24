const axios = require("axios");

// Convert city name to coordinates using Open-Meteo Geo API
async function getCoordinates(city) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`;

  try {
    const response = await axios.get(geoUrl);
    const data = response.data;

    if (!data.results || data.results.length === 0) {
      throw new Error("City not found");
    }

    const { latitude, longitude, name, country } = data.results[0];
    return { latitude, longitude, name, country };
  } catch (err) {
    throw new Error("Failed to get city coordinates");
  }
}

async function getWeather(city) {
  if (!city) throw new Error("City is required");

  const { latitude, longitude, name, country } = await getCoordinates(city);

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  try {
    const response = await axios.get(url);
    const data = response.data.current_weather;

    return {
      city: name,
      country: country,
      temperature: data.temperature,
      wind_speed: data.windspeed,
      wind_direction: data.winddirection,
      weather_code: data.weathercode,
      time: data.time
    };
  } catch (err) {
    throw new Error("Failed to fetch weather data");
  }
}

module.exports = { getWeather };
