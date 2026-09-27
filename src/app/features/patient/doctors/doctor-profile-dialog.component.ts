import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Doctor } from '../../../core/models';
import { UserAvatarComponent } from '../../../shared/components/user-avatar/user-avatar.component';

@Component({
  selector: 'app-doctor-profile-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, UserAvatarComponent],
  template: `
    <div class="doctor-dialog">
      <div class="dialog-top">
        <app-user-avatar [name]="data.doctor.fullName" [size]="64"></app-user-avatar>
        <div>
          <h5>{{ data.doctor.fullName }}</h5>
          <p class="text-muted mb-0">{{ data.doctor.specialization }}</p>
        </div>
      </div>
      <p class="bio">{{ data.doctor.bio }}</p>
      <div class="detail-grid">
        <div><span class="label">Qualification</span><span>{{ data.doctor.qualification }}</span></div>
        <div><span class="label">Experience</span><span>{{ data.doctor.experienceYears }} years</span></div>
        <div><span class="label">Department</span><span>{{ data.doctor.department }}</span></div>
        <div><span class="label">Consultation Fee</span><span>₹{{ data.doctor.consultationFee }}</span></div>
        <div><span class="label">Rating</span><span><i class="fa-solid fa-star text-warning"></i> {{ data.doctor.rating }}</span></div>
        <div><span class="label">Contact</span><span>{{ data.doctor.phone }}</span></div>
      </div>
      <div class="actions">
        <button type="button" class="btn btn-outline-secondary" (click)="dialogRef.close()">Close</button>
        <button type="button" class="btn btn-gradient" (click)="book()">Book Appointment</button>
      </div>
    </div>
  `,
  styles: [`
    .doctor-dialog { padding: 0.5rem; }
    .dialog-top { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
    .bio { color: var(--color-text-secondary); font-size: 0.9rem; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem 1rem; margin: 1rem 0; }
    .detail-grid > div { display: flex; flex-direction: column; font-size: 0.875rem; }
    .label { font-size: 0.72rem; text-transform: uppercase; color: var(--color-text-muted); letter-spacing: 0.04em; }
    .actions { display: flex; justify-content: flex-end; gap: 0.6rem; margin-top: 1rem; }
  `]
})
export class DoctorProfileDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DoctorProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { doctor: Doctor },
    private router: Router
  ) {}

  book(): void {
    this.dialogRef.close();
    this.router.navigate(['/patient/book-appointment'], { queryParams: { doctorId: this.data.doctor.id } });
  }
}
