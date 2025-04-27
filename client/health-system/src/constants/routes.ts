export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CLIENTS: {
    LIST: '/clients',
    DETAIL: (id: string = ':id') => `/clients/${id}`,
    CREATE: '/clients/new',
    EDIT: (id: string = ':id') => `/clients/${id}/edit`,
    ENROLL: (id: string = ':id') => `/clients/${id}/enroll`,
  },
  PROGRAMS: {
    LIST: '/programs',
    DETAIL: (id: string = ':id') => `/programs/${id}`,
    CREATE: '/programs/new',
    EDIT: (id: string = ':id') => `/programs/${id}/edit`,
  },
};
