# QA Report

## Release target

- Production URL: https://donetoday-prototype.vercel.app
- Vercel project: `donetoday-prototype`
- Deployment state: `READY`

## Automated logic tests

Command:

```bash
npm test
```

Result: **4/4 passed**

Covered:

- Date shifting across a month boundary
- Streak through the current day
- Streak through yesterday when today is incomplete
- Streak termination when there is a gap

## Production verification

- Vercel production build completed successfully
- Build error log contained no errors
- Production alias resolved correctly
- `/` returned HTTP 200
- `/manifest.webmanifest` returned HTTP 200 with `application/manifest+json`
- `/service-worker.js` returned HTTP 200 with `Service-Worker-Allowed: /`
- Compiled JavaScript asset returned HTTP 200
- Vercel runtime error query returned no errors

## Workflow checklist

The implemented workflow supports:

1. Open app with clean storage.
2. Create today’s task.
3. Edit the task before completion.
4. Select a 10, 25, or 50 minute focus duration.
5. Start, pause, restart, or reset the timer.
6. Mark today complete.
7. Update the completion strip and streak.
8. Reload and restore state from `localStorage`.
9. Reset all data from settings.
10. Install from Safari using **Add to Home Screen**.
11. Reopen the cached app shell after one successful online load.

## Responsive targets

- iPhone SE width: 375px
- iPhone 12/13/14 width: 390px
- Larger phone: 430px
- Desktop fallback: centered 520px app shell

## Environment note

The execution environment blocked automated Chromium navigation to the public deployment with `ERR_BLOCKED_BY_ADMINISTRATOR`. This was an environment policy restriction rather than an application or deployment error. Live endpoint verification, Vercel build/runtime checks, and unit tests were completed successfully.

## Remaining prototype risks

- iOS may throttle the timer while the app is backgrounded.
- Local browser storage can be cleared by the user or operating system.
- Older iOS versions may not use the SVG as a custom Home Screen icon.
