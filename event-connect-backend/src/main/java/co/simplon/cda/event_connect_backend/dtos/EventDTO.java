package co.simplon.cda.event_connect_backend.dtos;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EventDTO(
        Integer id,

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
        String adress,

        @NotNull(message = "La catégorie est requise")
        Integer categoryId,

        CategoryDTO category
) {
    @Override
    public String toString() {
        return "Event [nameEvent= " + nameEvent + ", imgUrl= " + imgUrl + ", description= " + description + ", dateEvent= " + dateEvent + ", program= " + program +
                ", contact= " + contact + ", price= " + price + ", numberPlace= " + numberPlace + ", adress= " + adress + "]";
    }
}