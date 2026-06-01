// utils/uploadToCloudinary.ts
import api from "../api/axios";

interface SignatureResponse {
  timestamp: number;
  signature: string;
  folder: string;
  cloudName: string;
  apiKey: string;
}

export const uploadToCloudinary = async (file: File): Promise<string> => {
  // 1. Your backend — needs auth cookie, use api instance
  const { data } = await api.get<SignatureResponse>('/api/upload/signature');

  // 2. Cloudinary — native fetch, completely bypasses axios and its withCredentials:true
  const formData = new FormData();
  formData.append('file', file);
  formData.append('timestamp', String(data.timestamp));
  formData.append('signature', data.signature);
  formData.append('folder', data.folder);
  formData.append('api_key', data.apiKey);

  const response = await fetch(                                          // ← fetch, not api.post
    `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,                                                    // ← no headers, no credentials
    }
  );

  if (!response.ok) {                                                    // ← fetch Response has .ok
    const err = await response.json();
    console.error('Cloudinary 403 detail:', err.error.message); 
    throw new Error(err.error?.message || 'Cloudinary upload failed');
  }

  const result = await response.json();
  console.log(result, 'result')
  return result.secure_url;
};