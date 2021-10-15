package ch.rfobaden.incidentmanager.backend.session;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Objects;
import java.util.Optional;

/**
 * Represents an active user session.
 *
 * @author Daniel von Atzigen
 */
public final class Session {
    private final long userId;

    /**
     * Encode a {@code Session} instance into a plain string.
     *
     * @param session the {@code Session} to be encoded.
     * @return a string representing the encoded {@code session}.
     *
     * @see #decode(String)
     */
    public static String encode(Session session) {
        try {
            var decodedToken = Long.toString(session.getUserId());
            var decodedBytes = decodedToken.getBytes(StandardCharsets.UTF_8.toString());
            return Base64.getEncoder().encodeToString(decodedBytes);
        } catch (UnsupportedEncodingException e) {
            throw new IllegalStateException("failed to base64 encode session", e);
        }
    }

    /**
     * Attempts to decode a string into a {@code Session} instance.
     *
     * @param token the encoded string token.
     * @return an {@link Optional} containing the decoded {@code Session},
     *         or {@code null} if decoding was not successful.
     *
     * @see #encode(Session)
     */
    public static Optional<Session> decode(String token) {
        String decodedToken;
        try {
            decodedToken = new String(Base64.getDecoder().decode(token));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
        long userId;
        try {
            userId = Long.parseLong(decodedToken);
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
        return Optional.of(new Session(userId));
    }

    public Session(long userId) {
        this.userId = userId;
    }

    public long getUserId() {
        return userId;
    }

    @Override
    public String toString() {
        return "Session{"
            + "userId=" + userId
            + '}';
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof Session)) {
            return false;
        }
        var that = (Session) other;
        return userId == that.userId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId);
    }
}
