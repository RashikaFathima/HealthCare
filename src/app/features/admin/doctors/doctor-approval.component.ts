import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DoctorService } from '../../../core/services/doctor.service';
import { Doctor } from '../../../core/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { UserAvatarComponent } from '../../../shared/components/user-avatar/user-avatar.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-doctor-approval',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, EmptyStateComponent, LoadingSpinnerComponent, StatusBadgeComponent, UserAvatarComponent],
  templateUrl: './doctor-approval.component.html'
})
export class DoctorApprovalComponent implements OnInit {
  loading = signal(true);
  pending = signal<Doctor[]>([]);
  allDoctors = signal<Doctor[]>([]);

  constructor(private doctorService: DoctorService, private dialog: MatDialog, private toast: ToastService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.doctorService.getDoctors().subscribe((doctors) => {
      this.allDoctors.set(doctors);
      this.pending.set(doctors.filter((d) => d.approvalStatus === 'PENDING'));
      this.loading.set(false);
    });
  }

  approve(doctor: Doctor): void {
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Approve doctor?', message: `Approve ${doctor.fullName} to start accepting appointments?`, confirmText: 'Approve' }
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.doctorService.updateApprovalStatus(doctor.id, 'APPROVED').subscribe(() => {
        this.toast.success(`${doctor.fullName} approved successfully.`);
        this.load();
      });
    });
  }

  reject(doctor: Doctor): void {
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Reject application?', message: `Reject ${doctor.fullName}'s doctor application?`, confirmText: 'Reject', variant: 'danger' }
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.doctorService.updateApprovalStatus(doctor.id, 'REJECTED').subscribe(() => {
        this.toast.success(`${doctor.fullName}'s application was rejected.`);
        this.load();
      });
    });
  }
}
