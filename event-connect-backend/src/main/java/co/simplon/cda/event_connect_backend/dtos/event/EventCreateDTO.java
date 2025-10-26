package co.simplon.cda.event_connect_backend.dtos.event;

import co.simplon.cda.event_connect_backend.dtos.category.CategoryDTO;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record EventCreateDTO(

        @NotBlank(message = "Le nom de l'événement est requis")
        @Size(max = 50)
        String nameEvent,

        @Size(max = 255)
        String imgUrl,

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
        BigDecimal price,

        @Min(value = 0)
        Integer numberPlace,

        @NotBlank(message = "L'adresse est requise")
        String address,

        @NotEmpty(message = "Au moins une catégorie est requise")
        List<Integer> categoryIds, // IDs des catégories
        List<CategoryDTO> categories // DTO complet pour retour front
) {
    @Override
    public String toString() {
        return "Event [nameEvent= " + nameEvent + ", imgUrl= " + imgUrl + ", description= " + description + ", dateEvent= " + dateEvent + ", program= " + program +
                ", contact= " + contact + ", price= " + price + ", numberPlace= " + numberPlace + ", address= " + address + "]";
    }
}