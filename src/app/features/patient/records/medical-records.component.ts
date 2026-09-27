import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';
import { PatientService } from '../../../core/services/patient.service';
import { MedicalRecordService } from '../../../core/services/medical-record.service';
import { MedicalRecord } from '../../../core/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchFilterComponent } from '../../../shared/components/search-filter/search-filter.component';
import { RecordCardComponent } from '../../../shared/components/record-card/record-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-medical-records',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, SearchFilterComponent, RecordCardComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './medical-records.component.html'
})
export class MedicalRecordsComponent implements OnInit {
  loading = signal(true);
  records = signal<MedicalRecord[]>([]);
  searchTerm = signal('');

  filtered = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.records();
    return this.records().filter(
      (r) => r.diagnosis.toLowerCase().includes(term) || r.doctorName.toLowerCase().includes(term) || r.specialization.toLowerCase().includes(term)
    );
  });

  constructor(
    private authService: AuthService,
    private patientService: PatientService,
    private medicalRecordService: MedicalRecordService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) return;
    this.patientService.getPatientByUserId(user.id).subscribe((patient) => {
      if (!patient) { this.loading.set(false); return; }
      this.medicalRecordService.getRecordsByPatient(patient.id).subscribe((records) => {
        this.records.set(records);
        this.loading.set(false);
      });
    });
  }

  onSearch(term: string): void { this.searchTerm.set(term); }

  download(record: MedicalRecord): void {
    // UI-only placeholder — no real file is generated until the backend
    // exposes a document/attachment endpoint. See README for details.
    this.toast.info(`Download is UI-only for now: "${record.attachmentName ?? 'record.pdf'}"`);
  }
}
