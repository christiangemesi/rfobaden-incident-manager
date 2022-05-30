package ch.rfobaden.incidentmanager.backend.errors;

/**
 * {@code UpdateConflictException} is thrown when trying to update an entity
 * which has already been changed by someone else since loading it.
 */
public final class UpdateConflictException extends RuntimeException {
    public UpdateConflictException(String message) {
        super(message);
    }
}
