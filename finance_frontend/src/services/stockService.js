import api from './api'

export const getAllStocks   = (params)     => api.get('/stock', { params })
export const getStockById  = (id)          => api.get(`/stock/${id}`)
export const createStock   = (data)        => api.post('/stock', data)
export const updateStock   = (id, data)    => api.put(`/stock/${id}`, data)
export const deleteStock   = (id)          => api.delete(`/stock/${id}`)
