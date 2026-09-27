import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DashboardStatistics } from '../models';

@Injectable({ providedIn: 'root' })
export class ReceptionistService {
  constructor(private http: HttpClient) {}

  getDashboardStats(stats: DashboardStatistics): Observable<DashboardStatistics> {
    // Aggregation is computed from AppointmentService data at the component/dashboard-service
    // level for mock mode; this method models the future single dedicated endpoint.
    if (environment.useMockData) {
      return of(stats).pipe(delay(environment.mockNetworkDelayMs));
    }
    return this.http.get<DashboardStatistics>(`${environment.apiBaseUrl}/receptionist/dashboard-stats`);
  }
}
