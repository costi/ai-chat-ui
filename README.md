# AI Chat UI

A single HTML page that works with an OpenAI Chat Completions API.

Open `index.html`, enter your endpoint, model, and API key in **Connection settings**, and start chatting. No installation or build step required.

You get Markdown responses, saved chats in a sidebar, automatic chat titles, and browser tools for calculations, JavaScript, interactive previews, time, and fetching CORS-enabled websites. Your model must support tool calling to use the tools.

Press **Enter** to send or **Shift + Enter** for a new line. Streaming keeps your reading position; **Jump to latest** takes you to the bottom.

**Edit this app** lets you describe a change, preview a proposed version in a new tab, and download it as a separate HTML file.

The context bar shows an estimate and API token usage when available. Set your model’s maximum context size in settings.

Settings and chats stay in this browser. Tokens are saved unencrypted. Local-file storage varies by browser; if needed, run `python3 -m http.server 8000` and open `http://localhost:8000`.
