import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger';
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule],
  template: `
    <div class="confirm-dialog">
      <h5>{{ data.title }}</h5>
      <p class="text-muted">{{ data.message }}</p>
      <div class="actions">
        <button type="button" class="btn btn-outline-secondary" (click)="dialogRef.close(false)">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button type="button"
                class="btn"
                [class.btn-danger]="data.variant === 'danger'"
                [class.btn-gradient]="data.variant !== 'danger'"
                (click)="dialogRef.close(true)">
          {{ data.confirmText || 'Confirm' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog { padding: 0.5rem; min-width: 280px; }
    h5 { margin-bottom: 0.5rem; }
    .actions { display: flex; justify-content: flex-end; gap: 0.6rem; margin-top: 1.25rem; }
  `]
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
