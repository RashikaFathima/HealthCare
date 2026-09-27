import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-stat-card',
  standalone: true,
  template: `
    <div class="stat-card">
      <div class="stat-icon" [style.background]="iconBg" [style.color]="iconColor">
        <i class="fa-solid" [class]="icon"></i>
      </div>
      <div class="stat-info">
        <span class="stat-value">{{ value }}</span>
        <span class="stat-label">{{ label }}</span>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      display: flex; align-items: center; gap: 1rem;
      background: var(--color-card); border: 1px solid var(--color-border);
      border-radius: var(--radius-md); box-shadow: var(--shadow-sm);
      padding: 1.25rem; transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .stat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
    .stat-icon {
      width: 52px; height: 52px; border-radius: var(--radius-sm);
      display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;
    }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.5rem; font-weight: 800; font-family: var(--font-heading); line-height: 1.1; }
    .stat-label { color: var(--color-text-secondary); font-size: 0.85rem; margin-top: 0.15rem; }
  `]
})
export class DashboardStatCardComponent {
  @Input({ required: true }) label!: string;
  @Input() value: string | number = 0;
  @Input() icon = 'fa-chart-line';
  @Input() iconBg = 'rgba(37,99,235,0.12)';
  @Input() iconColor = '#2563EB';
}
