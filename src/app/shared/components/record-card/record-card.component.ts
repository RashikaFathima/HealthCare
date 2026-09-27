import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalRecord } from '../../../core/models';

@Component({
  selector: 'app-record-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="record-card">
      <div class="record-icon"><i class="fa-solid fa-file-waveform"></i></div>
      <div class="record-body">
        <div class="record-top">
          <h6>{{ record.diagnosis }}</h6>
          <span class="text-muted small">{{ record.visitDate | date:'mediumDate' }}</span>
        </div>
        <p class="text-muted mb-1">{{ record.doctorName }} &middot; {{ record.specialization }}</p>
        <p class="notes">{{ record.consultationNotes }}</p>
      </div>
      <button type="button" class="btn btn-outline-secondary btn-sm" (click)="download.emit(record)">
        <i class="fa-solid fa-download"></i> Download
      </button>
    </div>
  `,
  styles: [`
    .record-card {
      display: flex; gap: 1rem; align-items: flex-start;
      background: var(--color-card); border: 1px solid var(--color-border); border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm); padding: 1.1rem; transition: box-shadow 0.2s ease;
    }
    .record-card:hover { box-shadow: var(--shadow-md); }
    .record-icon {
      width: 44px; height: 44px; border-radius: var(--radius-sm); flex-shrink: 0;
      background: rgba(6,182,212,0.12); color: var(--color-secondary);
      display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
    }
    .record-body { flex: 1; min-width: 0; }
    .record-top { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
    h6 { margin: 0; }
    .notes { font-size: 0.85rem; color: var(--color-text-secondary); margin: 0.35rem 0 0; }
    .btn { align-self: center; white-space: nowrap; }
  `]
})
export class RecordCardComponent {
  @Input({ required: true }) record!: MedicalRecord;
  @Output() download = new EventEmitter<MedicalRecord>();
}
