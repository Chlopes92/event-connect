package co.simplon.cda.event_connect_backend.services;

import co.simplon.cda.event_connect_backend.dtos.event.EventCreateDTO;
import co.simplon.cda.event_connect_backend.dtos.event.EventUpdateDTO;
import co.simplon.cda.event_connect_backend.dtos.event.EventViewDTO;
import co.simplon.cda.event_connect_backend.entities.Category;
import co.simplon.cda.event_connect_backend.entities.Event;
import co.simplon.cda.event_connect_backend.entities.Profile;
import co.simplon.cda.event_connect_backend.entities.Role;
import co.simplon.cda.event_connect_backend.exceptions.ResourceNotFoundException;
import co.simplon.cda.event_connect_backend.exceptions.UnauthorizedAccessException;
import co.simplon.cda.event_connect_backend.repositories.CategoryRepository;
import co.simplon.cda.event_connect_backend.repositories.EventRepository;
import co.simplon.cda.event_connect_backend.repositories.ProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

/**
 * Tests unitaires COMPLETS pour EventService
 *
 * COUVERTURE CIBLE : 100%
 *
 * Structure :
 * - Tests de consultation (getAllEvents, getById, getEventsByCategory)
 * - Tests de création (create)
 * - Tests de modification (update)
 * - Tests de suppression (delete)
 * - Tests d'autorisation
 * - Tests de validation
 * - Tests edge cases et couverture complète
 */
