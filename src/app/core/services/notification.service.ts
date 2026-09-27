import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AppNotification } from '../models';
import { MOCK_NOTIFICATIONS } from '../mock-data/notifications.mock';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications: AppNotification[] = [...MOCK_NOTIFICATIONS];

  constructor(private http: HttpClient) {}

  getForUser(userId: string): Observable<AppNotification[]> {
    if (environment.useMockData) {
      return of(this.notifications.filter((n) => n.userId === userId)).pipe(delay(environment.mockNetworkDelayMs));
    }
    return this.http.get<AppNotification[]>(`${environment.apiBaseUrl}/notifications`);
  }

  markAsRead(id: string): Observable<boolean> {
    if (environment.useMockData) {
      return of(id).pipe(
        delay(200),
        map(() => {
          const n = this.notifications.find((x) => x.id === id);
          if (n) n.isRead = true;
          return true;
        })
      );
    }
    return this.http.patch<boolean>(`${environment.apiBaseUrl}/notifications/${id}/read`, {});
  }
}
