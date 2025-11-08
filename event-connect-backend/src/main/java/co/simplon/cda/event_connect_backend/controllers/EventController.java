package co.simplon.cda.event_connect_backend.controllers;

import co.simplon.cda.event_connect_backend.dtos.event.EventCreateDTO;
import co.simplon.cda.event_connect_backend.dtos.event.EventUpdateDTO;
import co.simplon.cda.event_connect_backend.dtos.event.EventViewDTO;
import co.simplon.cda.event_connect_backend.services.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping()
    public ResponseEntity<String> create(@RequestBody EventCreateDTO inputs) {
        // try {
        System.out.println("Entrée de l'event: " + inputs);
        eventService.create(inputs);
        return ResponseEntity.ok("Event créée avec succès");
       /* } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la création de la ressource: " + e.getMessage());
        }*/
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable Integer id, @RequestBody EventUpdateDTO inputs) {
        eventService.update(inputs, id);
        return ResponseEntity.ok("Event mise à jour avec succès");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        eventService.delete(id);
        return ResponseEntity.ok("Event supprimée avec succès");
    }

    @GetMapping()
    public List<EventViewDTO> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/by-category/{categoryId}")
    public List<EventViewDTO> getEventsByCategory(@PathVariable Integer categoryId) {
        return eventService.getEventsByCategory(categoryId);
    }

    @GetMapping("/{id}")
    public EventViewDTO getById(@PathVariable Integer id) {
        return eventService.getById(id);
    }

}