package ch.rfobaden.incidentmanager.backend.controllers.helpers;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.catchThrowable;

import ch.rfobaden.incidentmanager.backend.RfoConfig;
import ch.rfobaden.incidentmanager.backend.TestConfig;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import ch.rfobaden.incidentmanager.backend.test.generators.UserGenerator;
import com.github.javafaker.Faker;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;

@SpringBootTest
@Import(TestConfig.class)
class JwtHelperTest {
    @MockBean
    UserService userService;

    @Autowired
    JwtHelper jwtHelper;

    @Autowired
    UserGenerator userGenerator;

    @Autowired
    Faker faker;

    @Test
    void testEncode() {
        // When
        var result = jwtHelper.encode((jwt) -> {});

        // Then
        assertThat(result).isNotBlank();
    }

    @Test
    void testDecode() {
        // Given
        var token = jwtHelper.encode((jwt) -> {});

        // When
        var result = jwtHelper.decode(token).orElse(null);

        // Then
        assertThat(result).isNotNull();
    }

    @Test
    void testDecode_nullToken() {
        // When
        var result = jwtHelper.decode(null).orElse(null);

        // Then
        assertThat(result).isNull();
    }

    @Test
    void testDecode_emptyToken() {
        // When
        var result = jwtHelper.decode("").orElse(null);

        // Then
        assertThat(result).isNull();
    }

    @Test
    void testDecode_blankToken() {
        // Given
        var token = " ".repeat(10);

        // When
        var result = jwtHelper.decode(token).orElse(null);

        // Then
        assertThat(result).isNull();
    }

    @Test
    void testDecode_malformedToken() {
        // Given
        var token = faker.beer().name();

        // When
        var result = jwtHelper.decode(token).orElse(null);

        // Then
        assertThat(result).isNull();
    }

    @Test
    void testDecode_invalidToken() {
        // Given
        var token = String.format(
            "%s.%s.%s", faker.beer().name(), faker.beer().name(), faker.beer().name()
        );

        // When
        var result = jwtHelper.decode(token).orElse(null);

        // Then
        assertThat(result).isNull();
    }

    @Test
    void testDecode_expiredToken() {
        // Given
        var token = jwtHelper.encode((jwt) -> jwt
            .setExpiration(new Date(System.currentTimeMillis() - 10))
        );

        // When
        var result = jwtHelper.decode(token).orElse(null);

        // Then
        assertThat(result).isNull();
    }

    @Test
    void testDecode_differentSignature() {
        // Given
        var token = Jwts.builder().signWith(Keys.secretKeyFor(SignatureAlgorithm.HS256)).compact();

        // When
        var result = jwtHelper.decode(token).orElse(null);

        // Then
        assertThat(result).isNull();
    }

    @Test
    void testDecode_unsignedJwt() {
        // Given
        var token = Jwts.builder().compact();

        // When
        var result = jwtHelper.decode(token).orElse(null);

        // Then
        assertThat(result).isNull();
    }

    @Test
    void testEncodeUser() {
        // Given
        var user = userGenerator.generate();

        // When
        var result = jwtHelper.encodeUser(user);

        // Then
        assertThat(result).isNotBlank();
    }

    @Test
    void testDecodeUser() {
        // Given
        var user = userGenerator.generate();
        var token = jwtHelper.encodeUser(user);
        Mockito.when(userService.find(user.getId()))
            .thenReturn(Optional.of(user));

        // When
        var result = jwtHelper.decodeUser(token).orElse(null);

        // Then
        assertThat(result).isEqualTo(user);
    }

    @Test
    void testDecodeUser_expiredToken() {
        // Given
        var token = jwtHelper.encode((jwt) -> jwt.setExpiration(new Date()));

        // When
        var result = jwtHelper.decodeUser(token).orElse(null);

        // Then
        assertThat(result).isNull();
    }

    @Test
    void testDecodeUser_invalidId() {
        // Given
        var token = jwtHelper.encode((jwt) -> jwt.setSubject(faker.beer().name()));

        // When
        var result = jwtHelper.decodeUser(token).orElse(null);

        // Then
        assertThat(result).isNull();
    }

    @Test
    void testDecodeUser_unknownUser() {
        // Given
        var user = userGenerator.generate();
        var token = jwtHelper.encodeUser(user);
        Mockito.when(userService.find(user.getId()))
            .thenReturn(Optional.empty());

        // When
        var result = jwtHelper.decodeUser(token).orElse(null);

        // Then
        assertThat(result).isNull();
    }

    @Test
    void testDecodeUser_afterPasswordChange() {
        // Given
        var user = userGenerator.generate();
        var token = jwtHelper.encodeUser(user);
        user.getCredentials().setLastPasswordChangeAt(LocalDateTime.now().plusDays(1));
        Mockito.when(userService.find(user.getId()))
            .thenReturn(Optional.of(user));

        // When
        var result = jwtHelper.decodeUser(token).orElse(null);

        // Then
        assertThat(result).isNull();
    }

    @Test
    void testNew_weakKey() {
        // Given
        var secret = faker.leagueOfLegends().champion();
        var rfoConfig = new RfoConfig(null, new RfoConfig.Jwt(secret));

        // When
        var result = catchThrowable(() -> new JwtHelper(rfoConfig, userService));

        // Then
        assertThat(result)
            .isInstanceOf(IllegalStateException.class)
            .hasMessage("jwt.secret is too weak");
    }
}
