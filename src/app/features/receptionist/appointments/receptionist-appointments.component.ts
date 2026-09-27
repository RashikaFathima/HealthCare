import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment } from '../../../core/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchFilterComponent, FilterOption } from '../../../shared/components/search-filter/search-filter.component';
import { DataTableComponent, DataTableColumn } from '../../../shared/components/data-table/data-table.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-receptionist-appointments',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, SearchFilterComponent, DataTableComponent, StatusBadgeComponent],
  templateUrl: './receptionist-appointments.component.html'
})
export class ReceptionistAppointmentsComponent implements OnInit {
  loading = signal(true);
  appointments = signal<Appointment[]>([]);
  searchTerm = signal('');
  statusFilter = signal('');

  columns: DataTableColumn[] = [
    { key: 'patientName', label: 'Patient' },
    { key: 'doctorName', label: 'Doctor' },
    { key: 'date', label: 'Date' },
    { key: 'timeSlot', label: 'Time' },
    { key: 'status', label: 'Status' }
  ];

  statusOptions: FilterOption[] = [
    { value: 'BOOKED', label: 'Booked' },
    { value: 'CHECKED_IN', label: 'Checked In' },
    { value: 'IN_CONSULTATION', label: 'In Consultation' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  filtered = computed(() => {
    let list = this.appointments();
    const term = this.searchTerm().toLowerCase().trim();
    if (term) list = list.filter((a) => a.patientName.toLowerCase().includes(term) || a.doctorName.toLowerCase().includes(term));
    if (this.statusFilter()) list = list.filter((a) => a.status === this.statusFilter());
    return [...list].sort((a, b) => (a.date < b.date ? 1 : -1));
  });

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.appointmentService.getAppointments().subscribe((list) => {
      this.appointments.set(list);
      this.loading.set(false);
    });
  }

  onSearch(term: string): void { this.searchTerm.set(term); }
  onFilter(status: string): void { this.statusFilter.set(status); }
}
