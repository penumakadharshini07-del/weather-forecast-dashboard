import { useState } from 'react'

export default function SearchBar({ onSearch, loading }) {
  const [city, setCity] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = city.trim()
    if (trimmed) {
      onSearch(trimmed)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Search city... e.g. Delhi, London, New York"
        className="search-input flex-1 rounded-2xl px-5 py-3.5 font-body text-sm"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !city.trim()}
        className="btn-primary px-6 py-3.5 rounded-2xl text-white font-body font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Searching...
          </>
        ) : (
          <>🔍 Search</>
        )}
      </button>
    </form>
  )
}
