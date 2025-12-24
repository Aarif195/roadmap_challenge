# Weather API

A simple RESTful API to fetch current weather data for any city using Open-Meteo.



## Endpoint
GET http://localhost:3000/weather?city=London

### No API key is required for Open-Meteo.

### Example Response
{
  "city": "London",
  "country": "GB",
  "temperature": 8.5,
  "wind_speed": 12.3,
  "wind_direction": 270,
  "weather_code": 3,
  "time": "2025-12-24T10:00"
}

### Error Handling

#### If city is missing:
{ "error": "City is required" }

#### If city is not found:
{ "error": "City not found" }


#### If API fails: 
{ "error": "Failed to fetch weather data" }
