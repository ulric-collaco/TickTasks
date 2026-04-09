export default function FilterBar({ filter, onFilterChange }) {
  return (
    <div className="filter-bar">
      {['all', 'active', 'completed'].map((f) => (
        // Avoid implicit submit
        <button
          type="button"
          key={f}
          className={`filter-btn ${filter === f ? 'active' : ''}`}
          onClick={() => onFilterChange(f)}
        >
          {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Completed'}
        </button>
      ))}
    </div>
  )
}
