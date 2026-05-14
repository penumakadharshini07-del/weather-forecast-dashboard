import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { registerUser } from '../services/auth'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password || !form.confirm)
      return setError('Please fill in all fields.')
    if (form.password.length < 6)
      return setError('Password must be at least 6 characters.')
    if (form.password !== form.confirm)
      return setError('Passwords do not match.')

    setLoading(true)
    try {
      const data = await registerUser({ name: form.name, email: form.email, password: form.password })
      login(data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10 py-8">
      <div className="w-full max-w-md animate-slide-up">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-float">🌤️</div>
          <h1 className="font-display font-bold text-4xl text-white">Create Account</h1>
          <p className="text-slate-400 font-body mt-2">Join WeatherScope — it's free</p>
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
              <label className="text-slate-300 font-body text-sm block mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="search-input w-full rounded-2xl px-5 py-3.5 font-body text-sm"
                disabled={loading}
              />
            </div>

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
                placeholder="Min. 6 characters"
                className="search-input w-full rounded-2xl px-5 py-3.5 font-body text-sm"
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-slate-300 font-body text-sm block mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Repeat your password"
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
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
              ) : '🚀 Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 font-body text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
