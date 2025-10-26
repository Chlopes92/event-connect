package co.simplon.cda.event_connect_backend.controllers;

import co.simplon.cda.event_connect_backend.dtos.profile.ProfileAuthenticateDTO;
import co.simplon.cda.event_connect_backend.dtos.profile.ProfileCreateDTO;
import co.simplon.cda.event_connect_backend.dtos.profile.ProfileViewDTO;
import co.simplon.cda.event_connect_backend.services.ProfileService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    Object authenticate(@Valid @RequestBody ProfileAuthenticateDTO inputs) {
        return profileService.authenticate(inputs);
    }

    /*@GetMapping
    public List<ProfileViewDTO> getAll() {
        return profileService.getAllProfiles();
    }*/
}
