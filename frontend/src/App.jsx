import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { getTasks, createTask, updateTask, updateTaskTitle, deleteTask } from './api'
import AddTaskForm from './components/AddTaskForm'
import FilterBar from './components/FilterBar'
import TaskList from './components/TaskList'
import './index.css'

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const cached = localStorage.getItem('tasks-cache')
      return cached ? JSON.parse(cached) : []
    } catch {
      return []
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadTasks()
  }, [])

  // Cache tasks locally
  useEffect(() => localStorage.setItem('tasks-cache', JSON.stringify(tasks)), [tasks])

  function fireCompletionConfetti() {
    // Celebrate full completion
    confetti({ particleCount: 140, spread: 90, origin: { y: 0.65 } })
  }

  async function loadTasks() {
    try {
      setLoading(true)
      setError('')
      const data = await getTasks()
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(title, priority) {
    const task = await createTask(title, priority)
    setTasks((prev) => [...prev, task])
  }

  async function handleToggle(id, completed) {
    try {
      const updated = await updateTask(id, completed)
      setTasks((prev) => {
        const next = prev.map((t) => (t.id === updated.id ? updated : t))
        if (next.length > 0 && next.every((t) => t.completed)) {
          fireCompletionConfetti()
        }
        return next
      })
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleCompleteAll() {
    try {
      setError('')
      const remaining = tasks.filter((t) => !t.completed)
      if (remaining.length === 0) return

      const updatedList = await Promise.all(
        remaining.map((task) => updateTask(task.id, true))
      )
      const updatedMap = new Map(updatedList.map((task) => [task.id, task]))
      const nextTasks = tasks.map((task) => updatedMap.get(task.id) || task)
      setTasks(nextTasks)
      fireCompletionConfetti()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleEdit(id, newTitle) {
    try {
      const updated = await updateTaskTitle(id, newTitle)
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch (err) {
      setError(err.message)
    }
  }

  const filtered = tasks.filter((t) => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const totalCount = tasks.length
  const activeCount = tasks.filter((t) => !t.completed).length
  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <div className="layout">
      {/* Left Column */}
      <aside className="leftSidebar">
        <h1 className="title">Tasks</h1>
        
        <FilterBar filter={filter} onFilterChange={setFilter} />

        <div className="statsBlock">
          <div className="statItem">
            <span className="statLabel">Total</span>
            <span className="statNumber">{totalCount}</span>
          </div>
          <div className="statItem">
            <span className="statLabel">Active</span>
            <span className="statNumber">{activeCount}</span>
          </div>
          <div className="statItem">
            <span className="statLabel">Completed</span>
            <span className="statNumber">{completedCount}</span>
          </div>
        </div>
      </aside>

      {/* Right Column */}
      <main className="rightContent">
        <AddTaskForm onAdd={handleAdd} />

        <div className="action-strip">
          {/* Complete remaining tasks */}
          <button
            type="button"
            className="complete-all-btn"
            onClick={handleCompleteAll}
            disabled={activeCount === 0}
          >
            {activeCount === 0 ? 'All tasks complete' : `Complete ${activeCount} remaining`}
          </button>

          {/* Show rename guidance */}
          <p className="rename-hint">
            Rename any task with double-click. Press Enter to save, or Esc to cancel.
          </p>
        </div>
        
        {error && <div className="error">{error}</div>}

        {loading ? (
          <p className="loading">Processing...</p>
        ) : (
          <TaskList 
            tasks={filtered} 
            onToggle={handleToggle} 
            onDelete={handleDelete} 
            onEdit={handleEdit} 
          />
        )}
      </main>
    </div>
  )
}
