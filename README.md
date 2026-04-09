# Task Manager

A minimal full-stack task manager built with React (Vite) + Node.js/Express.

## Setup

### Option A - Run both together (recommended)

```bash
cd GlobalTrends
npm install
npm --prefix backend install
npm --prefix frontend install
npm run dev
```

### Option B - Run separately

```bash
# Terminal 1 - backend
cd GlobalTrends/backend
npm install
npm start

# Terminal 2 - frontend
cd GlobalTrends/frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Features

- Add, complete, and delete tasks
- Complete-all action button for one-click finishing
- Confetti celebration when every task is complete
- Filter by all, active (incomplete), or completed status
- Edit an existing task title inline
- Priority levels (low/medium/high) with colored dot indicators
- Local cache via browser localStorage
- Persist tasks after refresh/server restart (file-backed store)

## API

| Method | Path        | Body                      | Description    |
|--------|-------------|---------------------------|----------------|
| GET    | /tasks      | -                         | List all tasks |
| POST   | /tasks      | `{ title: string, priority?: "low"|"medium"|"high" }` | Create task |
| PATCH  | /tasks/:id  | `{ completed?, title?, priority? }` | Update task |
| DELETE | /tasks/:id  | -                         | Delete task    |

All responses: `{ success: boolean, data | error }`

## Tests

```bash
cd GlobalTrends
npm test
```

This runs basic backend API tests (create/list/update and persistence reload behavior).

## Docker

```bash
cd GlobalTrends
docker compose up --build
```

Open [http://localhost:5173](http://localhost:5173)

Stop containers:

```bash
docker compose down
```

The backend data is persisted using a Docker volume (`backend_data`).

## Notes

- No authentication (out of scope)
- Store location defaults to `backend/tasks.json` locally
- Store location in Docker is `/app/data/tasks.json`
- Tested on Node 18+