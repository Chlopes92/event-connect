package co.simplon.cda.event_connect_backend.exceptions;

/**
 * Exception levée lorsqu'une tentative de création viole une contrainte d'unicité
 *
 * Exemples d'utilisation :
 * - Email déjà utilisé lors de l'inscription
 * - Numéro de téléphone déjà enregistré
 * - Nom d'événement déjà pris (si unicité requise)
 *
 * Retourne un code HTTP 409 Conflict au client
 */
public class DuplicateResourceException extends RuntimeException {
    private final String resourceName;
    private final String fieldName;
    private final Object fieldValue;

    /**
     * Constructeur avec détails de la ressource dupliquée
     */
    public DuplicateResourceException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s existe déjà avec %s : '%s'", resourceName, fieldName, fieldValue));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }

    /**
     * Constructeur simplifié avec message personnalisé
     */
    public DuplicateResourceException(String message) {
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