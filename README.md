# DoneToday

DoneToday is a tiny mobile-first React PWA for choosing one important task per day, running a distraction-free focus session, and building a daily completion streak.

## Live app

https://donetoday-prototype.vercel.app

## Product goal

Reduce daily planning overhead. The app deliberately supports only one daily commitment, so the user always knows what “done” means today.

## Features

- One task per calendar day
- Edit the current task until it is completed
- 10, 25, or 50 minute focus timer
- Start, pause, restart, and reset controls
- Daily completion action
- Seven-day completion strip and current streak
- Local-only persistence using `localStorage`
- Installable PWA metadata for iPhone
- Offline app-shell caching through a service worker
- Safe-area support for notched iPhones
- Responsive and keyboard-accessible UI
- Reduced-motion support

## Install on iPhone

1. Open https://donetoday-prototype.vercel.app in Safari.
2. Tap the Share button.
3. Scroll and tap **Add to Home Screen**.
4. Keep the name **DoneToday** and tap **Add**.
5. Launch it from the Home Screen. It opens in standalone app mode.

Open it online once before relying on offline mode so the service worker can cache the app shell.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Tests and build

```bash
npm test
npm run build
```

Verified for this release:

- 4 of 4 date/streak unit tests passed
- Vercel production build completed successfully
- Production deployment reached `READY`
- Home page, manifest, service worker, and compiled JavaScript returned HTTP 200
- No Vercel runtime errors were reported after deployment

## Data and privacy

All task, session, and streak data is stored in the browser on the current device. There is no account, backend, analytics SDK, or external database.

Clearing Safari website data or using **Reset all app data** removes the saved information. Data does not sync across devices.

## Known prototype constraints

- iOS can throttle JavaScript timers when the app is backgrounded, so the focus timer is intended for foreground use.
- The deployed Home Screen icon uses SVG. Newer iOS versions can derive an icon from it, but older versions may use a generated site preview instead.
- There are no notifications, cloud backup, login, or cross-device sync.

## Architecture

- React + Vite
- CSS design tokens and responsive layout
- `localStorage` state adapter
- Pure date/streak helpers with Node tests
- Static PWA assets in `public/`
- Vercel static deployment configuration

See `docs/ARCHITECTURE.md`, `docs/QA.md`, and `CHANGELOG.md`.
