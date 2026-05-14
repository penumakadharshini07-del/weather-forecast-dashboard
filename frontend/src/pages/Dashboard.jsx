import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import WeatherCard from '../components/WeatherCard'
import ForecastCard from '../components/ForecastCard'
import HourlyChart from '../components/HourlyChart'
import {
  getCurrentWeather, getForecast,
  getWeatherByCoords, getForecastByCoords,
  saveSearchHistory, getSearchHistory,
  toggleFavourite, getFavourites,
} from '../services/api'

export default function Dashboard() {
  const location = useLocation()
  const navigate = useNavigate()

  const [weather, setWeather]     = useState(location.state?.weather || null)
  const [forecast, setForecast]   = useState(location.state?.forecast || null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [history, setHistory]     = useState([])
  const [favourites, setFavourites] = useState([])
  const [isFavourite, setIsFavourite] = useState(false)
  const [gpsLoading, setGpsLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      const [h, f] = await Promise.all([getSearchHistory(), getFavourites()])
      setHistory(h)
      setFavourites(f)
    })()
  }, [])

  useEffect(() => {
    if (weather && favourites.length) {
      setIsFavourite(favourites.some((f) => f.city === weather.name))
    }
  }, [weather, favourites])

  const fetchWeather = async (city) => {
    setLoading(true)
    setError('')
    try {
      const [w, f] = await Promise.all([getCurrentWeather(city), getForecast(city)])
      setWeather(w)
      setForecast(f)
      saveSearchHistory({
        city: w.name, country: w.sys.country,
        temperature: w.main.temp, condition: w.weather[0].main,
      }).then(async () => { const h = await getSearchHistory(); setHistory(h) })
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid API key. Check frontend/.env and restart npm run dev.')
      } else if (err.response?.status === 404) {
        setError(`City "${city}" not found.`)
      } else {
        setError('Failed to fetch weather. Check your API key.')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchByGPS = () => {
    if (!navigator.geolocation) return setError('Geolocation not supported.')
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const [w, f] = await Promise.all([
            getWeatherByCoords(coords.latitude, coords.longitude),
            getForecastByCoords(coords.latitude, coords.longitude),
          ])
          setWeather(w); setForecast(f); setError('')
        } catch { setError('Failed to fetch weather for your location.') }
        finally { setGpsLoading(false) }
      },
      () => { setError('Location access denied.'); setGpsLoading(false) }
    )
  }

  const handleToggleFavourite = async () => {
    if (!weather) return
    await toggleFavourite(weather.name)
    const f = await getFavourites()
    setFavourites(f)
    setIsFavourite((prev) => !prev)
  }

  return (
    <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pb-12">

      {/* Dashboard Header */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl text-white">
          📊 Weather Dashboard
        </h1>
        <p className="text-slate-400 font-body text-sm mt-1">
          Search a city or use GPS to get detailed weather data
        </p>
      </div>

      {/* Search row */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1">
          <SearchBar onSearch={fetchWeather} loading={loading} />
        </div>
        <button
          onClick={fetchByGPS}
          disabled={gpsLoading}
          title="Use my location"
          className="glass px-4 py-3.5 rounded-2xl text-xl glass-hover disabled:opacity-50 whitespace-nowrap"
        >
          {gpsLoading ? '⏳' : '📍 GPS'}
        </button>
      </div>

      {error && (
        <div className="glass rounded-2xl px-5 py-4 text-red-300 font-body text-sm flex items-center gap-2 mb-5">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Empty state — no city searched yet */}
      {!loading && !weather && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-7xl mb-6 animate-float">🌍</div>
          <h2 className="font-display font-bold text-2xl text-white mb-2">
            Search a city to get started
          </h2>
          <p className="text-slate-400 font-body text-sm max-w-sm">
            Enter any city name above or click GPS to get weather for your current location.
          </p>
          {/* Quick picks */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {['Hyderabad', 'Delhi', 'Mumbai', 'Bangalore', 'Chennai'].map((c) => (
              <button
                key={c}
                onClick={() => fetchWeather(c)}
                className="glass px-4 py-2 rounded-xl font-body text-sm text-slate-300 glass-hover"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid gap-5">
          <div className="skeleton rounded-3xl h-72" />
          <div className="grid md:grid-cols-2 gap-5">
            <div className="skeleton rounded-3xl h-52" />
            <div className="skeleton rounded-3xl h-52" />
          </div>
          <div className="skeleton rounded-3xl h-48" />
        </div>
      )}

      {/* Weather content */}
      {!loading && weather && (
        <div className="grid gap-5 animate-fade-in">

          {/* Main weather card */}
          <WeatherCard
            weather={weather}
            onToggleFavourite={handleToggleFavourite}
            isFavourite={isFavourite}
          />

          {/* Hourly + Forecast */}
          <div className="grid md:grid-cols-2 gap-5">
            <HourlyChart forecast={forecast} />
            <ForecastCard forecast={forecast} />
          </div>

          {/* History + Favourites */}
          <div className="grid md:grid-cols-2 gap-5">

            {/* Recent searches */}
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg text-white">🕒 Recent Searches</h3>
                {history.length > 0 && (
                  <span className="text-slate-500 font-body text-xs">{history.length} searches</span>
                )}
              </div>
              {history.length === 0 ? (
                <p className="text-slate-500 font-body text-sm">No search history yet.</p>
              ) : (
                <div className="space-y-2">
                  {history.slice(0, 6).map((h, i) => (
                    <button
                      key={i}
                      onClick={() => fetchWeather(h.city)}
                      className="w-full flex items-center justify-between glass rounded-xl px-4 py-2.5 glass-hover text-left"
                    >
                      <div>
                        <span className="text-white font-body font-medium text-sm">{h.city}</span>
                        <span className="text-slate-500 text-xs ml-2">{h.country}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-300 font-body text-sm">{Math.round(h.temperature)}°C</span>
                        <span className="text-slate-500 text-xs ml-2">{h.condition}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Favourites */}
            <div className="glass rounded-3xl p-6">
              <h3 className="font-display font-bold text-lg text-white mb-4">⭐ Favourite Cities</h3>
              {favourites.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-slate-500 font-body text-sm">No favourites yet.</p>
                  <p className="text-slate-600 font-body text-xs mt-1">Click ☆ on a city to save it here.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {favourites.map((f, i) => (
                    <button
                      key={i}
                      onClick={() => fetchWeather(f.city)}
                      className="w-full flex items-center justify-between glass rounded-xl px-4 py-2.5 glass-hover text-left"
                    >
                      <span className="text-white font-body font-medium text-sm">{f.city}</span>
                      <span className="text-yellow-400 text-sm">⭐</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </main>
  )
}
