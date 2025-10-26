package co.simplon.cda.event_connect_backend.services;

import co.simplon.cda.event_connect_backend.configuration.JwtProvider;
import co.simplon.cda.event_connect_backend.dtos.profile.ProfileAuthenticateDTO;
import co.simplon.cda.event_connect_backend.dtos.profile.ProfileCreateDTO;
import co.simplon.cda.event_connect_backend.dtos.profile.ProfileViewDTO;
import co.simplon.cda.event_connect_backend.dtos.role.RoleDTO;
import co.simplon.cda.event_connect_backend.entities.Profile;
import co.simplon.cda.event_connect_backend.repositories.ProfileRepository;
import co.simplon.cda.event_connect_backend.repositories.RoleRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public ProfileService(ProfileRepository profileRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, JwtProvider jwtProvider) {
        this.profileRepository = profileRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
    }

    public void create(ProfileCreateDTO inputs) {
        Profile profile = new Profile();
        profile.setLastName(inputs.lastName());
        profile.setFirstName(inputs.firstName());
        profile.setEmail(inputs.email());
        String rawPassword = inputs.password();
        String encodedPassword = passwordEncoder.encode(rawPassword);
        profile.setPassword(encodedPassword);
        profile.setPhone(inputs.phone());
        profile.setOrganization(inputs.organization());

        var role = roleRepository.findById(inputs.roleId())
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + inputs.roleId()));
        profile.setRole(role);

        profileRepository.save(profile);
    }

    public List<ProfileViewDTO> getAllProfiles() {
        return profileRepository.findAll().stream()
                .map(profile -> new ProfileViewDTO(
                        profile.getId(),
                        profile.getEmail(),
                        profile.getFirstName(),
                        profile.getLastName(),
                        profile.getPhone(),
                        profile.getOrganization(),
                        new RoleDTO(profile.getRole().getId(), profile.getRole().getName())
                ))
                .collect(Collectors.toList());
    }

    public Object authenticate(ProfileAuthenticateDTO inputs) {
        // 1. Find account : Exists or not
        String email = inputs.email();
        Profile profile = profileRepository.findByEmail(email);
        String token = null;
        if (profile == null) {
            throw new BadCredentialsException(email);
        } else { // account found
            // 2. Same password?
            String encodedPassword = profile.getPassword();
            String rawPassword = inputs.password();
            if (!passwordEncoder.matches(rawPassword, encodedPassword)) { // not same
                throw new BadCredentialsException(rawPassword);
            } else { // same
                // 3. Create and Return JWT token
                token = jwtProvider.create(email);
                System.out.println(jwtProvider.verifyJwt(token));
            }
        }
        return token;
    }
}
