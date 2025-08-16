package co.simplon.cda.event_connect_backend.services;

import co.simplon.cda.event_connect_backend.dtos.CategoryDTO;
import co.simplon.cda.event_connect_backend.dtos.EventDTO;
import co.simplon.cda.event_connect_backend.entities.Category;
import co.simplon.cda.event_connect_backend.entities.Event;
import co.simplon.cda.event_connect_backend.repositories.CategoryRepository;
import co.simplon.cda.event_connect_backend.repositories.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;

    public EventService(EventRepository eventRepository, CategoryRepository categoryRepository) {
        this.eventRepository = eventRepository;
        this.categoryRepository = categoryRepository;
    }

    public void create(EventDTO inputs) {
        Event event = new Event();
        event.setNameEvent(inputs.nameEvent());
        event.setImgUrl(inputs.imgUrl());
        event.setDescription(inputs.description());
        event.setDateEvent(inputs.dateEvent());
        event.setProgram(inputs.program());
        event.setContact(inputs.contact());
        event.setPrice(inputs.price());
        event.setNumberPlace(inputs.numberPlace());
        event.setAdress(inputs.adress());

        if (inputs.categoryId() != null) {
            Category category = categoryRepository.findById(inputs.categoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            event.setCategory(category);
        }

        eventRepository.save(event);
    }

    public void update(EventDTO inputs, Integer id) {
        Event event = eventRepository.findById(id).orElseThrow();
        event.setNameEvent(inputs.nameEvent());
        event.setImgUrl(inputs.imgUrl());
        event.setDescription(inputs.description());
        event.setDateEvent(inputs.dateEvent());
        event.setProgram(inputs.program());
        event.setContact(inputs.contact());
        event.setPrice(inputs.price());
        event.setNumberPlace(inputs.numberPlace());
        event.setAdress(inputs.adress());

        if (inputs.categoryId() != null) {
            Category category = categoryRepository.findById(inputs.categoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            event.setCategory(category);
        }

        eventRepository.save(event);
    }

    public void delete(Integer id) {

        eventRepository.deleteById(id);
    }

    public List<EventDTO> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(event -> new EventDTO(
                        event.getId(),
                        event.getNameEvent(),
                        event.getImgUrl(),
                        event.getDescription(),
                        event.getDateEvent(),
                        event.getProgram(),
                        event.getContact(),
                        event.getPrice(),
                        event.getNumberPlace(),
                        event.getAdress(),
                        event.getCategory() != null ? event.getCategory().getId() : null,
                        event.getCategory() != null ? new CategoryDTO(event.getCategory().getId(), event.getCategory().getNameCategory()) : null
                ))
                .collect(Collectors.toList());
    }

    public List<EventDTO> getEventsByCategory(Integer categoryId) {
        return eventRepository.findByCategoryId(categoryId).stream()
                .map(event -> new EventDTO(
                        event.getId(),
                        event.getNameEvent(),
                        event.getImgUrl(),
                        event.getDescription(),
                        event.getDateEvent(),
                        event.getProgram(),
                        event.getContact(),
                        event.getPrice(),
                        event.getNumberPlace(),
                        event.getAdress(),
                        event.getCategory().getId(),
                        new CategoryDTO(event.getCategory().getId(), event.getCategory().getNameCategory())
                ))
                .collect(Collectors.toList());
    }


}
