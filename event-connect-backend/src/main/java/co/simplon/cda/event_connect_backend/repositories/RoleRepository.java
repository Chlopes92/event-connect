package co.simplon.cda.event_connect_backend.repositories;

import co.simplon.cda.event_connect_backend.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Integer> {
}
