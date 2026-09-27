import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { ConsultationService } from '../../../core/services/consultation.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { Appointment, Doctor } from '../../../core/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-consultation-workspace',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent, LoadingSpinnerComponent, EmptyStateComponent, StatusBadgeComponent],
  templateUrl: './consultation-workspace.component.html'
})
export class ConsultationWorkspaceComponent implements OnInit {
  loading = signal(true);
  saving = signal(false);
  appointment = signal<Appointment | null>(null);
  doctor = signal<Doctor | null>(null);
  activeCases = signal<Appointment[]>([]);
  saved = signal(false);

  form = this.fb.group({
    symptoms: ['', [Validators.required, Validators.minLength(5)]],
    diagnosis: ['', [Validators.required, Validators.minLength(3)]],
    clinicalNotes: ['', [Validators.required, Validators.minLength(5)]],
    followUpInstructions: [''],
    followUpDate: ['']
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private consultationService: ConsultationService,
    private doctorService: DoctorService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.doctorService.getDoctorByUserId(user.id).subscribe((doctor) => {
      if (!doctor) { this.loading.set(false); return; }
      this.doctor.set(doctor);

      this.appointmentService.getAppointmentsByDoctor(doctor.id).subscribe((appointments) => {
        this.activeCases.set(appointments.filter((a) => a.status === 'CHECKED_IN' || a.status === 'IN_CONSULTATION'));

        const appointmentId = this.route.snapshot.queryParamMap.get('appointmentId');
        if (appointmentId) {
          this.selectAppointment(appointments.find((a) => a.id === appointmentId) ?? null);
        }
        this.loading.set(false);
      });
    });
  }

  selectAppointment(appointment: Appointment | null): void {
    this.appointment.set(appointment);
    this.saved.set(false);
    this.form.reset({ symptoms: '', diagnosis: '', clinicalNotes: '', followUpInstructions: '', followUpDate: '' });

    if (appointment) {
      this.consultationService.getByAppointmentId(appointment.id).subscribe((existing) => {
        if (existing) {
          this.form.patchValue({
            symptoms: existing.symptoms,
            diagnosis: existing.diagnosis,
            clinicalNotes: existing.clinicalNotes,
            followUpInstructions: existing.followUpInstructions,
            followUpDate: existing.followUpDate ?? ''
          });
        }
      });

      if (appointment.status === 'CHECKED_IN') {
        this.appointmentService.updateAppointmentStatus(appointment.id, 'IN_CONSULTATION').subscribe();
      }
    }

    this.router.navigate([], { queryParams: appointment ? { appointmentId: appointment.id } : {}, relativeTo: this.route });
  }

  save(complete: boolean): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const appointment = this.appointment();
    const doctor = this.doctor();
    if (!appointment || !doctor) return;

    this.saving.set(true);
    const v = this.form.getRawValue();

    this.consultationService
      .saveConsultation({
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        doctorId: doctor.id,
        symptoms: v.symptoms!,
        diagnosis: v.diagnosis!,
        clinicalNotes: v.clinicalNotes!,
        followUpInstructions: v.followUpInstructions ?? '',
        followUpDate: v.followUpDate || undefined,
        status: complete ? 'COMPLETED' : 'IN_PROGRESS'
      })
      .subscribe(() => {
        this.saving.set(false);
        this.saved.set(true);
        this.toast.success(complete ? 'Consultation completed and saved.' : 'Consultation notes saved.');

        if (complete) {
          this.appointmentService.updateAppointmentStatus(appointment.id, 'COMPLETED').subscribe(() => {
            this.activeCases.update((list) => list.filter((a) => a.id !== appointment.id));
          });
        }
      });
  }
}
