package co.simplon.cda.event_connect_backend.exceptions;

/**
 * Exception levée lors d'une tentative d'authentification avec des identifiants invalides
 *
 * Sécurité :
 * - Le message ne doit PAS révéler si l'email existe ou non
 * - Message générique : "Email ou mot de passe incorrect"
 * - Évite l'énumération des comptes (attaque par force brute)
 *
 * Retourne un code HTTP 401 Unauthorized au client
 */
public class InvalidCredentialsException extends RuntimeException {

    /**
     * Constructeur par défaut avec message sécurisé générique
     *
     * Ne révèle pas si le problème vient de l'email ou du mot de passe
     * pour des raisons de sécurité
     */
    public InvalidCredentialsException() {
        super("Email ou mot de passe incorrect");
    }

    /**
     * Constructeur avec message personnalisé
     *
     * Attention : Ne pas révéler d'informations sensibles dans le message
     */
    public InvalidCredentialsException(String message) {
        super(message);
    }

    /**
     * Constructeur avec message et cause
     */
    public InvalidCredentialsException(String message, Throwable cause) {
        super(message, cause);
    }
}