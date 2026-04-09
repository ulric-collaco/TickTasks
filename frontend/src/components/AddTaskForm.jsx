import { useState } from 'react'

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) {
      setError('Title cannot be empty.')
      return
    }
    try {
      setSubmitting(true)
      setError('')
      await onAdd(trimmed, priority)
      setTitle('')
      setPriority('medium')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <input
        className="add-task-input"
        type="text"
        placeholder="New task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={submitting}
      />
      {/* Choose task priority */}
      <select
        className="priority-select"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        disabled={submitting}
        aria-label="Select priority"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button className="add-task-btn" type="submit" disabled={submitting}>
        {submitting ? 'Adding...' : 'Add'}
      </button>
      {error && <span className="form-error">{error}</span>}
    </form>
  )
}
