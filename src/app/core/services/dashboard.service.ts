import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AppointmentService } from './appointment.service';
import { DoctorService } from './doctor.service';
import { PatientService } from './patient.service';
import { AdminService } from './admin.service';
import { ChartData, DashboardStatistics } from '../models';

/**
 * DashboardService aggregates statistics for all four dashboards.
 * In mock mode it derives numbers from the in-memory mock arrays via the
 * other services. Once a backend is available, each `get*Stats` method can
 * be swapped for a single dedicated HttpClient call (see comments below).
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private adminService: AdminService
  ) {}

  getPatientStats(patientId: string): Observable<DashboardStatistics> {
    return this.appointmentService.getAppointmentsByPatient(patientId).pipe(
      map((appointments) => ({
        totalAppointments: appointments.length,
        todaysAppointments: appointments.filter((a) => a.status === 'BOOKED' || a.status === 'CHECKED_IN').length,
        completedConsultations: appointments.filter((a) => a.status === 'COMPLETED').length
      }))
    );
  }

  getDoctorStats(doctorId: string, todayIso: string): Observable<DashboardStatistics> {
    return this.appointmentService.getAppointmentsByDoctor(doctorId).pipe(
      map((appointments) => ({
        todaysAppointments: appointments.filter((a) => a.date === todayIso).length,
        completedConsultations: appointments.filter((a) => a.status === 'COMPLETED').length,
        pendingCases: appointments.filter((a) => a.status === 'BOOKED' || a.status === 'CHECKED_IN').length,
        availableSlots: 6
      }))
    );
  }

  getReceptionistStats(todayIso: string): Observable<DashboardStatistics> {
    return this.appointmentService.getAppointments().pipe(
      map((appointments) => {
        const today = appointments.filter((a) => a.date === todayIso);
        return {
          todaysAppointments: today.length,
          checkedInPatients: today.filter((a) => a.status === 'CHECKED_IN' || a.status === 'IN_CONSULTATION').length,
          pendingAppointments: today.filter((a) => a.status === 'BOOKED').length,
          cancelledBookings: appointments.filter((a) => a.status === 'CANCELLED').length
        };
      })
    );
  }

  getAdminStats(): Observable<DashboardStatistics> {
    return forkJoin({
      users: this.adminService.getUsers(),
      doctors: this.doctorService.getDoctors(),
      patients: this.patientService.getPatients(),
      appointments: this.appointmentService.getAppointments()
    }).pipe(
      map(({ users, doctors, patients, appointments }) => ({
        totalUsers: users.length,
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        totalAppointments: appointments.length
      }))
    );
  }

  getAppointmentTrend(): Observable<ChartData> {
    // Mock time-series; replace with real analytics endpoint later.
    const data: ChartData = {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      series: [{ label: 'Appointments', data: [4, 6, 3, 8, 5, 9, 2] }]
    };
    return of(data).pipe(delay(environment.mockNetworkDelayMs));
  }

  getWeeklyConsultations(): Observable<ChartData> {
    const data: ChartData = {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      series: [{ label: 'Consultations', data: [3, 5, 2, 6, 4, 7, 1] }]
    };
    return of(data).pipe(delay(environment.mockNetworkDelayMs));
  }

  getDepartmentStatistics(): Observable<ChartData> {
    const data: ChartData = {
      categories: ['Cardiology', 'Dermatology', 'Orthopedics', 'Pediatrics', 'Neurology', 'General'],
      series: [{ label: 'Patients Seen', data: [42, 28, 35, 50, 18, 60] }]
    };
    return of(data).pipe(delay(environment.mockNetworkDelayMs));
  }

  getAppointmentAnalytics(): Observable<ChartData> {
    const data: ChartData = {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      series: [
        { label: 'Booked', data: [120, 132, 101, 134, 90, 230, 210, 180, 195] },
        { label: 'Completed', data: [100, 120, 95, 110, 85, 200, 190, 160, 170] },
        { label: 'Cancelled', data: [10, 8, 12, 9, 6, 15, 11, 14, 10] }
      ]
    };
    return of(data).pipe(delay(environment.mockNetworkDelayMs));
  }
}
