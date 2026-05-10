import api from './axios';

export const submitContactApi = (data: {
  name: string; email: string; phone?: string; subject: string; message: string; property?: string;
}) => api.post('/api/contact', data);

export const getContactsApi = () =>
  api.get('/api/contact');
