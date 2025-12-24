const { fetchMovies } = require("./tmdb");

const command = process.argv[2];

const COMMAND_MAP = {
  popular: "popular",
  now_playing: "now_playing",
  top_rated: "top_rated",
  upcoming: "upcoming"
};

if (!COMMAND_MAP[command]) {
  console.log(
    "Invalid command.\nUse: popular | now_playing | top_rated | upcoming"
  );
  process.exit(1);
}

(async () => {
  try {
    const movies = await fetchMovies(COMMAND_MAP[command]);

    movies.slice(0, 10).forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title}`);
    });
  } catch (error) {
    console.error("Failed to fetch movies");
  }
})();
