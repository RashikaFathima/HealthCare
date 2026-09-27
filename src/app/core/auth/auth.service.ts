import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthCredentials, AuthSession, User } from '../models';
import { MOCK_USERS } from '../mock-data/users.mock';
import { STORAGE_KEYS } from '../constants/storage-keys.constant';

/**
 * AuthService — FRONTEND-ONLY MOCK AUTHENTICATION
 * --------------------------------------------------
 * Today: validates against MOCK_USERS and issues a fake JWT-like token.
 * Tomorrow: replace the body of `login()`/`register()` with real HttpClient
 * calls to environment.apiBaseUrl (see README "Future API Integration").
 * The rest of the app (guards, interceptor, components) will NOT need to change
 * because they only depend on this service's public API.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<User | null>(this.readStoredUser());
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => !!this._currentUser());
  readonly currentRole = computed(() => this._currentUser()?.role ?? null);

  constructor(private http: HttpClient) {}

  login(credentials: AuthCredentials): Observable<AuthSession> {
    if (environment.useMockData) {
      return this.mockLogin(credentials);
    }
    // --- FUTURE REAL BACKEND CALL ---
    // return this.http.post<AuthSession>(`${environment.apiBaseUrl}/auth/login`, credentials)
    //   .pipe(tap(session => this.persistSession(session)));
    return throwError(() => new Error('Real backend not configured yet.'));
  }

  register(payload: { fullName: string; email: string; password: string; role: User['role']; phone?: string }): Observable<AuthSession> {
    if (environment.useMockData) {
      return this.mockRegister(payload);
    }
    // --- FUTURE REAL BACKEND CALL ---
    // return this.http.post<AuthSession>(`${environment.apiBaseUrl}/auth/register`, payload)
    //   .pipe(tap(session => this.persistSession(session)));
    return throwError(() => new Error('Real backend not configured yet.'));
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    this._currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  private mockLogin(credentials: AuthCredentials): Observable<AuthSession> {
    const match = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === credentials.email.toLowerCase() && u.password === credentials.password
    );

    if (!match) {
      return throwError(() => new Error('Invalid email or password.')).pipe(delay(400));
    }
    if (!match.isActive) {
      return throwError(() => new Error('This account has been deactivated. Please contact the admin.')).pipe(delay(400));
    }

    const { password, ...user } = match;
    const session: AuthSession = {
      token: this.generateMockToken(user),
      user,
      expiresAt: Date.now() + 1000 * 60 * 60 * 8 // 8 hours
    };

    return of(session).pipe(
      delay(environment.mockNetworkDelayMs),
      tap((s) => this.persistSession(s))
    );
  }

  private mockRegister(payload: { fullName: string; email: string; password: string; role: User['role']; phone?: string }): Observable<AuthSession> {
    const exists = MOCK_USERS.some((u) => u.email.toLowerCase() === payload.email.toLowerCase());
    if (exists) {
      return throwError(() => new Error('An account with this email already exists.')).pipe(delay(400));
    }

    const newUser: User = {
      id: `usr-${Math.floor(Math.random() * 90000 + 10000)}`,
      fullName: payload.fullName,
      email: payload.email,
      role: payload.role,
      phone: payload.phone,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    // In a real app this would be persisted server-side. Here we just log the
    // new user in immediately with a mock session (no server-side storage).
    const session: AuthSession = {
      token: this.generateMockToken(newUser),
      user: newUser,
      expiresAt: Date.now() + 1000 * 60 * 60 * 8
    };

    return of(session).pipe(
      delay(environment.mockNetworkDelayMs),
      tap((s) => this.persistSession(s))
    );
  }

  private persistSession(session: AuthSession): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, session.token);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(session.user));
    this._currentUser.set(session.user);
  }

  private readStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  /** Generates a fake, non-cryptographic JWT-shaped token for mock mode only. */
  private generateMockToken(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'mock', typ: 'JWT' }));
    const body = btoa(JSON.stringify({ sub: user.id, role: user.role, iat: Date.now() }));
    return `${header}.${body}.mocksignature`;
  }
}
