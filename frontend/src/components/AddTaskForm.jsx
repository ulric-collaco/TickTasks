import { useState } from 'react'

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const priorityOptions = ['low', 'medium', 'high']

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

      <div className="priority-picker" role="radiogroup" aria-label="Task priority">
        {/* Choose task priority */}
        {priorityOptions.map((level) => {
          const active = priority === level
          return (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={active}
              className={`priority-option ${level}${active ? ' active' : ''}`}
              onClick={() => setPriority(level)}
              disabled={submitting}
            >
              <span className={`priority-dot ${level}`} aria-hidden="true" />
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          )
        })}
      </div>

      <button className="add-task-btn" type="submit" disabled={submitting}>
        {submitting ? 'Adding...' : 'Add'}
      </button>
      {error && <span className="form-error">{error}</span>}
    </form>
  )
}
