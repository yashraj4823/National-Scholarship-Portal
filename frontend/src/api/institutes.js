import api from './axios'

export const registerInstitute = (formData) =>
  api.post('/institutes/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const getInstituteProfile = () => api.get('/institutes/profile')

export const getApprovedInstitutes = () => api.get('/institutes')
