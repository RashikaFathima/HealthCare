import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DoctorService } from '../../../core/services/doctor.service';
import { AvailabilityService } from '../../../core/services/availability.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { PatientService } from '../../../core/services/patient.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Doctor, TimeSlot } from '../../../core/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './book-appointment.component.html'
})
export class BookAppointmentComponent implements OnInit {
  step = signal<1 | 2 | 3>(1);
  loadingDoctors = signal(true);
  loadingSlots = signal(false);
  submitting = signal(false);
  bookingSuccess = signal(false);

  doctors = signal<Doctor[]>([]);
  selectedDoctor = signal<Doctor | null>(null);
  selectedDate = signal<string>('');
  selectedSlot = signal<TimeSlot | null>(null);
  availableSlots = signal<TimeSlot[]>([]);
  minDate = new Date().toISOString().slice(0, 10);

  reasonForm = this.fb.group({
    reason: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private availabilityService: AvailabilityService,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.doctorService.getApprovedDoctors().subscribe((doctors) => {
      this.doctors.set(doctors);
      this.loadingDoctors.set(false);

      const preselectId = this.route.snapshot.queryParamMap.get('doctorId');
      if (preselectId) {
        const found = doctors.find((d) => d.id === preselectId);
        if (found) this.selectDoctor(found);
      }
    });
  }

  selectDoctor(doctor: Doctor): void {
    this.selectedDoctor.set(doctor);
    this.selectedDate.set('');
    this.selectedSlot.set(null);
    this.availableSlots.set([]);
    this.step.set(2);
  }

  onDateChange(dateValue: string): void {
    this.selectedDate.set(dateValue);
    this.selectedSlot.set(null);
    if (!dateValue || !this.selectedDoctor()) return;

    this.loadingSlots.set(true);
    this.availabilityService.getAvailableSlots(this.selectedDoctor()!.id, dateValue).subscribe((slots) => {
      this.availableSlots.set(slots);
      this.loadingSlots.set(false);
    });
  }

  selectSlot(slot: TimeSlot): void {
    this.selectedSlot.set(slot);
  }

  goToReason(): void {
    if (!this.selectedSlot()) return;
    this.step.set(3);
  }

  backTo(step: 1 | 2 | 3): void {
    this.step.set(step);
  }

  confirmBooking(): void {
    if (this.reasonForm.invalid) {
      this.reasonForm.markAllAsTouched();
      return;
    }
    const doctor = this.selectedDoctor();
    const slot = this.selectedSlot();
    const user = this.authService.currentUser();
    if (!doctor || !slot || !user) return;

    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm appointment',
        message: `Book ${doctor.fullName} on ${this.selectedDate()} at ${slot.startTime}?`,
        confirmText: 'Confirm booking'
      }
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.submitting.set(true);

      this.patientService.getPatientByUserId(user.id).subscribe((patient) => {
        if (!patient) { this.submitting.set(false); return; }

        this.appointmentService
          .createAppointment({
            patientId: patient.id,
            patientName: patient.fullName,
            doctorId: doctor.id,
            doctorName: doctor.fullName,
            specialization: doctor.specialization,
            date: this.selectedDate(),
            timeSlot: slot.startTime,
            reason: this.reasonForm.value.reason!
          })
          .subscribe(() => {
            this.availabilityService.bookSlot(doctor.id, this.selectedDate(), slot.id).subscribe();
            this.submitting.set(false);
            this.bookingSuccess.set(true);
            this.toast.success('Appointment booked successfully!');
          });
      });
    });
  }

  bookAnother(): void {
    this.bookingSuccess.set(false);
    this.step.set(1);
    this.selectedDoctor.set(null);
    this.selectedDate.set('');
    this.selectedSlot.set(null);
    this.reasonForm.reset();
  }

  goToAppointments(): void {
    this.router.navigate(['/patient/appointments']);
  }
}
