package co.simplon.cda.event_connect_backend.dtos.profile;

import co.simplon.cda.event_connect_backend.dtos.role.RoleDTO;

/**
 * DTO pour l'affichage d'un profil utilisateur
 *
 * Utilisé pour :
 * - Afficher les informations du compte utilisateur
 * - Liste des profils (si endpoint activé)
 *
 * Sécurité :
 * - Ne contient PAS le mot de passe
 * - Contient uniquement les données affichables
 */
public record ProfileViewDTO(
        Integer id,
        String email,
        String firstName,
        String lastName,
        String phone,
        String organization,
        RoleDTO role // Inclut le rôle de l'utilisateu
) { }
