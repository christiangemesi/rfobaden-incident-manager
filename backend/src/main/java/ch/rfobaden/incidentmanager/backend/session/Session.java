package ch.rfobaden.incidentmanager.backend.session;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Optional;

public final class Session {
    public static String encode(Session session) {
        try {
            var decodedToken = Long.toString(session.getUserId());
            return Base64.getEncoder().encodeToString(decodedToken.getBytes(StandardCharsets.UTF_8.toString()));
        } catch (UnsupportedEncodingException e) {
            throw new IllegalStateException("failed to base64 encode session", e);
        }
    }

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

    private final long userId;

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
}
