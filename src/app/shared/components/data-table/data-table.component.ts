import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

export interface DataTableColumn {
  key: string;
  label: string;
  width?: string;
}

/**
 * Generic, reusable table shell.
 * Usage:
 * <app-data-table [columns]="cols" [rows]="rows" [loading]="loading">
 *   <ng-template #cellTemplate let-row let-col="col">
 *     @switch (col.key) {
 *       @case ('status') { <app-status-badge [status]="row.status" /> }
 *       @default { {{ row[col.key] }} }
 *     }
 *   </ng-template>
 * </app-data-table>
 */
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, NgTemplateOutlet, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="table-wrap">
      @if (loading) {
        <app-loading-spinner label="Loading data..."></app-loading-spinner>
      } @else if (!rows.length) {
        <app-empty-state [title]="emptyTitle" [message]="emptyMessage" [icon]="emptyIcon"></app-empty-state>
      } @else {
        <table class="app-table">
          <thead>
            <tr>
              @for (col of columns; track col.key) {
                <th [style.width]="col.width">{{ col.label }}</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of rows; track $index) {
              <tr>
                @for (col of columns; track col.key) {
                  <td>
                    @if (cellTemplate) {
                      <ng-container *ngTemplateOutlet="cellTemplate; context: { $implicit: row, col: col }"></ng-container>
                    } @else {
                      {{ row[col.key] }}
                    }
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
  styles: [`
    .table-wrap {
      background: var(--color-card); border: 1px solid var(--color-border); border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm); overflow-x: auto;
    }
    .app-table { width: 100%; border-collapse: collapse; min-width: 560px; }
    .app-table th {
      text-align: left; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em;
      color: var(--color-text-secondary); padding: 0.9rem 1.1rem; border-bottom: 1px solid var(--color-border);
    }
    .app-table td { padding: 0.9rem 1.1rem; border-bottom: 1px solid var(--color-border); font-size: 0.9rem; }
    .app-table tbody tr:last-child td { border-bottom: none; }
    .app-table tbody tr:hover { background: rgba(var(--color-primary-rgb), 0.03); }
  `]
})
export class DataTableComponent {
  @Input({ required: true }) columns: DataTableColumn[] = [];
  @Input() rows: any[] = [];
  @Input() loading = false;
  @Input() emptyTitle = 'No records found';
  @Input() emptyMessage = 'Try adjusting your filters or check back later.';
  @Input() emptyIcon = 'fa-table';

  @ContentChild('cellTemplate') cellTemplate?: TemplateRef<any>;
}
