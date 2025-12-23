
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const scannerAPI = {
  initiateScan: (sector, priority = 'medium') =>
    apiClient.post('/api/v1/scanner/scan', { sector, priority }),
  getAllScans: () => apiClient.get('/api/v1/scanner/scans'),
  getScan: (scanId) => apiClient.get(`/api/v1/scanner/scans/${scanId}`),
};

export const agentsAPI = {
  getStatus: () => apiClient.get('/api/v1/agents/status'),
  executeWorkflow: (sector) => apiClient.post('/api/v1/agents/execute', { sector }),
};

export const analyticsAPI = {
  getPerformance: () => apiClient.get('/api/v1/analytics/performance'),
  getFailures: () => apiClient.get('/api/v1/analytics/failures'),
  getROI: () => apiClient.get('/api/v1/analytics/roi'),
};

export const twinAPI = {
  getAllComponents: () => apiClient.get('/api/v1/twin/components'),
  getComponent: (componentId) => apiClient.get(`/api/v1/twin/components/${componentId}`),
  sync: () => apiClient.post('/api/v1/twin/sync'),
};

export default apiClient;
