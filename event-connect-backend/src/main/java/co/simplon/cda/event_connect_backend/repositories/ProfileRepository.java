package co.simplon.cda.event_connect_backend.repositories;

import co.simplon.cda.event_connect_backend.entities.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, Integer> {
    Profile findByEmail(String email);
    boolean existsByEmail(String email);
}
