# AI Chat UI

A single HTML page that works with an OpenAI Chat Completions API.

Open `index.html` in your browser, enter the API endpoint, model name, and API key under **Connection settings** in the sidebar, and start chatting. Responses stream directly into the page.

Supports Markdown responses, including headings, lists, links, tables, and code blocks. Marked renders Markdown and DOMPurify sanitizes the HTML. Both load from a CDN; if they cannot load, responses display as plain text.

No installation or build step required.

Settings (endpoint, model, and token) and multiple chat threads are saved in your browser's local storage. Use **New chat**, the left sidebar, and **Delete current chat** to manage conversations. On mobile, open the sidebar with the menu button. Tokens are stored unencrypted; clearing browser storage removes saved settings and chats.

Opening the HTML directly from disk works in browsers that permit local storage for `file://` pages, but this behavior varies by browser. Moving or renaming the file may give it a different storage area. For a stable origin, run `python3 -m http.server 8000` in this folder and open `http://localhost:8000`. If saving fails or storage fills up, the page displays a notice and continues in memory.

Streaming replies preserve your reading position. Use **Jump to latest** to scroll to the bottom when you want to.

After the first successful response in a new chat, one additional non-streaming API request generates a short topic title using the same endpoint, model, and token. Titles are saved with the thread. If naming fails, the sidebar keeps the first message as the title.


## Browser tools

Enable **Browser tools** under **Connection settings**. The endpoint and model must support OpenAI-style Chat Completions function calls. Tool calls and results appear in expandable cards and are saved with the thread.

- `get_current_time`: browser date/time in the local timezone or an IANA timezone.
- `calculator`: arithmetic with parentheses, powers, and standard floating-point precision; no JavaScript evaluation.
- `run_javascript`: async JavaScript function body in a fresh Worker inside an opaque-origin sandbox. Use `return` for the result and `console.log` for logs. Computation has a five-second timeout and input/output limits. No parent DOM, saved token, storage, network, Node.js, or packages.
- `render_html`: inline HTML/CSS/JavaScript in a separate sandboxed iframe. External resources and fetch are blocked by CSP; data images work. Previews can be closed or rerun. Saved previews require an explicit click to run after reloading or switching threads.
- `fetch_url`: public HTTPS text/HTML/JSON/XML via a credential-free GET. CORS still applies; redirects, local-address/IP literals, and embedded credentials are rejected. Responses have a 15-second timeout and are limited to 20,000 characters. HTML is returned as source; its scripts do not execute. There is no proxy or access to other tabs.

The chat allows up to ten executed tools and six model rounds per user turn. **Stop** cancels requests/computation and closes visible previews. Disable tools or **Request API token usage** if your compatible endpoint rejects those options.

These are browser isolation measures, not a hardened hostile-code execution service. Interactive iframe scripts can still consume resources or freeze the UI; only Worker computation has a reliably enforced timeout. Browser CSP does not block every possible navigation channel, and hostname checks do not provide DNS-level network isolation. Do not put secrets into generated code or previews.

## Propose changes to the app

Click **Edit this app**, describe a change, and generate a proposal using the configured endpoint/model. The request includes a snapshot of the HTML source taken before saved settings or chats enter the DOM. It does not include the live conversation, token, or local storage.

The model returns a complete replacement HTML file, rather than a diff. **Preview in new tab** opens a static review shell containing an isolated iframe; the generated app cannot read your saved state or make API calls in this preview. **Download proposed HTML** saves a separate file. The working file is never overwritten or automatically replaced. Review downloaded code before using it outside the preview. Models with small output limits may be unable to return the whole file; truncated responses are rejected.

## Context status

The composer shows estimated context tokens, including chat messages and tool definitions/results. This is a rough text-length estimate (about four characters per token), not a tokenizer or an exact limit check. The maximum is a **manual setting** under Connection settings, initially 128,000; set it for your chosen model. It is not detected from the endpoint. The indicator warns near that configured limit but does not truncate history automatically.

When **Request API token usage** is enabled and the endpoint reports it, the status also shows the last chat request's actual input/output token counts. These exclude separate title-generation and app-editing requests.
