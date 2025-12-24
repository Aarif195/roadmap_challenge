# GitHub Trending CLI

A Node.js CLI tool that fetches trending GitHub repositories.

## How to Run

Run the command below followed by a time range:

node index.js <range> [limit]

## Available Ranges

daily  
weekly  
monthly  

## Examples

node index.js daily  
node index.js weekly 5  
node index.js monthly 15  

- `<range>` specifies the time period for trending repos.  
- `[limit]` is optional and defines how many repos to show (default 10).

## Output

For each repository, the CLI displays:

- Repository full name  
- Star count  
- Description  
- GitHub URL
