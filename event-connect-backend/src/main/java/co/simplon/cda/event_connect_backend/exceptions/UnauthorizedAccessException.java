package co.simplon.cda.event_connect_backend.exceptions;

/**
 * Exception levée lorsqu'un utilisateur tente d'accéder à une ressource
 * qui ne lui appartient pas
 *
 * Exemples d'utilisation :
 * - Tentative de modification d'un événement créé par un autre utilisateur
 * - Tentative de suppression d'un événement d'un autre organisateur
 *
 * Retourne un code HTTP 403 Forbidden au client
 *
 * Différence avec 401 Unauthorized :
 * - 401 : L'utilisateur n'est pas authentifié (pas de token JWT valide)
 * - 403 : L'utilisateur est authentifié mais n'a pas les droits sur cette ressource
 */
public class UnauthorizedAccessException extends RuntimeException {

    /**
     * Constructeur avec message par défaut
     */
    public UnauthorizedAccessException() {
        super("Vous n'êtes pas autorisé à effectuer cette action");
    }

    /**
     * Constructeur avec message personnalisé
     */
    public UnauthorizedAccessException(String message) {
        super(message);
    }

    /**
     * Constructeur avec message et cause
     */
    public UnauthorizedAccessException(String message, Throwable cause) {
        super(message, cause);
    }
}