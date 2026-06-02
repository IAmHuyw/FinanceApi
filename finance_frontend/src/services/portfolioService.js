import api from './api'

export const getPortfolio        = ()       => api.get('/portfolio')
export const addToPortfolio      = (symbol) => api.post('/portfolio', null, { params: { symbol } })
export const removeFromPortfolio = (symbol) => api.delete('/portfolio', { params: { symbol } })
