package ch.rfobaden.incidentmanager.backend.session;

import static org.assertj.core.api.Assertions.assertThat;

import ch.rfobaden.incidentmanager.backend.entities.Session;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Optional;

/**
 * Tests for {@link Session}.
 *
 * @author Daniel von Atzigen
 */
public class SessionTest {

    /**
     * Test for {@link Session#encode(Session)} and {@link Session#decode(String)}.
     */
    @ParameterizedTest()
    @MethodSource("getValidIds")
    public void testEncodeAndDecode(long id) {
        var session = new Session(id);
        var token = Session.encode(session);

        assertThat(token).isNotEmpty();

        var decodedSession = Session.decode(token).orElse(null);
        assertThat(decodedSession).isEqualTo(session);
    }

    /**
     * Test {@link Session#decode(String)} with an invalid token.
     */
    @Test
    public void testDecodeInvalidToken() {
        var session = Session.decode("I'll fail all the time");
        assertThat(session).isEqualTo(Optional.empty());
    }

    /**
     * Test {@link Session#decode(String)} with a token not containing a valid id.
     */
    @Test
    public void testDecodeInvalidTokenContent() {
        var token = Base64.getEncoder()
            .encodeToString("Fake it till you make it".getBytes(StandardCharsets.UTF_8));
        var session = Session.decode(token);
        assertThat(session).isEqualTo(Optional.empty());
    }

    private static long[] getValidIds() {
        return new long[] { 0, 1, 42, -10, Long.MAX_VALUE, Long.MIN_VALUE };
    }
}
