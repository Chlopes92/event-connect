package co.simplon.cda.event_connect_backend.repositories;

import co.simplon.cda.event_connect_backend.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository pour la gestion des rôles utilisateurs
 *
 * Les méthodes CRUD de base suffisent :
 * - findAll() : liste des rôles (ROLE_USER, ROLE_ADMIN)
 * - findById(id) : récupération d'un rôle par ID
 *
 * Utilisé principalement lors de l'inscription pour associer un rôle
 */
public interface RoleRepository extends JpaRepository<Role, Integer> {
}
