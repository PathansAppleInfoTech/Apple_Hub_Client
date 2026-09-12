import api from './axios';

export const getServices = (params = {}) => api.get('/services', { params }).then((r) => r.data.data);
export const getService = (idOrSlug) => api.get(`/services/${idOrSlug}`).then((r) => r.data.data);
export const getCategories = () => api.get('/categories').then((r) => r.data.data);

export const createOrder = (payload) => api.post('/orders', payload).then((r) => r.data.data);
export const getOrder = (idOrNumber) => api.get(`/orders/${idOrNumber}`).then((r) => r.data.data);

export const createPayment = (orderId) =>
  api.post('/payments/create', { order_id: orderId }).then((r) => r.data.data);

// Only used when no live gateway credentials are configured (test_mode: true
// from createPayment). It calls the same webhook endpoint a real gateway
// would call server-to-server, so the confirmed-payment flow is still the
// backend verifying and updating the order — never the browser marking
// itself as paid.
export const simulateTestPayment = (gatewayOrderId) =>
  api
    .post('/payments/webhook', {
      gateway_order_id: gatewayOrderId,
      payment_id: `test_pay_${Date.now()}`,
      status: 'paid',
      payment_method: 'test_mode',
    })
    .then((r) => r.data);
