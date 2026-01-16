package co.simplon.cda.event_connect_backend.configuration;

import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

/**
 * Configuration de la sécurité Spring Security avec JWT
 * Gère l'authentification, l'autorisation et le hashage/cryptage des mots de passe
 */
@Configuration
public class SecurityConfig {
    // Définir des constantes pour les endpoints
    private static final String EVENTS_BASE_PATH = "/events";
    private static final String EVENTS_PATH = "/events/**";
    private static final String CATEGORIES_PATH = "/categories";
    private static final String UPLOAD_IMAGES_PATH = "/upload/images/**";
    private static final String PROFILES_BASE_PATH = "/profiles";
    private static final String PROFILES_AUTH_PATH = "/profiles/authenticate";

    // Injection des propriétés depuis application.properties
    @Value("${eventconnect.jwt.secret}")
    private String secret;
    @Value("${eventconnect.jwt.expiration}")
    private long expiration;

    /**
     * Bean pour le cryptage des mots de passe avec BCrypt
     * BCrypt utilise un "salt" aléatoire pour chaque hash
     * Par défaut 10 tours -> offre un bon compromis sécurité/performance
     */
    @Bean
    PasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Bean pour la création et validation des tokens JWT
     * Utilise l'algorithme HMAC256 avec la clé secrète
     */
    @Bean
    JwtProvider jwtProvider() {
        Algorithm algorithm = Algorithm.HMAC256(secret);
        return new JwtProvider(algorithm, expiration);
    }

    /**
     * Bean pour décoder et valider les tokens JWT entrants
     * Utilisé par Spring Security pour authentifier les requêtes
     */
    @Bean
    JwtDecoder jwtDecoder() {
        SecretKey secretKey = new SecretKeySpec(secret.getBytes(), "HMACSHA256");
        return NimbusJwtDecoder.withSecretKey(secretKey)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
    }

    /**
     * Convertit les claims JWT en autorités Spring Security
     * Extrait le claim "roles" sans préfixe (car on ajoute déjà ROLE_ dans le token)
     */
    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthoritiesClaimName("roles");
        grantedAuthoritiesConverter.setAuthorityPrefix(""); // Pas de préfixe car on met déjà ROLE_ dans le token

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }


    /**
     * Configuration principale de la chaîne de filtres de sécurité
     * Définit les règles d'autorisation pour chaque endpoint
     *
     * Architecture de sécurité :
     * - Routes publiques (GET) : événements, catégories, images
     * - Routes anonymes (POST) : inscription, connexion
     * - Routes protégées : création/modification/suppression d'événements
     */
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // Activativation des CORS, désativation CSRF (non nécessaire)
        return http.cors(Customizer.withDefaults()).csrf(csrf -> csrf.disable())
                // Configuration des autorisations par endpoint
                .authorizeHttpRequests(req -> req
                        // Routes publiques (GET uniquement)
                        .requestMatchers(HttpMethod.GET, EVENTS_BASE_PATH, EVENTS_PATH, CATEGORIES_PATH, UPLOAD_IMAGES_PATH).permitAll()
                        // Routes d'inscription/connexion (anonymous only)
                        .requestMatchers(HttpMethod.POST, PROFILES_BASE_PATH, PROFILES_AUTH_PATH).anonymous()
                        // Routes protégées pour les events (nécessite authentification)
                        .requestMatchers(HttpMethod.POST, EVENTS_BASE_PATH).authenticated()
                        .requestMatchers(HttpMethod.PUT, EVENTS_PATH).authenticated()
                        .requestMatchers(HttpMethod.DELETE, EVENTS_PATH).authenticated()
                        // Toutes les autres routes nécessitent une authentification
                        .anyRequest().authenticated())
                // Active l'authentification OAuth2 Resource Server avec JWT
                .oauth2ResourceServer(srv -> srv.jwt(Customizer.withDefaults()))
                .build();
    }
}
