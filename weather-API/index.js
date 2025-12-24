const express = require("express");
const { getWeather } = require("./weather");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/weather", async (req, res) => {
  const city = req.query.city;

  try {
    const weatherData = await getWeather(city);
    res.status(200).json(weatherData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Weather API running on http://localhost:${PORT}`);
});
