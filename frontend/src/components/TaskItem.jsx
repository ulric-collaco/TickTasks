import { useState } from 'react'

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)

  const createdAt = new Date(task.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  function handleDoubleClick() {
    setEditing(true)
    setEditTitle(task.title)
  }

  async function handleEditSubmit(e) {
    e.preventDefault()
    const trimmed = editTitle.trim()
    if (!trimmed || trimmed === task.title) {
      setEditing(false)
      return
    }
    await onEdit(task.id, trimmed)
    setEditing(false)
  }

  function handleEditKeyDown(e) {
    if (e.key === 'Escape') setEditing(false)
  }

  return (
    <li className={`task-item${task.completed ? ' completed' : ''}`}>
      <input
        className="task-checkbox"
        type="checkbox"
        checked={task.completed}
        onChange={(e) => onToggle(task.id, e.target.checked)}
      />

      <div className="task-body">
        {editing ? (
          <form className="edit-form" onSubmit={handleEditSubmit}>
            <input
              className="edit-input"
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleEditKeyDown}
              onBlur={handleEditSubmit}
            />
          </form>
        ) : (
          <span
            className={`task-title${task.completed ? ' done' : ''}`}
            onDoubleClick={handleDoubleClick}
            title="Double-click to edit"
          >
            {task.title}
          </span>
        )}
        <span className="task-date">{createdAt}</span>
      </div>

      <button
        className="delete-btn"
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
      >
        ✕
      </button>
    </li>
  )
}
