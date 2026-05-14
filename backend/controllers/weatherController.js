const axios = require('axios')
const Weather = require('../models/Weather')

const OW_BASE = 'https://api.openweathermap.org/data/2.5'

// ── GET /api/weather/:city  ─ proxy to OpenWeather ──────────────────────────
exports.getWeather = async (req, res) => {
  try {
    const { city } = req.params
    const { data } = await axios.get(`${OW_BASE}/weather`, {
      params: { q: city, appid: process.env.OPENWEATHER_API_KEY, units: 'metric' },
    })
    res.json(data)
  } catch (err) {
    const status = err.response?.status || 500
    res.status(status).json({ message: err.response?.data?.message || 'Failed to fetch weather' })
  }
}

// ── GET /api/weather/forecast/:city ─ 5-day forecast ────────────────────────
exports.getForecast = async (req, res) => {
  try {
    const { city } = req.params
    const { data } = await axios.get(`${OW_BASE}/forecast`, {
      params: { q: city, appid: process.env.OPENWEATHER_API_KEY, units: 'metric', cnt: 40 },
    })
    res.json(data)
  } catch (err) {
    const status = err.response?.status || 500
    res.status(status).json({ message: err.response?.data?.message || 'Failed to fetch forecast' })
  }
}

// ── POST /api/weather/save ─ save search to MongoDB ─────────────────────────
exports.saveWeather = async (req, res) => {
  try {
    const { city, country, temperature, condition, humidity, windSpeed, description } = req.body
    const record = new Weather({ city, country, temperature, condition, humidity, windSpeed, description })
    await record.save()
    res.status(201).json({ message: 'Saved', data: record })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ── GET /api/weather/history ─ recent searches ───────────────────────────────
exports.getHistory = async (req, res) => {
  try {
    const history = await Weather.find({ isFavourite: false })
      .sort({ searchedAt: -1 })
      .limit(20)
    res.json(history)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ── GET /api/weather/favourites ─ get favourite cities ───────────────────────
exports.getFavourites = async (req, res) => {
  try {
    const favs = await Weather.find({ isFavourite: true }).sort({ updatedAt: -1 })
    res.json(favs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ── POST /api/weather/favourites ─ toggle favourite ──────────────────────────
exports.toggleFavourite = async (req, res) => {
  try {
    const { city } = req.body
    const existing = await Weather.findOne({ city, isFavourite: true })
    if (existing) {
      await Weather.deleteOne({ _id: existing._id })
      return res.json({ message: 'Removed from favourites', isFavourite: false })
    }
    // Add as favourite
    const fav = new Weather({ city, isFavourite: true })
    await fav.save()
    res.json({ message: 'Added to favourites', isFavourite: true, data: fav })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ── DELETE /api/weather/history ─ clear all history ──────────────────────────
exports.clearHistory = async (req, res) => {
  try {
    await Weather.deleteMany({ isFavourite: false })
    res.json({ message: 'History cleared' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
