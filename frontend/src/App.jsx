import { useState, useEffect } from 'react'
import { getTasks, createTask, updateTask, deleteTask } from './api'
import AddTaskForm from './components/AddTaskForm'
import FilterBar from './components/FilterBar'
import TaskList from './components/TaskList'
import './index.css'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadTasks()
  }, [])

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

  async function handleAdd(title) {
    const task = await createTask(title)
    setTasks((prev) => [...prev, task])
  }

  async function handleToggle(id, completed) {
    try {
      const updated = await updateTask(id, completed)
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
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
      const res = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'Update failed')
      setTasks((prev) => prev.map((t) => (t.id === id ? json.data : t)))
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
