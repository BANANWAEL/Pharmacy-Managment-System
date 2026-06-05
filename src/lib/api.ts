// // lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://youssef5807-001-site1.ntempurl.com/api',
  // withCredentials: true, // مهم جداً عشان يبعت الـ Cookie مع كل طلب
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
export default api;