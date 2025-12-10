package co.simplon.cda.event_connect_backend.services;

import co.simplon.cda.event_connect_backend.dtos.category.CategoryDTO;
import co.simplon.cda.event_connect_backend.dtos.event.EventCreateDTO;
import co.simplon.cda.event_connect_backend.dtos.event.EventUpdateDTO;
import co.simplon.cda.event_connect_backend.dtos.event.EventViewDTO;
import co.simplon.cda.event_connect_backend.entities.Category;
import co.simplon.cda.event_connect_backend.entities.Event;
import co.simplon.cda.event_connect_backend.entities.Profile;
import co.simplon.cda.event_connect_backend.repositories.CategoryRepository;
import co.simplon.cda.event_connect_backend.repositories.EventRepository;
import co.simplon.cda.event_connect_backend.repositories.ProfileRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import co.simplon.cda.event_connect_backend.exceptions.ResourceNotFoundException;
import co.simplon.cda.event_connect_backend.exceptions.UnauthorizedAccessException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import java.util.ArrayList;
import java.util.List;

/**
 * Service métier pour la gestion des événements
 * Gère la logique de création, modification, suppression et consultation des événements
 * Vérifie les autorisations (un organisateur ne peut modifier que ses propres événements)
 *
 * Améliorations :
 * - ✅ Exceptions personnalisées avec messages clairs
 * - ✅ Logs pour traçabilité (SLF4J)
 * - ✅ Transactions explicites
 * - ✅ Validation des autorisations renforcée
 * - ✅ Méthode utilitaire pour conversion Entity → DTO
 */
@Service
@Transactional
public class EventService {

    private static final Logger logger = LoggerFactory.getLogger(EventService.class);

    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;
    private final ProfileRepository profileRepository;

    public EventService(
            EventRepository eventRepository,
            CategoryRepository categoryRepository,
            ProfileRepository profileRepository
    ) {
        this.eventRepository = eventRepository;
        this.categoryRepository = categoryRepository;
        this.profileRepository = profileRepository;
    }

    /**
     * Crée un nouvel événement
     *
     * AMÉLIORATIONS :
     * - Exceptions personnalisées
     * - Logs détaillés
     * - Validation de l'image obligatoire
     *
     */
    public void create(EventCreateDTO inputs, String imgUrl) {
        // Récupération de l'utilisateur authentifié
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        logger.info("Création d'événement par : {}", email);

        // Recherche du profil
        Profile profile = profileRepository.findByEmail(email);
        if (profile == null) {
            logger.error("Utilisateur non trouvé : {}", email);
            throw new ResourceNotFoundException("Profile", "email", email);
        }

        // Validation de l'image obligatoire
        if (imgUrl == null || imgUrl.isBlank()) {
            logger.warn("Tentative de création d'événement sans image par : {}", email);
            throw new IllegalArgumentException("L'image est obligatoire");
        }

        // Construction de l'entité Event
        Event event = new Event();
        event.setNameEvent(inputs.nameEvent());
        event.setImgUrl(imgUrl);
        event.setDescription(inputs.description());
        event.setDateEvent(inputs.dateEvent());
        event.setProgram(inputs.program());
        event.setContact(inputs.contact());
        event.setPrice(inputs.price());
        event.setNumberPlace(inputs.numberPlace());
        event.setAddress(inputs.address());
        event.setProfile(profile);

        // Association avec les catégories
        if (inputs.categoryIds() != null && !inputs.categoryIds().isEmpty()) {
            List<Category> categories = categoryRepository.findAllById(inputs.categoryIds());

            if (categories.isEmpty()) {
                logger.error("Aucune catégorie trouvée pour les IDs : {}", inputs.categoryIds());
                throw new ResourceNotFoundException("Aucune catégorie trouvée avec les IDs fournis");
            }

            event.setCategories(categories);
        }

        // Sauvegarde en base
        Event savedEvent = eventRepository.save(event);
        logger.info("Événement créé avec succès - ID: {} par {}", savedEvent.getId(), email);
    }

