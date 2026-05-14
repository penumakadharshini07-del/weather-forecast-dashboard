require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const weatherRoutes = require('./routes/weatherRoutes')
const authRoutes = require('./routes/authRoutes')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

connectDB()

app.use('/api/auth',    authRoutes)
app.use('/api',         weatherRoutes)

app.get('/', (req, res) => res.json({ status: 'Weather Dashboard API running 🌤' }))
app.use((req, res) => res.status(404).json({ message: 'Route not found' }))
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`))
