import { NavItem } from '../../shared/components/app-shell/app-shell.component';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'fa-grid-2', path: '/receptionist/dashboard' },
  { label: 'Appointments', icon: 'fa-calendar-days', path: '/receptionist/appointments' },
  { label: 'Patient Queue', icon: 'fa-list-ol', path: '/receptionist/queue' }
];
