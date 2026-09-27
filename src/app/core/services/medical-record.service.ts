import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MedicalRecord } from '../models';
import { MOCK_MEDICAL_RECORDS } from '../mock-data/medical-records.mock';

@Injectable({ providedIn: 'root' })
export class MedicalRecordService {
  private records: MedicalRecord[] = [...MOCK_MEDICAL_RECORDS];

  constructor(private http: HttpClient) {}

  getRecordsByPatient(patientId: string): Observable<MedicalRecord[]> {
    if (environment.useMockData) {
      return of(this.records.filter((r) => r.patientId === patientId)).pipe(delay(environment.mockNetworkDelayMs));
    }
    return this.http.get<MedicalRecord[]>(`${environment.apiBaseUrl}/patients/${patientId}/medical-records`);
  }
}
