# Tweet Automator – Documentation

## Overview
Tweet Automator is a full-stack web application for AI-powered tweet, thread, and image generation, with advanced scheduling, bulk prompt input, and robust provider fallback. It is containerized for easy deployment.

---

## Key Functionalities
- **AI Tweet/Thread/Image Generation:**
  - Supports OpenAI, Gemini, and Perplexity providers with user-supplied API keys.
  - Provider fallback: If one provider fails, others are tried automatically.
  - Strict sanitization of generated content.
- **Bulk Prompt Input & Review:**
  - Enter multiple prompts at once for batch tweet generation.
  - Each generated tweet appears in the review panel as soon as it's ready.
  - Edit any generated tweet before scheduling (no AI regeneration on edit).
- **Advanced Scheduling:**
  - Schedule tweets in bulk, with options for daily, twice daily, or four times a week posting.
  - Select start date and posting times for all scheduled tweets.
  - Each tweet is scheduled for its own day/time.
- **History & Management:**
  - View tweet history and scheduled posts.
  - (Delete for scheduled posts is disabled by user request.)
- **User-Supplied API Keys:**
  - Enter your own keys for Twitter/X and AI providers in the UI.
- **Containerized Deployment:**
  - Docker Compose for local and production use.

---

## Major Errors Faced & Solutions

### 1. Frontend-Backend Communication in Docker
- **Problem:** Frontend could not reach backend using `localhost` inside Docker.
- **Solution:** Used Docker Compose service names (e.g., `backend`) and set backend to listen on `0.0.0.0`.

### 2. Environment Variables Not Set at Build Time
- **Problem:** VITE_API_URL and other env vars were not picked up by frontend at build time.
- **Solution:** Ensured `.env` is present before building frontend image; set VITE_API_URL to `http://backend:5000` for Docker.

### 3. CORS and JSON Parsing Errors
- **Problem:** CORS errors and JSON parsing issues between frontend and backend.
- **Solution:** Enabled CORS and JSON parsing middleware in backend.

### 4. Endpoint Placement & 404 Errors
- **Problem:** `/schedule-bulk-tweets` endpoint was missing or misplaced, causing 404s.
- **Solution:** Ensured endpoint is defined after DB initialization and only once.

### 5. Twitter/X Rate Limits (429 Errors)
- **Problem:** Hitting Twitter/X's strict 24-hour posting limit (17 tweets per user/app).
- **Solution:** Added error handling and user messaging; users must wait for reset or apply for elevated access.

### 6. UI/UX Issues in Bulk Review
- **Problem:** Duplicate textareas, edit button not working, or review panel not updating in real time.
- **Solution:** Refactored to allow per-tweet editing, removed duplicate UI, and made review panel update as each tweet is generated.

---

## How We Fixed Issues
- Used per-prompt loading state for editing/regeneration.
- Allowed editing of generated tweet content directly (no AI call on edit).
- Removed delete button from scheduled posts as requested.
- Ensured only one textarea or tweet display is shown in bulk review.
- Added backend logging for provider/key usage in bulk generation.
- Unified bulk prompt input and review into a single panel for better UX.

---

## Deployment & Usage
- See the main `README.md` for Docker Compose instructions and project structure.
- All API keys are entered in the web UI; no .env file is needed for end users.

---

## Contributors
- Fork, branch, and submit PRs for new features or fixes.
- See troubleshooting notes in the main README for Docker and networking tips.

---

Enjoy automating your tweets with AI!
