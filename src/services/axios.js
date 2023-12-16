import axios from 'axios';
import store from '../store/index';
import router from '../router/index';
import refreshTokenInstance from '../services/refreshToken';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_API,
  withCredentials: true,
});

// Interceptor para agregar el token al encabezado de autorización
axiosInstance.interceptors.request.use(config => {
  const accessToken = store.state.accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor para manejar la renovación de tokens
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const isLoginRequest = originalRequest.url.endsWith('/login/') && originalRequest.method === 'post';

      try {
        if (isLoginRequest) {
          router.push('/login/');
        } else {
          const newToken = await store.dispatch(
            'refreshTokens', 
            { axiosInstance: refreshTokenInstance }
          );
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance.request(originalRequest);
        }

      } catch (refreshError) {
        router.push('/login/');
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
