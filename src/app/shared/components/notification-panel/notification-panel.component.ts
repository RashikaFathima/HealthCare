import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppNotification } from '../../../core/models';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

@Component({
  selector: 'app-notification-panel',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent],
  template: `
    <div class="notif-panel">
      @if (!notifications.length) {
        <app-empty-state icon="fa-bell" title="No notifications" message="You're all caught up!"></app-empty-state>
      } @else {
        @for (n of notifications; track n.id) {
          <div class="notif-item" [class.unread]="!n.isRead" (click)="markRead.emit(n)">
            <div class="notif-icon"><i class="fa-solid" [class]="iconFor(n.type)"></i></div>
            <div class="notif-body">
              <p class="notif-title">{{ n.title }}</p>
              <p class="notif-msg">{{ n.message }}</p>
              <span class="notif-time">{{ n.createdAt | date:'short' }}</span>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .notif-panel { display: flex; flex-direction: column; gap: 0.5rem; max-height: 420px; overflow-y: auto; }
    .notif-item { display: flex; gap: 0.75rem; padding: 0.75rem; border-radius: var(--radius-sm); cursor: pointer; transition: background 0.15s ease; }
    .notif-item:hover { background: rgba(var(--color-primary-rgb), 0.06); }
    .notif-item.unread { background: rgba(var(--color-primary-rgb), 0.05); }
    .notif-icon {
      width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
      background: rgba(var(--color-primary-rgb), 0.12); color: var(--color-primary);
      display: flex; align-items: center; justify-content: center; font-size: 0.85rem;
    }
    .notif-title { font-weight: 600; margin: 0; font-size: 0.875rem; }
    .notif-msg { margin: 0.15rem 0; font-size: 0.8rem; color: var(--color-text-secondary); }
    .notif-time { font-size: 0.7rem; color: var(--color-text-muted); }
  `]
})
export class NotificationPanelComponent {
  @Input() notifications: AppNotification[] = [];
  @Output() markRead = new EventEmitter<AppNotification>();

  iconFor(type: string): string {
    switch (type) {
      case 'APPOINTMENT': return 'fa-calendar-check';
      case 'PRESCRIPTION': return 'fa-pills';
      case 'ALERT': return 'fa-triangle-exclamation';
      default: return 'fa-circle-info';
    }
  }
}
