import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Consultation } from '../models';
import { MOCK_CONSULTATIONS } from '../mock-data/consultations.mock';

@Injectable({ providedIn: 'root' })
export class ConsultationService {
  private consultations: Consultation[] = [...MOCK_CONSULTATIONS];

  constructor(private http: HttpClient) {}

  getConsultations(): Observable<Consultation[]> {
    if (environment.useMockData) {
      return of([...this.consultations]).pipe(delay(environment.mockNetworkDelayMs));
    }
    return this.http.get<Consultation[]>(`${environment.apiBaseUrl}/consultations`);
  }

  getByAppointmentId(appointmentId: string): Observable<Consultation | undefined> {
    return this.getConsultations().pipe(map((list) => list.find((c) => c.appointmentId === appointmentId)));
  }

  getByDoctorId(doctorId: string): Observable<Consultation[]> {
    return this.getConsultations().pipe(map((list) => list.filter((c) => c.doctorId === doctorId)));
  }

  saveConsultation(payload: Omit<Consultation, 'id' | 'createdAt'>): Observable<Consultation> {
    if (environment.useMockData) {
      const existingIdx = this.consultations.findIndex((c) => c.appointmentId === payload.appointmentId);
      const record: Consultation = {
        ...payload,
        id: existingIdx > -1 ? this.consultations[existingIdx].id : `con-${Math.floor(Math.random() * 90000 + 10000)}`,
        createdAt: existingIdx > -1 ? this.consultations[existingIdx].createdAt : new Date().toISOString()
      };
      if (existingIdx > -1) {
        this.consultations[existingIdx] = record;
      } else {
        this.consultations = [record, ...this.consultations];
      }
      return of(record).pipe(delay(environment.mockNetworkDelayMs));
    }
    return this.http.post<Consultation>(`${environment.apiBaseUrl}/consultations`, payload);
  }
}
