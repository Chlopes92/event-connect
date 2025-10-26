package co.simplon.cda.event_connect_backend.dtos.profile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProfileCreateDTO (
        @Email
        @NotBlank
        @Size(max = 320)
        String email,

        @NotBlank
        @Size(max = 50)
        String firstName,

        @NotBlank
        @Size(max = 100)
        String lastName,

        @NotBlank
        @Size(min = 8, max = 72)
        String password,

        @NotBlank
        @Size(max = 20)
        String phone,

        @Size(max = 50)
        String organization,

        @NotNull
        Integer roleId) { }
