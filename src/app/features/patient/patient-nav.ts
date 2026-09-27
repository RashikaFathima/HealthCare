import { NavItem } from '../../shared/components/app-shell/app-shell.component';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'fa-grid-2', path: '/patient/dashboard' },
  { label: 'Find Doctors', icon: 'fa-user-doctor', path: '/patient/doctors' },
  { label: 'Book Appointment', icon: 'fa-calendar-plus', path: '/patient/book-appointment' },
  { label: 'My Appointments', icon: 'fa-calendar-days', path: '/patient/appointments' },
  { label: 'Medical Records', icon: 'fa-file-medical', path: '/patient/records' },
  { label: 'Profile', icon: 'fa-user', path: '/patient/profile' }
];
