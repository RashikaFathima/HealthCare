import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { ConsultationService } from '../../../core/services/consultation.service';
import { PrescriptionService } from '../../../core/services/prescription.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { Appointment, Doctor } from '../../../core/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-prescription-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './prescription-form.component.html'
})
export class PrescriptionFormComponent implements OnInit {
  loading = signal(true);
  saving = signal(false);
  saved = signal(false);
  appointment = signal<Appointment | null>(null);
  doctor = signal<Doctor | null>(null);
  completedCases = signal<Appointment[]>([]);

  form = this.fb.group({
    notes: [''],
    medicines: this.fb.array([this.buildMedicineRow()])
  });

  get medicines(): FormArray {
    return this.form.get('medicines') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private consultationService: ConsultationService,
    private prescriptionService: PrescriptionService,
    private doctorService: DoctorService,
    private route: ActivatedRoute,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.doctorService.getDoctorByUserId(user.id).subscribe((doctor) => {
      if (!doctor) { this.loading.set(false); return; }
      this.doctor.set(doctor);

      this.appointmentService.getAppointmentsByDoctor(doctor.id).subscribe((appointments) => {
        this.completedCases.set(
          appointments.filter((a) => a.status === 'IN_CONSULTATION' || a.status === 'COMPLETED')
        );
        const appointmentId = this.route.snapshot.queryParamMap.get('appointmentId');
        if (appointmentId) {
          this.selectAppointment(appointments.find((a) => a.id === appointmentId) ?? null);
        }
        this.loading.set(false);
      });
    });
  }

  buildMedicineRow() {
    return this.fb.group({
      name: ['', Validators.required],
      dosage: ['', Validators.required],
      frequency: ['', Validators.required],
      duration: ['', Validators.required],
      instructions: ['']
    });
  }

  addMedicine(): void {
    this.medicines.push(this.buildMedicineRow());
  }

  removeMedicine(index: number): void {
    if (this.medicines.length > 1) this.medicines.removeAt(index);
  }

  selectAppointment(appointment: Appointment | null): void {
    this.appointment.set(appointment);
    this.saved.set(false);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const appointment = this.appointment();
    const doctor = this.doctor();
    if (!appointment || !doctor) return;

    this.saving.set(true);
    const v = this.form.getRawValue();

    this.consultationService.getByAppointmentId(appointment.id).subscribe((consultation) => {
      this.prescriptionService
        .savePrescription({
          consultationId: consultation?.id ?? '',
          appointmentId: appointment.id,
          patientId: appointment.patientId,
          patientName: appointment.patientName,
          doctorId: doctor.id,
          doctorName: doctor.fullName,
          medicines: v.medicines!.map((m, i) => ({ ...m, id: `med-${Date.now()}-${i}` })) as any,
          notes: v.notes ?? ''
        })
        .subscribe(() => {
          this.saving.set(false);
          this.saved.set(true);
          this.toast.success('Prescription saved successfully.');
        });
    });
  }
}
