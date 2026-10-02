import axios from 'axios';

// Base API configuration for the public portfolio
const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

// Since the public portfolio only fetches published content and submits contact forms,
// we do NOT need JWT tokens for these endpoints. 
// The backend `BasePublishViewSet` automatically filters `state="PUBLISHED"` for unauthenticated requests.

export default api;
