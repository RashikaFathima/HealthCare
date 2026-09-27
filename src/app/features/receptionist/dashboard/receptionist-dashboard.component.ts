import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { Appointment } from '../../../core/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DashboardStatCardComponent } from '../../../shared/components/dashboard-stat-card/dashboard-stat-card.component';
import { AppointmentCardComponent } from '../../../shared/components/appointment-card/appointment-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-receptionist-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeaderComponent, DashboardStatCardComponent, AppointmentCardComponent, EmptyStateComponent, SkeletonLoaderComponent],
  templateUrl: './receptionist-dashboard.component.html'
})
export class ReceptionistDashboardComponent implements OnInit {
  loading = signal(true);
  todaysQueue = signal<Appointment[]>([]);
  stats = signal({ todaysAppointments: 0, checkedInPatients: 0, pendingAppointments: 0, cancelledBookings: 0 });
  today = new Date().toISOString().slice(0, 10);

  constructor(private appointmentService: AppointmentService, private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getReceptionistStats(this.today).subscribe((stats) => this.stats.set(stats as any));
    this.appointmentService.getTodaysQueue(this.today).subscribe((list) => {
      this.todaysQueue.set(list.slice(0, 5));
      this.loading.set(false);
    });
  }
}
