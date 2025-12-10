package co.simplon.cda.event_connect_backend.dtos.event;

import co.simplon.cda.event_connect_backend.dtos.category.CategoryDTO;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO pour la création d'un événement
 *
 * Reçu depuis Angular lors du POST /events
 * Contient toutes les validations nécessaires
 *
 * Workflow :
 * 1. Angular envoie le JSON + l'image
 * 2. Spring valide automatiquement les contraintes (@Valid dans le controller)
 * 3. Le service crée l'entité Event correspondante
 *
 * Note : categoryIds contient les IDs pour la création en BDD
 *        categories contient les DTOs complets pour le retour front
 */
public record EventCreateDTO(

        @NotBlank(message = "Le nom de l'événement est requis")
        @Size(max = 50)
        String nameEvent,

        @Size(max = 255)
        String imgUrl, // Géré par FileStorageService

        @NotBlank(message = "La description est requise")
        String description,

        @NotNull(message = "La date est requise")
        @FutureOrPresent(message = "La date doit être future ou présente")
        LocalDate dateEvent,

        @NotBlank(message = "Le programme est requis")
        String program,

        @NotBlank(message = "Le contact est requis")
        String contact,

        @DecimalMin(value = "0.0", inclusive = true)
        @Digits(integer = 13, fraction = 2)
        BigDecimal price, // Peut être null pour événement gratuit

        @Min(value = 0)
        Integer numberPlace,

        @NotBlank(message = "L'adresse est requise")
        String address,

        @NotEmpty(message = "Au moins une catégorie est requise")
        List<Integer> categoryIds, // IDs des catégories sélectionnées
        List<CategoryDTO> categories // DTO complet pour retour front
) {
    @Override
    public String toString() {
        return "Event [nameEvent= " + nameEvent + ", imgUrl= " + imgUrl + ", description= " + description + ", dateEvent= " + dateEvent + ", program= " + program +
                ", contact= " + contact + ", price= " + price + ", numberPlace= " + numberPlace + ", address= " + address + "]";
    }
}