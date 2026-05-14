const mongoose = require('mongoose')

const weatherSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, trim: true },
    country: { type: String, trim: true },
    temperature: { type: Number },
    condition: { type: String },
    humidity: { type: Number },
    windSpeed: { type: Number },
    description: { type: String },
    isFavourite: { type: Boolean, default: false },
    searchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

// Index for fast lookups by city name
weatherSchema.index({ city: 1 })

module.exports = mongoose.model('Weather', weatherSchema)
