import { NavItem } from '../../shared/components/app-shell/app-shell.component';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'fa-grid-2', path: '/doctor/dashboard' },
  { label: 'Availability', icon: 'fa-calendar-check', path: '/doctor/availability' },
  { label: 'Appointments', icon: 'fa-calendar-days', path: '/doctor/appointments' },
  { label: 'Consultations', icon: 'fa-stethoscope', path: '/doctor/consultations' },
  { label: 'Prescriptions', icon: 'fa-pills', path: '/doctor/prescriptions' }
];