@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private ProfileRepository profileRepository;
    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;

    @InjectMocks
    private EventService eventService;

    private Event testEvent;
    private Profile testProfile;
    private Role testRole;
    private Category testCategory;

    @BeforeEach
    void setUp() {
        // Rôle
        testRole = new Role();
        testRole.setId(2);
        testRole.setName("ROLE_USER");

        // Profil
        testProfile = new Profile();
        testProfile.setEmail("test@example.com");
        testProfile.setFirstName("John");
        testProfile.setLastName("Doe");
        testProfile.setPhone("0123456789");
        testProfile.setOrganization("Test Org");
        testProfile.setRole(testRole);

        // Catégorie
        testCategory = new Category();
        testCategory.setId(1);
        testCategory.setNameCategory("Festival");

        // Événement
        testEvent = new Event();
        testEvent.setId(1);
        testEvent.setNameEvent("Test Event");
        testEvent.setImgUrl("test-image.png");
        testEvent.setDescription("Description test");
        testEvent.setDateEvent(LocalDate.of(2026, 6, 15));
        testEvent.setProgram("Programme test");
        testEvent.setContact("Contact test");
        testEvent.setPrice(new BigDecimal("10.00"));
        testEvent.setNumberPlace(100);
        testEvent.setAddress("Test Address");
        testEvent.setProfile(testProfile);
        testEvent.setCategories(List.of(testCategory));
    }

    /**
     * TEST 1 : getAllEvents() avec plusieurs événements
     */
    @Test
    void getAllEvents_ShouldReturnListOfEvents() {
        // GIVEN
        Event event1 = createMockEvent(1, "Event 1");
        Event event2 = createMockEvent(2, "Event 2");
        when(eventRepository.findAll()).thenReturn(Arrays.asList(event1, event2));

        // WHEN
        List<EventViewDTO> result = eventService.getAllEvents();

        // THEN
        assertThat(result).hasSize(2);
        assertThat(result.get(0).nameEvent()).isEqualTo("Event 1");
        assertThat(result.get(1).nameEvent()).isEqualTo("Event 2");
        verify(eventRepository, times(1)).findAll();
    }

    /**
     * TEST 2 : getAllEvents() sans événements
     */
    @Test
    void getAllEvents_WhenNoEvents_ShouldReturnEmptyList() {
        // GIVEN
        when(eventRepository.findAll()).thenReturn(List.of());

        // WHEN
        List<EventViewDTO> result = eventService.getAllEvents();

        // THEN
        assertThat(result).isEmpty();
        verify(eventRepository, times(1)).findAll();
    }

    /**
     * TEST 3 : getById() avec événement existant
     */
    @Test
    void getById_WhenEventExists_ShouldReturnEvent() {
        // GIVEN
        when(eventRepository.findById(1)).thenReturn(Optional.of(testEvent));

        // WHEN
        EventViewDTO result = eventService.getById(1);

        // THEN
        assertThat(result.id()).isEqualTo(1);
        assertThat(result.nameEvent()).isEqualTo("Test Event");
        assertThat(result.categories()).hasSize(1);
        verify(eventRepository, times(1)).findById(1);
    }

    /**
     * TEST 4 : getById() avec événement inexistant
     */
    @Test
    void getById_WhenEventDoesNotExist_ShouldThrowException() {
        // GIVEN
        when(eventRepository.findById(999)).thenReturn(Optional.empty());

        // WHEN & THEN
        assertThatThrownBy(() -> eventService.getById(999))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    /**
     * TEST 5 : getEventsByCategory() avec résultats
     */
    @Test
    void getEventsByCategory_ShouldReturnFilteredEvents() {
        // GIVEN
        when(eventRepository.findByCategoriesId(1)).thenReturn(List.of(testEvent));

        // WHEN
        List<EventViewDTO> result = eventService.getEventsByCategory(1);

        // THEN
        assertThat(result).hasSize(1);
        assertThat(result.get(0).nameEvent()).isEqualTo("Test Event");
        verify(eventRepository, times(1)).findByCategoriesId(1);
    }

    /**
     * TEST 6 : create() avec données valides
     */
    @Test
    void create_WithValidData_ShouldCreateEvent() {
        // GIVEN
        EventCreateDTO dto = createValidEventDTO();
        mockAuthentication("test@example.com");
        when(profileRepository.findByEmail("test@example.com")).thenReturn(testProfile);
        when(categoryRepository.findAllById(List.of(1))).thenReturn(List.of(testCategory));
        when(eventRepository.save(any(Event.class))).thenReturn(testEvent);

        // WHEN
        eventService.create(dto, "image.png");

        // THEN
        verify(eventRepository, times(1)).save(any(Event.class));
    }

    /**
     * TEST 7 : create() sans image (null)
     */
    @Test
    void create_WithoutImage_ShouldThrowException() {
        // GIVEN
        EventCreateDTO dto = createValidEventDTO();
        mockAuthentication("test@example.com");
        when(profileRepository.findByEmail("test@example.com")).thenReturn(testProfile);

        // WHEN & THEN
        assertThatThrownBy(() -> eventService.create(dto, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("image");
    }

    /**
     * TEST 8 : create() avec image vide ou blank
     */
    @Test
    void create_WithBlankImage_ShouldThrowIllegalArgumentException() {
        // GIVEN
        EventCreateDTO dto = createValidEventDTO();
        mockAuthentication("test@example.com");
        when(profileRepository.findByEmail("test@example.com")).thenReturn(testProfile);

        // WHEN & THEN - Avec chaîne vide
        assertThatThrownBy(() -> eventService.create(dto, ""))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("image");

        // WHEN & THEN - Avec chaîne contenant seulement des espaces
        assertThatThrownBy(() -> eventService.create(dto, "   "))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("image");

        verify(profileRepository, times(2)).findByEmail("test@example.com");
        verify(eventRepository, never()).save(any(Event.class));
    }

    /**
     * TEST 9 : create() avec profil inexistant
     */
    @Test
    void create_WithNonExistentProfile_ShouldThrowException() {
        // GIVEN
        EventCreateDTO dto = createValidEventDTO();
        mockAuthentication("unknown@example.com");
        when(profileRepository.findByEmail("unknown@example.com")).thenReturn(null);

        // WHEN & THEN
        assertThatThrownBy(() -> eventService.create(dto, "image.png"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    /**
     * TEST 10 : create() avec IDs de catégories invalides
     * COUVRE : Branche if(categories.isEmpty()) dans create()
     */
    @Test
    void create_WithInvalidCategoryIds_ShouldThrowResourceNotFoundException() {
        // GIVEN
        EventCreateDTO dto = new EventCreateDTO(
                "New Event",
                null,
                "Description",
                LocalDate.now().plusDays(10),
                "Programme",
                "Contact",
                BigDecimal.TEN,
                50,
                "Address",
                List.of(999, 888), // IDs de catégories qui n'existent pas
                null
        );

        mockAuthentication("test@example.com");
        when(profileRepository.findByEmail("test@example.com")).thenReturn(testProfile);

        // categoryRepository retourne une liste VIDE car les IDs n'existent pas
        when(categoryRepository.findAllById(List.of(999, 888))).thenReturn(List.of());

        // WHEN & THEN
        assertThatThrownBy(() -> eventService.create(dto, "image.png"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Aucune catégorie trouvée avec les IDs fournis");

        // Vérifications
        verify(profileRepository, times(1)).findByEmail("test@example.com");
        verify(categoryRepository, times(1)).findAllById(List.of(999, 888));
        verify(eventRepository, never()).save(any(Event.class));
    }

    /**
     * TEST 11 : create() avec categoryIds null
     * Vérifie que le code gère correctement l'absence de catégories
     */
    @Test
    void create_WithNullCategoryIds_ShouldCreateEventWithoutCategories() {
        // GIVEN
        EventCreateDTO dto = new EventCreateDTO(
                "Event without categories",
                null,
                "Description",
                LocalDate.now().plusDays(10),
                "Programme",
                "Contact",
                BigDecimal.TEN,
                50,
                "Address",
                null, // Pas de catégories
                null
        );

        mockAuthentication("test@example.com");
        when(profileRepository.findByEmail("test@example.com")).thenReturn(testProfile);
        when(eventRepository.save(any(Event.class))).thenReturn(testEvent);

        // WHEN
        eventService.create(dto, "image.png");

        // THEN
        verify(eventRepository, times(1)).save(any(Event.class));
        verify(categoryRepository, never()).findAllById(any());
    }

    /**
     * TEST 12 : update() en tant que propriétaire
     */
    @Test
    void update_AsOwner_ShouldUpdateEvent() {
        // GIVEN
        EventUpdateDTO dto = createValidUpdateDTO();
        mockAuthentication("test@example.com");
        when(eventRepository.findById(1)).thenReturn(Optional.of(testEvent));
        when(categoryRepository.findAllById(List.of(1))).thenReturn(List.of(testCategory));
        when(eventRepository.save(any(Event.class))).thenReturn(testEvent);

        // WHEN
        eventService.update(dto, 1, null);

        // THEN
        verify(eventRepository, times(1)).save(any(Event.class));
    }

    /**
     * TEST 13 : update() en tant que non-propriétaire
     */
    @Test
    void update_AsNonOwner_ShouldThrowException() {
        // GIVEN
        EventUpdateDTO dto = createValidUpdateDTO();
        mockAuthentication("other@example.com");
        when(eventRepository.findById(1)).thenReturn(Optional.of(testEvent));

        // WHEN & THEN
        assertThatThrownBy(() -> eventService.update(dto, 1, null))
                .isInstanceOf(UnauthorizedAccessException.class);
    }

    /**
     * TEST 14 : update() avec IDs de catégories invalides
     * COUVRE : Branche if(categories.isEmpty()) dans update()
     */
    @Test
    void update_WithInvalidCategoryIds_ShouldThrowResourceNotFoundException() {
        // GIVEN
        EventUpdateDTO dto = new EventUpdateDTO(
                1,
                "Updated Event",
                null,
                "Updated Description",
                LocalDate.now().plusDays(20),
                "Updated Programme",
                "Updated Contact",
                BigDecimal.valueOf(20),
                200,
                "Updated Address",
                List.of(777, 666), // IDs de catégories qui n'existent pas
                null
        );

        mockAuthentication("test@example.com");
        when(eventRepository.findById(1)).thenReturn(Optional.of(testEvent));

        // categoryRepository retourne une liste VIDE car les IDs n'existent pas
        when(categoryRepository.findAllById(List.of(777, 666))).thenReturn(List.of());

        // WHEN & THEN
        assertThatThrownBy(() -> eventService.update(dto, 1, null))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Aucune catégorie trouvée avec les IDs fournis");

        // Vérifications
        verify(eventRepository, times(1)).findById(1);
        verify(categoryRepository, times(1)).findAllById(List.of(777, 666));
        verify(eventRepository, never()).save(any(Event.class));
    }

    /**
     * TEST 15 : update() avec nouvelle image
     * Vérifie que l'image est bien mise à jour quand imgUrl n'est pas null
     */
    @Test
    void update_WithNewImage_ShouldUpdateImageUrl() {
        // GIVEN
        EventUpdateDTO dto = createValidUpdateDTO();
        mockAuthentication("test@example.com");
        when(eventRepository.findById(1)).thenReturn(Optional.of(testEvent));
        when(categoryRepository.findAllById(List.of(1))).thenReturn(List.of(testCategory));

        String newImageUrl = "new-image.jpg";

        // WHEN
        eventService.update(dto, 1, newImageUrl);

        // THEN
        verify(eventRepository, times(1)).save(argThat(event ->
                event.getImgUrl().equals(newImageUrl)
        ));
    }

    /**
     * TEST 16 : update() avec categoryIds null
     * Vérifie que les catégories ne sont pas modifiées si non fournies
     */
    @Test
    void update_WithNullCategoryIds_ShouldNotUpdateCategories() {
        // GIVEN
        EventUpdateDTO dto = new EventUpdateDTO(
                1,
                "Updated Event",
                null,
                "Updated Description",
                LocalDate.now().plusDays(20),
                "Updated Programme",
                "Updated Contact",
                BigDecimal.valueOf(20),
                200,
                "Updated Address",
                null, // Pas de mise à jour des catégories
                null
        );

        mockAuthentication("test@example.com");

        // L'événement a déjà une catégorie
        Category existingCategory = new Category();
        existingCategory.setId(1);
        existingCategory.setNameCategory("Festival");
        testEvent.setCategories(List.of(existingCategory));

        when(eventRepository.findById(1)).thenReturn(Optional.of(testEvent));

        // WHEN
        eventService.update(dto, 1, null);

        // THEN
        verify(eventRepository, times(1)).save(any(Event.class));
        verify(categoryRepository, never()).findAllById(any());
    }

    /**
     * TEST 17 : update() avec liste de catégories vide
     * Vérifie le comportement avec une liste vide (différent de null)
     */
    @Test
    void update_WithEmptyCategoryList_ShouldNotCallRepository() {
        // GIVEN
        EventUpdateDTO dto = new EventUpdateDTO(
                1,
                "Updated Event",
                null,
                "Updated Description",
                LocalDate.now().plusDays(20),
                "Updated Programme",
                "Updated Contact",
                BigDecimal.valueOf(20),
                200,
                "Updated Address",
                List.of(), // Liste vide (≠ null)
                null
        );

        mockAuthentication("test@example.com");
        when(eventRepository.findById(1)).thenReturn(Optional.of(testEvent));

        // WHEN
        eventService.update(dto, 1, null);

        // THEN
        verify(eventRepository, times(1)).save(any(Event.class));
        // Avec une liste vide, le if est faux, donc categoryRepository ne devrait pas être appelé
        verify(categoryRepository, never()).findAllById(any());
    }

    /**
     * TEST 18 : delete() en tant que propriétaire
     */
    @Test
    void delete_AsOwner_ShouldDeleteEvent() {
        // GIVEN
        mockAuthentication("test@example.com");
        when(eventRepository.findById(1)).thenReturn(Optional.of(testEvent));

        // WHEN
        eventService.delete(1);

        // THEN
        verify(eventRepository, times(1)).deleteById(1);
    }

    /**
     * TEST 19 : delete() en tant que non-propriétaire
     */
    @Test
    void delete_AsNonOwner_ShouldThrowException() {
        // GIVEN
        mockAuthentication("other@example.com");
        when(eventRepository.findById(1)).thenReturn(Optional.of(testEvent));

        // WHEN & THEN
        assertThatThrownBy(() -> eventService.delete(1))
                .isInstanceOf(UnauthorizedAccessException.class);
        verify(eventRepository, never()).deleteById(any());
    }

    private Event createMockEvent(Integer id, String name) {
        Event event = new Event();
        event.setId(id);
        event.setNameEvent(name);
        event.setDescription("Description");
        event.setDateEvent(LocalDate.now().plusDays(1));
        event.setProgram("Program");
        event.setContact("Contact");
        event.setPrice(BigDecimal.TEN);
        event.setNumberPlace(50);
        event.setAddress("Address");
        event.setProfile(testProfile);
        event.setCategories(List.of(testCategory));
        return event;
    }

    private EventCreateDTO createValidEventDTO() {
        return new EventCreateDTO(
                "New Event", null, "Description", LocalDate.now().plusDays(10),
                "Programme", "Contact", BigDecimal.TEN, 50, "Address", List.of(1), null
        );
    }

    private EventUpdateDTO createValidUpdateDTO() {
        return new EventUpdateDTO(
                1, "Updated Event", null, "Updated Description", LocalDate.now().plusDays(20),
                "Updated Programme", "Updated Contact", BigDecimal.valueOf(20), 200, "Updated Address", List.of(1), null
        );
    }

    private void mockAuthentication(String email) {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn(email);
    }
}