package ch.rfobaden.incidentmanager.backend.utils.validation;

import ch.rfobaden.incidentmanager.backend.errors.ValidationException;
import org.springframework.stereotype.Component;

import java.util.function.BiConsumer;
import javax.validation.Validator;

/**
 * {@code ValidationUtils} allows for simple in-place validations of any possible value.
 */
@Component
public final class ValidationUtils {
    /**
     * The validator used to validate values.
     */
    private final Validator validator;

    public ValidationUtils(Validator validator) {
        this.validator = validator;
    }

    /**
     * Validates a value using only the validations configured directly on it.
     *
     * @param value The value to validate.
     * @param <T> The type of {@code value}.
     *
     * @throws ValidationException If the validation fails.
     */
    public <T> void validate(T value) {
        this.validate(value, (v, vs) -> {});
    }

    /**
     * Validates a value, and allows manipulation of the resulting {@link Violations} instance.
     *
     * @param value The value to validate.
     * @param compute Allows manipulation of the resulting {@link Violations} instance.
     * @param <T> The type of {@code value}.
     *
     * @throws ValidationException If the {@link Violations} instance contains errors
     *                             after applying {@code compute} to it.
     */
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
