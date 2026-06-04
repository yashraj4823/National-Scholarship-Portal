import api from './axios'

export const getStateStudentApps = () => api.get('/state/applications')

export const reviewStateStudentApp = (id, action, remarks) =>
  api.put(`/state/applications/${id}`, { action, remarks })

export const getStateInstituteApps = () => api.get('/state/institutes')

export const reviewStateInstituteApp = (id, action, remarks) =>
  api.put(`/state/institutes/${id}`, { action, remarks })
