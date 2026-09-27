export const APP_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PATIENT: {
    DASHBOARD: '/patient/dashboard',
    DOCTORS: '/patient/doctors',
    BOOK_APPOINTMENT: '/patient/book-appointment',
    APPOINTMENTS: '/patient/appointments',
    RECORDS: '/patient/records',
    PROFILE: '/patient/profile'
  },
  DOCTOR: {
    DASHBOARD: '/doctor/dashboard',
    AVAILABILITY: '/doctor/availability',
    APPOINTMENTS: '/doctor/appointments',
    CONSULTATIONS: '/doctor/consultations',
    PRESCRIPTIONS: '/doctor/prescriptions'
  },
  RECEPTIONIST: {
    DASHBOARD: '/receptionist/dashboard',
    APPOINTMENTS: '/receptionist/appointments',
    QUEUE: '/receptionist/queue'
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    DOCTORS: '/admin/doctors',
    REPORTS: '/admin/reports'
  }
};
