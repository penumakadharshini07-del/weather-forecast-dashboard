import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SearchBar from '../components/SearchBar'
import { getCurrentWeather, getForecast, saveSearchHistory } from '../services/api'

const POPULAR_CITIES = ['Delhi', 'Mumbai', 'London', 'New York', 'Tokyo', 'Paris', 'Dubai', 'Sydney']

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSearch = async (city) => {
    setLoading(true)
    setError('')
    try {
      const [weather, forecast] = await Promise.all([
        getCurrentWeather(city),
        getForecast(city),
      ])
      saveSearchHistory({
        city: weather.name,
        country: weather.sys.country,
        temperature: weather.main.temp,
        condition: weather.weather[0].main,
      })
      navigate('/dashboard', { state: { weather, forecast } })
    } catch (err) {
      if (err.message === 'NO_API_KEY') {
        setError('API key missing! Open frontend/.env and set VITE_WEATHER_API_KEY=your_key, then restart npm run dev.')
      } else if (err.response?.status === 404) {
        setError(`City "${city}" not found. Please check the spelling.`)
      } else if (err.response?.status === 401) {
        setError('Invalid API key. Please check your key at openweathermap.org/api_keys and wait 15-30 mins after creation.')
      } else {
        setError('Failed to fetch weather. Check your API key in frontend/.env and restart the server.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-6">
      {/* Hero */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="text-7xl mb-6 animate-float">🌤️</div>
        <h1 className="font-display font-extrabold text-5xl md:text-6xl text-white leading-tight mb-4">
          Real-Time
          <span className="gradient-text block">Weather Dashboard</span>
        </h1>
        <p className="font-body text-slate-400 text-lg max-w-xl mx-auto">
          Hello {user?.name} 👋 — Search any city to get live weather and forecasts.
        </p>
      </div>

      {/* Search */}
      <div className="w-full max-w-2xl animate-slide-up">
        <SearchBar onSearch={handleSearch} loading={loading} />
        {error && (
          <div className="mt-3 glass rounded-xl px-4 py-3 text-red-300 font-body text-sm flex items-start gap-2">
            <span className="mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Popular cities */}
      <div className="mt-10 animate-fade-in">
        <p className="text-slate-500 font-body text-sm text-center mb-4">Popular Cities</p>
        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR_CITIES.map((city) => (
            <button
              key={city}
              onClick={() => handleSearch(city)}
              disabled={loading}
              className="glass px-4 py-2 rounded-xl font-body text-sm text-slate-300 glass-hover disabled:opacity-50"
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl animate-fade-in">
        {[
          { icon: '🌡️', label: 'Live Temperature' },
          { icon: '🔮', label: '5-Day Forecast' },
          { icon: '💨', label: 'Wind & Pressure' },
          { icon: '📍', label: 'GPS Location' },
        ].map((f) => (
          <div key={f.label} className="glass rounded-2xl p-4 text-center glass-hover">
            <div className="text-3xl mb-2">{f.icon}</div>
            <div className="text-slate-300 font-body text-sm">{f.label}</div>
          </div>
        ))}
      </div>

      {/* API key help box — only show if key is missing */}
      {(!import.meta.env.VITE_WEATHER_API_KEY || import.meta.env.VITE_WEATHER_API_KEY === 'YOUR_OPENWEATHER_API_KEY') && (
        <div className="mt-8 w-full max-w-2xl">
          <div className="glass rounded-2xl px-5 py-4">
            <p className="text-slate-400 font-body text-xs text-center">
              🔑 Make sure <span className="text-blue-400 font-mono">frontend/.env</span> has your key:&nbsp;
              <span className="text-green-400 font-mono">VITE_WEATHER_API_KEY=your_actual_key</span>
              &nbsp;then restart <span className="text-yellow-400 font-mono">npm run dev</span>
            </p>
          </div>
        </div>
      )}
    </main>
  )
}
