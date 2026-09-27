import { UserRole } from '../models';

export const ROLES: { [key in UserRole]: UserRole } = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  RECEPTIONIST: 'RECEPTIONIST',
  ADMIN: 'ADMIN'
};

export const ROLE_HOME_ROUTE: { [key in UserRole]: string } = {
  PATIENT: '/patient/dashboard',
  DOCTOR: '/doctor/dashboard',
  RECEPTIONIST: '/receptionist/dashboard',
  ADMIN: '/admin/dashboard'
};

export const ROLE_LABELS: { [key in UserRole]: string } = {
  PATIENT: 'Patient',
  DOCTOR: 'Doctor',
  RECEPTIONIST: 'Receptionist',
  ADMIN: 'Administrator'
};
