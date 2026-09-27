import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

/**
 * Centralized HTTP error handling. Converts raw HTTP errors into
 * user-friendly messages and handles 401/403 globally.
 * Extend the switch below once the backend's real error payload shape is known.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let friendlyMessage = 'Something went wrong. Please try again.';

      switch (error.status) {
        case 401:
          friendlyMessage = 'Your session has expired. Please log in again.';
          authService.logout();
          router.navigate(['/auth/login']);
          break;
        case 403:
          friendlyMessage = 'You do not have permission to perform this action.';
          break;
        case 404:
          friendlyMessage = 'The requested resource was not found.';
          break;
        case 0:
          friendlyMessage = 'Unable to reach the server. Please check your connection.';
          break;
        default:
          friendlyMessage = 'Unable to complete the request. Please try again.';
      }

      return throwError(() => ({ ...error, friendlyMessage }));
    })
  );
};
