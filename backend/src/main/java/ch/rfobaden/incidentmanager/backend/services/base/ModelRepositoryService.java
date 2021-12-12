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
    public Optional<TModel> create(TPath path, TModel entity) {
        if (entity.getId() != null) {
            throw new IllegalArgumentException("id will be overwritten and must be null");
        }
        if (entity.getCreatedAt() != null) {
            throw new IllegalArgumentException("createdAt must not be set");
        }
        if (entity.getUpdatedAt() != null) {
            throw new IllegalArgumentException("updatedAt must not be set");
        }
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(entity.getCreatedAt());
        validate(entity);
        if (!path.equals(entity.toPath())) {
            throw new IllegalStateException("record does not match path: " + path);
        }
        return Optional.of(repository.save(entity));
    }

    @Override
    public Optional<TModel> update(TPath path, TModel entity) {
        if (entity.getUpdatedAt() == null) {
            throw new IllegalArgumentException("updatedAt must be set");
        }

        var existingRecord = find(path, entity.getId()).orElse(null);
        if (existingRecord == null) {
            return Optional.empty();
        }
        if (!isSameDateTime(existingRecord.getUpdatedAt(), entity.getUpdatedAt())) {
            throw new UpdateConflictException(
                "record " + entity.getId() + " has already been modified"
            );
        }
        entity.setUpdatedAt(LocalDateTime.now());
        entity.setCreatedAt(existingRecord.getCreatedAt());
        validate(entity);
        if (!path.equals(entity.toPath())) {
            throw new IllegalStateException("record does not match path: " + path);
        }
        return Optional.of(repository.save(entity));
    }

    @Override
    public boolean delete(TPath path, Long id) {
        if (repository.existsByPath(path, id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    protected void loadRelations(TModel entity, Violations violations) {}

    protected final void validate(TModel entity) {
        validationUtils.validate(entity, (r, violations) -> {
            loadRelations(entity, violations);
            validate(entity, violations);
        });
    }

    protected void validate(TModel entity, Violations violations) {}

    protected static boolean isPersisted(Model entity) {
        return entity.getId() == null;
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
