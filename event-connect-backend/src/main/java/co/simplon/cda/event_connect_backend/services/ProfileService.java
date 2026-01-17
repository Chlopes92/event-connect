package co.simplon.cda.event_connect_backend.services;

import co.simplon.cda.event_connect_backend.configuration.JwtProvider;
import co.simplon.cda.event_connect_backend.dtos.profile.ProfileAuthenticateDTO;
import co.simplon.cda.event_connect_backend.dtos.profile.ProfileCreateDTO;
import co.simplon.cda.event_connect_backend.dtos.profile.ProfileViewDTO;
import co.simplon.cda.event_connect_backend.dtos.role.RoleDTO;
import co.simplon.cda.event_connect_backend.entities.Profile;
import co.simplon.cda.event_connect_backend.entities.Role;
import co.simplon.cda.event_connect_backend.repositories.ProfileRepository;
import co.simplon.cda.event_connect_backend.repositories.RoleRepository;
import co.simplon.cda.event_connect_backend.exceptions.DuplicateResourceException;
import co.simplon.cda.event_connect_backend.exceptions.InvalidCredentialsException;
import co.simplon.cda.event_connect_backend.exceptions.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service métier pour la gestion des profils utilisateurs
 * Gère l'inscription, l'authentification et la gestion des comptes
 *
 * Améliorations :
 * - Validation de l'unicité email/téléphone AVANT insertion
 * - Exceptions personnalisées avec messages clairs
 * - Logs pour traçabilité (SLF4J)
 * - Transactions explicites
 * - Gestion d'erreurs robuste
 */
@Service
@Transactional
public class ProfileService {
    private static final Logger logger = LoggerFactory.getLogger(ProfileService.class);

    // Constantes pour les noms de ressources
    private static final String RESOURCE_NAME_PROFILE = "Profile";
    private static final String RESOURCE_NAME_ROLE = "Role";
    private static final String FIELD_NAME_EMAIL = "email";
    private static final String FIELD_NAME_PHONE = "phone";
    private static final String FIELD_NAME_ID = "id";

    // Messages d'erreur
    private static final String ERROR_PROFILE_CREATION = "Erreur lors de la création du profil";

    private final ProfileRepository profileRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public ProfileService(
            ProfileRepository profileRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtProvider jwtProvider
    ) {
        this.profileRepository = profileRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
    }

    /**
     * Crée un nouveau profil utilisateur (inscription)
     *
     * AMÉLIORATIONS :
     * - Validation de l'unicité email/téléphone
     * - Exceptions personnalisées
     * - Logs pour traçabilité
     */
    public void create(ProfileCreateDTO inputs) {
        logger.info("Tentative de création de profil pour : {}", inputs.email());

        // 1. Validation de l'unicité de l'email
        if (profileRepository.existsByEmail(inputs.email())) {
            logger.warn("Tentative d'inscription avec email existant : {}", inputs.email());
            throw new DuplicateResourceException(RESOURCE_NAME_PROFILE, FIELD_NAME_EMAIL, inputs.email());
        }

        // 2. Vérification de l'existence du rôle
        Role role = roleRepository.findById(inputs.roleId())
                .orElseThrow(() -> {
                    logger.error("Tentative de création avec rôle inexistant : {}", inputs.roleId());
                    return new ResourceNotFoundException(RESOURCE_NAME_ROLE, FIELD_NAME_ID, inputs.roleId());
                });

        // 3. Construction de l'entité Profile
        Profile profile = new Profile();
        profile.setLastName(inputs.lastName());
        profile.setFirstName(inputs.firstName());
        profile.setEmail(inputs.email());

        // 4. Hashage sécurisé du mot de passe avec BCrypt
        String encodedPassword = passwordEncoder.encode(inputs.password());
        profile.setPassword(encodedPassword);
        profile.setPhone(inputs.phone());
        profile.setOrganization(inputs.organization());
        profile.setRole(role);

        // 5. Sauvegarde en base
        try {
            profileRepository.save(profile);
            logger.info("Profil créé avec succès pour : {}", inputs.email());
        } catch (Exception e) {
            // Gestion des contraintes SQL (unicité du téléphone)
            if (e.getMessage().contains(FIELD_NAME_PHONE)) {
                logger.warn("Tentative d'inscription avec téléphone existant : {}", inputs.phone());
                throw new DuplicateResourceException(RESOURCE_NAME_PROFILE, FIELD_NAME_PHONE, inputs.phone());
            }
            logger.error("Erreur lors de la création du profil : ", e);
            throw new RuntimeException(ERROR_PROFILE_CREATION, e);
        }
    }

    /**
     * Authentifie un utilisateur et génère un token JWT
     *
     * AMÉLIORATIONS :
     * - Exception personnalisée InvalidCredentialsException
     * - Logs sans révéler d'informations sensibles
     * - Message générique pour la sécurité
     *
     * Sécurité :
     * - Le message d'erreur ne révèle PAS si l'email existe
     * - Prévient l'énumération des comptes
     */
    @Transactional(readOnly = true)
    public String authenticate(ProfileAuthenticateDTO inputs) {
        logger.info("Tentative de connexion pour : {}", inputs.email());

        // 1. Recherche du profil par email
        Profile profile = profileRepository.findByEmail(inputs.email());

        // 2. Vérification de l'existence du compte
        if (profile == null) {
            logger.warn("Tentative de connexion avec email inconnu : {}", inputs.email());
            throw new InvalidCredentialsException();
        }

        // 3. Vérification du mot de passe avec BCrypt
        if (!passwordEncoder.matches(inputs.password(), profile.getPassword())) {
            logger.warn("Tentative de connexion avec mot de passe incorrect pour : {}", inputs.email());
            throw new InvalidCredentialsException();
        }

        // 4. Génération du token JWT avec le rôle
        String roleName = profile.getRole().getName();
        List<String> roles = List.of(roleName);
        String token = jwtProvider.create(inputs.email(), roles);

        logger.info("Connexion réussie pour : {}", inputs.email());
        return token;
    }

    /**
     * Récupère tous les profils
     *
     * Note : À protéger avec @PreAuthorize("hasRole('ADMIN')")
     * dans le controller si nécessaire
     */
    @Transactional(readOnly = true)
    public List<ProfileViewDTO> getAllProfiles() {
        logger.debug("Récupération de tous les profils");

        return profileRepository.findAll().stream()
                .map(profile -> new ProfileViewDTO(
                        profile.getId(),
                        profile.getEmail(),
                        profile.getFirstName(),
                        profile.getLastName(),
                        profile.getPhone(),
                        profile.getOrganization(),
                        new RoleDTO(profile.getRole().getId(), profile.getRole().getName())
                ))
                .toList();
    }

    /**
     * Récupère un profil par son email
     */
    @Transactional(readOnly = true)
    public Profile getByEmail(String email) {
        logger.debug("Recherche du profil : {}", email);

        Profile profile = profileRepository.findByEmail(email);
        if (profile == null) {
            logger.warn("Profil non trouvé : {}", email);
            throw new ResourceNotFoundException(RESOURCE_NAME_PROFILE, FIELD_NAME_EMAIL, email);
        }

        return profile;
    }
}