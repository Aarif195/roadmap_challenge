const axios = require("axios");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.TMDB_API_KEY;

async function fetchMovies(endpoint) {
  const response = await axios.get(`${BASE_URL}/movie/${endpoint}`, {
    params: { api_key: API_KEY }
  });

  return response.data.results;
}

module.exports = {
  fetchMovies
};
