package ch.rfobaden.incidentmanager.backend.controllers.helpers;

import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.DecodingException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import io.jsonwebtoken.security.WeakKeyException;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;

@Component
@EnableConfigurationProperties(JwtHelper.Props.class)
public class JwtHelper {
    private static final long EXPIRATION_MILLIS = TimeUnit.DAYS.toMillis(30);

    private final Key secretKey;

    private final JwtParser jwtParser;

    private final UserService userService;

    public JwtHelper(Props props, UserService userService) {
        this.secretKey = parseKey(props.getSecret());
        this.userService = userService;
        this.jwtParser = Jwts.parserBuilder().setSigningKey(secretKey).build();
    }

    public String encodeUser(User user) {
        return encode((jwt) -> jwt
            .setSubject(user.getId().toString())
        );
    }

    public Optional<User> decodeUser(String token) {
        var jwt = decode(token).orElse(null);
        if (jwt == null) {
            return Optional.empty();
        }
        var body = jwt.getBody();

        long userId;
        try {
            userId = Long.parseLong(body.getSubject());
        } catch (NumberFormatException e) {
            return Optional.empty();
        }

        var user = userService.find(userId).orElse(null);
        if (user == null) {
            return Optional.empty();
        }

        var issuedAt = body.getIssuedAt().toInstant()
            .atZone(ZoneId.systemDefault())
            .toLocalDateTime();

        // Invalidate the token if the password has been changed since the tokens' creation.
        if (user.getCredentials().getLastPasswordChangeAt().isAfter(issuedAt)) {
            return Optional.empty();
        }

        return Optional.of(user);
    }

    public String encode(Consumer<JwtBuilder> build) {
        var builder = Jwts.builder()
            // Add 1 second to issuedAt.
            // This is done because our application uses java.time, which includes nanoseconds.
            // This means that some dates are incorrectly compared to this timestamp if they
            // were created within less than one second after this.
            // We can correct this by adding just one second.
            .setIssuedAt(new Date(System.currentTimeMillis() + 1_000))
            .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MILLIS));
        build.accept(builder);
        return builder.signWith(secretKey).compact();
    }

    public Optional<Jws<Claims>> decode(String token) {
        try {
            return Optional.of(jwtParser.parseClaimsJws(token));
        } catch (UnsupportedJwtException e) {
            return Optional.empty();
        } catch (MalformedJwtException e) {
            return Optional.empty();
        } catch (ExpiredJwtException e) {
            return Optional.empty();
        } catch (SignatureException e) {
            return Optional.empty();
        } catch (DecodingException e) {
            return Optional.empty();
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    private static Key parseKey(String jwtSecret) {
        try {
            return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        } catch (WeakKeyException e) {
            throw new IllegalStateException("jwt.secret is too weak", e);
        }
    }

    @ConfigurationProperties("jwt")
    public static class Props {
        private String secret;

        public String getSecret() {
            return secret;
        }

        public void setSecret(String secret) {
            this.secret = secret;
        }

    }
}
