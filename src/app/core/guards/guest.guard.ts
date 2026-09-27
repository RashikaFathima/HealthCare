import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ROLE_HOME_ROUTE } from '../constants/roles.constant';

/** Prevents an already-logged-in user from seeing the login/register pages again. */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const role = auth.currentRole();

  if (role) {
    return router.parseUrl(ROLE_HOME_ROUTE[role]);
  }
  return true;
};
