import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Prevent multiple refresh requests when several API calls
// fail at the same time.
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

function notifyRefreshSubscribers() {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
}

function rejectRefreshSubscribers(error) {
  refreshSubscribers.forEach((callback) => callback(error));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const response = error.response;

    console.error('[API Error]', {
      status: response?.status,
      code: response?.data?.code,
      data: response?.data,
      url: originalRequest?.url,
    });

    const code = response?.data?.code;

    /*
     * Only refresh when the backend specifically says
     * that the ACCESS TOKEN has expired.
     *
     * Do NOT refresh for every 401.
     */
    if (
      code !== 'AUTH_ACCESS_TOKEN_EXPIRED' ||
      originalRequest?._retry ||
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/refresh')
    ) {
      const message =
        response?.data?.message ||
        error.message ||
        'Something went wrong. Please try again.';

      return Promise.reject(new Error(message));
    }

    originalRequest._retry = true;

    /*
     * Another request is already refreshing the token.
     * Wait until it finishes, then retry this request.
     */
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((refreshError) => {
          if (refreshError) {
            reject(refreshError);
            return;
          }

          api(originalRequest)
            .then(resolve)
            .catch(reject);
        });
      });
    }

    isRefreshing = true;

    try {
      /*
       * Refresh token is stored in an HTTP-only cookie,
       * so we don't manually handle the token here.
       */
      await api.post('/auth/refresh');

      isRefreshing = false;

      notifyRefreshSubscribers();

      // Retry the original request with the new access cookie.
      return api(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;

      const message =
        refreshError.response?.data?.message ||
        refreshError.message ||
        'Your session has expired. Please log in again.';

      const finalError = new Error(message);

      rejectRefreshSubscribers(finalError);

      return Promise.reject(finalError);
    }
  }
);

export default api;