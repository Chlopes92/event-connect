import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ErrorResponse } from '../shared/models/ErrorResponse';

/**
 * Intercepteur HTTP pour gérer l'authentification JWT
 * 
 * Fonctionnalités :
 * 1. Ajoute automatiquement le token JWT dans les headers de toutes les requêtes
 * 2. Détecte les erreurs 401 (token expiré/invalide)
 * 3. Nettoie le localStorage et redirige vers la page appropriée
 * 
 * Configuration dans app.config.ts :
 * provideHttpClient(withInterceptors([authInterceptor]))
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Récupération du token depuis le localStorage
  const token = localStorage.getItem('jwt');

  // Si un token existe, on l'ajoute dans les headers
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  // Gestion des erreurs HTTP
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Erreur 401 : Token invalide/expiré
      if (error.status === 401) {
        console.warn('⚠️ Erreur 401 : Token expiré ou invalide');
        
        // Afficher le message du backend si disponible
        const backendError = error.error as ErrorResponse;
        if (backendError && backendError.message) {
          console.warn('Message backend:', backendError.message);
        }
        
        // Nettoyage du localStorage
        localStorage.removeItem('jwt');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        
        // Redirection vers la page d'accueil
        router.navigate(['/home']);
      }
      
      // Erreur 403 : Accès refusé
      if (error.status === 403) {
        console.warn('⚠️ Erreur 403 : Accès refusé');
        
        const backendError = error.error as ErrorResponse;
        if (backendError && backendError.message) {
          console.warn('Message backend:', backendError.message);
          // Optionnel : afficher un toast/alert
          alert(backendError.message);
        }
      }

      // Erreur 404 : Ressource non trouvée
      if (error.status === 404) {
        console.warn('⚠️ Erreur 404 : Ressource non trouvée');
        
        const backendError = error.error as ErrorResponse;
        if (backendError && backendError.message) {
          console.warn('Message backend:', backendError.message);
        }
      }

      // Erreur 409 : Conflit (email/téléphone déjà utilisé)
      if (error.status === 409) {
        console.warn('⚠️ Erreur 409 : Conflit (ressource dupliquée)');
        
        const backendError = error.error as ErrorResponse;
        if (backendError && backendError.message) {
          console.warn('Message backend:', backendError.message);
        }
      }
      
      // Propagation de l'erreur pour que les composants puissent la gérer
      return throwError(() => error);
    })
  );
};
