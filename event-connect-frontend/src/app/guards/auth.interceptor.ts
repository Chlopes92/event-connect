import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ErrorResponse } from '../shared/models/ErrorResponse';
import Swal from 'sweetalert2';

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
      const backendError = error.error as ErrorResponse;
      
      // Erreur 401 : Token invalide/expiré
      if (error.status === 401) {
        console.warn('⚠️ Erreur 401 : Token expiré ou invalide');
        
        const message = backendError?.message || 'Votre session a expiré. Veuillez vous reconnecter.';
        
        // Jolie alerte avec SweetAlert2
        Swal.fire({
          icon: 'warning',
          title: 'Session expirée',
          text: message,
          confirmButtonText: 'OK',
          confirmButtonColor: '#DC2626',
          timer: 5000,
          timerProgressBar: true
        });
        
        // Nettoyage du localStorage
        localStorage.removeItem('jwt');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        
        // Redirection
        setTimeout(() => {
          router.navigate(['/home']);
        }, 2000);
      }
      
      // Erreur 403 : Accès refusé
      if (error.status === 403) {
        console.warn('⚠️ Erreur 403 : Accès refusé');
        
        const message = backendError?.message || 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
        
        // Jolie alerte
        Swal.fire({
          icon: 'error',
          title: 'Accès refusé',
          text: message,
          confirmButtonText: 'OK',
          confirmButtonColor: '#DC2626'
        });
      }

      // Erreur 404 : Ressource non trouvée
      if (error.status === 404) {
        console.warn('⚠️ Erreur 404 : Ressource non trouvée');
        const message = backendError?.message || 'Ressource non trouvée.';
        console.warn('Message backend:', message);
      }

      // Erreur 409 : Conflit
      if (error.status === 409) {
        console.warn('⚠️ Erreur 409 : Conflit (ressource dupliquée)');
        const message = backendError?.message || 'Cette ressource existe déjà.';
        console.warn('Message backend:', message);
      }

      // Erreur 500 : Erreur serveur
      if (error.status === 500) {
        console.error('❌ Erreur 500 : Erreur serveur');
        
        const message = backendError?.message || 'Une erreur serveur est survenue. Veuillez réessayer plus tard.';
        
        // Jolie alerte
        Swal.fire({
          icon: 'error',
          title: 'Erreur serveur',
          text: message,
          confirmButtonText: 'OK',
          confirmButtonColor: '#DC2626'
        });
      }
      
      return throwError(() => error);
    })
  );
};
