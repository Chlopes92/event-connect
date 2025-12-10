package co.simplon.cda.event_connect_backend.repositories;

import co.simplon.cda.event_connect_backend.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository pour la gestion des événements
 * Fournit les opérations CRUD standard + une requête personnalisée
 *
 * Spring Data JPA génère automatiquement les requêtes SQL
 * en se basant sur le nom de la méthode (Query Method)
 */
public interface EventRepository extends JpaRepository<Event, Integer> {
    /**
     * Recherche les événements appartenant à une catégorie spécifique
     *
     * Fonctionnement :
     * - Spring analyse le nom de la méthode
     * - "findBy" : requête SELECT
     * - "Categories" : navigue vers la relation @ManyToMany categories
     * - "Id" : filtre sur le champ id de Category
     *
     * Génère automatiquement la requête SQL :
     * SELECT e.* FROM t_events e
     * JOIN t_belong b ON e.event_id = b.event_id
     * WHERE b.category_id = ?
     */
    List<Event> findByCategoriesId(Integer categoryId);
}
