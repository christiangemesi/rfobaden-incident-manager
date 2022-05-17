package ch.rfobaden.incidentmanager.backend.repos.base;

import ch.rfobaden.incidentmanager.backend.models.Model;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

/**
 * {@code ModelRepository} defines methods with which a {@link Model} is accessed in the database.
 * The model class is required to implement {@link PathConvertible}.
 *
 * @param <TModel> The {@link Model} whose instances are being accessed.
 * @param <TPath> The type of the path under which the model instances can be found.
 */
public interface ModelRepository<TModel extends Model & PathConvertible<TPath>, TPath> {
    /**
     * Checks if an entity with a specific id exists at a given path.
     *
     * @param path The path at which the entity is supposed to exist.
     * @param id The id of the entity.
     * @return Whether there's a matching entity.
     */
    boolean existsByPath(TPath path, Long id);

    /**
     * Attempts to load an entity with a specific id at a given path.
     *
     * @param path The path at which the entity is supposed to exist.
     * @param id The id of the entity.
     * @return An {@link Optional} containing the entity,
     *         or {@link Optional#empty()}, if no matching entity exists.
     */
    Optional<TModel> findByPath(TPath path, Long id);

    /**
     * Loads all entities at a given path.
     *
     * @param path The path whose entities are loaded.
     * @return All entities whose {@link PathConvertible#toPath() path} matches the given path.
     */
    List<TModel> findAllByPath(TPath path);

    /**
     * {@code ModelRepository.Basic} contains default implementations for a {@link ModelRepository}
     * whose {@link TModel} is always found at an {@link EmptyPath}.
     * <p>
     *     Note that in order for the methods to work correctly,
     *     you will also need to extend {@link JpaRepository}.
     * </p>
     *
     * @param <TModel> The {@link Model} whose instances are being accessed.
     */
    interface Basic<TModel extends Model & PathConvertible<EmptyPath>>
        extends ModelRepository<TModel, EmptyPath> {
        @Override
        default boolean existsByPath(EmptyPath path, Long id) {
            @SuppressWarnings("unchecked")
            var repo = ((JpaRepository<TModel, Long>) this);
            return repo.existsById(id);
        }

        @Override
        @Query
        default Optional<TModel> findByPath(EmptyPath path, Long id) {
            @SuppressWarnings("unchecked")
            var repo = ((JpaRepository<TModel, Long>) this);
            return repo.findById(id);
        }

        @Override
        default List<TModel> findAllByPath(EmptyPath path) {
            @SuppressWarnings("unchecked")
            var repo = ((JpaRepository<TModel, Long>) this);
            return repo.findAll();
        }
    }
}
