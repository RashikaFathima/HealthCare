import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DoctorAvailability, TimeSlot } from '../models';
import { MOCK_AVAILABILITY } from '../mock-data/availability.mock';

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  private availability: DoctorAvailability[] = [...MOCK_AVAILABILITY];

  constructor(private http: HttpClient) {}

  getAvailabilityForDoctor(doctorId: string): Observable<DoctorAvailability[]> {
    if (environment.useMockData) {
      return of(this.availability.filter((a) => a.doctorId === doctorId)).pipe(delay(environment.mockNetworkDelayMs));
    }
    return this.http.get<DoctorAvailability[]>(`${environment.apiBaseUrl}/doctors/${doctorId}/availability`);
  }

  getAvailableSlots(doctorId: string, date: string): Observable<TimeSlot[]> {
    return this.getAvailabilityForDoctor(doctorId).pipe(
      map((entries) => entries.find((e) => e.date === date)?.slots.filter((s) => !s.isBooked) ?? [])
    );
  }

  addSlot(doctorId: string, date: string, slot: Omit<TimeSlot, 'id' | 'isBooked'>): Observable<DoctorAvailability> {
    if (environment.useMockData) {
      return of(null).pipe(
        delay(environment.mockNetworkDelayMs),
        map(() => {
          let entry = this.availability.find((a) => a.doctorId === doctorId && a.date === date);
          const newSlot: TimeSlot = { ...slot, id: `slot-${Math.random().toString(36).slice(2, 8)}`, isBooked: false };

          const overlap = entry?.slots.some(
            (s) => slot.startTime < s.endTime && slot.endTime > s.startTime
          );
          if (overlap) {
            throw new Error('This time overlaps with an existing slot.');
          }

          if (!entry) {
            entry = { id: `avl-${Math.random().toString(36).slice(2, 8)}`, doctorId, date, slots: [] };
            this.availability.push(entry);
          }
          entry.slots.push(newSlot);
          return entry;
        })
      );
    }
    return this.http.post<DoctorAvailability>(`${environment.apiBaseUrl}/doctors/${doctorId}/availability`, { date, slot });
  }

  removeSlot(doctorId: string, date: string, slotId: string): Observable<boolean> {
    if (environment.useMockData) {
      return of(null).pipe(
        delay(environment.mockNetworkDelayMs),
        map(() => {
          const entry = this.availability.find((a) => a.doctorId === doctorId && a.date === date);
          if (entry) {
            entry.slots = entry.slots.filter((s) => s.id !== slotId);
          }
          return true;
        })
      );
    }
    return this.http.delete<boolean>(`${environment.apiBaseUrl}/doctors/${doctorId}/availability/${slotId}`);
  }

  bookSlot(doctorId: string, date: string, slotId: string): Observable<boolean> {
    if (environment.useMockData) {
      return of(null).pipe(
        delay(environment.mockNetworkDelayMs),
        map(() => {
          const entry = this.availability.find((a) => a.doctorId === doctorId && a.date === date);
          const slot = entry?.slots.find((s) => s.id === slotId);
          if (slot) slot.isBooked = true;
          return true;
        })
      );
    }
    return this.http.patch<boolean>(`${environment.apiBaseUrl}/doctors/${doctorId}/availability/${slotId}/book`, {});
  }
}
