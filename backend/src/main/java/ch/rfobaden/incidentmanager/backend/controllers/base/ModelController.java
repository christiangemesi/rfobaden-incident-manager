package ch.rfobaden.incidentmanager.backend.controllers.base;

import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.RequireAdmin;
import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.RequireAgent;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Model;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import ch.rfobaden.incidentmanager.backend.services.base.ModelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;
import java.util.Objects;

/**
 * {@code ModelController} implements commonly used REST-API endpoints
 * for a {@link Model}, using a {@link ModelService}.
 *
 * @param <TModel> The {@link Model} whose instances are being exposed over the endpoints.
 * @param <TPath> The type of the path under which the model instances can be found.
 * @param <TService> The {@link ModelService} giving access to {@link TModel} instances.
 */
@RequireAdmin
public abstract class ModelController<
    TModel extends Model & PathConvertible<TPath>,
    TPath,
    TService extends ModelService<TModel, TPath>
    > implements AppController {
    private static final String RECORD_NOT_FOUND_MESSAGE = "record not found";
    /**
     * The service giving access to {@link TModel}.
     */
    @Autowired
    protected TService service;

    /**
     * Loads the relations of an entity.
     * <p>
     *     This method is called whenever an entity is received by an API endpoint -
     *     for example via {@code POST} (create) or {@code PUT} (update) request.
     *     Such endpoints may not receive the full data of the entity.
     *     Instead, relations may only be specified via id,
     *     which means that the entities to which the id points has to be loaded manually.
     * </p>
     *
     * @param path The entities' path.
     * @param entity The entity.
     */
    protected abstract void loadRelations(TPath path, TModel entity);

    /**
     * Lists all entities at a specific path.
     *
     * @param path The path whose entities are listed.
     * @return The entities.
     */
    @GetMapping
    @RequireAgent
    public List<TModel> list(@ModelAttribute TPath path) {
        return service.list(path);
    }

    /**
     * Loads an entity with a specific id at a given path.
     *
     * @param path The entity's path.
     * @param id The entity's id.
     * @return The entity.
     *
     * @throws ApiException {@link HttpStatus#NOT_FOUND} if no matching entity was found.
     */
    @GetMapping(value = "{id}")
    @RequireAgent
    public TModel find(@ModelAttribute TPath path, @PathVariable Long id) {
        return service.find(path, id).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, RECORD_NOT_FOUND_MESSAGE)
        ));
    }

    /**
     * Creates a new entity at a specific path.
     *
     * @param path The path at which the entity is created.
     * @param entity The entity to create.
     * @return The created entity.
     *
     * @throws ApiException {@link HttpStatus#UNPROCESSABLE_ENTITY} if the entity already has an id.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TModel create(@ModelAttribute TPath path, @RequestBody TModel entity) {
        if (entity.getId() != null) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "id must not be set");
        }
        loadRelations(path, entity);
        return service.create(path, entity);
    }

    /**
     * Updates an entity with a specific id at a given path.
     *
     * @param path The entity's path.
     * @param id The entity's id.
     * @param entity The updated entity.
     * @return The updated entity.
     *
     * @throws ApiException {@link HttpStatus#UNPROCESSABLE_ENTITY} if the entity's id
     *                      and the id from the request path do not match.
     *                      {@link HttpStatus#NOT_FOUND} if no matching entity was found.
     */
    @PutMapping("{id}")
    @ResponseStatus(HttpStatus.OK)
    public TModel update(
        @ModelAttribute TPath path,
        @PathVariable Long id,
        @RequestBody TModel entity
    ) {
        if (!Objects.equals(entity.getId(), id)) {
            throw new ApiException(
                HttpStatus.UNPROCESSABLE_ENTITY, "id must be identical to url parameter"
            );
        }
        loadRelations(path, entity);
        return service.update(path, entity).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, RECORD_NOT_FOUND_MESSAGE)
        ));
    }

    /**
     * Deletes an entity with a specific id at a given path.
     *
     * @param path The entity's path.
     * @param id The entity's id.
     *
     * @throws ApiException {@link HttpStatus#NOT_FOUND} if no matching entity was found.
     */
    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@ModelAttribute TPath path, @PathVariable Long id) {
        if (!service.delete(path, id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, RECORD_NOT_FOUND_MESSAGE);
        }
    }

    /**
     * {@code ModelController.Basic} represents a {@link ModelController}
     * whose {@link TModel} is always found at an {@link EmptyPath}.
     *
     * @param <TModel> The {@link Model} whose instances are being exposed over the endpoints.
     * @param <TService> The {@link ModelService} giving access to {@link TModel} instances.
     */
    public abstract static class Basic<
        TModel extends Model & PathConvertible<EmptyPath>,
        TService extends ModelService<TModel, EmptyPath>
        > extends ModelController<TModel, EmptyPath, TService> {
        @Override
        protected void loadRelations(EmptyPath emptyPath, TModel entity) {
            // Since the entity does not have any relations in its path,
            // we assume that it has no relations at all.
            //
            // This might be wrong for many models, which, however, should not be a problem,
            // as controllers for such models may easily override this method again.
            //
            // For all other cases, leaving this method empty eases implementation and
            // leaves us with cleaner controller classes.
        }
    }
}
