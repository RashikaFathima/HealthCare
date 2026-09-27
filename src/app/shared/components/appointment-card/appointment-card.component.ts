import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../../core/models';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent, UserAvatarComponent],
  template: `
    <div class="apt-card">
      <app-user-avatar [name]="displayName" [size]="46"></app-user-avatar>
      <div class="apt-info">
        <div class="apt-top">
          <h6>{{ displayName }}</h6>
          <app-status-badge [status]="appointment.status"></app-status-badge>
        </div>
        <p class="text-muted mb-0">{{ appointment.specialization }}</p>
        <p class="apt-time"><i class="fa-regular fa-clock"></i> {{ appointment.date | date:'mediumDate' }} &middot; {{ appointment.timeSlot }}</p>
        @if (appointment.reason) { <p class="apt-reason">"{{ appointment.reason }}"</p> }
      </div>
      <div class="apt-actions"><ng-content></ng-content></div>
    </div>
  `,
  styles: [`
    .apt-card {
      display: flex; gap: 1rem; align-items: flex-start;
      background: var(--color-card); border: 1px solid var(--color-border); border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm); padding: 1rem 1.15rem; transition: box-shadow 0.2s ease;
    }
    .apt-card:hover { box-shadow: var(--shadow-md); }
    .apt-info { flex: 1; min-width: 0; }
    .apt-top { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
    h6 { margin: 0; }
    .apt-time { font-size: 0.8rem; color: var(--color-text-secondary); margin: 0.35rem 0 0; }
    .apt-reason { font-size: 0.8rem; color: var(--color-text-muted); font-style: italic; margin: 0.35rem 0 0; }
    .apt-actions { display: flex; gap: 0.4rem; flex-shrink: 0; }
  `]
})
export class AppointmentCardComponent {
  @Input({ required: true }) appointment!: Appointment;
  @Input() displayNameOverride = '';

  get displayName(): string {
    return this.displayNameOverride || this.appointment.doctorName || this.appointment.patientName;
  }
}
