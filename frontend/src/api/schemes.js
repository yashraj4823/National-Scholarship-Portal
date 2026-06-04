import api from './axios'

export const getSchemes = () => api.get('/schemes')

export const getSchemeById = (schemeId) => api.get(`/schemes/${schemeId}`)
