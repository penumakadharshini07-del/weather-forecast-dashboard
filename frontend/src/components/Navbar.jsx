import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Don't show navbar on login/register pages
  if (pathname === '/login' || pathname === '/register') return null

  return (
    <nav className="relative z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            🌤
          </div>
          <span className="font-display font-bold text-xl tracking-tight gradient-text">
            WeatherScope
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className={`px-4 py-2 rounded-xl font-body font-medium text-sm transition-all duration-200 ${
              pathname === '/'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className={`px-4 py-2 rounded-xl font-body font-medium text-sm transition-all duration-200 ${
              pathname === '/dashboard'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Dashboard
          </Link>

          {user && (
            <div className="flex items-center gap-3 ml-3 pl-3 border-l border-white/10">
              <span className="text-slate-400 font-body text-sm hidden md:block">
                👋 {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl font-body font-medium text-sm text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/20 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
