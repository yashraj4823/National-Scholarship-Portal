import api from './axios'

export const login = (uid, password, role) =>
  api.post('/auth/login', { uid, password, role })

export const getMe = () => api.get('/auth/me')
