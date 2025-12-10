package co.simplon.cda.event_connect_backend.exceptions;

/**
 * Exception levée lors de problèmes avec les fichiers uploadés
 *
 * Exemples d'utilisation :
 * - Type de fichier non autorisé (ex: .exe au lieu de .png)
 * - Fichier trop volumineux
 * - Fichier corrompu
 * - Erreur lors de la sauvegarde
 *
 * Retourne un code HTTP 400 Bad Request au client
 */
public class InvalidFileException extends RuntimeException {

    /**
     * Constructeur avec message d'erreur
     */
    public InvalidFileException(String message) {
        super(message);
    }

    /**
     * Constructeur avec message et cause
     */
    public InvalidFileException(String message, Throwable cause) {
        super(message, cause);
    }
}