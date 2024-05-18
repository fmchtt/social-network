import { effect, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  effect(() => {
    if (authService.authToken() === null) {
      router.navigate(['/login']);
    }
  });

  if (authService.authToken() !== null) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
