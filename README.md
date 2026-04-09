# TickTasks

## Setup and Run

```bash
cd GlobalTrends
npm install
npm --prefix backend install
npm --prefix frontend install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Tests

```bash
cd GlobalTrends
npm test
```

## Docker

```bash
cd GlobalTrends
docker compose up --build
docker compose down
```

Open [http://localhost:5173](http://localhost:5173)

## Features

- Create new tasks quickly
- Toggle tasks as complete
- Delete tasks in one tap
- Filter all active completed
- Edit titles inline instantly
- Display clear rename hint
- Complete all remaining tasks
- Celebrate completion with confetti
- Set low medium high priority
- Show priority colored dot badges
- Cache tasks in localStorage
- Persist tasks across refresh
- Persist tasks across restarts
- Show total active completed counts
- Show loading error empty states