# 🌤 WeatherScope — Weather Dashboard Application

A full-stack weather dashboard built with **React (Vite) + TailwindCSS**, **Node.js + Express**, and **MongoDB**, powered by the **OpenWeatherMap API**.

---

## 📁 Project Structure

```
weather-dashboard/
├── frontend/         ← React + Vite + TailwindCSS
└── backend/          ← Node.js + Express + MongoDB
```

---

## ⚡ Quick Start

### Step 1 — Get a Free OpenWeather API Key
1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Sign up for a free account
3. Copy your API key from the dashboard

---

### Step 2 — Setup Frontend

```bash
cd frontend
npm install
```

Open `frontend/.env` and replace:
```
VITE_WEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
```

Start the frontend:
```bash
npm run dev
```
Frontend runs at → **http://localhost:5173**

---

### Step 3 — Setup Backend (Optional — for search history & favourites)

```bash
cd backend
npm install
```

Open `backend/.env` and fill in:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/weatherdashboard
OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
```

> **MongoDB**: Install locally from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)  
> Or use **MongoDB Atlas** (free cloud): [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

Start the backend:
```bash
npm run dev    # with nodemon (auto-restart)
# or
npm start      # without nodemon
```
Backend runs at → **http://localhost:5000**

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🔍 City Search | Search any city worldwide |
| 🌡️ Current Weather | Temperature, feels-like, high/low |
| 💧 Detailed Stats | Humidity, wind speed, visibility, pressure |
| ⏱️ Hourly Forecast | Next 24 hours in 3-hour intervals |
| 📅 5-Day Forecast | Daily high/low with conditions |
| 📍 GPS Location | Auto-detect your location |
| ⭐ Favourite Cities | Save cities to quick-access list |
| 🕒 Search History | View recent searches (stored in MongoDB) |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TailwindCSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| API | OpenWeatherMap API |
| Routing | React Router v6 |

---

## 📡 API Endpoints (Backend)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/weather/:city` | Proxy current weather |
| GET | `/api/weather/forecast/:city` | Proxy 5-day forecast |
| POST | `/api/weather/save` | Save search to MongoDB |
| GET | `/api/weather/history` | Get search history |
| DELETE | `/api/weather/history` | Clear search history |
| GET | `/api/weather/favourites` | Get favourite cities |
| POST | `/api/weather/favourites` | Toggle favourite city |

---

## 🗂 MongoDB Collections

**Weather** collection stores:
- `city`, `country`
- `temperature`, `condition`, `humidity`, `windSpeed`, `description`
- `isFavourite` (boolean)
- `searchedAt`, `createdAt`, `updatedAt`

---

## 📝 Notes

- The frontend works **standalone** without the backend — it calls OpenWeatherMap directly.
- The backend adds **search history** and **favourite cities** persistence via MongoDB.
- The frontend gracefully handles backend being offline.
