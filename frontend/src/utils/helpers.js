export function getWeatherIcon(main, icon) {
  const isNight = icon && icon.endsWith('n')
  const map = {
    Clear: isNight ? '🌙' : '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Smoke: '🌫️',
    Haze: '🌫️',
    Dust: '🌪️',
    Fog: '🌫️',
    Sand: '🌪️',
    Ash: '🌋',
    Squall: '💨',
    Tornado: '🌪️',
  }
  return map[main] || '🌡️'
}

export function getWeatherBg(main) {
  const map = {
    Clear: 'linear-gradient(135deg, rgba(30,58,95,0.8) 0%, rgba(10,22,40,0.9) 100%)',
    Clouds: 'linear-gradient(135deg, rgba(45,55,72,0.8) 0%, rgba(26,32,44,0.9) 100%)',
    Rain: 'linear-gradient(135deg, rgba(26,54,93,0.8) 0%, rgba(13,31,60,0.9) 100%)',
    Drizzle: 'linear-gradient(135deg, rgba(26,54,93,0.7) 0%, rgba(13,31,60,0.9) 100%)',
    Thunderstorm: 'linear-gradient(135deg, rgba(26,26,46,0.9) 0%, rgba(13,13,26,0.95) 100%)',
    Snow: 'linear-gradient(135deg, rgba(44,62,80,0.8) 0%, rgba(26,37,47,0.9) 100%)',
    Mist: 'linear-gradient(135deg, rgba(37,47,63,0.8) 0%, rgba(20,26,35,0.9) 100%)',
    Haze: 'linear-gradient(135deg, rgba(37,47,63,0.8) 0%, rgba(20,26,35,0.9) 100%)',
  }
  return map[main] || map.Clear
}

export function formatTime(dt, timezoneOffset) {
  const localTime = new Date((dt + timezoneOffset) * 1000)
  return localTime.toUTCString().slice(17, 22)
}

export function getDayName(dateString) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const d = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return days[d.getDay()]
}

export function getWindDirection(deg) {
  if (deg === undefined) return ''
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}
