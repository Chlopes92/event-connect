package co.simplon.cda.event_connect_backend.dtos.event;

import co.simplon.cda.event_connect_backend.dtos.category.CategoryDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record EventUpdateDTO(
            Integer id,
            String nameEvent,
            String imgUrl,
            String description,
            LocalDate dateEvent,
            String program,
            String contact,
            BigDecimal price,
            Integer numberPlace,
            String address,
            List<Integer> categoryIds,
            List<CategoryDTO> categories
) {}

