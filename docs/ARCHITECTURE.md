# Architecture

## Scope

DoneToday is intentionally frontend-only. A server would add cost and complexity without improving the single-device use case.

## Modules

- `src/App.jsx`: product workflow and state composition
- `src/components/ProgressRing.jsx`: accessible timer visualization
- `src/components/BottomSheet.jsx`: reusable mobile modal surface
- `src/lib/date.js`: date keys, recent days, and streak calculation
- `src/lib/storage.js`: versioned local persistence
- `public/service-worker.js`: offline app-shell caching
- `public/manifest.webmanifest`: install metadata

## State model

```js
{
  task: string,
  taskDate: 'YYYY-MM-DD',
  completedDates: string[],
  focusMinutes: 10 | 25 | 50,
  focusSessions: number,
  lastCompletedTask: string
}
```

The state is written to `donetoday-state-v1`. The versioned key makes a future migration possible without corrupting older data.

## Deliberate constraints

- One active task per day
- No login or cross-device sync
- No notifications
- No background timer guarantee after iOS suspends the app

These constraints keep the prototype private, fast, and usable without setup.
