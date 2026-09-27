import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment } from '../../../core/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchFilterComponent } from '../../../shared/components/search-filter/search-filter.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { UserAvatarComponent } from '../../../shared/components/user-avatar/user-avatar.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-appointment-queue',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, SearchFilterComponent, StatusBadgeComponent, UserAvatarComponent, EmptyStateComponent, LoadingSpinnerComponent],
  templateUrl: './appointment-queue.component.html'
})
export class AppointmentQueueComponent implements OnInit {
  loading = signal(true);
  queue = signal<Appointment[]>([]);
  searchTerm = signal('');
  today = new Date().toISOString().slice(0, 10);

  filtered = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.queue();
    return this.queue().filter((a) => a.patientName.toLowerCase().includes(term) || a.doctorName.toLowerCase().includes(term));
  });

  constructor(private appointmentService: AppointmentService, private dialog: MatDialog, private toast: ToastService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.appointmentService.getTodaysQueue(this.today).subscribe((list) => {
      this.queue.set(list);
      this.loading.set(false);
    });
  }

  onSearch(term: string): void { this.searchTerm.set(term); }

  checkIn(appointment: Appointment): void {
    const nextQueueNumber = Math.max(0, ...this.queue().map((a) => a.queueNumber ?? 0)) + 1;
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Confirm check-in', message: `Check in ${appointment.patientName} for their ${appointment.timeSlot} appointment?`, confirmText: 'Check in' }
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.appointmentService.checkIn(appointment.id, nextQueueNumber).subscribe(() => {
        this.toast.success(`${appointment.patientName} checked in — queue #${nextQueueNumber}`);
        this.load();
      });
    });
  }

  markNoShow(appointment: Appointment): void {
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Mark as no-show?', message: `Mark ${appointment.patientName} as a no-show for this appointment?`, confirmText: 'Mark no-show', variant: 'danger' }
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.appointmentService.updateAppointmentStatus(appointment.id, 'NO_SHOW').subscribe(() => {
        this.toast.success('Marked as no-show.');
        this.load();
      });
    });
  }

  canCheckIn(a: Appointment): boolean {
    return a.status === 'BOOKED';
  }
}
