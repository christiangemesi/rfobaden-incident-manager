package ch.rfobaden.incidentmanager.backend.errors;

public final class MailException extends RuntimeException {

    public MailException(String message) {
        super(message);
    }
}
