import api from './api'

export const loginApi    = (data) => api.post('/account/login', data)
export const registerApi = (data) => api.post('/account/register', data)
