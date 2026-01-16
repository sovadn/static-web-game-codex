# static-web-game-codex

Static web game deployed via GitHub Pages.

## Local testing
- Open `index.html` directly in a browser, or serve the repo with `python -m http.server 8000`.
- `vendor/vexflow-min.js` is included so notation works even when CDN scripts are blocked.
- If automated browser testing fails in a container (Playwright timeouts/crashes), try running the same commands on your local machine or on GitHub Pages to rule out container graphics/sandbox limits.
