import { getWeatherIcon, getWeatherBg, formatTime, getWindDirection } from '../utils/helpers'

export default function WeatherCard({ weather, onToggleFavourite, isFavourite }) {
  if (!weather) return null

  const { name, sys, main, wind, weather: conditions, visibility, dt } = weather
  const condition = conditions[0]
  const bg = getWeatherBg(condition.main)

  return (
    <div className={`glass rounded-3xl p-6 md:p-8 animate-slide-up`} style={{ background: bg }}>
      {/* Header: city + favourite */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white">
            {name}
          </h2>
          <p className="text-slate-300 font-body mt-1">
            {sys.country} &bull; {formatTime(dt, sys.timezone)}
          </p>
        </div>
        <button
          onClick={onToggleFavourite}
          className="text-2xl transition-transform duration-200 hover:scale-125"
          title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
        >
          {isFavourite ? '⭐' : '☆'}
        </button>
      </div>

      {/* Main temp + icon */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="font-display font-bold text-7xl md:text-8xl text-white leading-none">
            {Math.round(main.temp)}°
          </div>
          <div className="text-blue-200 font-body mt-2 text-lg capitalize">
            {condition.description}
          </div>
          <div className="text-slate-400 font-body text-sm mt-1">
            Feels like {Math.round(main.feels_like)}° &bull; H:{Math.round(main.temp_max)}° L:{Math.round(main.temp_min)}°
          </div>
        </div>
        <div className="text-8xl md:text-9xl animate-float select-none">
          {getWeatherIcon(condition.main, condition.icon)}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon="💧" label="Humidity" value={`${main.humidity}%`} />
        <StatCard icon="🌬️" label="Wind" value={`${Math.round(wind.speed)} m/s`} sub={getWindDirection(wind.deg)} />
        <StatCard icon="👁️" label="Visibility" value={`${(visibility / 1000).toFixed(1)} km`} />
        <StatCard icon="🔵" label="Pressure" value={`${main.pressure} hPa`} />
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="glass rounded-2xl p-4 glass-hover">
      <div className="text-xl mb-2">{icon}</div>
      <div className="text-slate-400 font-body text-xs uppercase tracking-wider">{label}</div>
      <div className="text-white font-display font-semibold text-lg mt-1">{value}</div>
      {sub && <div className="text-slate-400 text-xs mt-0.5">{sub}</div>}
    </div>
  )
}
