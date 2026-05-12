import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isAdmin = localStorage.getItem('Admin') === 'true';
  const token = localStorage.getItem('Token');

  if (token && isAdmin) return true;

  router.navigate(['/']);
  return false;
};