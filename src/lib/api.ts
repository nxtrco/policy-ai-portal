import { API_URL } from '@/config/env';

export async function apiFetch(url: string, options: RequestInit = {}) {
  const accessToken = localStorage.getItem('access_token');
  const headers = {
    ...options.headers,
    Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return;
  }

  return response;
}

// Helper function to build API URLs
export function buildApiUrl(endpoint: string): string {
  return `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
} 