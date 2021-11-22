package ch.rfobaden.incidentmanager.backend.utils.validation;

import ch.rfobaden.incidentmanager.backend.errors.ValidationException;
import org.springframework.stereotype.Component;

import java.util.function.BiConsumer;
import javax.validation.Validator;

@Component
public final class ValidationUtils {
    private final Validator validator;

    public ValidationUtils(Validator validator) {
        this.validator = validator;
    }


    public <T> void validate(T value) {
        this.validate(value, (v, vs) -> {});
    }

    public <T> void validate(T value, BiConsumer<T, Violations> compute) {
        var violations = new Violations();

        validator.validate(value).forEach((violation) -> {
            Violations nestedViolations = violations;
            String lastField = null;
            for (var field : violation.getPropertyPath()) {
                if (lastField != null) {
                    nestedViolations = nestedViolations.nested(lastField);
                }
                lastField = field.getName();
            }
            if (lastField == null) {
                throw new IllegalStateException("violation property path was empty");
            }
            nestedViolations.add(lastField, violation.getMessage());
        });

        compute.accept(value, violations);

        if (!violations.isEmpty()) {
            throw new ValidationException(violations);
        }
    }
}
