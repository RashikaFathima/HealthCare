import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Doctor } from '../../../core/models';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';

@Component({
  selector: 'app-doctor-card',
  standalone: true,
  imports: [CommonModule, UserAvatarComponent],
  template: `
    <div class="doctor-card">
      <div class="doctor-card-top">
        <app-user-avatar [name]="doctor.fullName" [size]="56"></app-user-avatar>
        @if (doctor.isAvailableToday) {
          <span class="available-pill"><i class="fa-solid fa-circle"></i> Available today</span>
        }
      </div>
      <h5>{{ doctor.fullName }}</h5>
      <p class="specialization">{{ doctor.specialization }} &middot; {{ doctor.experienceYears }} yrs exp.</p>
      <div class="meta-row">
        <span><i class="fa-solid fa-star"></i> {{ doctor.rating }}</span>
        <span class="fee">₹{{ doctor.consultationFee }} / visit</span>
      </div>
      <div class="actions">
        <button type="button" class="btn btn-outline-secondary btn-sm" (click)="viewProfile.emit(doctor)">View profile</button>
        <button type="button" class="btn btn-gradient btn-sm" (click)="book.emit(doctor)">Book</button>
      </div>
    </div>
  `,
  styles: [`
    .doctor-card {
      background: var(--color-card); border: 1px solid var(--color-border); border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem;
      transition: transform 0.2s ease, box-shadow 0.2s ease; height: 100%;
    }
    .doctor-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
    .doctor-card-top { display: flex; align-items: center; justify-content: space-between; }
    h5 { margin-top: 0.5rem; }
    .specialization { color: var(--color-text-secondary); font-size: 0.875rem; margin: 0; }
    .available-pill { font-size: 0.7rem; color: var(--color-success); font-weight: 700; }
    .available-pill i { font-size: 0.5rem; margin-right: 0.25rem; }
    .meta-row { display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; margin-top: 0.35rem; }
    .meta-row i { color: var(--color-warning); }
    .fee { font-weight: 700; color: var(--color-primary); }
    .actions { display: flex; gap: 0.5rem; margin-top: 0.75rem; }
    .actions .btn { flex: 1; }
  `]
})
export class DoctorCardComponent {
  @Input({ required: true }) doctor!: Doctor;
  @Output() book = new EventEmitter<Doctor>();
  @Output() viewProfile = new EventEmitter<Doctor>();
}
