import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('jwt'); // même clé partout

  if (token) return true;

  // stocker la route demandée
  localStorage.setItem('redirectUrl', state.url);

  // redirect selon type d'utilisateur
  if (state.url.startsWith('/organizer')) {
    router.navigateByUrl('/organizer-signup');
  } else {
    router.navigateByUrl('/client-signup');
  }

  return false;
};
