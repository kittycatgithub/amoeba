import api from './axios';

export interface PropertyFilters {
  page?: number;
  limit?: number;
  category?: string;
  city?: string;
  search?: string;
  minBudget?: number;
  maxBudget?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number[];
  propertyTypes?: string[];
  furnishing?: string[];
  postedBy?: string[];
  bathrooms?: number[];
  amenities?: string[];
  availableFor?: string[];
  availability?: string[];
}

export const getPropertiesApi = (filters: PropertyFilters = {}) => {
  const params: Record<string, string> = {};
  if (filters.page) params.page = String(filters.page);
  if (filters.limit) params.limit = String(filters.limit);
  if (filters.category) params.category = filters.category;
  if (filters.city) params.city = filters.city;
  if (filters.search) params.search = filters.search;
  if (filters.minBudget && filters.minBudget > 0) params.minBudget = String(filters.minBudget);
  if (filters.maxBudget && filters.maxBudget > 0) params.maxBudget = String(filters.maxBudget);
  if (filters.minArea && filters.minArea > 0) params.minArea = String(filters.minArea);
  if (filters.maxArea && filters.maxArea > 0) params.maxArea = String(filters.maxArea);
  if (filters.bedrooms?.length) params.bedrooms = filters.bedrooms.join(',');
  if (filters.propertyTypes?.length) params.propertyTypes = filters.propertyTypes.join(',');
  if (filters.furnishing?.length) params.furnishing = filters.furnishing.join(',');
  if (filters.postedBy?.length) params.postedBy = filters.postedBy.join(',');
  if (filters.bathrooms?.length) params.bathrooms = filters.bathrooms.join(',');
  if (filters.amenities?.length) params.amenities = filters.amenities.join(',');
  if (filters.availableFor?.length) params.availableFor = filters.availableFor.join(',');
  if (filters.availability?.length) params.availability = filters.availability.join(',');
  return api.get('/api/properties', { params });
};

export const getPropertyApi = (id: string) =>
  api.get(`/api/properties/${id}`);

export const getMyPropertiesApi = () =>
  api.get('/api/properties/user/my-properties');

// export const createPropertyApi = (formData: FormData) =>
//   api.post('/api/properties', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });

// createProperty now sends plain JSON
export const createPropertyApi = async (payload: Record<string, any>) => {
  const { data } = await api.post('/api/properties/create', payload, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });
  return data;
};

export const updatePropertyApi = (id: string, formData: FormData) =>
  api.put(`/api/properties/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deletePropertyApi = (id: string) =>
  api.delete(`/api/properties/${id}`);
