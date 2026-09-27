import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { PatientService } from '../../../core/services/patient.service';
import { Patient } from '../../../core/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { UserAvatarComponent } from '../../../shared/components/user-avatar/user-avatar.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent, LoadingSpinnerComponent, UserAvatarComponent],
  templateUrl: './patient-profile.component.html'
})
export class PatientProfileComponent implements OnInit {
  loading = signal(true);
  saving = signal(false);
  patient = signal<Patient | null>(null);
  editMode = signal(false);

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    dateOfBirth: ['', [Validators.required]],
    gender: ['MALE', [Validators.required]],
    bloodGroup: [''],
    address: ['', [Validators.required]],
    emergencyContactName: ['', [Validators.required]],
    emergencyContactRelationship: ['', [Validators.required]],
    emergencyContactPhone: ['', [Validators.required]]
  });

  constructor(
    private authService: AuthService,
    private patientService: PatientService,
    private fb: FormBuilder,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) return;
    this.patientService.getPatientByUserId(user.id).subscribe((patient) => {
      if (patient) {
        this.patient.set(patient);
        this.form.patchValue({
          fullName: patient.fullName,
          email: patient.email,
          phone: patient.phone,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
          bloodGroup: patient.bloodGroup ?? '',
          address: patient.address,
          emergencyContactName: patient.emergencyContact.name,
          emergencyContactRelationship: patient.emergencyContact.relationship,
          emergencyContactPhone: patient.emergencyContact.phone
        });
      }
      this.loading.set(false);
    });
  }

  toggleEdit(): void {
    this.editMode.set(!this.editMode());
    if (!this.editMode() && this.patient()) {
      // reset if user cancels
      this.ngOnInit();
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const patient = this.patient();
    if (!patient) return;

    this.saving.set(true);
    const v = this.form.getRawValue();
    this.patientService
      .updatePatientProfile(patient.id, {
        fullName: v.fullName!,
        email: v.email!,
        phone: v.phone!,
        dateOfBirth: v.dateOfBirth!,
        gender: v.gender as any,
        bloodGroup: v.bloodGroup ?? undefined,
        address: v.address!,
        emergencyContact: {
          name: v.emergencyContactName!,
          relationship: v.emergencyContactRelationship!,
          phone: v.emergencyContactPhone!
        }
      })
      .subscribe((updated) => {
        this.patient.set(updated);
        this.saving.set(false);
        this.editMode.set(false);
        this.toast.success('Profile updated successfully.');
      });
  }
}
