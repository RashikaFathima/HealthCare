import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <div class="empty-icon"><i class="fa-solid" [class]="icon"></i></div>
      <h5>{{ title }}</h5>
      <p class="text-muted">{{ message }}</p>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .empty-state { text-align: center; padding: 3rem 1rem; }
    .empty-icon {
      width: 64px; height: 64px; margin: 0 auto 1rem; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      background: rgba(var(--color-primary-rgb), 0.1); color: var(--color-primary); font-size: 1.5rem;
    }
    h5 { margin-bottom: 0.35rem; }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'fa-inbox';
  @Input() title = 'Nothing here yet';
  @Input() message = 'There is no data to display right now.';
}
