# Task Manager

A minimal full-stack task manager built with React (Vite) + Node.js/Express.

## Setup

### Option A — Run both together (recommended)

```bash
cd task-manager
npm install          # installs concurrently
npm run dev          # starts backend on :3001 and frontend on :5173
```

### Option B — Run separately

```bash
# Terminal 1 — backend
cd task-manager/backend
npm install
node index.js

# Terminal 2 — frontend
cd task-manager/frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Features

- Add, complete, delete tasks
- Filter by All / Active / Completed
- Double-click a task title to edit it inline (Esc or click away to cancel)

## API

| Method | Path          | Body                        | Description        |
|--------|---------------|-----------------------------|--------------------|
| GET    | /tasks        | —                           | List all tasks     |
| POST   | /tasks        | `{ title: string }`        | Create task        |
| PATCH  | /tasks/:id    | `{ completed?, title? }`   | Update task        |
| DELETE | /tasks/:id    | —                           | Delete task        |

All responses: `{ success: boolean, data | error }`

## Assumptions & Trade-offs

- **In-memory storage**: tasks reset on server restart — acceptable per assignment brief
- **No auth**: out of scope for this assignment
- **No database**: `store.js` exports a plain array; swap with DB calls if needed
- **Tested on Node 18+**
