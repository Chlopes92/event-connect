package co.simplon.cda.event_connect_backend.integration;

import co.simplon.cda.event_connect_backend.repositories.EventRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Test d'intégration simple
 * Objectif : vérifier que l’API permet de récupérer la liste des événements
 */

@SpringBootTest
@AutoConfigureMockMvc // Permet de simuler des appels HTTP
@ActiveProfiles("test") // Utilise la configuration de test
public class EventIT {

    @Autowired
    private MockMvc mockMvc; // Permet de simuler les requêtes HTTP vers l’API
    @Autowired
    private EventRepository eventRepository;  // Accès direct à la base pour vérification

    @Test
    void shouldGetAllEvents() throws Exception {
        // GIVEN : aucune préparation spécifique
        // On teste un endpoint public

        // WHEN : appel HTTP GET sur /events
        mockMvc.perform(get("/events")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        // THEN : vérification que la couche données répond correctement
        assertThat(eventRepository.findAll()).isNotNull();
    }
}
