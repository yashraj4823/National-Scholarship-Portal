import api from './axios'

export const submitApplication = (formData) =>
  api.post('/applications', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const getMyApplications = () => api.get('/applications/my')

export const getInstituteApplications = () => api.get('/applications/institute')

export const instituteAction = (id, action, remarks, bonafideFile) => {
  const fd = new FormData()
  fd.append('action', action)
  if (remarks) fd.append('remarks', remarks)
  if (bonafideFile) fd.append('bonafide', bonafideFile)
  return api.put(`/applications/${id}/institute-action`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
