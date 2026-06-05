// // services/authService.ts
import api from '@/lib/api';

interface LoginResponse {
  token: string;
  message?: string;
}

export interface UserProfile {
  employee_ID: number;
  employee_Name: string;
  employee_Role: "Admin" | "Pharmacist"; // تأكدي إن الباك إند بيرجعهم كدة بالظبط بالـ Capital letter
  email: string;
}

export const handleLogin = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  
  if (response.data.token) {
    // 1. نخزن في الـ localStorage عشان الـ Interceptor (الفرونت إند)
    localStorage.setItem('userToken', response.data.token);
    
    // 2. نخزن في الـ Cookies يدويًا عشان الـ Middleware (السيرفر) يحس بيه فوراً
    document.cookie = `userToken=${response.data.token}; path=/; max-age=86400; SameSite=Lax`;
  }
  return response.data;
};

export const getMyProfile = async () => {
  const response = await api.get('/employees/me');
  return response.data;
};
