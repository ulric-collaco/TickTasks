const rawApiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const API_BASE_URL = rawApiBase.replace(/\/$/, '');
const TASKS_URL = `${API_BASE_URL}/tasks`;

async function handleResponse(res) {
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Request failed');
  return json.data;
}

export async function getTasks() {
  const res = await fetch(TASKS_URL);
  return handleResponse(res);
}

export async function createTask(title) {
  const res = await fetch(TASKS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  return handleResponse(res);
}

export async function updateTask(id, completed) {
  const res = await fetch(`${TASKS_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
  return handleResponse(res);
}

export async function updateTaskTitle(id, title) {
  const res = await fetch(`${TASKS_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  return handleResponse(res);
}

export async function deleteTask(id) {
  const res = await fetch(`${TASKS_URL}/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}
