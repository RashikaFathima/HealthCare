import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Appointment, AppointmentStatus } from '../models';
import { MOCK_APPOINTMENTS } from '../mock-data/appointments.mock';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private appointments: Appointment[] = [...MOCK_APPOINTMENTS];

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<Appointment[]> {
    if (environment.useMockData) {
      return of([...this.appointments]).pipe(delay(environment.mockNetworkDelayMs));
    }
    return this.http.get<Appointment[]>(`${environment.apiBaseUrl}/appointments`);
  }

  getAppointmentsByPatient(patientId: string): Observable<Appointment[]> {
    return this.getAppointments().pipe(map((list) => list.filter((a) => a.patientId === patientId)));
  }

  getAppointmentsByDoctor(doctorId: string): Observable<Appointment[]> {
    return this.getAppointments().pipe(map((list) => list.filter((a) => a.doctorId === doctorId)));
  }

  getTodaysAppointmentsByDoctor(doctorId: string, todayIso: string): Observable<Appointment[]> {
    return this.getAppointments().pipe(
      map((list) => list.filter((a) => a.doctorId === doctorId && a.date === todayIso))
    );
  }

  getTodaysQueue(todayIso: string): Observable<Appointment[]> {
    return this.getAppointments().pipe(
      map((list) =>
        list
          .filter((a) => a.date === todayIso && a.status !== 'CANCELLED')
          .sort((a, b) => (a.queueNumber ?? 99) - (b.queueNumber ?? 99))
      )
    );
  }

  createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Observable<Appointment> {
    if (environment.useMockData) {
      const created: Appointment = {
        ...appointment,
        id: `apt-${Math.floor(Math.random() * 90000 + 10000)}`,
        status: 'BOOKED',
        createdAt: new Date().toISOString()
      };
      this.appointments = [created, ...this.appointments];
      return of(created).pipe(delay(environment.mockNetworkDelayMs));
    }
    return this.http.post<Appointment>(`${environment.apiBaseUrl}/appointments`, appointment);
  }

  updateAppointmentStatus(appointmentId: string, status: AppointmentStatus): Observable<Appointment> {
    if (environment.useMockData) {
      return of(appointmentId).pipe(
        delay(environment.mockNetworkDelayMs),
        map(() => {
          const idx = this.appointments.findIndex((a) => a.id === appointmentId);
          if (idx === -1) throw new Error('Appointment not found');
          this.appointments[idx] = { ...this.appointments[idx], status };
          return this.appointments[idx];
        })
      );
    }
    return this.http.patch<Appointment>(`${environment.apiBaseUrl}/appointments/${appointmentId}/status`, { status });
  }

  checkIn(appointmentId: string, queueNumber: number): Observable<Appointment> {
    if (environment.useMockData) {
      return of(appointmentId).pipe(
        delay(environment.mockNetworkDelayMs),
        map(() => {
          const idx = this.appointments.findIndex((a) => a.id === appointmentId);
          if (idx === -1) throw new Error('Appointment not found');
          this.appointments[idx] = { ...this.appointments[idx], status: 'CHECKED_IN', queueNumber };
          return this.appointments[idx];
        })
      );
    }
    return this.http.patch<Appointment>(`${environment.apiBaseUrl}/appointments/${appointmentId}/check-in`, { queueNumber });
  }

  cancelAppointment(appointmentId: string): Observable<Appointment> {
    return this.updateAppointmentStatus(appointmentId, 'CANCELLED');
  }
}
