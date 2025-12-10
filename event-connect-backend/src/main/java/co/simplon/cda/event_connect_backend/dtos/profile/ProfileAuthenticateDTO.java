package co.simplon.cda.event_connect_backend.dtos.profile;

/**
 * DTO pour l'authentification d'un utilisateur
 *
 * Reçu lors du POST /profiles/authenticate
 *
 * Processus :
 * 1. Angular envoie email + mot de passe en clair
 * 2. Le service vérifie les identifiants
 * 3. Génère un token JWT si authentification réussie
 * 4. Retourne le token au front
 *
 * Sécurité :
 * - Le mot de passe est envoyé en clair sur HTTPS
 * - Jamais stocké en clair côté serveur
 * - Comparé avec le hash BCrypt en base
 */
public record ProfileAuthenticateDTO(
        String email,
        String password // Mot de passe en clair (sera comparé au hash)
) { }
