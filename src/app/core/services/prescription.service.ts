import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Prescription } from '../models';
import { MOCK_PRESCRIPTIONS } from '../mock-data/prescriptions.mock';

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  private prescriptions: Prescription[] = [...MOCK_PRESCRIPTIONS];

  constructor(private http: HttpClient) {}

  getPrescriptions(): Observable<Prescription[]> {
    if (environment.useMockData) {
      return of([...this.prescriptions]).pipe(delay(environment.mockNetworkDelayMs));
    }
    return this.http.get<Prescription[]>(`${environment.apiBaseUrl}/prescriptions`);
  }

  getByDoctorId(doctorId: string): Observable<Prescription[]> {
    return this.getPrescriptions().pipe(map((list) => list.filter((p) => p.doctorId === doctorId)));
  }

  getByPatientId(patientId: string): Observable<Prescription[]> {
    return this.getPrescriptions().pipe(map((list) => list.filter((p) => p.patientId === patientId)));
  }

  savePrescription(payload: Omit<Prescription, 'id' | 'createdAt'>): Observable<Prescription> {
    if (environment.useMockData) {
      const created: Prescription = {
        ...payload,
        id: `rx-${Math.floor(Math.random() * 90000 + 10000)}`,
        createdAt: new Date().toISOString()
      };
      this.prescriptions = [created, ...this.prescriptions];
      return of(created).pipe(delay(environment.mockNetworkDelayMs));
    }
    return this.http.post<Prescription>(`${environment.apiBaseUrl}/prescriptions`, payload);
  }
}
