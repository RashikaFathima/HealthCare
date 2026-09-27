import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '../../../core/services/admin.service';
import { User, UserRole } from '../../../core/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchFilterComponent, FilterOption } from '../../../shared/components/search-filter/search-filter.component';
import { DataTableComponent, DataTableColumn } from '../../../shared/components/data-table/data-table.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { UserAvatarComponent } from '../../../shared/components/user-avatar/user-avatar.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, SearchFilterComponent, DataTableComponent, StatusBadgeComponent, UserAvatarComponent],
  templateUrl: './user-management.component.html'
})
export class UserManagementComponent implements OnInit {
  loading = signal(true);
  users = signal<User[]>([]);
  searchTerm = signal('');
  roleFilter = signal('');

  columns: DataTableColumn[] = [
    { key: 'user', label: 'User' },
    { key: 'role', label: 'Role' },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '' }
  ];

  roleOptions: FilterOption[] = [
    { value: 'PATIENT', label: 'Patient' },
    { value: 'DOCTOR', label: 'Doctor' },
    { value: 'RECEPTIONIST', label: 'Receptionist' },
    { value: 'ADMIN', label: 'Admin' }
  ];

  filtered = computed(() => {
    let list = this.users();
    const term = this.searchTerm().toLowerCase().trim();
    if (term) list = list.filter((u) => u.fullName.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
    if (this.roleFilter()) list = list.filter((u) => u.role === this.roleFilter());
    return list;
  });

  constructor(private adminService: AdminService, private dialog: MatDialog, private toast: ToastService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.adminService.getUsers().subscribe((users) => {
      this.users.set(users);
      this.loading.set(false);
    });
  }

  onSearch(term: string): void { this.searchTerm.set(term); }
  onFilter(role: string): void { this.roleFilter.set(role); }

  toggleStatus(user: User): void {
    const activating = !user.isActive;
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: activating ? 'Activate user?' : 'Deactivate user?',
        message: `${activating ? 'Activate' : 'Deactivate'} ${user.fullName}'s account?`,
        confirmText: activating ? 'Activate' : 'Deactivate',
        variant: activating ? 'primary' : 'danger'
      }
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.adminService.setUserActiveStatus(user.id, activating).subscribe(() => {
        this.toast.success(`${user.fullName} ${activating ? 'activated' : 'deactivated'} successfully.`);
        this.load();
      });
    });
  }
}
