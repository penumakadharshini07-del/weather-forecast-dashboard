import axios from 'axios'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

// Debug: log key status on load (remove after fixing)
console.log('API Key loaded:', API_KEY ? `${API_KEY.slice(0,6)}...` : 'NOT FOUND - check frontend/.env')

const weatherAPI = axios.create({ baseURL: BASE_URL })
const backendAPI = axios.create({ baseURL: '/api' })

export const getCurrentWeather = async (city) => {
  if (!API_KEY || API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
    throw new Error('NO_API_KEY')
  }
  const { data } = await weatherAPI.get('/weather', {
    params: { q: city, appid: API_KEY, units: 'metric' },
  })
  return data
}

export const getForecast = async (city) => {
  if (!API_KEY || API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
    throw new Error('NO_API_KEY')
  }
  const { data } = await weatherAPI.get('/forecast', {
    params: { q: city, appid: API_KEY, units: 'metric', cnt: 40 },
  })
  return data
}

export const getWeatherByCoords = async (lat, lon) => {
  const { data } = await weatherAPI.get('/weather', {
    params: { lat, lon, appid: API_KEY, units: 'metric' },
  })
  return data
}

export const getForecastByCoords = async (lat, lon) => {
  const { data } = await weatherAPI.get('/forecast', {
    params: { lat, lon, appid: API_KEY, units: 'metric', cnt: 40 },
  })
  return data
}

export const saveSearchHistory = async (weatherData) => {
  try { const { data } = await backendAPI.post('/weather/save', weatherData); return data } catch { return null }
}
export const getSearchHistory = async () => {
  try { const { data } = await backendAPI.get('/weather/history'); return data } catch { return [] }
}
export const getFavourites = async () => {
  try { const { data } = await backendAPI.get('/weather/favourites'); return data } catch { return [] }
}
export const toggleFavourite = async (city) => {
  try { const { data } = await backendAPI.post('/weather/favourites', { city }); return data } catch { return null }
}
