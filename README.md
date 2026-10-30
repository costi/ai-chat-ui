# AI Chat UI

A single HTML page that works with an OpenAI Chat Completions API.

Open `index.html` in your browser, enter the API endpoint, model name, and API key under **Connection settings** in the sidebar, and start chatting. Responses stream directly into the page.

Supports Markdown responses, including headings, lists, links, tables, and code blocks. Marked renders Markdown and DOMPurify sanitizes the HTML. Both load from a CDN; if they cannot load, responses display as plain text.

No installation or build step required.

Settings (endpoint, model, and token) and multiple chat threads are saved in your browser's local storage. Use **New chat**, the left sidebar, and **Delete current chat** to manage conversations. On mobile, open the sidebar with the menu button. Tokens are stored unencrypted; clearing browser storage removes saved settings and chats.

Opening the HTML directly from disk works in browsers that permit local storage for `file://` pages, but this behavior varies by browser. Moving or renaming the file may give it a different storage area. For a stable origin, run `python3 -m http.server 8000` in this folder and open `http://localhost:8000`. If saving fails or storage fills up, the page displays a notice and continues in memory.

Streaming replies preserve your reading position. Use **Jump to latest** to scroll to the bottom when you want to.

After the first successful response in a new chat, one additional non-streaming API request generates a short topic title using the same endpoint, model, and token. Titles are saved with the thread. If naming fails, the sidebar keeps the first message as the title.
