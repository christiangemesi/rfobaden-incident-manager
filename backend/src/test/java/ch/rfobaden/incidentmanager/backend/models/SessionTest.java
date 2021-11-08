package ch.rfobaden.incidentmanager.backend.models;

import static org.assertj.core.api.Assertions.assertThat;

import ch.rfobaden.incidentmanager.backend.models.base.PojoTest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@SpringBootTest
public class SessionTest extends PojoTest<Session> {
    @Test
    public void testEncodeAndDecode() {
        // Given
        var session = generator.generate();

        // When
        var token = Session.encode(session);
        var decodedSession = Session.decode(token).orElse(null);

        // Then
        assertThat(token).isNotEmpty();
        assertThat(decodedSession).isEqualTo(session);
    }

    @Test
    public void testDecode_invalidToken() {
        // When
        var session = Session.decode("I'll fail all the time");

        // Then
        assertThat(session).isEqualTo(Optional.empty());
    }

    @Test
    public void testDecode_invalidTokenContent() {
        // Given
        var token = Base64.getEncoder()
            .encodeToString("Fake it till you make it".getBytes(StandardCharsets.UTF_8));

        // When
        var result = Session.decode(token);

        // Then
        assertThat(result).isEqualTo(Optional.empty());
    }

    @Test
    public void testDecode_invalidUserId() {
        // Given
        var decodedToken = "not user id;" + LocalDateTime.now();
        var token = Base64.getEncoder()
            .encodeToString(decodedToken.getBytes(StandardCharsets.UTF_8));

        // When
        var result = Session.decode(token);

        // Then
        assertThat(result).isEqualTo(Optional.empty());
    }

    @Test
    public void testDecode_invalidCreatedAt() {
        // Given
        var decodedToken = "1;not a date time";
        var token = Base64.getEncoder()
            .encodeToString(decodedToken.getBytes(StandardCharsets.UTF_8));

        // When
        var result = Session.decode(token);

        // Then
        assertThat(result).isEqualTo(Optional.empty());
    }
}
