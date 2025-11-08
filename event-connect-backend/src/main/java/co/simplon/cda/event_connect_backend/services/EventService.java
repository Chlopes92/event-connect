package co.simplon.cda.event_connect_backend.services;

import co.simplon.cda.event_connect_backend.dtos.category.CategoryDTO;
import co.simplon.cda.event_connect_backend.dtos.event.EventCreateDTO;
import co.simplon.cda.event_connect_backend.dtos.event.EventUpdateDTO;
import co.simplon.cda.event_connect_backend.dtos.event.EventViewDTO;
import co.simplon.cda.event_connect_backend.entities.Category;
import co.simplon.cda.event_connect_backend.entities.Event;
import co.simplon.cda.event_connect_backend.repositories.CategoryRepository;
import co.simplon.cda.event_connect_backend.repositories.EventRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;

    public EventService(EventRepository eventRepository, CategoryRepository categoryRepository) {
        this.eventRepository = eventRepository;
        this.categoryRepository = categoryRepository;
    }

    public void create(EventCreateDTO inputs) {
        Event event = new Event();
        event.setNameEvent(inputs.nameEvent());
        event.setImgUrl(inputs.imgUrl());
        event.setDescription(inputs.description());
        event.setDateEvent(inputs.dateEvent());
        event.setProgram(inputs.program());
        event.setContact(inputs.contact());
        event.setPrice(inputs.price());
        event.setNumberPlace(inputs.numberPlace());
        event.setAddress(inputs.address());

        List<Category> categories = new ArrayList<>();
        if (inputs.categoryIds() != null) {
            categories = categoryRepository.findAllById(inputs.categoryIds());
        }
        event.setCategories(categories);
        eventRepository.save(event);
    }

    public void update(EventUpdateDTO inputs, Integer id) {
        Event event = eventRepository.findById(id).orElseThrow();
        event.setNameEvent(inputs.nameEvent());
        event.setImgUrl(inputs.imgUrl());
        event.setDescription(inputs.description());
        event.setDateEvent(inputs.dateEvent());
        event.setProgram(inputs.program());
        event.setContact(inputs.contact());
        event.setPrice(inputs.price());
        event.setNumberPlace(inputs.numberPlace());
        event.setAddress(inputs.address());

        if (inputs.categoryIds() != null && !inputs.categoryIds().isEmpty()) {
            List<Category> categories = categoryRepository.findAllById(inputs.categoryIds());
            if (categories.isEmpty()) {
                throw new RuntimeException("Aucune catégorie trouvée");
            }
            event.setCategories(categories);
        }

        eventRepository.save(event);
    }

    public void delete(Integer id) {
        eventRepository.deleteById(id);
    }

    public List<EventViewDTO> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        List<EventViewDTO> result = new ArrayList<>();
        for (Event event : events) {
            List<CategoryDTO> categoryDTOs = new ArrayList<>();
            if (event.getCategories() != null) {
                for (Category category : event.getCategories()) {
                    categoryDTOs.add(new CategoryDTO(category.getId(), category.getNameCategory()));
                }
            }
            result.add(new EventViewDTO(
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
            ));
        }
        return result;
    }

    public List<EventViewDTO> getEventsByCategory(Integer categoryId) {
        List<Event> events = eventRepository.findByCategoriesId(categoryId);
        List<EventViewDTO> result = new ArrayList<>();
        for (Event event : events) {
            List<CategoryDTO> categoryDTOs = new ArrayList<>();
            if (event.getCategories() != null) {
                for (Category category : event.getCategories()) {
                    categoryDTOs.add(new CategoryDTO(category.getId(), category.getNameCategory()));
                }
            }
            result.add(new EventViewDTO(
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
            ));
        }
        return result;
    }

    public EventViewDTO getById(Integer id) {
        Event event = eventRepository.findById(id).orElseThrow();

        List<CategoryDTO> categoryDTOs = new ArrayList<>();
        if (event.getCategories() != null) {
            for (Category category : event.getCategories()) {
                categoryDTOs.add(new CategoryDTO(category.getId(), category.getNameCategory()));
            }
        }

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
