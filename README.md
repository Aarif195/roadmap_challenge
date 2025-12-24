# Backend Beginner Projects – Learning Summary

This document summarizes the **12 beginner backend projects**, highlighting purpose, features, implementation details, and key learnings. Projects progress from CLI apps to RESTful APIs with authentication and database integration.

---

## 1. CLI – Task Tracker
**Type:** CLI Application  
**Purpose:** Terminal-based task management tool.

### Description
A simple CLI app to create, update, delete, and view tasks stored locally in JSON files.

### Features
- Add, mark as complete, update, delete tasks
- View all tasks

### Learning Outcomes
- Node.js CLI structure
- File system operations (`fs`)
- Basic CRUD without database

---

## 2. CLI – GitHub User Activity
**Type:** CLI Application  
**Purpose:** Display GitHub user activity.

### Description
Fetch real-time user data from GitHub API and display it in the terminal.

### Features
- Fetch repositories, commits, events
- Display user activity in terminal

### Learning Outcomes
- HTTP requests in Node.js (`axios`)
- Parsing API responses
- Async programming

---

## 3. CLI – Expense Tracker
**Type:** CLI Application  
**Purpose:** Track personal finances in terminal.

### Description
CLI tool to manage expenses with categories like Groceries, Utilities, Leisure.

### Features
- Add, update, delete expenses
- Summarize expenses

### Learning Outcomes
- CLI menu creation
- Structured data management
- Basic calculations

---

## 4. CLI – Number Guessing Game
**Type:** CLI Application  
**Purpose:** Interactive number guessing game in terminal.

### Description
User guesses a random number and receives feedback until correct.

### Features
- Random number generation
- Input validation
- Game loop and attempt tracking

### Learning Outcomes
- Conditional logic
- Loops and input handling
- User interaction in CLI

---

## 5. Web App – Unit Converter
**Type:** Web Application  
**Purpose:** Convert values between units.

### Description
Browser-based app to convert units in real time.

### Features
- Convert length, weight, temperature
- Responsive input forms
- Error handling for invalid inputs

### Learning Outcomes
- DOM manipulation
- Event handling in JS
- Real-time updates in browser

---

## 6. Web App – Personal Blog
**Type:** Web Application  
**Purpose:** Publish and manage blog posts.

### Description
Users can create, view, update, and delete posts. Data initially local, later integrated with MongoDB.

### Features
- CRUD for blog posts
- Dynamic rendering of posts

### Learning Outcomes
- CRUD in web apps
- MongoDB integration
- Dynamic content rendering

---

## 7. API – Weather API
**Type:** RESTful API  
**Purpose:** Fetch weather data for a given city.

### Description
REST API that queries a weather service (OpenWeatherMap) and returns current weather.

### Features
- Fetch weather by city
- JSON responses with temperature, conditions, and humidity

### Learning Outcomes
- API consumption
- Query parameters and response formatting
- Error handling for external APIs

---

## 8. API – Blogging Platform
**Type:** RESTful API  
**Purpose:** Backend for managing blog posts.

### Description
CRUD API with filtering/search on title, content, and category.

### Features
- Create, read, update, delete posts
- Search/filter posts
- Proper HTTP status codes

### Learning Outcomes
- RESTful API design
- MongoDB for persistent storage
- Error handling

---

## 9. API – To-Do List
**Type:** RESTful API with JWT Authentication  
**Purpose:** User-specific task management with security.

### Description
Users register and login, with access to only their own to-dos.

### Features
- JWT-based authentication
- CRUD operations
- Filter by completion status

### Learning Outcomes
- Secure route middleware
- Error handling
- Combining CRUD with authorization
- Token-based authentication

---

## 10. API – Expense Tracker
**Type:** RESTful API with JWT Authentication  
**Purpose:** Track user expenses with secure access and filtering.

### Description
Users can manage expenses with filters for past week, month, 3 months, or custom date ranges.

### Features
- JWT authentication
- CRUD operations
- Date-based filtering
- Expense categorization


### Learning Outcomes
- Advanced date queries in MongoDB
- Multi-user data security
- Combining numeric, string, and date fields

---

## 11. CLI – TMDB Tool
**Type:** CLI Application  
**Purpose:** Fetch and display movie/TV data from TMDB API.

### Description
Users view popular and trending movies/TV shows in the terminal.

### Features
- Fetch and display movies/TV shows
- Filter by title, release date, rating

### Learning Outcomes
- Consuming third-party APIs
- CLI output formatting
- Async programming with APIs

---

## 12. CLI – GitHub Trending
**Type:** CLI Application  
**Purpose:** Display trending GitHub repositories.

### Description
Fetch and display trending repositories filtered by language, stars, and time period.

### Features
- Fetch trending repos via GitHub API
- Display repo name, owner, stars, description

### Learning Outcomes
- REST API consumption
- Query parameter filtering
- CLI display formatting

---

# Overall Key Learnings
- Backend fundamentals: Node.js, Express, REST APIs  
- Database management: MongoDB, CRUD, ObjectId  
- Authentication: JWT  
- API consumption: TMDB, GitHub, Weather  
- CLI development: input handling, loops, display formatting  
- Data filtering, validation, and error handling  
- HTTP status codes and REST conventions  
- Front-end basics: DOM, forms, dynamic content  

