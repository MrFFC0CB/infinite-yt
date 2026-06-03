# infinite-yt

Personal project. A desktop app to listen to music on YouTube without the annoying "Are you still there?" pop-up.

> **Note:** This project is not intended for general use.

---

## Why it exists

YouTube Music pauses playback after a period of inactivity. The first attempt at solving this was a Firefox extension that simulated mouse movement and clicks — it worked, but required keeping a dedicated browser window open and manually loading the extension every time.

That led to looking into Electron. The hypothesis was that the inactivity timeout is a browser tab concern and shouldn't apply to the embedded player, which turned out to be correct. Puppeteer came in shortly after to handle search and related video fetching, and that closed the initial idea.

At some point the resource cost of running both Electron and a headless Chromium instance felt worth revisiting. A Python scraper seemed like a lighter alternative, but YouTube is fully CSR — no JavaScript execution means no rendered content — so Puppeteer stayed.

### Current plan

The project is currently on hold while testing a potential rewrite. While inspecting YouTube's network traffic in DevTools, the internal API that both youtube.com and music.youtube.com use became apparent. That opens up the possibility of replacing the scraping layer entirely with direct API calls, and dropping Electron in favor of a C# / .NET desktop app.

The goal is to validate this with an MVP before committing to a full rewrite. If the API approach proves stable enough, the next version would have no Puppeteer dependency and no Chromium overhead.

---

## Stack

| Layer | Technology |
|---|---|
| App shell | Electron 39 + Electron Forge |
| UI | React 19 + React Router 7 |
| Scraping | Puppeteer 24 (headless Chromium) |
| Internal server | Express 5 |
| Build | esbuild + TypeScript 5 |

---

## How it works

```
┌─────────────────────────────────────────────┐
│  Electron main process                      │
│                                             │
│  ┌──────────┐   IPC    ┌──────────────────┐ │
│  │ Express  │ ←──────→ │  puppeteer.ts    │ │
│  │ server   │          │  (scraping YTM)  │ │
│  └──────────┘          └──────────────────┘ │
│       ↑                                     │
│  BrowserWindow loads localhost (index.html) │
│       ↓                                     │
│  ┌──────────────────────────────────────┐   │
│  │  React UI (renderer process)         │   │
│  │  Home / Search / Watch / Favorites   │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

The main process runs an Express server that serves the React bundle. The UI loads from localhost inside a `BrowserWindow` — localhost is required because the YouTube iframe embed API only works in an HTTP/HTTPS context, not from a `file://` origin.

Search results and related videos are fetched by Puppeteer, which runs a separate headless Chromium instance that scrapes YouTube Music. Images, CSS, and fonts are intercepted and blocked during scraping, which speeds things up considerably. The scraping is triggered from the main process via `ipcMain.handle`.

### Cookies

On app close, the YouTube session cookies from the Electron window are exported to `data/cookies.json`. On the next run, Puppeteer loads those cookies into the headless browser so that scraping results reflect a personalized session — this improves the quality of search results and related video suggestions over time.

### Search source routing

When the search query contains keywords like `full`, `album`, `disco`, or `completo`, the scraper targets youtube.com instead of YouTube Music, since that type of content (full albums, complete discographies) is generally not available on YTM in one video and the app doesn't handle YT playlists (it has its own).

---

## Puppeteer / Chromium packaging

During `npm install`, Puppeteer downloads Chromium to `.cache/puppeteer/` (defined in `.puppeteerrc.cjs`). This keeps it inside the project directory rather than in a system-level path.

When packaging with `npm run package`, `forge.config.js` includes `.cache/puppeteer` as an `extraResource`, so Chromium is bundled inside the app. At runtime, `main.ts` resolves the cache path to `process.resourcesPath` when `app.isPackaged` is true, so the packaged app is fully self-contained.