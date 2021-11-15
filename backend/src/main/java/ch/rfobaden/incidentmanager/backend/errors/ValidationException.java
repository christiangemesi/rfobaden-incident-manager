package ch.rfobaden.incidentmanager.backend.errors;

import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;

public class ValidationException extends RuntimeException {
    private final ModelRepositoryService.Violations violations;

    public ValidationException(ModelRepositoryService.Violations violations) {
        super("validation failed");
        this.violations = violations;
    }

    public ModelRepositoryService.Violations getViolations() {
        return violations;
    }
}
