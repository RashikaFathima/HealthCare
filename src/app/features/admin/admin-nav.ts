import { NavItem } from '../../shared/components/app-shell/app-shell.component';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'fa-grid-2', path: '/admin/dashboard' },
  { label: 'User Management', icon: 'fa-users', path: '/admin/users' },
  { label: 'Doctor Approval', icon: 'fa-user-doctor', path: '/admin/doctors' },
  { label: 'Reports', icon: 'fa-chart-line', path: '/admin/reports' }
];
