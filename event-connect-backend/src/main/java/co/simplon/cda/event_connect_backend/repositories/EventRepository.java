package co.simplon.cda.event_connect_backend.repositories;

import co.simplon.cda.event_connect_backend.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Integer> {
    List<Event> findByCategoriesId(Integer categoryId);
}
