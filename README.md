# Tweet Automator 🚀

This is a web application that helps automate tweeting using AI for content and image generation. It is fully containerized and ready for deployment or local use with Docker Compose.

## How to Access and Use

### Prerequisites
- [Docker](https://www.docker.com/get-started) must be installed on your machine.

### Quick Start (Production/Sharing)
1. **Clone this repository:**
   ```bash
   git clone https://github.com/Kanishk2404/tweet-automation-docker.git
   cd tweet-automation-docker
   ```
2. **Start the app with Docker Compose:**
   ```bash
   docker compose -f docker-compose.prod.yml up --build
   ```
3. **Open your browser and go to:**
   [http://localhost:3000](http://localhost:3000)
4. **Enter your API keys** in the web UI and start generating and posting tweets!

### For Development
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

## Notes
- **No .env file is needed for users.** All API keys are entered in the web UI after the app loads.
- The backend and frontend are fully containerized and networked via Docker Compose.
- For any issues, check the logs with `docker compose logs backend` or `docker compose logs frontend`.

---

Enjoy automating your tweets with AI!
