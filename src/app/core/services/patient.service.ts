import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Patient } from '../models';
import { MOCK_PATIENTS } from '../mock-data/patients.mock';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private patients: Patient[] = [...MOCK_PATIENTS];

  constructor(private http: HttpClient) {}

  getPatients(): Observable<Patient[]> {
    if (environment.useMockData) {
      return of(this.patients).pipe(delay(environment.mockNetworkDelayMs));
    }
    return this.http.get<Patient[]>(`${environment.apiBaseUrl}/patients`);
  }

  getPatientByUserId(userId: string): Observable<Patient | undefined> {
    if (environment.useMockData) {
      return of(this.patients.find((p) => p.userId === userId)).pipe(delay(environment.mockNetworkDelayMs));
    }
    return this.http.get<Patient>(`${environment.apiBaseUrl}/patients/by-user/${userId}`);
  }

  updatePatientProfile(patientId: string, changes: Partial<Patient>): Observable<Patient> {
    if (environment.useMockData) {
      return of(patientId).pipe(
        delay(environment.mockNetworkDelayMs),
        map(() => {
          const idx = this.patients.findIndex((p) => p.id === patientId);
          if (idx > -1) {
            this.patients[idx] = { ...this.patients[idx], ...changes };
            return this.patients[idx];
          }
          throw new Error('Patient not found');
        })
      );
    }
    return this.http.put<Patient>(`${environment.apiBaseUrl}/patients/${patientId}`, changes);
  }
}
