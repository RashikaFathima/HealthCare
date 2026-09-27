import { Routes } from '@angular/router';
import { AppShellComponent } from '../../shared/components/app-shell/app-shell.component';
import { NAV_ITEMS } from './admin-nav';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AppShellComponent,
    data: { navItems: NAV_ITEMS, profilePath: '/admin/dashboard' },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent) },
      { path: 'users', loadComponent: () => import('./users/user-management.component').then((m) => m.UserManagementComponent) },
      { path: 'doctors', loadComponent: () => import('./doctors/doctor-approval.component').then((m) => m.DoctorApprovalComponent) },
      { path: 'reports', loadComponent: () => import('./reports/admin-reports.component').then((m) => m.AdminReportsComponent) }
    ]
  }
];
