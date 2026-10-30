# Working on AI Chat UI

- Keep the app in `index.html`: no build step or framework required.
- Keep the README short, plain, and focused on using the app. Put developer guidance here instead.
- Preserve saved settings and threads when changing the storage format.
- Keep streamed replies from moving the reader’s scroll position.
- The composer should grow with newlines and wrapped text, shrink when text is removed, and reset after sending.
- Sanitize rendered Markdown. Run generated code only in isolated Workers/frames; never expose the parent DOM, credentials, or chat storage.
- Keep app-update proposals separate from the working file and preview them in a sandbox.
- Label context counts as estimates and context limits as manual settings.
- Verify behavioral UI changes in a browser, including mobile layout. Use mocked API responses instead of live paid requests unless explicitly requested.
