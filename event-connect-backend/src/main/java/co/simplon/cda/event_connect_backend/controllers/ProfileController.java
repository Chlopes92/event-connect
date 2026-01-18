package co.simplon.cda.event_connect_backend.controllers;

import co.simplon.cda.event_connect_backend.dtos.profile.ProfileAuthenticateDTO;
import co.simplon.cda.event_connect_backend.dtos.profile.ProfileCreateDTO;
import co.simplon.cda.event_connect_backend.services.ProfileService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/profiles")
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping
    public void create(@Valid @RequestBody ProfileCreateDTO dto) {
        profileService.create(dto);
    }

    @PostMapping("/authenticate")
    public String authenticate(@Valid @RequestBody ProfileAuthenticateDTO inputs) {
        return profileService.authenticate(inputs);
    }
}
