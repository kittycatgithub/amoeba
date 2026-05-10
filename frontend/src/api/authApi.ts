import api from './axios';

export const sendRegisterOtp = (email: string, phone: string) =>
  api.post('/api/auth/send-otp', { email, phone });

export const verifyOtpAndRegister = (data: {
  name: string; email: string; password: string; phone?: string; role?: string; otp: string;
}) => api.post('/api/auth/verify-otp-register', data);

export const loginApi = (email: string, password: string) =>
  api.post('/api/auth/login', { email, password });

export const logoutApi = () =>
  api.post('/api/auth/logout');

export const forgotPasswordApi = (email: string) =>
  api.post('/api/auth/forgot-password', { email });

export const resetPasswordApi = (email: string, otp: string, newPassword: string) =>
  api.post('/api/auth/reset-password', { email, otp, newPassword });

export const getMeApi = () =>
  api.get('/api/auth/me');

export const updateProfileApi = (data: { name?: string; phone?: string; avatar?: string }) =>
  api.put('/api/auth/profile', data);
