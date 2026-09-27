import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-group">
      @for (row of rowsArray; track row) {
        <div class="skeleton-line" [style.width]="row === rowsArray[rowsArray.length-1] ? '60%' : '100%'" [style.height.px]="height"></div>
      }
    </div>
  `,
  styles: [`
    .skeleton-group { display: flex; flex-direction: column; gap: 10px; }
    .skeleton-line {
      border-radius: 8px;
      background: linear-gradient(90deg, var(--color-border) 25%, rgba(148,163,184,0.25) 37%, var(--color-border) 63%);
      background-size: 400% 100%;
      animation: shimmer 1.4s ease infinite;
    }
    @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }
  `]
})
export class SkeletonLoaderComponent {
  @Input() rows = 3;
  @Input() height = 16;
  get rowsArray() { return Array.from({ length: this.rows }); }
}
