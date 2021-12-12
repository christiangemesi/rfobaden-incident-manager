package ch.rfobaden.incidentmanager.backend.utils.validation;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public final class Violations implements Serializable {
    private static final long serialVersionUID = 1L;

    private final Map<String, List<String>> fields;

    private final Map<String, Violations> nested;

    public Violations() {
        this.fields = new HashMap<>();
        this.nested = new HashMap<>();
    }

    public boolean isEmpty() {
        return fields.isEmpty() && nested.isEmpty();
    }

    public void add(String field, String error) {
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

    public Violations nested(String... fields) {
        var violations = this;
        for (var field : fields) {
            violations = nested(field);
        }
        return violations;
    }

    public Violations nested(String field) {
        if (fields.containsKey(field)) {
            throw new IllegalArgumentException(
                "can't nest into non-nested field '" + field + "'"
            );
        }
        if (field.length() == 0) {
            throw new IllegalArgumentException("nested field name must not be empty");
        }
        return nested.computeIfAbsent(field, (k) -> new Violations());
    }

    public Map<String, Object> getAll() {
        // Use a LinkedHashMap, so the items will be stored in insertion order.
        // Makes the JSON output somewhat nicer to look at.
        var errors = new LinkedHashMap<String, Object>(fields);
        nested.forEach((field, violations) -> {
            errors.put(field, violations.getAll());
        });
        return errors;
    }
}
