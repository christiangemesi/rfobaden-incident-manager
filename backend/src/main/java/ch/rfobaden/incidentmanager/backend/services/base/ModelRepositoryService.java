package ch.rfobaden.incidentmanager.backend.services.base;

import ch.rfobaden.incidentmanager.backend.errors.UpdateConflictException;
import ch.rfobaden.incidentmanager.backend.models.Model;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepository;
import ch.rfobaden.incidentmanager.backend.utils.validation.ValidationUtils;
import ch.rfobaden.incidentmanager.backend.utils.validation.Violations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

public abstract class ModelRepositoryService<
    TModel extends Model & PathConvertible<TPath>,
    TPath,
    TRepository extends ModelRepository<TModel, TPath> & JpaRepository<TModel, Long>
    > implements ModelService<TModel, TPath> {

    @Autowired
    protected TRepository repository;

    @Autowired
    private ValidationUtils validationUtils;

    @Override
    public Optional<TModel> find(Long id) {
        return repository.findById(id);
    }

    @Override
    public Optional<TModel> find(TPath path, Long id) {
        return repository.findByPath(path, id);
    }

    @Override
    public List<TModel> list(TPath path) {
        return repository.findAllByPath(path);
    }

    @Override
    public Optional<TModel> create(TPath path, TModel record) {
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
        if (!path.equals(record.toPath())) {
            throw new IllegalStateException("record does not match path: " + path);
        }
        return Optional.of(repository.save(record));
    }

    @Override
    public Optional<TModel> update(TPath path, TModel record) {
        if (record.getUpdatedAt() == null) {
            throw new IllegalArgumentException("updatedAt must be set");
        }

        var existingRecord = find(path, record.getId()).orElse(null);
        if (existingRecord == null) {
            return Optional.empty();
        }
        if (!isSameDateTime(existingRecord.getUpdatedAt(), record.getUpdatedAt())) {
            throw new UpdateConflictException(
                "record " + record.getId() + " has already been modified"
            );
        }
        record.setUpdatedAt(LocalDateTime.now());
        record.setCreatedAt(existingRecord.getCreatedAt());
        validate(record);
        if (!path.equals(record.toPath())) {
            throw new IllegalStateException("record does not match path: " + path);
        }
        return Optional.of(repository.save(record));
    }

    @Override
    public boolean delete(TPath path, Long id) {
        if (repository.existsByPath(path, id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    protected void loadRelations(TModel record, Violations violations) {}

    protected final void validate(TModel record) {
        validationUtils.validate(record, (r, violations) -> {
            loadRelations(record, violations);
            validate(record, violations);
        });
    }

    protected void validate(TModel record, Violations violations) {}

    protected static boolean isPersisted(Model record) {
        return record.getId() == null;
    }

    private boolean isSameDateTime(LocalDateTime a, LocalDateTime b) {
        return Objects.equals(
            a.minusNanos(a.getNano()),
            b.minusNanos(b.getNano())
        );
    }

    public abstract static class Basic<
        TModel extends Model & PathConvertible<EmptyPath>,
        TRepository extends ModelRepository<TModel, EmptyPath> & JpaRepository<TModel, Long>
        > extends ModelRepositoryService<TModel, EmptyPath, TRepository> {
    }
}
