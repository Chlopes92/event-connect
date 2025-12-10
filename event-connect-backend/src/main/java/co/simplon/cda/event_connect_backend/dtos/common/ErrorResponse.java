package co.simplon.cda.event_connect_backend.dtos.common;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * DTO détaillé pour les réponses d'erreur
 *
 * Utilisé par le GlobalExceptionHandler pour retourner des erreurs structurées
 *
 * }
 */
public record ErrorResponse(
        LocalDateTime timestamp,
        int status,
        String error,
        String message,
        String path,
        Map<String, String> validationErrors // Erreurs de validation par champ
) {
    /**
     * Constructeur pour une erreur simple sans détails de validation
     */
    public static ErrorResponse of(int status, String error, String message, String path) {
        return new ErrorResponse(
                LocalDateTime.now(),
                status,
                error,
                message,
                path,
                null
        );
    }

    /**
     * Constructeur pour une erreur avec détails de validation
     */
    public static ErrorResponse withValidationErrors(
            int status,
            String error,
            String message,
            String path,
            Map<String, String> validationErrors
    ) {
        return new ErrorResponse(
                LocalDateTime.now(),
                status,
                error,
                message,
                path,
                validationErrors
        );
    }
}