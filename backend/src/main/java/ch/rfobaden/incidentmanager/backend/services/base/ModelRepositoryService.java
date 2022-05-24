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
import org.springframework.lang.Nullable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * {code ModelRepositoryService} implements {@link ModelService}
 * using an instance of {@link ModelRepository}.
 *
 * @param <TModel> The {@link Model} whose instances are being accessed.
 * @param <TPath> The type of the path under which the model instances can be found.
 * @param <TRepository> The {@link ModelRepository} giving access to {@link TModel} instances.
 */
public abstract class ModelRepositoryService<
    TModel extends Model & PathConvertible<TPath>,
    TPath,
    TRepository extends ModelRepository<TModel, TPath> & JpaRepository<TModel, Long>
    > implements ModelService<TModel, TPath> {

    /**
     * The repository giving access to {@link TModel}.
     */
    @Autowired
    protected TRepository repository;

    /**
     * Utils to validate entities with before saving them.
     */
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
    public TModel create(TPath path, TModel entity) {
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
        var result = repository.save(entity);
        afterCreate(result);
        this.afterSave(null, result);
        return result;
    }

    @Override
    public Optional<TModel> update(TPath path, TModel entity) {
        if (entity.getUpdatedAt() == null) {
            throw new IllegalArgumentException("updatedAt must be set");
        }

        var existingEntity = find(path, entity.getId()).orElse(null);
        if (existingEntity == null) {
            return Optional.empty();
        }
        if (!isSameDateTime(existingEntity.getUpdatedAt(), entity.getUpdatedAt())) {
            throw new UpdateConflictException(
                "record " + entity.getId() + " has already been modified"
            );
        }
        entity.setUpdatedAt(LocalDateTime.now());
        entity.setCreatedAt(existingEntity.getCreatedAt());
        validate(entity);
        var result = repository.save(entity);
        this.afterUpdate(existingEntity, result);
        this.afterSave(existingEntity, result);
        return Optional.of(result);
    }

    @Override
    public boolean delete(TPath path, Long id) {
        if (repository.existsByPath(path, id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    protected final void validate(TModel entity) {
        validationUtils.validate(entity, this::validate);
    }

    /**
     * Allows for custom, in-place validations on an entity.
     * <p>
     *     This method is called right before saving.
     *     It can be freely overwritten by subclasses.
     * </p>
     *
     * @param entity The entity to validate.
     * @param violations The violations to which validation errors can be written.
     */
    protected void validate(TModel entity, Violations violations) {}

    /**
     * Called when a new entity has been created.
     * <p>
     *     This method can be freely overwritten by subclasses.
     * </p>
     *
     * @param entity The newly created entity.
     */
    protected void afterCreate(TModel entity) {}

    /**
     * Called when an existing entity has been updated.
     * <p>
     *     This method can be freely overwritten by subclasses.
     * </p>
     *
     * @param oldEntity The entity as it was before it had been updated.
     * @param newEntity The newly updated entity.
     */
    protected void afterUpdate(TModel oldEntity, TModel newEntity) {}

    /**
     * Called before creating or updating an entity.
     * <p>
     *     This method can be freely overwritten by subclasses.
     * </p>
     *
     * @param oldEntity The entity as it was before it had been updated.
     *                  Is {@code null} if the entity has just been created.
     * @param entity The newly saved entity.
     */
    protected void afterSave(@Nullable TModel oldEntity, TModel entity) {}

    /**
     * Checks if an entity has been created yet.
     *
     * @param entity The entity to check.
     * @return Whether the entity is persisted.
     */
    protected static boolean isPersisted(Model entity) {
        return entity.getId() == null;
    }

    /**
     * Checks if two {@link LocalDateTime} represent the same point in time.
     *
     * @param a The first instance.
     * @param b The second instance.
     * @return Whether both parameters are the same.
     */
    private boolean isSameDateTime(LocalDateTime a, LocalDateTime b) {
        return Objects.equals(
            a.minusNanos(a.getNano()),
            b.minusNanos(b.getNano())
        );
    }

    /**
     * {@code ModelRepositoryService.Basic} represents a {@link ModelRepositoryService}
     * whose {@link TModel} is always found at an {@link EmptyPath}.
     *
     * @param <TModel> The {@link Model} whose instances are being accessed.
     * @param <TRepository> The {@link ModelRepository} giving access to {@link TModel} instances.
     */
    public abstract static class Basic<
        TModel extends Model & PathConvertible<EmptyPath>,
        TRepository extends ModelRepository<TModel, EmptyPath> & JpaRepository<TModel, Long>
        > extends ModelRepositoryService<TModel, EmptyPath, TRepository> {
    }
}
