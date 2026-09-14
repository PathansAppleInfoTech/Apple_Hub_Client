import api from './axios';

// Auth

export const login = async (email, password) => {
  try {
    console.log('[Admin Auth] Login request started:', email);

    const response = await api.post('/auth/login', {
      email,
      password,
    });

    console.log('[Admin Auth] Login successful:', response.data.data?.admin);

    return response.data.data;
  } catch (error) {
    console.error(
      '[Admin Auth] Login failed:',
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message || error.message ||
      'Unable to login. Please check your credentials.'
    );

  }
};

/**
 * Admin Logout
 */
export const logout = async () => {
  try {
    console.log('[Admin Auth] Logout request started');

    const response = await api.post('/auth/logout');

    console.log('[Admin Auth] Logout successful');

    return response.data.data;
  } catch (error) {
    console.error(
      '[Admin Auth] Logout failed:',
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Unable to logout.'
    );
  }
};

/**
 * Get currently authenticated admin
 */
export const getMe = async () => {
  try {
    console.log('[Admin Auth] Checking current session...');

    const response = await api.get('/auth/me');

    console.log(
      '[Admin Auth] Active session:',
      response.data.data?.admin
    );

    return response.data.data?.admin;
  } catch (error) {
    console.warn(
      '[Admin Auth] No active session:',
      error.response?.data?.message || error.message
    );

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Session expired.'
    );
  }
};

/**
 * Get admin dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    console.log('[Admin Dashboard] Fetching dashboard statistics...');

    const response = await api.get('/admin/dashboard');

    const data = response.data.data;

    console.log('[Admin Dashboard] Statistics loaded:', data);

    return data;
  } catch (error) {
    console.error(
      '[Admin Dashboard] Failed to load statistics:',
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Could not load dashboard statistics.'
    );
  }
};


// Services (admin)
export const getAllServices = () => api.get('/admin/services').then((r) => r.data.data);
export const createService = (payload) => api.post('/services', payload).then((r) => r.data.data);
export const updateService = (id, payload) => api.put(`/services/${id}`, payload).then((r) => r.data.data);
export const deleteService = (id) => api.delete(`/services/${id}`).then((r) => r.data.data);

// Categories (admin)
export const getAllCategories = () => api.get('/admin/categories').then((r) => r.data.data);
export const createCategory = (payload) => api.post('/categories', payload).then((r) => r.data.data);
export const updateCategory = (id, payload) => api.put(`/categories/${id}`, payload).then((r) => r.data.data);
export const deactivateCategory = (id) => api.delete(`/categories/${id}`).then((r) => r.data.data);

// Orders (admin)
export const getOrders = (params = {}) => api.get('/admin/orders', { params }).then((r) => r.data.data);
export const getOrderDetail = (id) => api.get(`/admin/orders/${id}`).then((r) => r.data.data);
export const updateOrderStatus = (id, order_status) =>
  api.put(`/admin/orders/${id}/status`, { order_status }).then((r) => r.data.data);
export const assignOrder = (id, assigned_to) =>
  api.put(`/admin/orders/${id}/assign`, { assigned_to }).then((r) => r.data.data);

// Team (admin)
export const getTeam = () => api.get('/admin/team').then((r) => r.data.data);
export const createTeamMember = (payload) => api.post('/admin/team', payload).then((r) => r.data.data);
export const updateTeamMember = (id, payload) => api.put(`/admin/team/${id}`, payload).then((r) => r.data.data);
