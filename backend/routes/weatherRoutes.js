const express = require('express')
const router = express.Router()
const {
  getWeather,
  getForecast,
  saveWeather,
  getHistory,
  getFavourites,
  toggleFavourite,
  clearHistory,
} = require('../controllers/weatherController')

// MongoDB routes (must be BEFORE the :city wildcard)
router.post('/weather/save', saveWeather)
router.get('/weather/history', getHistory)
router.delete('/weather/history', clearHistory)
router.get('/weather/favourites', getFavourites)
router.post('/weather/favourites', toggleFavourite)

// OpenWeather proxy routes (wildcard :city must be last)
router.get('/weather/forecast/:city', getForecast)
router.get('/weather/:city', getWeather)

module.exports = router
