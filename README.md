# Gemini Chat UI

A standalone browser chat UI generated with Gemini. The original HTML is preserved in `index.html`.

## Run locally

Open `index.html` in your browser, or serve this directory:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

Enter a compatible chat completions endpoint, model name, and API key, then send a message. The UI streams responses and keeps conversation history in memory for the current page session.

The endpoint must allow browser requests through CORS. The API key is sent directly from your browser to the endpoint you enter. Use this as a personal local prototype; a shared production deployment should handle credentials on a server.

## Files

- `index.html` — UI styles and JavaScript, with no build step or external dependencies.
