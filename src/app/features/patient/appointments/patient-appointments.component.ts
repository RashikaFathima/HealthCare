import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../core/auth/auth.service';
import { PatientService } from '../../../core/services/patient.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment, AppointmentStatus } from '../../../core/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchFilterComponent, FilterOption } from '../../../shared/components/search-filter/search-filter.component';
import { AppointmentCardComponent } from '../../../shared/components/appointment-card/appointment-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-patient-appointments',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, SearchFilterComponent, AppointmentCardComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './patient-appointments.component.html'
})
export class PatientAppointmentsComponent implements OnInit {
  loading = signal(true);
  view = signal<'list' | 'timeline'>('list');
  appointments = signal<Appointment[]>([]);
  searchTerm = signal('');
  statusFilter = signal('');
  private patientId = '';

  statusOptions: FilterOption[] = [
    { value: 'BOOKED', label: 'Booked' },
    { value: 'CHECKED_IN', label: 'Checked In' },
    { value: 'IN_CONSULTATION', label: 'In Consultation' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  filtered = computed(() => {
    let list = this.appointments();
    const term = this.searchTerm().toLowerCase().trim();
    if (term) list = list.filter((a) => a.doctorName.toLowerCase().includes(term) || a.specialization.toLowerCase().includes(term));
    if (this.statusFilter()) list = list.filter((a) => a.status === this.statusFilter());
    return [...list].sort((a, b) => (a.date < b.date ? 1 : -1));
  });

  constructor(
    private authService: AuthService,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) return;
    this.patientService.getPatientByUserId(user.id).subscribe((patient) => {
      if (!patient) { this.loading.set(false); return; }
      this.patientId = patient.id;
      this.load();
    });
  }

  load(): void {
    this.loading.set(true);
    this.appointmentService.getAppointmentsByPatient(this.patientId).subscribe((list) => {
      this.appointments.set(list);
      this.loading.set(false);
    });
  }

  onSearch(term: string) { this.searchTerm.set(term); }
  onFilter(status: string) { this.statusFilter.set(status); }

  cancel(appointment: Appointment): void {
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Cancel appointment?', message: `Cancel your appointment with ${appointment.doctorName}?`, confirmText: 'Yes, cancel', variant: 'danger' }
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.appointmentService.cancelAppointment(appointment.id).subscribe(() => {
        this.toast.success('Appointment cancelled.');
        this.load();
      });
    });
  }

  canCancel(a: Appointment): boolean {
    return a.status === 'BOOKED' || a.status === 'CHECKED_IN';
  }
}
