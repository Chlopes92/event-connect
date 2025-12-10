import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

/**
 * Guard de route pour protéger les pages nécessitant une authentification
 * 
 * Fonctionnement :
 * 1. Vérifie si un token existe
 * 2. Vérifie le rôle de l'utilisateur
 * 3. Autorise ou refuse l'accès selon le rôle et la route demandée
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('jwt');
  const userRole = localStorage.getItem('userRole');

  // Pas de token → Rediriger vers signup
  if (!token) {
    localStorage.setItem('redirectUrl', state.url);
    
    // Redirection selon le type de page demandée
    if (state.url.startsWith('/organizer')) {
      router.navigate(['/organizer-signup']);
    } else {
      router.navigate(['/client-signup']);
    }
    return false;
  }

  // Token présent → Vérifier le rôle
  const isOrganizerRoute = state.url.startsWith('/organizer') || 
                           state.url.startsWith('/create-event') || 
                           state.url.startsWith('/edit-event');

  // Si route organisateur → vérifier ROLE_ADMIN
  if (isOrganizerRoute && userRole !== 'ROLE_ADMIN') {
    router.navigate(['/home']);
    return false;
  }

  // Accès autorisé
  return true;
};

/**
 * Guard spécifique pour les routes ORGANISATEUR uniquement
 * Vérifie que l'utilisateur a le rôle ROLE_ADMIN
 */
export const organizerGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('jwt');
  const userRole = localStorage.getItem('userRole');

  // Pas de token
  if (!token) {
    localStorage.setItem('redirectUrl', state.url);
    router.navigate(['/organizer-signup']);
    return false;
  }

  // Token présent mais pas le bon rôle
  if (userRole !== 'ROLE_ADMIN') {
    router.navigate(['/home']);
    return false;
  }

  // Accès autorisé
  return true;
};

/**
 * Guard spécifique pour les routes CLIENT uniquement
 * Vérifie que l'utilisateur a le rôle ROLE_USER
 */
export const clientGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('jwt');
  const userRole = localStorage.getItem('userRole');

  // Pas de token
  if (!token) {
    localStorage.setItem('redirectUrl', state.url);
    router.navigate(['/client-signup']);
    return false;
  }

  // Token présent mais pas le bon rôle
  if (userRole !== 'ROLE_USER') {
    router.navigate(['/home']);
    return false;
  }

  // Accès autorisé
  return true;
};