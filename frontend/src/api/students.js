import api from './axios'

export const registerStudent = (data) => api.post('/students/register', data)

export const getStudentProfile = () => api.get('/students/profile')

export const updateStudentProfile = (data) => api.put('/students/profile', data)
