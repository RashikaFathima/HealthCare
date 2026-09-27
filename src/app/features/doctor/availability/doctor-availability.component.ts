import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../core/auth/auth.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { AvailabilityService } from '../../../core/services/availability.service';
import { Doctor, DoctorAvailability, TimeSlot } from '../../../core/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastService } from '../../../core/services/toast.service';

function toMinutes(t: string): number {
  const [time, meridian] = t.split(' ');
  let [h, m] = time.split(':').map(Number);
  if (meridian === 'PM' && h !== 12) h += 12;
  if (meridian === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

@Component({
  selector: 'app-doctor-availability',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './doctor-availability.component.html'
})
export class DoctorAvailabilityComponent implements OnInit {
  loading = signal(true);
  saving = signal(false);
  doctor = signal<Doctor | null>(null);
  entries = signal<DoctorAvailability[]>([]);
  selectedDate = signal<string>(new Date().toISOString().slice(0, 10));
  minDate = new Date().toISOString().slice(0, 10);
  formError = signal('');

  // Next 14 days for the quick calendar strip
  upcomingDays = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  form = this.fb.group({
    startTime: ['09:00', Validators.required],
    endTime: ['09:30', Validators.required]
  });

  slotsForSelectedDate = computed<TimeSlot[]>(() => {
    return this.entries().find((e) => e.date === this.selectedDate())?.slots ?? [];
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private doctorService: DoctorService,
    private availabilityService: AvailabilityService,
    private dialog: MatDialog,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) return;
    this.doctorService.getDoctorByUserId(user.id).subscribe((doctor) => {
      if (!doctor) { this.loading.set(false); return; }
      this.doctor.set(doctor);
      this.reload(doctor.id);
    });
  }

  reload(doctorId: string): void {
    this.availabilityService.getAvailabilityForDoctor(doctorId).subscribe((entries) => {
      this.entries.set(entries);
      this.loading.set(false);
    });
  }

  selectDate(date: string): void {
    this.selectedDate.set(date);
    this.formError.set('');
  }

  private to12Hour(hhmm: string): string {
    let [h, m] = hhmm.split(':').map(Number);
    const meridian = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m.toString().padStart(2, '0')} ${meridian}`;
  }

  addSlot(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const doctor = this.doctor();
    if (!doctor) return;

    const { startTime, endTime } = this.form.getRawValue();
    const start12 = this.to12Hour(startTime!);
    const end12 = this.to12Hour(endTime!);

    if (toMinutes(start12) >= toMinutes(end12)) {
      this.formError.set('End time must be after start time.');
      return;
    }

    this.saving.set(true);
    this.formError.set('');
    this.availabilityService.addSlot(doctor.id, this.selectedDate(), { startTime: start12, endTime: end12 }).subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success('Availability slot added.');
        this.reload(doctor.id);
      },
      error: (err) => {
        this.saving.set(false);
        this.formError.set(err?.message ?? 'Could not add slot — it may overlap an existing one.');
      }
    });
  }

  removeSlot(slot: TimeSlot): void {
    const doctor = this.doctor();
    if (!doctor) return;
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Remove slot?', message: `Remove the ${slot.startTime} - ${slot.endTime} slot?`, confirmText: 'Remove', variant: 'danger' }
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.availabilityService.removeSlot(doctor.id, this.selectedDate(), slot.id).subscribe(() => {
        this.toast.success('Slot removed.');
        this.reload(doctor.id);
      });
    });
  }
}
