const fs = require('fs');
const path = require('path');
const request = require('supertest');

const testStoreFile = path.join(__dirname, 'test-tasks.json');
process.env.STORE_FILE = testStoreFile;

const app = require('../app');
const store = require('../store');

describe('Task API', () => {
  beforeEach(() => {
    store.clearAll();
  });

  afterAll(() => {
    if (fs.existsSync(testStoreFile)) {
      fs.unlinkSync(testStoreFile);
    }
  });

  test('creates and returns tasks', async () => {
    const createRes = await request(app)
      .post('/tasks')
      .send({ title: 'Write tests' })
      .expect(201);

    expect(createRes.body.success).toBe(true);
    expect(createRes.body.data.title).toBe('Write tests');

    const listRes = await request(app).get('/tasks').expect(200);
    expect(listRes.body.success).toBe(true);
    expect(listRes.body.data).toHaveLength(1);
    expect(listRes.body.data[0].completed).toBe(false);
  });

  test('updates completion and title', async () => {
    const createRes = await request(app)
      .post('/tasks')
      .send({ title: 'Initial title' })
      .expect(201);

    const taskId = createRes.body.data.id;

    const completeRes = await request(app)
      .patch(`/tasks/${taskId}`)
      .send({ completed: true })
      .expect(200);

    expect(completeRes.body.data.completed).toBe(true);

    const renameRes = await request(app)
      .patch(`/tasks/${taskId}`)
      .send({ title: 'Updated title' })
      .expect(200);

    expect(renameRes.body.data.title).toBe('Updated title');
  });

  test('persists tasks to disk and reloads after module refresh', async () => {
    await request(app)
      .post('/tasks')
      .send({ title: 'Persist me' })
      .expect(201);

    jest.resetModules();
    process.env.STORE_FILE = testStoreFile;
    const reloadedStore = require('../store');

    const allTasks = reloadedStore.getAll();
    expect(allTasks).toHaveLength(1);
    expect(allTasks[0].title).toBe('Persist me');
  });
});
