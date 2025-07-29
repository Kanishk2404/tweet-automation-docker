# Tweet Automator 🚀


Tweet Automator is a full-stack web application for AI-powered tweet, thread, and image generation, with advanced scheduling, bulk prompt input, and robust provider fallback. It is fully containerized and ready for deployment or local use with Docker Compose.

**Key Features:**
- AI tweet/thread/image generation (OpenAI, Gemini, Perplexity; user-supplied keys; provider fallback)
- Bulk prompt input and review (edit generated tweets before scheduling)
- Advanced scheduling (daily, twice daily, four times a week; start date and time selection)
- Real-time review panel (see each tweet as soon as it's generated)
- Edit generated tweets directly in review (no AI call on edit)
- Strict content sanitization
- History and scheduled posts view (delete disabled for scheduled posts)
- Containerized with Docker Compose

## How to Access and Use

### For Users (No Coding Required)
- **Quick Start:**
  1. Download or copy the `docker-compose.prod.yml` file to your machine.
  2. Make sure you have [Docker](https://www.docker.com/get-started) installed.
  3. In the same folder as `docker-compose.prod.yml`, run:
     ```bash
     docker compose -f docker-compose.prod.yml up --build
     ```
  4. Open your browser and go to [http://localhost:3000](http://localhost:3000)
  5. Enter your API keys in the web UI and start automating your tweets!
- You do not need to clone the full repository unless you want to contribute or customize the code.

### For Contributors (Developers)
- **Clone this repository:**
  ```bash
  git clone https://github.com/Kanishk2404/tweet-automation-docker.git
  cd tweet-automation-docker
  ```
- Use `docker-compose.yml` for local development (hot reload, etc.).
- Use `docker-compose.prod.yml` for production or sharing.

## Project Structure
```
/tweet-automation-docker
|-- backend/
|   |-- Dockerfile
|   |-- server.js
|   |-- package.json
|   `-- ... (other backend files)
|
|-- frontend/
|   |-- Dockerfile
|   |-- App.jsx
|   |-- package.json
|   `-- ... (other frontend files)
|
|-- .gitignore
|-- docker-compose.yml             # For development
|-- docker-compose.prod.yml        # For deployment/sharing
`-- README.md                      # Instructions
```


## Documentation & Troubleshooting
- See `DOCUMENTATION.md` for a full list of features, error history, and how issues were fixed.
- **No .env file is needed for users.** All API keys are entered in the web UI after the app loads.
- The backend and frontend are fully containerized and networked via Docker Compose.
- For any issues, check the logs with `docker compose logs backend` or `docker compose logs frontend`.

---
## For Contributors
- Want to contribute? Feel free to fork this repository and submit a pull request!
- Contributions are welcome—add features, fix bugs, or improve documentation:
  1. Fork this repository.
  2. Create a new branch for your feature or fix.
  3. Make your changes and test them locally using Docker Compose.
  4. Submit a pull request with a clear description of your changes.
- Please follow best practices for code quality and documentation.
- For major changes, open an issue first to discuss what you would like to change.

## Troubleshooting: Frontend-Backend Container Communication
- During development, a major challenge was getting the frontend container to talk to the backend container reliably.
- **Common Issues Faced:**
  - Frontend could not reach backend when using `localhost` or `127.0.0.1` inside Docker.
  - Environment variables (like VITE_API_URL) were not set or picked up correctly at build time.
  - Docker Compose service names were not used, causing network errors.
- **Solutions:**
  - Changed backend to listen on `0.0.0.0` instead of `localhost` for Docker compatibility.
  - Set `VITE_API_URL` to `http://backend:5000` in the frontend's build environment and .env file.
  - Ensured .env is present before building the frontend image.
  - Used Docker Compose service names (`backend`) for internal networking between containers.
- **Lesson Learned:**
  - Always use Docker Compose service names for container-to-container communication.
  - Ensure environment variables are available at build time, not just runtime.
  - Test networking on multiple platforms to catch environment-specific issues early.

---

Enjoy automating your tweets with AI!
