import { Routes } from '@angular/router';
import { AppShellComponent } from '../../shared/components/app-shell/app-shell.component';
import { NAV_ITEMS } from './receptionist-nav';

export const RECEPTIONIST_ROUTES: Routes = [
  {
    path: '',
    component: AppShellComponent,
    data: { navItems: NAV_ITEMS, profilePath: '/receptionist/dashboard' },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/receptionist-dashboard.component').then((m) => m.ReceptionistDashboardComponent) },
      { path: 'appointments', loadComponent: () => import('./appointments/receptionist-appointments.component').then((m) => m.ReceptionistAppointmentsComponent) },
      { path: 'queue', loadComponent: () => import('./queue/appointment-queue.component').then((m) => m.AppointmentQueueComponent) }
    ]
  }
];
