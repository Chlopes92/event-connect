package co.simplon.cda.event_connect_backend.repositories;

import co.simplon.cda.event_connect_backend.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository pour la gestion des catégories d'événements
 * Hérite de JpaRepository qui fournit les méthodes CRUD de base :
 * - findAll() : récupère toutes les catégories
 * - findById(id) : recherche par ID
 * - save(entity) : crée ou met à jour
 * - deleteById(id) : supprime par ID
 *
 * Spring Data JPA génère automatiquement l'implémentation au runtime
 */
public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
