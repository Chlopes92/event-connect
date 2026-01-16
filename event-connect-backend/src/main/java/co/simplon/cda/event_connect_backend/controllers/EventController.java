package co.simplon.cda.event_connect_backend.controllers;

import co.simplon.cda.event_connect_backend.dtos.event.EventCreateDTO;
import co.simplon.cda.event_connect_backend.dtos.event.EventUpdateDTO;
import co.simplon.cda.event_connect_backend.dtos.event.EventViewDTO;
import co.simplon.cda.event_connect_backend.services.EventService;
import co.simplon.cda.event_connect_backend.services.FileStorageService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * Contrôleur REST pour la gestion des événements
 * Expose les endpoints CRUD pour l'API événements
 *
 * Routes :
 * - GET    /events           → Liste tous les événements (public)
 * - GET    /events/{id}      → Détails d'un événement (public)
 * - GET    /events/by-category/{id} → Événements par catégorie (public)
 * - POST   /events           → Créer un événement (authentifié)
 * - PUT    /events/{id}      → Modifier un événement (authentifié + owner)
 * - DELETE /events/{id}      → Supprimer un événement (authentifié + owner)
 */
@RestController
@RequestMapping("/events")
public class EventController {

    // CONSTANTES - CLÉS DE RÉPONSE JSON
    private static final String RESPONSE_KEY_MESSAGE = "message";
    private static final String RESPONSE_KEY_STATUS = "status";
    private static final String RESPONSE_STATUS_SUCCESS = "success";

    // Messages de succès
    private static final String MSG_EVENT_CREATED = "Event créé avec succès";
    private static final String MSG_EVENT_UPDATED = "Event mis à jour avec succès";
    private static final String MSG_EVENT_DELETED = "Event supprimé avec succès";
    private final EventService eventService;
    private final FileStorageService fileStorageService;

    /**
     * Constructeur avec injection de dépendances
     */
    public EventController(EventService eventService, FileStorageService fileStorageService) {
        this.eventService = eventService;
        this.fileStorageService = fileStorageService;
    }

    /**
     * Crée un nouvel événement avec upload d'image
     *
     * Format de la requête : multipart/form-data
     * - "event" : JSON avec les données de l'événement
     * - "image" : Fichier image
     *
     * Sécurité : Nécessite une authentification JWT
     * L'utilisateur est automatiquement associé comme créateur
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> create(
            @Valid @RequestPart("event") EventCreateDTO inputs,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        // Sauvegarde de l'image si fournie
        String imgUrl = null;
        if(image != null && !image.isEmpty()) {
            imgUrl = fileStorageService.saveImage(image);
        }
        // Création de l'événement en base
        eventService.create(inputs, imgUrl);
        return ResponseEntity.ok(Map.of(
                RESPONSE_KEY_MESSAGE, MSG_EVENT_CREATED,
                RESPONSE_KEY_STATUS, RESPONSE_STATUS_SUCCESS
        ));
    }

    /**
     * Met à jour un événement existant
     *
     * Sécurité :
     * - Nécessite authentification
     * - Seul le créateur peut modifier son événement
     */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> update(@PathVariable Integer id,
                                         @Valid @RequestPart("event") EventUpdateDTO inputs,
                                         @RequestPart(value = "image", required = false) MultipartFile image) {
        // Sauvegarde de la nouvelle image si fournie
        String imgUrl = (image != null) ? fileStorageService.saveImage(image) : null;

        // Mise à jour en base
        eventService.update(inputs, id, imgUrl);
        return ResponseEntity.ok(Map.of(
                RESPONSE_KEY_MESSAGE, MSG_EVENT_UPDATED,
                RESPONSE_KEY_STATUS, RESPONSE_STATUS_SUCCESS
        ));
    }

    /**
     * Supprime un événement
     *
     * Sécurité :
     * - Nécessite authentification
     * - Seul le créateur peut supprimer son événement
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Integer id) {
        eventService.delete(id);
        return ResponseEntity.ok(Map.of(
                RESPONSE_KEY_MESSAGE, MSG_EVENT_DELETED,
                RESPONSE_KEY_STATUS, RESPONSE_STATUS_SUCCESS
        ));
    }

    /**
     * Récupère tous les événements
     * Endpoint public, accessible sans authentification
     */
    @GetMapping()
    public List<EventViewDTO> getAllEvents() {
        return eventService.getAllEvents();
    }

    /**
     * Récupère les événements d'une catégorie spécifique
     * Utilisé pour le filtrage sur la page d'accueil
     */
    @GetMapping("/by-category/{categoryId}")
    public List<EventViewDTO> getEventsByCategory(@PathVariable Integer categoryId) {
        return eventService.getEventsByCategory(categoryId);
    }

    /**
     * Récupère les détails d'un événement spécifique
     * Utilisé pour la page de détails
     */
    @GetMapping("/{id}")
    public EventViewDTO getById(@PathVariable Integer id) {
        return eventService.getById(id);
    }

}