package co.simplon.cda.event_connect_backend.configuration;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator.Builder;
import com.auth0.jwt.algorithms.Algorithm;

import java.time.Instant;
import java.util.List;

public class JwtProvider {

    private final Algorithm algorithm;

    private final long expiration;

    public JwtProvider(Algorithm algorithm, long expiration) {
        this.algorithm = algorithm;
        this.expiration = expiration;
    }

    public String create(String subject, List<String> roles) {
        Instant issuedAt = Instant.now();
        Builder builder = JWT.create()
                .withIssuedAt(issuedAt)
                .withSubject(subject)
                .withClaim("roles", roles);

        if (expiration > -1) {
            Instant expiresAt = issuedAt.plusSeconds(expiration);
            builder.withExpiresAt(expiresAt);
        }
        return builder.sign(algorithm);
    }

    public String verifyJwt(String token) {
        return JWT.decode(token).getSubject();
    }
}

