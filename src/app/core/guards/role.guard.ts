import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { UserRole } from '../models';
import { ROLE_HOME_ROUTE } from '../constants/roles.constant';

/**
 * Usage in routes:
 *   { path: 'admin', canActivate: [roleGuard(['ADMIN'])], ... }
 */
export function roleGuard(allowedRoles: UserRole[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const role = auth.currentRole();
    if (!role) {
      return router.parseUrl('/auth/login');
    }
    if (!allowedRoles.includes(role)) {
      // Logged in, but wrong role -> send them home instead of a 403 dead-end.
      return router.parseUrl(ROLE_HOME_ROUTE[role]);
    }
    return true;
  };
}
