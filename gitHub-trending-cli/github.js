const axios = require("axios");

/**
 * Get trending repos by range
 * @param {string} range - daily | weekly | monthly
 * @param {number} limit - number of repos to return
 */
async function fetchTrendingRepos(range, limit = 10) {
  // Calculate start date
  const now = new Date();
  let pastDate = new Date();

  if (range === "daily") pastDate.setDate(now.getDate() - 1);
  if (range === "weekly") pastDate.setDate(now.getDate() - 7);
  if (range === "monthly") pastDate.setMonth(now.getMonth() - 1);

  const since = pastDate.toISOString().split("T")[0]; // YYYY-MM-DD

  const url = `https://api.github.com/search/repositories?q=created:>${since}&sort=stars&order=desc&per_page=${limit}`;

  try {
    const response = await axios.get(url);
    return response.data.items;
  } catch (err) {
    console.error("Failed to fetch trending repos:", err.message);
    return [];
  }
}

module.exports = { fetchTrendingRepos };
