import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { DashboardService } from '../../../core/services/dashboard.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { AdminService } from '../../../core/services/admin.service';
import { ChartData } from '../../../core/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ChartPanelComponent } from '../../../shared/components/chart-panel/chart-panel.component';
import { DashboardStatCardComponent } from '../../../shared/components/dashboard-stat-card/dashboard-stat-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, ChartPanelComponent, DashboardStatCardComponent, LoadingSpinnerComponent],
  templateUrl: './admin-reports.component.html'
})
export class AdminReportsComponent implements OnInit {
  loading = signal(true);
  dateRange = signal<'7d' | '30d' | '90d'>('30d');
  appointmentAnalytics = signal<ChartData | null>(null);
  departmentStats = signal<ChartData | null>(null);
  weeklyConsultations = signal<ChartData | null>(null);

  totalDoctors = signal(0);
  totalUsers = signal(0);
  approvedDoctors = signal(0);
  pendingDoctors = signal(0);

  constructor(
    private dashboardService: DashboardService,
    private doctorService: DoctorService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    forkJoin({
      appointments: this.dashboardService.getAppointmentAnalytics(),
      departments: this.dashboardService.getDepartmentStatistics(),
      weekly: this.dashboardService.getWeeklyConsultations(),
      doctors: this.doctorService.getDoctors(),
      users: this.adminService.getUsers()
    }).subscribe(({ appointments, departments, weekly, doctors, users }) => {
      this.appointmentAnalytics.set(appointments);
      this.departmentStats.set(departments);
      this.weeklyConsultations.set(weekly);
      this.totalDoctors.set(doctors.length);
      this.approvedDoctors.set(doctors.filter((d) => d.approvalStatus === 'APPROVED').length);
      this.pendingDoctors.set(doctors.filter((d) => d.approvalStatus === 'PENDING').length);
      this.totalUsers.set(users.length);
      this.loading.set(false);
    });
  }

  setRange(range: '7d' | '30d' | '90d'): void {
    this.dateRange.set(range);
    // NOTE: mock data is static; once a real analytics endpoint exists,
    // pass `range` through to DashboardService here to refetch scoped data.
  }
}
