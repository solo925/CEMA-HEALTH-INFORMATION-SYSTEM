export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';

export const API_PATHS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login/`,
    REGISTER: `${API_BASE_URL}/auth/register/`,
    REFRESH: `${API_BASE_URL}/auth/refresh/`,
    LOGOUT: `${API_BASE_URL}/auth/logout/`,
  },
  CLIENTS: {
    BASE: `${API_BASE_URL}/clients/`,
    DETAIL: (id: string) => `${API_BASE_URL}/clients/${id}/`,
    ENROLL: (id: string) => `${API_BASE_URL}/clients/${id}/enroll/`,
    SEARCH: `${API_BASE_URL}/clients/search/`,
  },
  PROGRAMS: {
    BASE: `${API_BASE_URL}/programs/`,
    DETAIL: (id: string) => `${API_BASE_URL}/programs/${id}/`,
    CLIENTS: (id: string) => `${API_BASE_URL}/programs/${id}/clients/`,
  },
};