package co.simplon.cda.event_connect_backend.controllers;

import co.simplon.cda.event_connect_backend.dtos.EventDTO;
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
    public ResponseEntity<String> create(@RequestBody EventDTO inputs) {
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
    void update(@PathVariable Integer id, @RequestBody EventDTO inputs) {
        System.out.println("ResourceController");
        System.out.println(inputs);
        eventService.update(inputs, id);
    }

    @DeleteMapping("/{id}")
    void delete(@PathVariable Integer id) {
        eventService.delete(id);
    }

    @GetMapping()
    public List<EventDTO> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/by-category/{categoryId}")
    public List<EventDTO> getEventsByCategory(@PathVariable Integer categoryId) {
        return eventService.getEventsByCategory(categoryId);
    }

}