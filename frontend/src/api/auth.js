import api from './axios'

export const login = (uid, password, role) =>
  api.post('/auth/login', { uid, password, role })

export const resetPassword = (payload) => api.post('/auth/reset-password', payload)

export const getMe = () => api.get('/auth/me')
