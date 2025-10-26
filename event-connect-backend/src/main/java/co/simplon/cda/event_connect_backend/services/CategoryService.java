package co.simplon.cda.event_connect_backend.services;

import co.simplon.cda.event_connect_backend.dtos.category.CategoryDTO;
import co.simplon.cda.event_connect_backend.repositories.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(cat -> new CategoryDTO(cat.getId(), cat.getNameCategory()))
                .collect(Collectors.toList());
    }
}