package ch.rfobaden.incidentmanager.backend.errors;

import ch.rfobaden.incidentmanager.backend.utils.validation.Violations;

public class ValidationException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    private final Violations violations;

    public ValidationException(Violations violations) {
        super("validation failed");
        this.violations = violations;
    }

    public Violations getViolations() {
        return violations;
    }
}
