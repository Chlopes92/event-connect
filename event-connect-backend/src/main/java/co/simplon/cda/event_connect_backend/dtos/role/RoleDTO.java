package co.simplon.cda.event_connect_backend.dtos.role;

/**
 * DTO pour la représentation d'un rôle utilisateur
 *
 * Rôles disponibles :
 * - ROLE_USER : utilisateur standard
 * - ROLE_ADMIN : administrateur
 *
 * Utilisé dans ProfileViewDTO et lors de l'inscription
 */
public record RoleDTO(
        Integer id,
        String name // Ex: "ROLE_USER", "ROLE_ADMIN"
) {}
