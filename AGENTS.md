# Working on AI Chat UI

- Keep the app in `index.html`: no build step or framework required.
- Keep the README short, plain, and focused on using the app. Put developer guidance here instead.
- Preserve saved settings and threads when changing the storage format.
- Keep streamed replies from moving the reader’s scroll position.
- The composer should grow with newlines and wrapped text, shrink when text is removed, and reset after sending.
- Sanitize rendered Markdown. Run generated code only in isolated Workers/frames; never expose the parent DOM, credentials, or chat storage.
- Chat and app editing should share the streamed Chat Completions tool parser. A missing tool call does not establish that a model lacks tool support.
- Show executed JavaScript in tool cards and preserve it when saved chats reload.
- Use chunk-based source tools for app editing; keep model history bounded instead of sending or regenerating the whole file.
- Interactive previews may load scripts, styles, assets, and fetch from any HTTPS source. Keep opaque-origin isolation and keep the computation Worker network-blocked.
- Keep artifact content in IndexedDB (with a local-storage fallback), and keep compact name/version references in chat. Do not resend historical artifact source or patch arguments; source tools return bounded chunks on demand.
- Artifact versions are immutable. A new artifact starts at v0. All creation/edit calls in one user turn share drafts and commit at most one version per changed artifact. Failed/cancelled turns commit none; multi-artifact commits are atomic.
- Chat and dedicated artifact editing use the same read/search/edit/view tools. Existing viewers stay pinned to explicit versions. Restoring creates a new version with the selected version as parent; never overwrite history.
- Preserve existing canvas source during migration. Never read the iframe runtime DOM across its isolation boundary.
- Keep app-update proposals separate from the working file and preview them in a sandbox.
- Label context counts as estimates and context limits as manual settings.
- Verify behavioral UI changes in a browser, including mobile layout. Use mocked API responses instead of live paid requests unless explicitly requested.

## Regression checks

With Playwright and Chromium installed, run `node tests/artifacts-core.cjs` and `node tests/artifacts-chat.cjs`. `CHROME_BIN` can select an installed Chrome executable. These tests mock the API and block external requests. They cover version transactions, persistence, rollback, pinned references, and source compaction.
