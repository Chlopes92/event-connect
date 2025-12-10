package co.simplon.cda.event_connect_backend.dtos.profile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO pour la création d'un profil utilisateur (inscription)
 *
 * Reçu lors du POST /profiles
 *
 * Validations :
 * - Email : format valide + unique en base (vérifié par contrainte SQL)
 * - Mot de passe : min 8 caractères pour la sécurité
 * - Téléphone : unique en base
 * - Rôle : doit exister (ROLE_USER ou ROLE_ADMIN)
 *
 * Sécurité :
 * - Le mot de passe sera hashé avec BCrypt avant sauvegarde
 * - Jamais stocké en clair
 */
public record ProfileCreateDTO (
        @Email
        @NotBlank
        @Size(max = 320) // Longueur max standard pour un email
        String email,

        @NotBlank
        @Size(max = 50)
        String firstName,

        @NotBlank
        @Size(max = 100)
        String lastName,

        @NotBlank
        @Size(min = 8, max = 72) // BCrypt encode sur max 72 caractères
        String password,

        @NotBlank
        @Size(max = 20)
        String phone,

        @Size(max = 50)
        String organization,

        @NotNull
        Integer roleId // 1 = ROLE_USER, 2 = ROLE_ADMIN
) { }
