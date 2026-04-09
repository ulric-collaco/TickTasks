import { useState } from 'react'

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
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
      await onAdd(trimmed)
      setTitle('')
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
      <button className="add-task-btn" type="submit" disabled={submitting}>
        {submitting ? 'Adding...' : 'Add'}
      </button>
      {error && <span className="form-error">{error}</span>}
    </form>
  )
}
