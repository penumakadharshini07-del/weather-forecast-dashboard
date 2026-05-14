import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../services/auth'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) return setError('Please fill in all fields.')
    setLoading(true)
    try {
      const data = await loginUser(form)
      login(data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <div className="w-full max-w-md animate-slide-up">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-float">🌤️</div>
          <h1 className="font-display font-bold text-4xl text-white">Welcome Back</h1>
          <p className="text-slate-400 font-body mt-2">Sign in to your WeatherScope account</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {error && (
              <div className="glass rounded-xl px-4 py-3 text-red-300 font-body text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <div>
              <label className="text-slate-300 font-body text-sm block mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="search-input w-full rounded-2xl px-5 py-3.5 font-body text-sm"
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-slate-300 font-body text-sm block mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="search-input w-full rounded-2xl px-5 py-3.5 font-body text-sm"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-2xl text-white font-body font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
              ) : '🔐 Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 font-body text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </div>

        {/* Demo hint */}
        <div className="mt-4 glass rounded-2xl px-5 py-3 text-center">
          <p className="text-slate-500 font-body text-xs">
            💡 If backend is not running, use any email & password — demo mode will log you in
          </p>
        </div>
      </div>
    </div>
  )
}
