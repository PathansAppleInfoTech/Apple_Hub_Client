import api from './axios';

export const getServices = (params = {}) => api.get('/services', { params }).then((r) => r.data.data);
export const getService = (idOrSlug) => api.get(`/services/${idOrSlug}`).then((r) => r.data.data);
export const getCategories = () => api.get('/categories').then((r) => r.data.data);

export const getOrder = (idOrNumber) => api.get(`/orders/${idOrNumber}`).then((r) => r.data.data);

export const createPayment = (payload) => api.post('/payments/create', payload).then((r) => r.data.data);
export const verifyPayment = (payload) => api.post('/payments/verify', payload).then((r) => r.data.data);