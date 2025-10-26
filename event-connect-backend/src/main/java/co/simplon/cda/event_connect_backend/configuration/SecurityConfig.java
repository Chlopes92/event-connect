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
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

@Configuration
public class SecurityConfig {
    @Value("${eventconnect.jwt.secret}")
    private String secret;

    @Value("${eventconnect.jwt.expiration}")
    private long expiration;

    @Bean
    PasswordEncoder encoder() {
        // Création d'une instance d'une librairie de Bcrypt
        // On peut alors utiliser une autre librairie de cryptage tout en utilisant la méthode encoder()
        // Possibilité de définir le nombre de tours pour générer le cryptage du pwd -> rester à 10, 12 max (puissance 10, puissance 12)
        return new BCryptPasswordEncoder();
    }

    @Bean
    JwtProvider jwtProvider() {
        com.auth0.jwt.algorithms.Algorithm algorithm = Algorithm.HMAC256(secret);
        return new JwtProvider(algorithm, expiration);
    }

    @Bean
    JwtDecoder jwtDecoder() {
        SecretKey secretKey = new SecretKeySpec(secret.getBytes(), "HMACSHA256");
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(secretKey)
                .macAlgorithm(MacAlgorithm.HS256).build();
        return decoder;
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http.cors(Customizer.withDefaults()).csrf((csrf) -> csrf.disable())
// Multiple matchers to map verbs + paths + authorizations
// "authorizations": anonymous, permit, deny and more...
// By configuration (filterChain), also by annotations...
                .authorizeHttpRequests((req) -> req
                        .requestMatchers(HttpMethod.POST, "/events", "/profiles", "/profiles/authenticate").anonymous()
                        .requestMatchers(HttpMethod.GET, "/events", "/categories").permitAll())
// Always last rule:
                .authorizeHttpRequests((reqs) -> reqs.anyRequest().authenticated())
                .oauth2ResourceServer((srv) -> srv.jwt(Customizer.withDefaults()))
// The build method builds the configured SecurityFilterChain
// with all the specified configuration
                .build();
    }
}
