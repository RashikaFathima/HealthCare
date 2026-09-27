import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Doctor } from '../models';
import { MOCK_DOCTORS } from '../mock-data/doctors.mock';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private doctors: Doctor[] = [...MOCK_DOCTORS];

  constructor(private http: HttpClient) {}

  getDoctors(): Observable<Doctor[]> {
    if (environment.useMockData) {
      return of(this.doctors).pipe(delay(environment.mockNetworkDelayMs));
    }
    // FUTURE:
    // return this.http.get<Doctor[]>(`${environment.apiBaseUrl}/doctors`);
    return this.http.get<Doctor[]>(`${environment.apiBaseUrl}/doctors`);
  }

  getApprovedDoctors(): Observable<Doctor[]> {
    return this.getDoctors().pipe(map((doctors) => doctors.filter((d) => d.approvalStatus === 'APPROVED')));
  }

  getPendingDoctors(): Observable<Doctor[]> {
    return this.getDoctors().pipe(map((doctors) => doctors.filter((d) => d.approvalStatus === 'PENDING')));
  }

  getDoctorById(id: string): Observable<Doctor | undefined> {
    if (environment.useMockData) {
      return of(this.doctors.find((d) => d.id === id)).pipe(delay(environment.mockNetworkDelayMs));
    }
    return this.http.get<Doctor>(`${environment.apiBaseUrl}/doctors/${id}`);
  }

  getDoctorByUserId(userId: string): Observable<Doctor | undefined> {
    if (environment.useMockData) {
      return of(this.doctors.find((d) => d.userId === userId)).pipe(delay(environment.mockNetworkDelayMs));
    }
    return this.http.get<Doctor>(`${environment.apiBaseUrl}/doctors/by-user/${userId}`);
  }

  updateApprovalStatus(doctorId: string, status: Doctor['approvalStatus']): Observable<Doctor> {
    if (environment.useMockData) {
      return of(doctorId).pipe(
        delay(environment.mockNetworkDelayMs),
        map(() => {
          const idx = this.doctors.findIndex((d) => d.id === doctorId);
          if (idx === -1) throw new Error('Doctor not found');
          this.doctors[idx] = { ...this.doctors[idx], approvalStatus: status };
          return this.doctors[idx];
        })
      );
    }
    return this.http.patch<Doctor>(`${environment.apiBaseUrl}/doctors/${doctorId}/approval`, { status });
  }
}
