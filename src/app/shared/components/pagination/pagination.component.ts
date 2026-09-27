import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    @if (totalPages > 1) {
      <div class="pagination-bar">
        <button class="page-btn" [disabled]="page === 1" (click)="go(page - 1)"><i class="fa-solid fa-chevron-left"></i></button>
        @for (p of pagesArray; track p) {
          <button class="page-btn" [class.active]="p === page" (click)="go(p)">{{ p }}</button>
        }
        <button class="page-btn" [disabled]="page === totalPages" (click)="go(page + 1)"><i class="fa-solid fa-chevron-right"></i></button>
      </div>
    }
  `,
  styles: [`
    .pagination-bar { display: flex; gap: 0.4rem; justify-content: center; margin-top: 1rem; }
    .page-btn {
      min-width: 36px; height: 36px; border-radius: var(--radius-sm); border: 1px solid var(--color-border);
      background: var(--color-card); color: var(--color-text-primary); font-weight: 600; cursor: pointer;
      transition: all 0.15s ease;
    }
    .page-btn:hover:not(:disabled) { border-color: var(--color-primary); color: var(--color-primary); }
    .page-btn.active { background: var(--color-primary); border-color: var(--color-primary); color: #fff; }
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  `]
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() pageSize = 6;
  @Input() totalItems = 0;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number { return Math.max(1, Math.ceil(this.totalItems / this.pageSize)); }
  get pagesArray(): number[] { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  go(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.pageChange.emit(p);
  }
}