    /**
     * Met à jour un événement existant
     *
     * AMÉLIORATIONS :
     * - Vérification renforcée des autorisations
     * - Exceptions personnalisées
     * - Logs détaillés
     */
    public void update(EventUpdateDTO inputs, Integer id, String imgUrl) {
        logger.info("Tentative de modification de l'événement {} par utilisateur authentifié", id);

        // Récupération de l'événement
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Événement non trouvé : {}", id);
                    return new ResourceNotFoundException("Event", "id", id);
                });

        // Vérification des autorisations
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        if (!event.getProfile().getEmail().equals(email)) {
            logger.warn("Tentative de modification non autorisée de l'événement {} par {}", id, email);
            throw new UnauthorizedAccessException("Vous ne pouvez modifier que vos propres événements");
        }

        // Mise à jour des champs
        event.setNameEvent(inputs.nameEvent());
        if (imgUrl != null) {
            event.setImgUrl(imgUrl);
        }
        event.setDescription(inputs.description());
        event.setDateEvent(inputs.dateEvent());
        event.setProgram(inputs.program());
        event.setContact(inputs.contact());
        event.setPrice(inputs.price());
        event.setNumberPlace(inputs.numberPlace());
        event.setAddress(inputs.address());

        // Mise à jour des catégories si fournies
        if (inputs.categoryIds() != null && !inputs.categoryIds().isEmpty()) {
            List<Category> categories = categoryRepository.findAllById(inputs.categoryIds());

            if (categories.isEmpty()) {
                logger.error("Aucune catégorie trouvée pour les IDs : {}", inputs.categoryIds());
                throw new ResourceNotFoundException("Aucune catégorie trouvée avec les IDs fournis");
            }

            event.setCategories(categories);
        }

        eventRepository.save(event);
        logger.info("Événement {} mis à jour avec succès par {}", id, email);
    }

    /**
     * Supprime un événement
     */
    public void delete(Integer id) {
        logger.info("Tentative de suppression de l'événement {}", id);

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Événement non trouvé pour suppression : {}", id);
                    return new ResourceNotFoundException("Event", "id", id);
                });

        // Vérification des autorisations
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        if (!event.getProfile().getEmail().equals(email)) {
            logger.warn("Tentative de suppression non autorisée de l'événement {} par {}", id, email);
            throw new UnauthorizedAccessException("Vous ne pouvez supprimer que vos propres événements");
        }

        eventRepository.deleteById(id);
        logger.info("Événement {} supprimé avec succès par {}", id, email);
    }

    /**
     * Récupère tous les événements
     *
     * Endpoint public, accessible sans authentification
     */
    @Transactional(readOnly = true)
    public List<EventViewDTO> getAllEvents() {
        logger.debug("Récupération de tous les événements");

        List<Event> events = eventRepository.findAll();
        return events.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Récupère les événements d'une catégorie spécifique
     */
    @Transactional(readOnly = true)
    public List<EventViewDTO> getEventsByCategory(Integer categoryId) {
        logger.debug("Récupération des événements de la catégorie {}", categoryId);

        List<Event> events = eventRepository.findByCategoriesId(categoryId);
        return events.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Récupère un événement par son ID
     */
    @Transactional(readOnly = true)
    public EventViewDTO getById(Integer id) {
        logger.debug("Récupération de l'événement {}", id);

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Événement non trouvé : {}", id);
                    return new ResourceNotFoundException("Event", "id", id);
                });

        return convertToDTO(event);
    }

    /**
     * MÉTHODE UTILITAIRE : Conversion Event → EventViewDTO
     */
    private EventViewDTO convertToDTO(Event event) {
        List<CategoryDTO> categoryDTOs = event.getCategories() != null
                ? event.getCategories().stream()
                .map(cat -> new CategoryDTO(cat.getId(), cat.getNameCategory()))
                .collect(Collectors.toList())
                : new ArrayList<>();

        return new EventViewDTO(
                event.getId(),
                event.getNameEvent(),
                event.getImgUrl(),
                event.getDescription(),
                event.getDateEvent(),
                event.getProgram(),
                event.getContact(),
                event.getPrice(),
                event.getNumberPlace(),
                event.getAddress(),
                categoryDTOs
        );
    }
}