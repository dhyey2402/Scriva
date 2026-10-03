import axios from 'axios';

// Base API configuration for the public portfolio
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';
export const API_BASE_URL = rawApiUrl.endsWith('/') ? rawApiUrl : `${rawApiUrl}/`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Since the public portfolio only fetches published content and submits contact forms,
// we do NOT need JWT tokens for these endpoints. 
// The backend `BasePublishViewSet` automatically filters `state="PUBLISHED"` for unauthenticated requests.

export default api;
