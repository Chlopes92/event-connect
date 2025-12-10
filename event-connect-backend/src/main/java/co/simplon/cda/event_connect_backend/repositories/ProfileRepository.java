package co.simplon.cda.event_connect_backend.repositories;

import co.simplon.cda.event_connect_backend.entities.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository pour la gestion des profils utilisateurs
 *
 * Contient deux Query Methods personnalisées pour l'authentification
 * et la vérification des emails
 */
public interface ProfileRepository extends JpaRepository<Profile, Integer> {
    /**
     * Recherche un profil par son email
     * Utilisé lors de la connexion pour vérifier les identifiants
     *
     * Spring Data JPA génère automatiquement :
     * SELECT * FROM t_profiles WHERE email = ?
     */
    Profile findByEmail(String email);
    boolean existsByEmail(String email);
}
