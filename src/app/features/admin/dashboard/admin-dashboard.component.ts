import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { DashboardService } from '../../../core/services/dashboard.service';
import { DoctorService } from '../../../core/services/doctor.service';

import {
ChartData,
DashboardStatistics,
Doctor
} from '../../../core/models';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DashboardStatCardComponent } from '../../../shared/components/dashboard-stat-card/dashboard-stat-card.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { ChartPanelComponent } from '../../../shared/components/chart-panel/chart-panel.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
selector: 'app-admin-dashboard',
standalone: true,
imports: [
CommonModule,
RouterLink,
PageHeaderComponent,
DashboardStatCardComponent,
SkeletonLoaderComponent,
ChartPanelComponent,
EmptyStateComponent
],
templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {

loading = signal<boolean>(true);

stats = signal<DashboardStatistics>({
totalUsers: 0,
totalPatients: 0,
totalDoctors: 0,
totalAppointments: 0
});

departmentChart = signal<ChartData | null>(null);

appointmentChart = signal<ChartData | null>(null);

pendingDoctors = signal<Doctor[]>([]);

constructor(
private dashboardService: DashboardService,
private doctorService: DoctorService
) {}

ngOnInit(): void {


forkJoin({
  stats: this.dashboardService.getAdminStats(),
  department: this.dashboardService.getDepartmentStatistics(),
  appointments: this.dashboardService.getAppointmentAnalytics(),
  pending: this.doctorService.getPendingDoctors()
}).subscribe({
  next: ({
    stats,
    department,
    appointments,
    pending
  }) => {

    this.stats.set({
      totalUsers: stats.totalUsers ?? 0,
      totalPatients: stats.totalPatients ?? 0,
      totalDoctors: stats.totalDoctors ?? 0,
      totalAppointments: stats.totalAppointments ?? 0
    });

    this.departmentChart.set(department);

    this.appointmentChart.set(appointments);

    this.pendingDoctors.set(pending ?? []);

    this.loading.set(false);
  },

  error: (error) => {

    console.error(
      'Failed to load admin dashboard:',
      error
    );

    this.stats.set({
      totalUsers: 0,
      totalPatients: 0,
      totalDoctors: 0,
      totalAppointments: 0
    });

    this.departmentChart.set(null);

    this.appointmentChart.set(null);

    this.pendingDoctors.set([]);

    this.loading.set(false);
  }
});


}
}
