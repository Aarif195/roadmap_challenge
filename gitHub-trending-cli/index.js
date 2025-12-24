const { fetchTrendingRepos } = require("./github");

const range = process.argv[2];
const limit = parseInt(process.argv[3]) || 10;

const VALID_RANGES = ["daily", "weekly", "monthly"];

if (!VALID_RANGES.includes(range)) {
  console.log("Usage: node index.js daily|weekly|monthly [limit]");
  process.exit(1);
}

(async () => {
  try {
    const repos = await fetchTrendingRepos(range, limit);

    if (!repos.length) {
      console.log("No trending repositories found.");
      return;
    }

    console.log(`Top ${repos.length} trending repos (${range}):\n`);

    repos.forEach((repo, index) => {
      console.log(
        `${index + 1}. ${repo.full_name} (${repo.stargazers_count} ⭐)\n   ${repo.description || "No description"}\n   ${repo.html_url}\n`
      );
    });
  } catch (err) {
    console.error("Error fetching repos:", err.message);
  }
})();
