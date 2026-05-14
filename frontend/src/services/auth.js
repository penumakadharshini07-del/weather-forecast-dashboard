import axios from 'axios'

const authAPI = axios.create({ baseURL: '/api/auth' })

export const registerUser = async ({ name, email, password }) => {
  try {
    const { data } = await authAPI.post('/register', { name, email, password })
    return data
  } catch (err) {
    // Demo mode: if backend is offline, simulate login locally
    if (!err.response) {
      return { user: { name, email, id: Date.now().toString() } }
    }
    throw err
  }
}

export const loginUser = async ({ email, password }) => {
  try {
    const { data } = await authAPI.post('/login', { email, password })
    return data
  } catch (err) {
    // Demo mode: if backend is offline, simulate login locally
    if (!err.response) {
      const name = email.split('@')[0]
      return { user: { name, email, id: Date.now().toString() } }
    }
    throw err
  }
}
