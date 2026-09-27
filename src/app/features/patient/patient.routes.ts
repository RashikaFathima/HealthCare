import { Routes } from '@angular/router';
import { AppShellComponent } from '../../shared/components/app-shell/app-shell.component';
import { NAV_ITEMS } from './patient-nav';

export const PATIENT_ROUTES: Routes = [
  {
    path: '',
    component: AppShellComponent,
    data: { navItems: NAV_ITEMS, profilePath: '/patient/profile' },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/patient-dashboard.component').then((m) => m.PatientDashboardComponent) },
      { path: 'doctors', loadComponent: () => import('./doctors/doctor-search.component').then((m) => m.DoctorSearchComponent) },
      { path: 'book-appointment', loadComponent: () => import('./book-appointment/book-appointment.component').then((m) => m.BookAppointmentComponent) },
      { path: 'appointments', loadComponent: () => import('./appointments/patient-appointments.component').then((m) => m.PatientAppointmentsComponent) },
      { path: 'records', loadComponent: () => import('./records/medical-records.component').then((m) => m.MedicalRecordsComponent) },
      { path: 'profile', loadComponent: () => import('./profile/patient-profile.component').then((m) => m.PatientProfileComponent) }
    ]
  }
];
