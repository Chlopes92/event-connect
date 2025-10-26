package co.simplon.cda.event_connect_backend.dtos.profile;

import co.simplon.cda.event_connect_backend.dtos.role.RoleDTO;

public record ProfileViewDTO(
        Integer id,
        String email,
        String firstName,
        String lastName,
        String phone,
        String organization,
        RoleDTO role
) { }
