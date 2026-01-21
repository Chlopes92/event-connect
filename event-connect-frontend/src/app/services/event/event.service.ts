import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { EVENT_URL, UPLOAD_IMAGE_URL } from '../../shared/constants/urls';
import { Event } from '../../shared/models/Event';
import { ErrorResponse } from '../../shared/models/ErrorResponse';
import { environment } from '../../../environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  
  readonly http = inject(HttpClient);

  /** 
   * Récupère tous les événements
   */
  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${EVENT_URL}`).pipe(
      catchError(this.handleError)
    );
  }

  /** 
   * Récupère un événement par son ID
   */
  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${EVENT_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /** 
   * Récupère les événements par catégorie
   */
  getEventsByCategory(categoryId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${EVENT_URL}/by-category/${categoryId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crée un nouvel événement
   * 
   * Gestion des erreurs :
   * - 400 : Fichier invalide (type, taille)
   * - 401 : Non authentifié
   * - 400 : Validation échouée
   */
  createEvent(event: Event, imageFile?: File): Observable<string> {
    const formData = new FormData();
    formData.append('event', new Blob([JSON.stringify(event)], { type: 'application/json' }));
    
    if (imageFile) { 
      formData.append('image', imageFile) 
    };

    return this.http.post<string>(`${EVENT_URL}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Met à jour un événement existant
   * 
   * Gestion des erreurs :
   * - 403 : Vous n'êtes pas autorisé (pas le créateur)
   * - 404 : Événement non trouvé
   * - 400 : Validation échouée
   */
  updateEvent(id: number, event: Event, imageFile?: File): Observable<string> {
    const formData = new FormData();
    formData.append('event', new Blob([JSON.stringify(event)], { type: 'application/json' }));
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.put<string>(`${EVENT_URL}/${id}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Supprime un événement
   * 
   * Gestion des erreurs :
   * - 403 : Vous n'êtes pas autorisé (pas le créateur)
   * - 404 : Événement non trouvé
   */
  deleteEvent(id: number): Observable<string> {
    return this.http.delete<string>(`${EVENT_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

   /**
   * Construit l'URL complète d'une image
   */
  getImageUrl(filename: string | undefined): string {
    if(!filename) return '';
    
    // En production (Render) : utilise assets
  if (environment.production) {
    return `assets/events/${filename}`;
  }

  // En local (dev) : utilise le backend
  return `${UPLOAD_IMAGE_URL}/${filename}`;
}
  

  /**
   * Gestion centralisée des erreurs HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      console.error('❌ Erreur client:', error.error.message);
      errorMessage = `Erreur réseau : ${error.error.message}`;
    } else {
      // Erreur côté serveur
      console.error(`❌ Erreur ${error.status}:`, error.error);

      // Si c'est une ErrorResponse structurée du backend
      const backendError = error.error as ErrorResponse;
      
      if (backendError?.message) {
        errorMessage = backendError.message;

        // Si erreurs de validation
        if (backendError.validationErrors) {
          const validationMessages = Object.values(backendError.validationErrors).join(', ');
          errorMessage += ` (${validationMessages})`;
        }
      } else {
        // Fallback
        switch (error.status) {
          case 400:
            errorMessage = 'Données invalides ou fichier non autorisé';
            break;
          case 401:
            errorMessage = 'Vous devez être connecté';
            break;
          case 403:
            errorMessage = 'Vous n\'êtes pas autorisé à effectuer cette action';
            break;
          case 404:
            errorMessage = 'Événement non trouvé';
            break;
          case 500:
            errorMessage = 'Erreur serveur, veuillez réessayer plus tard';
            break;
          default:
            errorMessage = `Erreur ${error.status}: ${error.statusText}`;
        }
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
