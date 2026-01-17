package co.simplon.cda.event_connect_backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Test d'intégration vérifiant que le contexte Spring démarre correctement
 * Utilise H2 en mémoire au lieu de PostgreSQL
 */
@SpringBootTest
@ActiveProfiles("test")  // ✅ Active le profil "test"
class EventConnectBackendApplicationTests {
	@Autowired
	private ApplicationContext applicationContext;

	@Test
	void contextLoads() {
		// Vérifie que le contexte Spring a bien démarré
		assertThat(applicationContext).isNotNull();
	}
	@Test
	void allRepositoriesAreLoaded() {
		// Vérifie que les repositories sont bien chargés
		assertThat(applicationContext.containsBean("eventRepository")).isTrue();
		assertThat(applicationContext.containsBean("profileRepository")).isTrue();
		assertThat(applicationContext.containsBean("categoryRepository")).isTrue();
		assertThat(applicationContext.containsBean("roleRepository")).isTrue();
	}

	@Test
	void allServicesAreLoaded() {
		// Vérifie que les services sont bien chargés
		assertThat(applicationContext.containsBean("eventService")).isTrue();
		assertThat(applicationContext.containsBean("profileService")).isTrue();
		assertThat(applicationContext.containsBean("fileStorageService")).isTrue();
	}
}
