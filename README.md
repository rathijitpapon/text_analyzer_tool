# Text Analyzer Tool

A powerful text analysis tool for processing and understanding textual data.

## Table of Contents
- [Text Analyzer Tool](#text-analyzer-tool)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Rate Limiting](#rate-limiting)
  - [Error Handling](#error-handling)
  - [Testing](#testing)
  - [Deployment](#deployment)
  - [License](#license)
  - [Future Development](#future-development)

## Features
- Word count analysis
- Character count analysis
- Sentence count analysis
- Paragraph count analysis
- Longest word identification in paragraphs
- Google OAuth2.0 authentication
- Rate limiting for API protection
- Caching mechanism for frequently accessed data

## Prerequisites
- Node.js (v20 or higher)
- npm (v10 or higher)
- Express.js (v4 or higher)
- PostgreSQL (v14 or higher)
- Redis (v7 or higher)
- TypeScript (v5 or higher)
- Jest (v29 or higher)
- Supertest (v6 or higher)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/rathijitpapon/text_analyzer_tool.git
   cd text_analyzer_tool
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration
1. Create a `.env` file in the root directory:
   ```bash
   cp env.example .env
   ```
2. Open `.env`, copy the `env.example` file and fill in all required environment variables:
   ```bash
   cp env.example .env
   nano .env
   # fill in the required environment variables
   # save and exit
   ```
3. Create a database and update the `.env` file with the database credentials.
    ```bash
    # create database in the postgres server
    CREATE DATABASE text_analyzer_tool;
    # update the .env file with the database credentials and database name
    ```

## Usage
1. Start the application:
   ```bash
   # Development Mode
   npm run dev

   # Production Mode
   npm install -g pm2 pm2-runtime
   npm start
   ```
2. Access the application at `http://localhost:PORT` (replace PORT with the value set in your `.env` file).
3. Use the provided API endpoints to analyze text data.

## API Endpoints

| Endpoint | Method | Body | Auth Required | Description |
|----------|--------|------|---------------|-------------|
| `/api/health` | GET | None | No | Checks the health of the application |
| `/api` | GET | None | No | Index page of the application |
| `/api/v1/auth/google` | GET | None | No | Initiates Google OAuth authentication |
| `/api/v1/auth/me` | GET | None | Yes | Retrieves current user information |
| `/api/v1/texts` | POST | `{ "text": "string" }` | Yes | Creates a new text entry |
| `/api/v1/texts` | GET | None | Yes | Retrieves all text entries for the user |
| `/api/v1/texts/:id` | GET | None | Yes | Retrieves a specific text entry |
| `/api/v1/texts/:id` | DELETE | None | Yes | Deletes a specific text entry |
| `/api/v1/texts/:id` | PATCH | `{ "text": "string" }` | Yes | Updates a specific text entry |
| `/api/v1/texts/:id/word-count` | GET | None | Yes | Counts words in a specific text entry |
| `/api/v1/texts/:id/character-count` | GET | None | Yes | Counts characters in a specific text entry |
| `/api/v1/texts/:id/sentence-count` | GET | None | Yes | Counts sentences in a specific text entry |
| `/api/v1/texts/:id/paragraph-count` | GET | None | Yes | Counts paragraphs in a specific text entry |
| `/api/v1/texts/:id/longest-paragraph-words` | GET | None | Yes | Finds the longest word in each paragraph |

## Authentication
The application uses Google OAuth2.0 for authentication:

1. After successful authentication, users are redirected to the `SIGN_IN_URL` with a `session_token` in the cookies.
2. Include the `session_token` in the cookies for all authenticated API requests.

## Rate Limiting
To prevent abuse, the application implements rate limiting:

- Users are limited to 100 requests per 5-minute window.
- Exceeding this limit results in a `429 Too Many Requests` status code.

## Error Handling
The API uses standard HTTP status codes for error responses:

- `400 Bad Request`: Invalid input or missing required fields
- `401 Unauthorized`: Authentication failure or missing authentication
- `403 Forbidden`: Insufficient permissions for the requested action
- `404 Not Found`: Requested resource not found
- `422 Unprocessable Entity`: Validation error
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Unexpected server error

## Testing
Run the test suite with:
```bash
# copy the env.example file to .env.test and update the environment variables
cp env.example .env.test

# create a test database in the postgres server
CREATE DATABASE text_analyzer_tool_test;
# update the .env.test file with the test database credentials and database name

# run the test
npm run test
```

## Deployment
Deployment instructions are currently under development. Please check back for updates.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Future Development
- [ ] Compress the text using some compression algorithm to reduce the size of the text in database. It will also improve the performance of the application.
- [ ] Deploy the application on Cloud Service Provider like AWS, GCP, etc.