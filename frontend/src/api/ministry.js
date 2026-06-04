import api from './axios'

export const getMinistryStats = () => api.get('/ministry/stats')

export const getMinistryStudentApps = () => api.get('/ministry/applications')

export const reviewMinistryStudentApp = (id, action, remarks) =>
  api.put(`/ministry/applications/${id}`, { action, remarks })

export const getMinistryInstituteApps = () => api.get('/ministry/institutes')

export const reviewMinistryInstituteApp = (id, action, remarks) =>
  api.put(`/ministry/institutes/${id}`, { action, remarks })

export const getMinistrySchemes = () => api.get('/schemes/all')

export const toggleScheme = (schemeId) => api.patch(`/schemes/${schemeId}/toggle`)
