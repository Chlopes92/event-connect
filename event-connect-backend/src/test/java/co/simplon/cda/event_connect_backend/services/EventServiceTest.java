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
import static org.mockito.Mockito.*;

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

        // Profil - SANS setId() car pas de setter dans Profile
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

    @Test
    void getAllEvents_ShouldReturnListOfEvents() {
        Event event1 = createMockEvent(1, "Event 1");
        Event event2 = createMockEvent(2, "Event 2");
        when(eventRepository.findAll()).thenReturn(Arrays.asList(event1, event2));

        List<EventViewDTO> result = eventService.getAllEvents();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).nameEvent()).isEqualTo("Event 1");
        assertThat(result.get(1).nameEvent()).isEqualTo("Event 2");
        verify(eventRepository, times(1)).findAll();
    }

    @Test
    void getAllEvents_WhenNoEvents_ShouldReturnEmptyList() {
        when(eventRepository.findAll()).thenReturn(List.of());
        List<EventViewDTO> result = eventService.getAllEvents();
        assertThat(result).isEmpty();
        verify(eventRepository, times(1)).findAll();
    }

    @Test
    void getById_WhenEventExists_ShouldReturnEvent() {
        when(eventRepository.findById(1)).thenReturn(Optional.of(testEvent));
        EventViewDTO result = eventService.getById(1);
        assertThat(result.id()).isEqualTo(1);
        assertThat(result.nameEvent()).isEqualTo("Test Event");
        assertThat(result.categories()).hasSize(1);
        verify(eventRepository, times(1)).findById(1);
    }

    @Test
    void getById_WhenEventDoesNotExist_ShouldThrowException() {
        when(eventRepository.findById(999)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> eventService.getById(999))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getEventsByCategory_ShouldReturnFilteredEvents() {
        when(eventRepository.findByCategoriesId(1)).thenReturn(List.of(testEvent));
        List<EventViewDTO> result = eventService.getEventsByCategory(1);
        assertThat(result).hasSize(1);
        assertThat(result.get(0).nameEvent()).isEqualTo("Test Event");
        verify(eventRepository, times(1)).findByCategoriesId(1);
    }

    @Test
    void create_WithValidData_ShouldCreateEvent() {
        EventCreateDTO dto = createValidEventDTO();
        mockAuthentication("test@example.com");
        when(profileRepository.findByEmail("test@example.com")).thenReturn(testProfile);
        when(categoryRepository.findAllById(List.of(1))).thenReturn(List.of(testCategory));
        when(eventRepository.save(any(Event.class))).thenReturn(testEvent);

        eventService.create(dto, "image.png");

        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    void create_WithoutImage_ShouldThrowException() {
        EventCreateDTO dto = createValidEventDTO();
        mockAuthentication("test@example.com");
        when(profileRepository.findByEmail("test@example.com")).thenReturn(testProfile);

        assertThatThrownBy(() -> eventService.create(dto, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("image");
    }

    @Test
    void create_WithNonExistentProfile_ShouldThrowException() {
        EventCreateDTO dto = createValidEventDTO();
        mockAuthentication("unknown@example.com");
        when(profileRepository.findByEmail("unknown@example.com")).thenReturn(null);

        assertThatThrownBy(() -> eventService.create(dto, "image.png"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void update_AsOwner_ShouldUpdateEvent() {
        EventUpdateDTO dto = createValidUpdateDTO();
        mockAuthentication("test@example.com");
        when(eventRepository.findById(1)).thenReturn(Optional.of(testEvent));
        when(categoryRepository.findAllById(List.of(1))).thenReturn(List.of(testCategory));
        when(eventRepository.save(any(Event.class))).thenReturn(testEvent);

        eventService.update(dto, 1, null);

        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    void update_AsNonOwner_ShouldThrowException() {
        EventUpdateDTO dto = createValidUpdateDTO();
        mockAuthentication("other@example.com");
        when(eventRepository.findById(1)).thenReturn(Optional.of(testEvent));

        assertThatThrownBy(() -> eventService.update(dto, 1, null))
                .isInstanceOf(UnauthorizedAccessException.class);
    }

    @Test
    void delete_AsOwner_ShouldDeleteEvent() {
        mockAuthentication("test@example.com");
        when(eventRepository.findById(1)).thenReturn(Optional.of(testEvent));

        eventService.delete(1);

        verify(eventRepository, times(1)).deleteById(1);
    }

    @Test
    void delete_AsNonOwner_ShouldThrowException() {
        mockAuthentication("other@example.com");
        when(eventRepository.findById(1)).thenReturn(Optional.of(testEvent));

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