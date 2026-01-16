package co.simplon.cda.event_connect_backend.service;

import co.simplon.cda.event_connect_backend.dtos.role.RoleDTO;
import co.simplon.cda.event_connect_backend.entities.Role;
import co.simplon.cda.event_connect_backend.repositories.RoleRepository;
import co.simplon.cda.event_connect_backend.services.RoleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

/**
 * Tests unitaires pour RoleService
 *
 * Service simple qui retourne tous les rôles
 * Tests : cas nominal + liste vide
 */
@ExtendWith(MockitoExtension.class)
class RoleServiceTest {

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private RoleService roleService;

    private Role roleUser;
    private Role roleAdmin;

    @BeforeEach
    void setUp() {
        roleUser = new Role();
        roleUser.setId(1);
        roleUser.setName("ROLE_USER");

        roleAdmin = new Role();
        roleAdmin.setId(2);
        roleAdmin.setName("ROLE_ADMIN");
    }

    /**
     * TEST 1 : getAllRoles() - Cas nominal
     * Vérifie que tous les rôles sont retournés
     */
    @Test
    void getAllRoles_ShouldReturnAllRoles() {
        // GIVEN
        List<Role> roles = Arrays.asList(roleUser, roleAdmin);
        when(roleRepository.findAll()).thenReturn(roles);

        // WHEN
        List<RoleDTO> result = roleService.getAllRoles();

        // THEN
        assertThat(result).isNotNull();
        assertThat(result).hasSize(2);

        assertThat(result.get(0).id()).isEqualTo(1);
        assertThat(result.get(0).name()).isEqualTo("ROLE_USER");  // ✅ name() pas role()

        assertThat(result.get(1).id()).isEqualTo(2);
        assertThat(result.get(1).name()).isEqualTo("ROLE_ADMIN");  // ✅ name() pas role()

        verify(roleRepository, times(1)).findAll();
    }

    /**
     * TEST 2 : getAllRoles() - Liste vide
     * Vérifie que le service gère correctement une BDD sans rôles
     */
    @Test
    void getAllRoles_WhenNoRoles_ShouldReturnEmptyList() {
        // GIVEN
        when(roleRepository.findAll()).thenReturn(List.of());

        // WHEN
        List<RoleDTO> result = roleService.getAllRoles();

        // THEN
        assertThat(result).isNotNull();
        assertThat(result).isEmpty();

        verify(roleRepository, times(1)).findAll();
    }

    /**
     * TEST 3 : getAllRoles() - Un seul rôle
     */
    @Test
    void getAllRoles_WithSingleRole_ShouldReturnSingleElement() {
        // GIVEN
        when(roleRepository.findAll()).thenReturn(List.of(roleUser));

        // WHEN
        List<RoleDTO> result = roleService.getAllRoles();

        // THEN
        assertThat(result).hasSize(1);
        assertThat(result.get(0).name()).isEqualTo("ROLE_USER");  // ✅ name() pas role()

        verify(roleRepository, times(1)).findAll();
    }
}