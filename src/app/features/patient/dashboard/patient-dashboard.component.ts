import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { PatientService } from '../../../core/services/patient.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { MedicalRecordService } from '../../../core/services/medical-record.service';
import { PrescriptionService } from '../../../core/services/prescription.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { Appointment, AppNotification, MedicalRecord, Patient, Prescription } from '../../../core/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DashboardStatCardComponent } from '../../../shared/components/dashboard-stat-card/dashboard-stat-card.component';
import { AppointmentCardComponent } from '../../../shared/components/appointment-card/appointment-card.component';
import { RecordCardComponent } from '../../../shared/components/record-card/record-card.component';
import { NotificationPanelComponent } from '../../../shared/components/notification-panel/notification-panel.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink, PageHeaderComponent, DashboardStatCardComponent, AppointmentCardComponent,
    RecordCardComponent, NotificationPanelComponent, EmptyStateComponent, SkeletonLoaderComponent
  ],
  templateUrl: './patient-dashboard.component.html'
})
export class PatientDashboardComponent implements OnInit {
  loading = signal(true);
  patient = signal<Patient | null>(null);
  upcomingAppointments = signal<Appointment[]>([]);
  recentRecords = signal<MedicalRecord[]>([]);
  recentPrescriptions = signal<Prescription[]>([]);
  notifications = signal<AppNotification[]>([]);
  stats = signal({ totalAppointments: 0, todaysAppointments: 0, completedConsultations: 0 });

  constructor(
    private authService: AuthService,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private medicalRecordService: MedicalRecordService,
    private prescriptionService: PrescriptionService,
    private notificationService: NotificationService,
    private dashboardService: DashboardService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.patientService.getPatientByUserId(user.id).subscribe((patient) => {
      if (!patient) { this.loading.set(false); return; }
      this.patient.set(patient);

      forkJoin({
        appointments: this.appointmentService.getAppointmentsByPatient(patient.id),
        records: this.medicalRecordService.getRecordsByPatient(patient.id),
        prescriptions: this.prescriptionService.getByPatientId(patient.id),
        notifications: this.notificationService.getForUser(user.id),
        stats: this.dashboardService.getPatientStats(patient.id)
      }).subscribe(({ appointments, records, prescriptions, notifications, stats }) => {
        this.upcomingAppointments.set(
          appointments.filter((a) => a.status === 'BOOKED' || a.status === 'CHECKED_IN').slice(0, 3)
        );
        this.recentRecords.set(records.slice(0, 2));
        this.recentPrescriptions.set(prescriptions.slice(0, 2));
        this.notifications.set(notifications.slice(0, 4));
        this.stats.set(stats as any);
        this.loading.set(false);
      });
    });
  }

  onMarkRead(n: AppNotification): void {
    if (n.isRead) return;
    this.notificationService.markAsRead(n.id).subscribe(() => {
      this.notifications.update((list) => list.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
    });
  }

  cancelAppointment(id: string): void {
    this.appointmentService.cancelAppointment(id).subscribe(() => {
      this.upcomingAppointments.update((list) => list.filter((a) => a.id !== id));
      this.toast.success('Appointment cancelled.');
    });
  }
}
