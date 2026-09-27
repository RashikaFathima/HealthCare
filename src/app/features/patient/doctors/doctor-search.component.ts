import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DoctorService } from '../../../core/services/doctor.service';
import { Doctor } from '../../../core/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DoctorCardComponent } from '../../../shared/components/doctor-card/doctor-card.component';
import { SearchFilterComponent, FilterOption } from '../../../shared/components/search-filter/search-filter.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { DoctorProfileDialogComponent } from './doctor-profile-dialog.component';

@Component({
  selector: 'app-doctor-search',
  standalone: true,
  imports: [
    CommonModule, PageHeaderComponent, DoctorCardComponent, SearchFilterComponent,
    EmptyStateComponent, LoadingSpinnerComponent, PaginationComponent
  ],
  templateUrl: './doctor-search.component.html'
})
export class DoctorSearchComponent implements OnInit {
  loading = signal(true);
  allDoctors = signal<Doctor[]>([]);
  searchTerm = signal('');
  specialization = signal('');
  sortBy = signal<'rating' | 'experience' | 'fee'>('rating');
  page = signal(1);
  pageSize = 6;

  specializationOptions = computed<FilterOption[]>(() => {
    const set = new Set(this.allDoctors().map((d) => d.specialization));
    return Array.from(set).map((s) => ({ value: s, label: s }));
  });

  filteredDoctors = computed(() => {
    let list = this.allDoctors();
    const term = this.searchTerm().toLowerCase().trim();
    if (term) {
      list = list.filter((d) => d.fullName.toLowerCase().includes(term) || d.specialization.toLowerCase().includes(term));
    }
    if (this.specialization()) {
      list = list.filter((d) => d.specialization === this.specialization());
    }
    const sorted = [...list];
    switch (this.sortBy()) {
      case 'rating': sorted.sort((a, b) => b.rating - a.rating); break;
      case 'experience': sorted.sort((a, b) => b.experienceYears - a.experienceYears); break;
      case 'fee': sorted.sort((a, b) => a.consultationFee - b.consultationFee); break;
    }
    return sorted;
  });

  pagedDoctors = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filteredDoctors().slice(start, start + this.pageSize);
  });

  constructor(private doctorService: DoctorService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.doctorService.getApprovedDoctors().subscribe((doctors) => {
      this.allDoctors.set(doctors);
      this.loading.set(false);
    });
  }

  onSearch(term: string): void { this.searchTerm.set(term); this.page.set(1); }
  onFilter(spec: string): void { this.specialization.set(spec); this.page.set(1); }
  onSort(sort: string): void { this.sortBy.set(sort as any); }

  viewProfile(doctor: Doctor): void {
    this.dialog.open(DoctorProfileDialogComponent, { data: { doctor }, width: '480px' });
  }

  bookDoctor(doctor: Doctor): void {
    this.router.navigate(['/patient/book-appointment'], { queryParams: { doctorId: doctor.id } });
  }
}
