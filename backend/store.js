let tasks = [];
let idCounter = 1;

const getAll = () => tasks;

const create = (title) => {
  const task = {
    id: idCounter++,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  return task;
};

const update = (id, fields) => {
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;
  if (fields.completed !== undefined) task.completed = fields.completed;
  if (fields.title !== undefined) task.title = fields.title.trim();
  return task;
};

const remove = (id) => {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
};

module.exports = { getAll, create, update, remove };
