package co.simplon.cda.event_connect_backend.dtos.event;

import co.simplon.cda.event_connect_backend.dtos.category.CategoryDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO pour l'affichage d'un événement
 *
 * Retourné par les endpoints GET :
 * - GET /events : liste de tous les événements
 * - GET /events/{id} : détails d'un événement
 * - GET /events/by-category/{id} : événements par catégorie
 *
 * Contient toutes les informations nécessaires pour l'affichage :
 * - Données de l'événement
 * - Liste des catégories associées (ManyToMany)
 *
 * Note : Ne contient PAS d'informations sensibles comme le profil du créateur
 */
public record EventViewDTO(
        Integer id,
        String nameEvent,
        String imgUrl, // Nom du fichier (ex: "abc123.png")
        String description,
        LocalDate dateEvent,
        String program,
        String contact,
        BigDecimal price,
        Integer numberPlace,
        String address,
        List<CategoryDTO> categories // Liste des catégories associées
) {}
