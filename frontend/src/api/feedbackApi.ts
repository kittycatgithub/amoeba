import api from './axios';

export const submitFeedbackApi = (data: {
  name: string; email: string; rating: number; message: string;
}) => api.post('/api/feedback', data);

export const getFeedbackApi = () =>
  api.get('/api/feedback');
