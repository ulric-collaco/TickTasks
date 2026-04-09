const fs = require('fs');
const path = require('path');

const STORE_FILE = process.env.STORE_FILE || path.join(__dirname, 'tasks.json');

let tasks = [];
let idCounter = 1;

function getNextId(existingTasks) {
  if (!Array.isArray(existingTasks) || existingTasks.length === 0) return 1;
  return existingTasks.reduce((maxId, task) => {
    return Number.isInteger(task.id) && task.id > maxId ? task.id : maxId;
  }, 0) + 1;
}

function persist() {
  fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
  fs.writeFileSync(
    STORE_FILE,
    JSON.stringify({ tasks, idCounter }, null, 2),
    'utf8'
  );
}

function loadFromDisk() {
  if (!fs.existsSync(STORE_FILE)) {
    persist();
    return;
  }

  try {
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    if (!raw.trim()) {
      persist();
      return;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      tasks = parsed;
      idCounter = getNextId(tasks);
      persist();
      return;
    }

    tasks = Array.isArray(parsed.tasks) ? parsed.tasks : [];
    idCounter = Number.isInteger(parsed.idCounter)
      ? parsed.idCounter
      : getNextId(tasks);
  } catch (_err) {
    tasks = [];
    idCounter = 1;
    persist();
  }
}

loadFromDisk();

const getAll = () => tasks;

const create = (title) => {
  const task = {
    id: idCounter++,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  persist();
  return task;
};

const update = (id, fields) => {
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;
  if (fields.completed !== undefined) task.completed = fields.completed;
  if (fields.title !== undefined) task.title = fields.title.trim();
  persist();
  return task;
};

const remove = (id) => {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  persist();
  return true;
};

const clearAll = () => {
  tasks = [];
  idCounter = 1;
  persist();
};

module.exports = { getAll, create, update, remove, clearAll };
