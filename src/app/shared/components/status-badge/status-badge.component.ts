import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span class="status-badge" [style.background]="bg" [style.color]="fg">{{ label }}</span>`,
  styles: [`
    .status-badge {
      display: inline-flex; align-items: center; padding: 0.28rem 0.75rem;
      border-radius: 999px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.02em;
      white-space: nowrap;
    }
  `]
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: string;

  private map: Record<string, { bg: string; fg: string }> = {
    BOOKED: { bg: 'rgba(37,99,235,0.12)', fg: '#2563EB' },
    CHECKED_IN: { bg: 'rgba(6,182,212,0.14)', fg: '#0891B2' },
    IN_CONSULTATION: { bg: 'rgba(245,158,11,0.14)', fg: '#B45309' },
    COMPLETED: { bg: 'rgba(16,185,129,0.14)', fg: '#059669' },
    CANCELLED: { bg: 'rgba(239,68,68,0.12)', fg: '#DC2626' },
    NO_SHOW: { bg: 'rgba(100,116,139,0.14)', fg: '#475569' },
    PENDING: { bg: 'rgba(245,158,11,0.14)', fg: '#B45309' },
    APPROVED: { bg: 'rgba(16,185,129,0.14)', fg: '#059669' },
    REJECTED: { bg: 'rgba(239,68,68,0.12)', fg: '#DC2626' },
    ACTIVE: { bg: 'rgba(16,185,129,0.14)', fg: '#059669' },
    INACTIVE: { bg: 'rgba(100,116,139,0.14)', fg: '#475569' }
  };

  get bg(): string { return this.map[this.status]?.bg ?? 'rgba(100,116,139,0.14)'; }
  get fg(): string { return this.map[this.status]?.fg ?? '#475569'; }
  get label(): string { return (this.status || '').replace(/_/g, ' '); }
}
