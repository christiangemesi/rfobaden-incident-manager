package ch.rfobaden.incidentmanager.backend.utils.validation;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.validation.ConstraintViolation;

/**
 * {@code Violations} represents the errors resulting from a failed validation.
 * Its main purpose is to act as simple way of dealing with
 * multiple instances of {@link ConstraintViolation}.
 * <p>
 *     Each {@code Violations} instance holds the validation errors of a single value,
 *     including the errors produced by validating other objects nested inside that value.
 * </p>
 */
public final class Violations implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * A mapping from field name to a list of errors of that specific field.
     * Fields with no errors are not included.
     */
    private final Map<String, List<String>> fields;

    /**
     * A mapping from field name to the violations resulting from validating the field's value.
     * Only fields with nested validations are included.
     * Fields with no errors are not included.
     */
    private final Map<String, Violations> nested;

    /**
     * Creates a new, empty {@code Violations} instance.
     */
    public Violations() {
        this.fields = new HashMap<>();
        this.nested = new HashMap<>();
    }

    /**
     * Checks if the instance is empty.
     * An instance is empty if it does neither contain
     * {@link #fields field errors} nor {@link #nested nested errors}.
     *
     * @return Whether the instance is empty.
     */
    public boolean isEmpty() {
        return fields.isEmpty() && nested.isEmpty();
    }

    /**
     * Adds an error to a field.
     *
     * @param field The field to which the error belongs.
     * @param error The error message.
     *
     * @throws IllegalArgumentException If the field name is invalid,
     *                                  or if it was already used for a nested field.
     */
    public void add(String field, String error) {
        if (field.isEmpty()) {
            throw new IllegalArgumentException(
                "field name must not be empty"
            );
        }
        if (field.contains(".")) {
            throw new IllegalArgumentException(
                "can't add with nested field key '" + field + "'"
            );
        }
        if (nested.containsKey(field)) {
            throw new IllegalArgumentException(
                "can't add to nested field '" + field + "'"
            );
        }
        var errors = fields.computeIfAbsent(field, (k) -> new ArrayList<>(1));
        errors.add(error);
    }

    /**
     * Loads the {@code Violations} instance for a deeply nested field.
     * Missing instances are automatically created.
     *
     * @param fields The nested field names.
     * @return The nested {@code Violations} instance.
     */
    public Violations nested(String... fields) {
        var violations = this;
        for (var field : fields) {
            violations = violations.nested(field);
        }
        return violations;
    }

    /**
     * Loads the {@code Violations} instance for a nested field.
     * The instance is automatically created if it does not exist yet.
     *
     * @param field The nested field's name.
     * @return The nested {@code Violations} instance.
     *
     * @throws IllegalArgumentException If the field name is invalid,
     *                                  or if it was already used for a non-nested field.
     */
    public Violations nested(String field) {
        if (field.isEmpty()) {
            throw new IllegalArgumentException(
                "field name must not be empty"
            );
        }
        if (field.contains(".")) {
            throw new IllegalArgumentException(
                "can't nest into nested field key '" + field + "'"
            );
        }
        if (fields.containsKey(field)) {
            throw new IllegalArgumentException(
                "can't nest into non-nested field '" + field + "'"
            );
        }
        return nested.computeIfAbsent(field, (k) -> new Violations());
    }

    /**
     * Transforms the instance into an untyped mapping,
     * containing both {@link #fields field errors} and {@link #nested nested errors}.
     * <p>
     *     Nested {@code Violations} instances will be added the the mapping by
     *     calling {@code getAll()} on them.
     * </p>
     *
     * @return An untyped mapping of the {@code Violations} instance.
     */
    public Map<String, Object> getAll() {
        // Use a LinkedHashMap, so the items will be stored in insertion order.
        // Makes the JSON output somewhat nicer to look at.
        var errors = new LinkedHashMap<String, Object>(fields);
        nested.forEach((field, violations) -> {
            errors.put(field, violations.getAll());
        });
        return errors;
    }

    public Map<String, Violations> getNested() {
        return nested;
    }
}
