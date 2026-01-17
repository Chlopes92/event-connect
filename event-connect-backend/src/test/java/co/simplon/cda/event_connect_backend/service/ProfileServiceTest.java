package co.simplon.cda.event_connect_backend.service;

import co.simplon.cda.event_connect_backend.configuration.JwtProvider;
import co.simplon.cda.event_connect_backend.dtos.profile.ProfileAuthenticateDTO;
import co.simplon.cda.event_connect_backend.dtos.profile.ProfileCreateDTO;
import co.simplon.cda.event_connect_backend.entities.Profile;
import co.simplon.cda.event_connect_backend.entities.Role;
import co.simplon.cda.event_connect_backend.exceptions.DuplicateResourceException;
import co.simplon.cda.event_connect_backend.exceptions.InvalidCredentialsException;
import co.simplon.cda.event_connect_backend.exceptions.ResourceNotFoundException;
import co.simplon.cda.event_connect_backend.repositories.ProfileRepository;
import co.simplon.cda.event_connect_backend.repositories.RoleRepository;
import co.simplon.cda.event_connect_backend.services.ProfileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Tests unitaires pour ProfileService
 *
 * Couverture :
 * - create() : inscription utilisateur
 * - authenticate() : connexion + génération JWT
 *
 * Focus sécurité : validation des credentials, hashage des mots de passe
 */
