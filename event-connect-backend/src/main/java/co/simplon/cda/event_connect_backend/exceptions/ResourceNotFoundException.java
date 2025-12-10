package co.simplon.cda.event_connect_backend.exceptions;

/**
 * Exception levée lorsqu'une ressource demandée n'existe pas en base de données
 *
 * Exemples d'utilisation :
 * - Événement non trouvé par ID
 * - Profil non trouvé par email
 * - Catégorie inexistante
 *
 * Retourne un code HTTP 404 Not Found au client
 */
public class ResourceNotFoundException extends RuntimeException {

    private final String resourceName;
    private final String fieldName;
    private final Object fieldValue;

    /**
     * Constructeur avec détails de la ressource manquante
     */
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s non trouvé avec %s : '%s'", resourceName, fieldName, fieldValue));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }

    /**
     * Constructeur simplifié avec message personnalisé
     */
    public ResourceNotFoundException(String message) {
        super(message);
        this.resourceName = null;
        this.fieldName = null;
        this.fieldValue = null;
    }

    public String getResourceName() {
        return resourceName;
    }

    public String getFieldName() {
        return fieldName;
    }

    public Object getFieldValue() {
        return fieldValue;
    }
}