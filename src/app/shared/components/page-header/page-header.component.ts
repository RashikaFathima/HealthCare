import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <div class="page-header">
      <div>
        <h2>{{ title }}</h2>
        @if (subtitle) { <p class="text-muted mb-0">{{ subtitle }}</p> }
      </div>
      <div class="page-header-actions"><ng-content></ng-content></div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;
    }
    h2 { font-size: 1.5rem; }
  `]
})
export class PageHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle = '';
}
