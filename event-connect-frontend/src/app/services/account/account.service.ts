import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Role } from '../../shared/models/Role';
import { catchError, map, Observable, throwError } from 'rxjs';
import { PROFILE_URL, ROLE_URL } from '../../shared/constants/urls';
import { Profile, ProfileLogin } from '../../shared/models/Profile';
import { ErrorResponse } from '../../shared/models/ErrorResponse';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste des rôles disponibles
   */
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${ROLE_URL}`).pipe(catchError(this.handleError));
  }

  /**
   * Inscription d'un nouvel utilisateur
   * 
   * Gestion des erreurs :
   * - 409 : Email ou téléphone déjà utilisé
   * - 400 : Erreur de validation des champs
   * - 500 : Erreur serveur
   */
  signup(profile: Profile): Observable<HttpResponse<void>> {
    return this.http.post<void>(`${PROFILE_URL}`, profile, {
      headers: {
        'Content-Type': 'application/json'
      },
      observe: 'response'
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Authentification d'un utilisateur
   * 
   * Le backend retourne le token JWT en text/plain
   * 
   * Gestion des erreurs :
   * - 401 : Email ou mot de passe incorrect
   * - 400 : Erreur de validation
   */
  login(credentials: ProfileLogin): Observable<string> {
    return this.http.post(`${PROFILE_URL}/authenticate`, credentials, {
      responseType: 'text'
    }).pipe(
      map((response: string) => {
        // Le backend retourne directement le token en tant que string
        return response;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Gestion centralisée des erreurs HTTP
   * 
   * Transforme les erreurs backend en messages utilisables
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur réseau : ${error.error.message}`;
    } else {
      // Erreur côté serveur
      
      // Si c'est une ErrorResponse structurée du backend
      const backendError = error.error as ErrorResponse;
      
      if (backendError && backendError.message) {
        errorMessage = backendError.message;

        // Si erreurs de validation, les ajouter au message
        if (backendError.validationErrors) {
          const validationMessages = Object.values(backendError.validationErrors).join(', ');
          errorMessage += ` (${validationMessages})`;
        }
      } else {
        // Fallback si pas de structure ErrorResponse
        switch (error.status) {
          case 400:
            errorMessage = 'Données invalides';
            break;
          case 401:
            errorMessage = 'Email ou mot de passe incorrect';
            break;
          case 403:
            errorMessage = 'Accès refusé';
            break;
          case 404:
            errorMessage = 'Ressource non trouvée';
            break;
          case 409:
            errorMessage = 'Email ou téléphone déjà utilisé';
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
