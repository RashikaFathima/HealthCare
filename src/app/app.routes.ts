import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },

  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: 'patient',
    canActivate: [authGuard, roleGuard(['PATIENT'])],
    loadChildren: () => import('./features/patient/patient.routes').then((m) => m.PATIENT_ROUTES)
  },
  {
    path: 'doctor',
    canActivate: [authGuard, roleGuard(['DOCTOR'])],
    loadChildren: () => import('./features/doctor/doctor.routes').then((m) => m.DOCTOR_ROUTES)
  },
  {
    path: 'receptionist',
    canActivate: [authGuard, roleGuard(['RECEPTIONIST'])],
    loadChildren: () => import('./features/receptionist/receptionist.routes').then((m) => m.RECEPTIONIST_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES)
  },

  { path: '**', redirectTo: 'auth/login' }
];
