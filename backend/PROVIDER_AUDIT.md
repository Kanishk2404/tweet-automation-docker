# Provider Selection & API Key Usage Audit

## What was changed
- Strict separation of user-provided and system (.env) API keys for all AI providers (Perplexity, Gemini, OpenAI).
- Backend only uses keys from the selected source (user or .env) and only for providers explicitly selected by the frontend.
- Fallback order is determined by which providers are selected and have valid keys.
- Added logging to `provider_audit.log` for every tweet generation request, recording provider order and keys used for audit/debugging.

## How it works
- If `useOwnKeys` is true, only keys sent by the frontend are used. If false, only keys from `.env` are used.
- Providers are only tried if both a valid key is present and the provider is selected.
- No fallback between user and system keys.
- All logic works identically in local and hosted environments.

## Example log entry
```
[2025-07-27T12:53:32.535Z] Provider order: ["openai"], Keys: {"validPerplexityKey":null,"validGeminiKey":null,"validOpenaiKey":"sk-..."}
```

## Deployment notes
- After changing `.env` keys, restart the backend to reload them.
- To audit provider usage, check `provider_audit.log` in the backend directory.

## Last update
- July 27, 2025
- Author: GitHub Copilot
