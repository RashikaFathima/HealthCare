import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment, AppointmentStatus } from '../../../core/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchFilterComponent, FilterOption } from '../../../shared/components/search-filter/search-filter.component';
import { AppointmentCardComponent } from '../../../shared/components/appointment-card/appointment-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ToastService } from '../../../core/services/toast.service';

type TabKey = 'today' | 'upcoming' | 'completed' | 'cancelled';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, SearchFilterComponent, AppointmentCardComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './doctor-appointments.component.html'
})
export class DoctorAppointmentsComponent implements OnInit {
  loading = signal(true);
  appointments = signal<Appointment[]>([]);
  activeTab = signal<TabKey>('today');
  searchTerm = signal('');
  today = new Date().toISOString().slice(0, 10);
  private doctorId = '';

  tabs: { key: TabKey; label: string }[] = [
    { key: 'today', label: "Today" },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' }
  ];

  filtered = computed(() => {
    let list = this.appointments();
    const term = this.searchTerm().toLowerCase().trim();
    if (term) list = list.filter((a) => a.patientName.toLowerCase().includes(term));

    switch (this.activeTab()) {
      case 'today': return list.filter((a) => a.date === this.today && a.status !== 'CANCELLED');
      case 'upcoming': return list.filter((a) => a.date > this.today && (a.status === 'BOOKED' || a.status === 'CHECKED_IN'));
      case 'completed': return list.filter((a) => a.status === 'COMPLETED');
      case 'cancelled': return list.filter((a) => a.status === 'CANCELLED' || a.status === 'NO_SHOW');
    }
  });

  constructor(
    private authService: AuthService,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) return;
    this.doctorService.getDoctorByUserId(user.id).subscribe((doctor) => {
      if (!doctor) { this.loading.set(false); return; }
      this.doctorId = doctor.id;
      this.load();
    });
  }

  load(): void {
    this.loading.set(true);
    this.appointmentService.getAppointmentsByDoctor(this.doctorId).subscribe((list) => {
      this.appointments.set(list);
      this.loading.set(false);
    });
  }

  onSearch(term: string): void { this.searchTerm.set(term); }

  startConsultation(appointment: Appointment): void {
    if (appointment.status === 'BOOKED' || appointment.status === 'CHECKED_IN') {
      this.appointmentService.updateAppointmentStatus(appointment.id, 'IN_CONSULTATION').subscribe(() => {
        this.router.navigate(['/doctor/consultations'], { queryParams: { appointmentId: appointment.id } });
      });
    } else {
      this.router.navigate(['/doctor/consultations'], { queryParams: { appointmentId: appointment.id } });
    }
  }

  markCompleted(appointment: Appointment): void {
    this.appointmentService.updateAppointmentStatus(appointment.id, 'COMPLETED').subscribe(() => {
      this.toast.success('Appointment marked as completed.');
      this.load();
    });
  }
}
