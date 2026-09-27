import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { Appointment, ChartData, Doctor } from '../../../core/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DashboardStatCardComponent } from '../../../shared/components/dashboard-stat-card/dashboard-stat-card.component';
import { AppointmentCardComponent } from '../../../shared/components/appointment-card/appointment-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { ChartPanelComponent } from '../../../shared/components/chart-panel/chart-panel.component';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink, PageHeaderComponent, DashboardStatCardComponent, AppointmentCardComponent,
    EmptyStateComponent, SkeletonLoaderComponent, ChartPanelComponent
  ],
  templateUrl: './doctor-dashboard.component.html'
})
export class DoctorDashboardComponent implements OnInit {
  loading = signal(true);
  doctor = signal<Doctor | null>(null);
  todaysAppointments = signal<Appointment[]>([]);
  recentPatients = signal<Appointment[]>([]);
  stats = signal({ todaysAppointments: 0, completedConsultations: 0, pendingCases: 0, availableSlots: 0 });
  weeklyChart = signal<ChartData | null>(null);
  today = new Date().toISOString().slice(0, 10);

  constructor(
    private authService: AuthService,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.doctorService.getDoctorByUserId(user.id).subscribe((doctor) => {
      if (!doctor) { this.loading.set(false); return; }
      this.doctor.set(doctor);

      forkJoin({
        appointments: this.appointmentService.getAppointmentsByDoctor(doctor.id),
        stats: this.dashboardService.getDoctorStats(doctor.id, this.today),
        chart: this.dashboardService.getWeeklyConsultations()
      }).subscribe(({ appointments, stats, chart }) => {
        this.todaysAppointments.set(appointments.filter((a) => a.date === this.today));
        this.recentPatients.set(
          appointments.filter((a) => a.status === 'COMPLETED').slice(0, 4)
        );
        this.stats.set(stats as any);
        this.weeklyChart.set(chart);
        this.loading.set(false);
      });
    });
  }
}
