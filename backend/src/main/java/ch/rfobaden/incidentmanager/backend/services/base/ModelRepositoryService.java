package ch.rfobaden.incidentmanager.backend.services.base;

import ch.rfobaden.incidentmanager.backend.errors.UpdateConflictException;
import ch.rfobaden.incidentmanager.backend.errors.ValidationException;
import ch.rfobaden.incidentmanager.backend.models.Model;
import ch.rfobaden.incidentmanager.backend.utils.validation.ValidationUtils;
import ch.rfobaden.incidentmanager.backend.utils.validation.Violations;
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
    private ValidationUtils validationUtils;

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
        if (!Objects.equals(existingRecord.getUpdatedAt(), record.getUpdatedAt())) {
            throw new UpdateConflictException(
                "record " + record.getId() + " has already been modified"
            );
        }
        record.setUpdatedAt(LocalDateTime.now());
        record.setCreatedAt(existingRecord.getCreatedAt());
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
        validationUtils.validate(record, this::validate);
    }

    protected void validate(TModel record, Violations violations) {}

    protected static boolean isPersisted(Model record) {
        return record.getId() == null;
    }
}
