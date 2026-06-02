import api from './api'

export const getAllComments  = ()                => api.get('/comment')
export const createComment  = (stockId, data)   => api.post(`/comment/${stockId}`, data)
export const updateComment  = (id, data)         => api.put(`/comment/${id}`, data)
export const deleteComment  = (id)               => api.delete(`/comment/${id}`)
