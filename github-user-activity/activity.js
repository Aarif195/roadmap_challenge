#!/usr/bin/env node
const https = require("https");

const username = process.argv[2];

if (!username) {
  console.log("Please provide a GitHub username.");
  process.exit(1);
}

console.log(`Fetching recent activity for: ${username}...`);

const options = {
  hostname: "api.github.com",
  path: `/users/${username}/events`,
  method: "GET",
  headers: { "User-Agent": "node.js" },
};

https
  .get(options, (res) => {
    let data = "";

    // Collect data chunks as they come in
    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      // Handle invalid usernames or API errors
      if (res.statusCode === 404) {
        console.log(" User not found.");
        return;
      } else if (res.statusCode !== 200) {
        console.log(` Error: Received status code ${res.statusCode}`);
        return;
      }

      try {
        const events = JSON.parse(data);

        if (events.length === 0) {
          console.log("ℹ No recent activity found for this user.");
          return;
        }

        console.log(`\n🧾 Recent activity for ${username}:\n`);

        // Display first 5 activities
        events.slice(0, 5).forEach((event) => {
          switch (event.type) {
            case "PushEvent":
              console.log(` Pushed commits to ${event.repo.name}`);
              break;
            case "IssuesEvent":
              console.log(` Opened an issue in ${event.repo.name}`);
              break;
            case "PullRequestEvent":
              console.log(
                ` Pull request ${event.payload.action} on ${event.repo.name}`
              );
              break;
            case "ForkEvent":
              console.log(`🍴 Forked ${event.repo.name}`);
              break;
            case "CreateEvent":
              console.log(
                ` Created ${event.payload.ref_type} in ${event.repo.name}`
              );
              break;
            case "WatchEvent":
              console.log(` Starred ${event.repo.name}`);
              break;
            default:
              console.log(` ${event.type} on ${event.repo.name}`);
          }
        });
      } catch (error) {
        console.log(" Error parsing data:", error.message);
      }
    });
  })
  .on("error", (err) => {
    console.log(" Error fetching data:", err.message);
  })
