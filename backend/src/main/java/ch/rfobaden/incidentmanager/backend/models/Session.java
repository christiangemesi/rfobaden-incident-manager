package ch.rfobaden.incidentmanager.backend.models;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.Base64;
import java.util.Objects;
import java.util.Optional;

/**
 * Represents an active user session.
 *
 * @author Daniel von Atzigen
 */
public final class Session {
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
            var decodedToken = String.format("%s;%s", session.getUserId(), session.getCreatedAt());
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
        String[] parts = decodedToken.split(";");
        if (parts.length != 2) {
            return Optional.empty();
        }

        long userId;
        try {
            userId = Long.parseLong(parts[0]);
        } catch (NumberFormatException e) {
            return Optional.empty();
        }

        LocalDateTime createdAt;
        try {
            createdAt = LocalDateTime.parse(parts[1]);
        } catch (DateTimeParseException e) {
            return Optional.empty();
        }

        return Optional.of(new Session(userId, createdAt));
    }

    private final long userId;

    private final LocalDateTime createdAt;

    public Session(long userId) {
        this(userId, LocalDateTime.now());
    }

    public Session(long userId, LocalDateTime createdAt) {
        this.userId = userId;
        this.createdAt = createdAt;
    }

    public long getUserId() {
        return userId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    @Override
    public String toString() {
        return "Session{"
            + "userId=" + userId
            + ", createdAt=" + createdAt
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
        return userId == that.userId
            && Objects.equals(createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, createdAt);
    }
}
