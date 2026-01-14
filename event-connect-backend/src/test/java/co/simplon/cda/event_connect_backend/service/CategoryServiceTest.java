package co.simplon.cda.event_connect_backend.service;

import co.simplon.cda.event_connect_backend.dtos.category.CategoryDTO;
import co.simplon.cda.event_connect_backend.entities.Category;
import co.simplon.cda.event_connect_backend.repositories.CategoryRepository;
import co.simplon.cda.event_connect_backend.services.CategoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

/**
 * Tests unitaires pour CategoryService
 *
 * Service simple qui retourne toutes les catégories
 * Tests : cas nominal + liste vide
 */
@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {
    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    private Category category1;
    private Category category2;

    @BeforeEach
    void setUp() {
        category1 = new Category();
        category1.setId(1);
        category1.setNameCategory("Festival");

        category2 = new Category();
        category2.setId(2);
        category2.setNameCategory("Concert");
    }

    /**
     * TEST 1 : getAllCategories() - Cas nominal
     * Vérifie que toutes les catégories sont retournées
     */
    @Test
    void getAllCategories_ShouldReturnAllCategories() {
        // GIVEN
        List<Category> categories = Arrays.asList(category1, category2);
        when(categoryRepository.findAll()).thenReturn(categories);

        // WHEN
        List<CategoryDTO> result = categoryService.getAllCategories();

        // THEN
        assertThat(result).isNotNull();
        assertThat(result).hasSize(2);

        assertThat(result.get(0).id()).isEqualTo(1);
        assertThat(result.get(0).nameCategory()).isEqualTo("Festival");

        assertThat(result.get(1).id()).isEqualTo(2);
        assertThat(result.get(1).nameCategory()).isEqualTo("Concert");

        verify(categoryRepository, times(1)).findAll();
    }

    /**
     * TEST 2 : getAllCategories() - Liste vide
     * Vérifie que le service gère correctement une BDD sans catégories
     */
    @Test
    void getAllCategories_WhenNoCategories_ShouldReturnEmptyList() {
        // GIVEN
        when(categoryRepository.findAll()).thenReturn(List.of());

        // WHEN
        List<CategoryDTO> result = categoryService.getAllCategories();

        // THEN
        assertThat(result).isNotNull();
        assertThat(result).isEmpty();

        verify(categoryRepository, times(1)).findAll();
    }

    /**
     * TEST 3 : getAllCategories() - Une seule catégorie
     */
    @Test
    void getAllCategories_WithSingleCategory_ShouldReturnSingleElement() {
        // GIVEN
        when(categoryRepository.findAll()).thenReturn(List.of(category1));

        // WHEN
        List<CategoryDTO> result = categoryService.getAllCategories();

        // THEN
        assertThat(result).hasSize(1);
        assertThat(result.get(0).nameCategory()).isEqualTo("Festival");

        verify(categoryRepository, times(1)).findAll();
    }
}
