import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Remplace l'injection dans le constructor

  const localData = localStorage.getItem('token');
  if(localData != null){
    return true;
  } else {
    // Stocker l'URL où l'utilisateur tentait d'accèder
    localStorage.setItem('redirectUrl', state.url);
    router.navigateByUrl('/signin');
    return false;
  }
};
