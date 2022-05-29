package ch.rfobaden.incidentmanager.backend.controllers.data;


import ch.rfobaden.incidentmanager.backend.models.User;

/**
 * {@code SessionData} contains the state of a user session.
 */
public final class SessionData {
    /**
     * The session user.
     */
    private final User user;

    /**
     * The session token.
     */
    private final String token;

    public SessionData(User user, String token) {
        this.user = user;
        this.token = token;
    }

    public User getUser() {
        return user;
    }

    public String getToken() {
        return token;
    }
}
