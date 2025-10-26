package co.simplon.cda.event_connect_backend.services;

import co.simplon.cda.event_connect_backend.dtos.role.RoleDTO;
import co.simplon.cda.event_connect_backend.entities.Role;
import co.simplon.cda.event_connect_backend.repositories.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleService {
    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public List<RoleDTO> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        return roles.stream()
                .map(role -> new RoleDTO(role.getId(), role.getName()))
                .collect(Collectors.toList());
    }
}
