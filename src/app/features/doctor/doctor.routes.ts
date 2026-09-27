import { Routes } from '@angular/router';
import { AppShellComponent } from '../../shared/components/app-shell/app-shell.component';
import { NAV_ITEMS } from './doctor-nav';

export const DOCTOR_ROUTES: Routes = [
  {
    path: '',
    component: AppShellComponent,
    data: { navItems: NAV_ITEMS, profilePath: '/doctor/dashboard' },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/doctor-dashboard.component').then((m) => m.DoctorDashboardComponent) },
      { path: 'availability', loadComponent: () => import('./availability/doctor-availability.component').then((m) => m.DoctorAvailabilityComponent) },
      { path: 'appointments', loadComponent: () => import('./appointments/doctor-appointments.component').then((m) => m.DoctorAppointmentsComponent) },
      { path: 'consultations', loadComponent: () => import('./consultations/consultation-workspace.component').then((m) => m.ConsultationWorkspaceComponent) },
      { path: 'prescriptions', loadComponent: () => import('./prescriptions/prescription-form.component').then((m) => m.PrescriptionFormComponent) }
    ]
  }
];
