import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="spinner-wrap" [style.padding.px]="padding">
      <div class="spinner"></div>
      @if (label) { <p class="mt-2 text-muted">{{ label }}</p> }
    </div>
  `,
  styles: [`
    .spinner-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .spinner {
      width: 38px; height: 38px; border-radius: 50%;
      border: 3px solid var(--color-border);
      border-top-color: var(--color-primary);
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoadingSpinnerComponent {
  @Input() label = '';
  @Input() padding = 32;
}
