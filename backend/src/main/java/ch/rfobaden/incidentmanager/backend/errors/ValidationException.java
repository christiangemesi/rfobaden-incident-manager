package ch.rfobaden.incidentmanager.backend.errors;

import ch.rfobaden.incidentmanager.backend.utils.validation.Violations;

/**
 * {@code ValidationException} is caused by receiving an invalid entity
 * when a valid one was expected. It contains a nested {@link Violations} entity
 * detailing its invalid fields.
 */
public class ValidationException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    /**
     * The violations which caused this exception.
     */
    private final Violations violations;

    /**
     * Create a new {@code ValidationException}.
     *
     * @param violations The violations which caused this exception.
     */
    public ValidationException(Violations violations) {
        super("validation failed: " + violations);
        this.violations = violations;
    }

    public Violations getViolations() {
        return violations;
    }
}
