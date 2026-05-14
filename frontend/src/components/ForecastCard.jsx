import { getWeatherIcon, getDayName } from '../utils/helpers'

export default function ForecastCard({ forecast }) {
  if (!forecast) return null

  // Group by day (take the noon entry or first entry per day)
  const dailyMap = {}
  forecast.list.forEach((item) => {
    const date = new Date(item.dt * 1000)
    const dayKey = date.toDateString()
    if (!dailyMap[dayKey]) {
      dailyMap[dayKey] = []
    }
    dailyMap[dayKey].push(item)
  })

  // Build one summary per day (skip today)
  const today = new Date().toDateString()
  const days = Object.entries(dailyMap)
    .filter(([day]) => day !== today)
    .slice(0, 5)
    .map(([day, items]) => {
      const temps = items.map((i) => i.main.temp)
      const noonItem = items.find((i) => new Date(i.dt * 1000).getHours() === 12) || items[0]
      return {
        day,
        high: Math.round(Math.max(...temps)),
        low: Math.round(Math.min(...temps)),
        condition: noonItem.weather[0].main,
        icon: noonItem.weather[0].icon,
        description: noonItem.weather[0].description,
      }
    })

  return (
    <div className="glass rounded-3xl p-6 animate-slide-up">
      <h3 className="font-display font-bold text-lg text-white mb-4">5-Day Forecast</h3>
      <div className="space-y-3">
        {days.map((d, i) => (
          <div
            key={i}
            className="flex items-center justify-between glass rounded-2xl px-4 py-3 glass-hover"
          >
            <div className="w-24 text-slate-300 font-body font-medium text-sm">
              {getDayName(d.day)}
            </div>
            <div className="text-2xl">{getWeatherIcon(d.condition, d.icon)}</div>
            <div className="text-slate-400 font-body text-sm capitalize hidden md:block w-32 text-center">
              {d.description}
            </div>
            <div className="flex gap-3 text-sm font-body">
              <span className="text-white font-semibold">{d.high}°</span>
              <span className="text-slate-500">{d.low}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
