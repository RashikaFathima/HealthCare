import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

/**
 * Attaches "Authorization: Bearer <token>" to every outgoing request once the
 * app is switched to real HTTP calls (environment.useMockData = false).
 *
 * WHEN THE BACKEND TEAM PROVIDES THEIR AUTH SCHEME:
 * - If they use a different header name/format, update the header below.
 * - If they use an API key instead of a bearer token, replace the header
 *   with e.g. req.headers.set('X-API-KEY', apiKey).
 * - If certain endpoints must be excluded (e.g. login/register), add a
 *   condition on req.url before attaching the header.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // While running on mock data there is no real HTTP traffic to intercept,
  // but this stays active so nothing needs to change when useMockData flips.
  if (!environment.useMockData) {
    const token = authService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
  }

  return next(req);
};
