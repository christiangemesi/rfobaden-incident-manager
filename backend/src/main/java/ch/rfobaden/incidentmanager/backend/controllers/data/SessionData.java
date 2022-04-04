package ch.rfobaden.incidentmanager.backend.controllers.data;


import ch.rfobaden.incidentmanager.backend.models.User;

public final class SessionData {
    private final User user;

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
