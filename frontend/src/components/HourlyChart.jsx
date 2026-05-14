import { getWeatherIcon } from '../utils/helpers'

export default function HourlyChart({ forecast }) {
  if (!forecast) return null

  const hourly = forecast.list.slice(0, 8) // next 24 hours (3h intervals)

  return (
    <div className="glass rounded-3xl p-6 animate-slide-up">
      <h3 className="font-display font-bold text-lg text-white mb-4">Hourly Forecast</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {hourly.map((item, i) => {
          const date = new Date(item.dt * 1000)
          const hour = date.getHours()
          const label = i === 0 ? 'Now' : `${hour}:00`
          return (
            <div
              key={i}
              className="flex flex-col items-center gap-2 glass rounded-2xl px-4 py-3 min-w-[70px] glass-hover"
            >
              <span className="text-slate-400 font-body text-xs">{label}</span>
              <span className="text-2xl">{getWeatherIcon(item.weather[0].main, item.weather[0].icon)}</span>
              <span className="text-white font-display font-semibold text-sm">
                {Math.round(item.main.temp)}°
              </span>
              <div className="flex items-center gap-1 text-blue-300 text-xs">
                <span>💧</span>
                <span>{item.pop ? Math.round(item.pop * 100) : 0}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
