package ch.rfobaden.incidentmanager.backend.services.base;

import ch.rfobaden.incidentmanager.backend.errors.UpdateConflictException;
import ch.rfobaden.incidentmanager.backend.errors.ValidationException;
import ch.rfobaden.incidentmanager.backend.models.Model;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Validator;

public abstract class ModelRepositoryService<
    TModel extends Model,
    TRepository extends JpaRepository<TModel, Long>
    > implements ModelService<TModel> {

    protected final TRepository repository;

    @Autowired
    private Validator validator;

    public ModelRepositoryService(TRepository repository) {
        this.repository = repository;
    }

    @Override
    public Optional<TModel> find(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<TModel> list() {
        return repository.findAll();
    }

    @Override
    public TModel create(TModel record) {
        if (record.getId() != null) {
            throw new IllegalArgumentException("id will be overwritten and must be null");
        }
        if (record.getCreatedAt() != null) {
            throw new IllegalArgumentException("createdAt must not be set");
        }
        if (record.getUpdatedAt() != null) {
            throw new IllegalArgumentException("updatedAt must not be set");
        }
        record.setCreatedAt(LocalDateTime.now());
        record.setUpdatedAt(record.getCreatedAt());
        validate(record);
        return repository.save(record);
    }

    @Override
    public Optional<TModel> update(TModel record) {
        if (record.getUpdatedAt() == null) {
            throw new IllegalArgumentException("updatedAt must be set");
        }

        var existingRecord = find(record.getId()).orElse(null);
        if (existingRecord == null) {
            return Optional.empty();
        }
        if (!Objects.equals(existingRecord.getCreatedAt(), record.getCreatedAt())) {
            throw new IllegalArgumentException("createdAt differs from persisted value");
        }
        if (!Objects.equals(existingRecord.getUpdatedAt(), record.getUpdatedAt())) {
            throw new UpdateConflictException(
                "record " + record.getId() + " has already been modified"
            );
        }
        record.setUpdatedAt(LocalDateTime.now());
        validate(record);
        return Optional.of(repository.save(record));
    }

    @Override
    public boolean delete(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    protected final void validate(TModel record) {
        var violations = new Violations();
        validator.validate(record).forEach((violation) -> {
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
        validate(record, violations);
        if (!violations.fields.isEmpty()) {
            throw new ValidationException(violations);
        }
    }

    protected void validate(TModel record, Violations violations) {}

    protected static boolean isPersisted(Model record) {
        return record.getId() == null;
    }

    public static final class Violations {
        private final Map<String, List<String>> fields;

        private final Map<String, Violations> nested;

        public Violations() {
            this.fields = new HashMap<>();
            this.nested = new HashMap<>();
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
}
