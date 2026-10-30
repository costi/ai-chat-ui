# AI Chat UI

A single HTML page that works with an OpenAI Chat Completions API.

Open `index.html` in your browser, enter the API endpoint, model name, and API key, and start chatting. Responses stream directly into the page.

Supports Markdown responses, including headings, lists, links, tables, and code blocks. Marked renders Markdown and DOMPurify sanitizes the HTML. Both load from a CDN; if they cannot load, responses display as plain text.

No installation or build step required.
