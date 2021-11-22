package ch.rfobaden.incidentmanager.backend.errors;

public final class UpdateConflictException extends RuntimeException {
    public UpdateConflictException(String message) {
        super(message);
    }
}
