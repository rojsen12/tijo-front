import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api/api.service';

export const authGuard = () => {
  const apiService = inject(ApiService);
  const router = inject(Router);

  if (apiService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