@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock
    private ProfileRepository profileRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtProvider jwtProvider;

    @InjectMocks
    private ProfileService profileService;

    private Role testRole;
    private Profile testProfile;

    @BeforeEach
    void setUp() {
        testRole = new Role();
        testRole.setId(1);
        testRole.setName("ROLE_USER");

        testProfile = new Profile();
        // PAS de setId() car Profile n'a pas de setter pour l'ID (géré par JPA)
        testProfile.setEmail("test@example.com");
        testProfile.setFirstName("John");
        testProfile.setLastName("Doe");
        testProfile.setPassword("$2a$10$hashedPassword");
        testProfile.setPhone("0123456789");
        testProfile.setOrganization("Test Org");
        testProfile.setRole(testRole);
    }

    // ========== TESTS create() ==========
    /**
     * TEST 1 : create() - Cas nominal
     * Vérifie qu'un utilisateur est bien créé avec mot de passe hashé
     */
    @Test
    void create_WithValidData_ShouldCreateProfile() {
        // GIVEN
        ProfileCreateDTO dto = new ProfileCreateDTO(
                "john@example.com",
                "John",
                "Doe",
                "password123",
                "0123456789",
                "Test Org",
                1
        );

        when(profileRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(roleRepository.findById(1)).thenReturn(Optional.of(testRole));
        when(passwordEncoder.encode("password123")).thenReturn("$2a$10$hashedPassword");
        when(profileRepository.save(any(Profile.class))).thenReturn(testProfile);

        // WHEN
        profileService.create(dto);

        // THEN
        verify(profileRepository, times(1)).existsByEmail("john@example.com");
        verify(passwordEncoder, times(1)).encode("password123");
        verify(profileRepository, times(1)).save(any(Profile.class));
    }

    /**
     * TEST 2 : create() - Email déjà existant
     * Vérifie que DuplicateResourceException est levée
     */
    @Test
    void create_WithExistingEmail_ShouldThrowDuplicateResourceException() {
        // GIVEN
        ProfileCreateDTO dto = new ProfileCreateDTO(
                "john@example.com",
                "John",
                "Doe",
                "password123",
                "0123456789",
                "Test Org",
                1
        );

        when(profileRepository.existsByEmail("john@example.com")).thenReturn(true);

        // WHEN & THEN
        assertThatThrownBy(() -> profileService.create(dto))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("email");

        verify(profileRepository, never()).save(any());
    }

    /**
     * TEST 3 : create() - Rôle inexistant
     * Vérifie que ResourceNotFoundException est levée
     */
    @Test
    void create_WithNonExistentRole_ShouldThrowResourceNotFoundException() {
        // GIVEN
        ProfileCreateDTO dto = new ProfileCreateDTO(
                "john@example.com",
                "John",
                "Doe",
                "password123",
                "0123456789",
                "Test Org",
                999 // Rôle inexistant
        );

        when(profileRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(roleRepository.findById(999)).thenReturn(Optional.empty());

        // WHEN & THEN
        assertThatThrownBy(() -> profileService.create(dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Role");

        verify(profileRepository, never()).save(any());
    }

    // ========== TESTS authenticate() ==========
    /**
     * TEST 4 : authenticate() - Cas nominal
     * Vérifie qu'un JWT est généré pour des credentials valides
     */
    @Test
    void authenticate_WithValidCredentials_ShouldReturnJwtToken() {
        // GIVEN
        ProfileAuthenticateDTO dto = new ProfileAuthenticateDTO(
                "test@example.com",
                "password123"
        );

        when(profileRepository.findByEmail("test@example.com")).thenReturn(testProfile);
        when(passwordEncoder.matches("password123", testProfile.getPassword())).thenReturn(true);
        when(jwtProvider.create("test@example.com", List.of("ROLE_USER"))).thenReturn("jwt-token-123");

        // WHEN
        String token = profileService.authenticate(dto);

        // THEN
        assertThat(token).isEqualTo("jwt-token-123");

        verify(profileRepository, times(1)).findByEmail("test@example.com");
        verify(passwordEncoder, times(1)).matches("password123", testProfile.getPassword());
        verify(jwtProvider, times(1)).create("test@example.com", List.of("ROLE_USER"));
    }

    /**
     * TEST 5 : authenticate() - Email inexistant
     * Vérifie que InvalidCredentialsException est levée
     * Message générique pour éviter l'énumération des comptes
     */
    @Test
    void authenticate_WithNonExistentEmail_ShouldThrowInvalidCredentialsException() {
        // GIVEN
        ProfileAuthenticateDTO dto = new ProfileAuthenticateDTO(
                "unknown@example.com",
                "password123"
        );

        when(profileRepository.findByEmail("unknown@example.com")).thenReturn(null);

        // WHEN & THEN
        assertThatThrownBy(() -> profileService.authenticate(dto))
                .isInstanceOf(InvalidCredentialsException.class);

        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtProvider, never()).create(anyString(), any());
    }

    /**
     * TEST 6 : authenticate() - Mot de passe incorrect
     * Vérifie que InvalidCredentialsException est levée
     */
    @Test
    void authenticate_WithWrongPassword_ShouldThrowInvalidCredentialsException() {
        // GIVEN
        ProfileAuthenticateDTO dto = new ProfileAuthenticateDTO(
                "test@example.com",
                "wrongPassword"
        );

        when(profileRepository.findByEmail("test@example.com")).thenReturn(testProfile);
        when(passwordEncoder.matches("wrongPassword", testProfile.getPassword())).thenReturn(false);

        // WHEN & THEN
        assertThatThrownBy(() -> profileService.authenticate(dto))
                .isInstanceOf(InvalidCredentialsException.class);

        verify(jwtProvider, never()).create(anyString(), any());
    }

    /**
     * TEST 7 : getByEmail() - Cas nominal
     * Vérifie la récupération d'un profil par email
     */
    @Test
    void getByEmail_WhenProfileExists_ShouldReturnProfile() {
        // GIVEN
        when(profileRepository.findByEmail("test@example.com")).thenReturn(testProfile);

        // WHEN
        Profile result = profileService.getByEmail("test@example.com");

        // THEN
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("test@example.com");

        verify(profileRepository, times(1)).findByEmail("test@example.com");
    }

    /**
     * TEST 8 : getByEmail() - Profil inexistant
     */
    @Test
    void getByEmail_WhenProfileDoesNotExist_ShouldThrowResourceNotFoundException() {
        // GIVEN
        when(profileRepository.findByEmail("unknown@example.com")).thenReturn(null);

        // WHEN & THEN
        assertThatThrownBy(() -> profileService.getByEmail("unknown@example.com"))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
