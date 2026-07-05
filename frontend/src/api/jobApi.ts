import api from './axios';

export interface SalaryRange {
  min: number | null;
  max: number | null;
}

export interface JobPayload {
  title: string;
  description: string;
  skills: string[];
  status: 'open' | 'closed';
  location: 'remote' | 'hybrid' | 'on-site';
  salaryRange: SalaryRange;
  ctc: number | null;
  jobTypes: string[];
}

export interface JobFilters {
  page?: number;
  limit?: number;
  status?: string;
  location?: string[];
  search?: string;
  minCtc?: number;
  maxCtc?: number;
  jobTypes?: string[];
  skills?: string[];
  postedBy?: string[];
}

export const getJobsApi = (filters: JobFilters = {}) => {
  const params: Record<string, string> = {};
  if (filters.page) params.page = String(filters.page);
  if (filters.limit) params.limit = String(filters.limit);
  if (filters.status) params.status = filters.status;
  if (filters.search) params.search = filters.search;
  if (filters.minCtc && filters.minCtc > 0) params.minCtc = String(filters.minCtc);
  if (filters.maxCtc && filters.maxCtc > 0) params.maxCtc = String(filters.maxCtc);
  if (filters.location?.length) params.location = filters.location.join(',');
  if (filters.jobTypes?.length) params.jobTypes = filters.jobTypes.join(',');
  if (filters.skills?.length) params.skills = filters.skills.join(',');
  if (filters.postedBy?.length) params.postedBy = filters.postedBy.join(',');
  return api.get('/api/jobs', { params });
};

export const getJobApi = (id: string) =>
  api.get(`/api/jobs/${id}`);

export const getMyJobsApi = () =>
  api.get('/api/jobs/user/my-jobs');

export const createJobApi = async (payload: JobPayload) => {
  const { data } = await api.post('/api/jobs', payload, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });
  return data;
};

export const updateJobApi = (id: string, payload: Partial<JobPayload>) =>
  api.put(`/api/jobs/${id}`, payload);

export const deleteJobApi = (id: string) =>
  api.delete(`/api/jobs/${id}`);