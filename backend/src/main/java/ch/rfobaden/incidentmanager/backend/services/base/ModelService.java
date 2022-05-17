package ch.rfobaden.incidentmanager.backend.services.base;

import ch.rfobaden.incidentmanager.backend.errors.UpdateConflictException;
import ch.rfobaden.incidentmanager.backend.errors.ValidationException;
import ch.rfobaden.incidentmanager.backend.models.Model;
import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;

import java.util.List;
import java.util.Optional;

/**
 * {@code ModelRepository} defines CRUD methods for a a {@link Model}.
 * The model class is required to implement {@link PathConvertible}.
 *
 * @param <TModel> The {@link Model} whose instances are being accessed.
 * @param <TPath> The type of the path under which the model instances can be found.
 */
public interface ModelService<TModel extends Model & PathConvertible<TPath>, TPath> {
    /**
     * Attempts to load an entity with a specific id.
     *
     * @param id The id of the entity.
     * @return An {@link Optional} containing the entity,
     *         or {@link Optional#empty()}, if no matching entity exists.
     */
    Optional<TModel> find(Long id);

    /**
     * Attempts to load an entity with a specific id at a given path.
     *
     * @param path The path at which the entity is supposed to exist.
     * @param id The id of the entity.
     * @return An {@link Optional} containing the entity,
     *         or {@link Optional#empty()}, if no matching entity exists.
     */
    Optional<TModel> find(TPath path, Long id);

    /**
     * Loads all entities at a given path.
     *
     * @param path The path whose entities are loaded.
     * @return All entities whose {@link PathConvertible#toPath() path} matches the given path.
     */
    List<TModel> list(TPath path);

    /**
     * Saves a new entity at a given path.
     * <p>
     *     The values for {@link Model#getId()}, {@link Model#getCreatedAt()}
     *     and {@link Model#getUpdatedAt()} will be set automatically.
     *     Note that these fields must all not be set yet.
     * </p>
     *
     * @param path The path at which the entity is saved.
     * @param entity The entity to save.
     * @return The newly saved entity.
     *
     * @throws IllegalArgumentException If any of listed {@link Model} fields were already set.
     * @throws IllegalStateException If the entities' {@link PathConvertible#toPath() path}
     *                               does not match the path parameter.
     */
    TModel create(TPath path, TModel entity);

    /**
     * Saves a new entity.
     * The values for {@link Model#getId()}, {@link Model#getCreatedAt()}
     * and {@link Model#getUpdatedAt()} will be set automatically.
     *
     * @param entity The entity to save.
     * @return The newly saved entity.
     *
     * @throws IllegalArgumentException If any of listed {@link Model} fields were already set.
     */
    default TModel create(TModel entity) {
        return create(entity.toPath(), entity);
    }

    /**
     * Saves changes to an already persisted entity.
     * {@link Model#getUpdatedAt()} will automatically be changed.
     *
     * @param path The path at which the entity is saved.
     * @param entity The entity to save.
     * @return An {@link Optional} containing the newly saved entity,
     *         or {@link Optional#empty()}, if no matching entity was found.
     *
     * @throws IllegalArgumentException If {@link Model#getUpdatedAt() updatedAt} is {@code null}.
     * @throws UpdateConflictException If the entity has been modified since having been loaded.
     * @throws ValidationException If any of the entities' validations fails.
     */
    Optional<TModel> update(TPath path, TModel entity);

    /**
     * Saves changes to an already persisted entity.
     * {@link Model#getUpdatedAt()} will automatically be changed.
     *
     * @param entity The entity to save.
     * @return An {@link Optional} containing the newly saved entity,
     *         or {@link Optional#empty()}, if no matching entity was found.
     *
     * @throws IllegalArgumentException If {@link Model#getUpdatedAt() updatedAt} is {@code null}.
     * @throws UpdateConflictException If the entity has been modified since having been loaded.
     * @throws ValidationException If any of the entities' validations fails.
     */
    default Optional<TModel> update(TModel entity) {
        return update(entity.toPath(), entity);
    }

    /**
     * Deletes an entity.
     *
     * @param path The path at which the entity is saved.
     * @param id The id of the entity.
     * @return Whether there was an entity to be deleted.
     */
    boolean delete(TPath path, Long id);

    /**
     * Deletes an entity.
     *
     * @param entity The entity to delete.
     * @return Whether there was an entity to be deleted.
     */
    default boolean delete(TModel entity) {
        return delete(entity.toPath(), entity.getId());
    }
}
