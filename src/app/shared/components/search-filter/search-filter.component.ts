import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterOption { value: string; label: string; }

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-filter-bar">
      <div class="search-box">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input
          type="text"
          [placeholder]="searchPlaceholder"
          [(ngModel)]="searchTerm"
          (ngModelChange)="searchChange.emit($event)" />
      </div>
      @if (filterOptions.length) {
        <select class="form-select filter-select" [(ngModel)]="selectedFilter" (ngModelChange)="filterChange.emit($event)">
          <option value="">{{ filterPlaceholder }}</option>
          @for (opt of filterOptions; track opt.value) {
            <option [value]="opt.value">{{ opt.label }}</option>
          }
        </select>
      }
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .search-filter-bar { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.25rem; }
    .search-box {
      flex: 1; min-width: 220px; display: flex; align-items: center; gap: 0.5rem;
      background: var(--color-card); border: 1px solid var(--color-border); border-radius: var(--radius-sm);
      padding: 0.55rem 0.9rem;
    }
    .search-box i { color: var(--color-text-muted); }
    .search-box input { border: none; outline: none; background: transparent; width: 100%; color: var(--color-text-primary); }
    .filter-select { max-width: 220px; }
  `]
})
export class SearchFilterComponent {
  @Input() searchPlaceholder = 'Search...';
  @Input() filterPlaceholder = 'All';
  @Input() filterOptions: FilterOption[] = [];
  @Output() searchChange = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<string>();

  searchTerm = '';
  selectedFilter = '';
}
