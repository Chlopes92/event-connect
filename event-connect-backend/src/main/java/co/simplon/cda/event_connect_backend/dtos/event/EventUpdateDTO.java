package co.simplon.cda.event_connect_backend.dtos.event;

import co.simplon.cda.event_connect_backend.dtos.category.CategoryDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO pour la mise à jour d'un événement
 *
 * Différences avec EventCreateDTO :
 * - Pas de validations strictes (optionnelles en update)
 * - Contient l'id pour identifier l'événement à modifier
 * - imgUrl peut être null si l'image n'est pas modifiée
 *
 * Utilisé lors du PUT /events/{id}
 */
public record EventUpdateDTO(
            Integer id,
            String nameEvent,
            String imgUrl, // null si l'image n'est pas modifiée
            String description,
            LocalDate dateEvent,
            String program,
            String contact,
            BigDecimal price,
            Integer numberPlace,
            String address,
            List<Integer> categoryIds, // Nouvelles catégories sélectionnées
            List<CategoryDTO> categories
) {}

