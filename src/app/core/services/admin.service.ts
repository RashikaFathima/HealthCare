import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models';
import { MOCK_USERS } from '../mock-data/users.mock';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private users: User[] = MOCK_USERS.map(({ password, ...u }) => u);

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    if (environment.useMockData) {
      return of([...this.users]).pipe(delay(environment.mockNetworkDelayMs));
    }
    return this.http.get<User[]>(`${environment.apiBaseUrl}/admin/users`);
  }

  setUserActiveStatus(userId: string, isActive: boolean): Observable<User> {
    if (environment.useMockData) {
      return of(userId).pipe(
        delay(environment.mockNetworkDelayMs),
        map(() => {
          const idx = this.users.findIndex((u) => u.id === userId);
          if (idx === -1) throw new Error('User not found');
          this.users[idx] = { ...this.users[idx], isActive };
          return this.users[idx];
        })
      );
    }
    return this.http.patch<User>(`${environment.apiBaseUrl}/admin/users/${userId}/status`, { isActive });
  }
}
