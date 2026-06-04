import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nsp_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On 401, clear storage and redirect to home
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('nsp_token')
      localStorage.removeItem('nsp_user')
      window.location.href = '/'
    }
    return Promise.reject(err)
  }
)

export default api
