package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelController;
import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.RequireAgent;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Trailer;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.services.TrailerService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * {@code TrailerController} is a {@link ModelController} for {@link Trailer trailers}.
 */
@RestController
@RequestMapping(path = "api/v1/trailers")
public class TrailerController
    extends ModelController.Basic<Trailer, TrailerService> {

    /**
     * Constructor to create a new trailer controller.
     */
    public TrailerController() {
    }

    /**
     * Loads all trailers over the defined get path whose visibility is true.
     *
     * @return Visible trailers.
     */
    @GetMapping("visible")
    @ResponseStatus(HttpStatus.OK)
    @RequireAgent
    public List<Trailer> listVisible() {
        return service.listVisible();
    }

    /**
     * Creates a new trailer by calling {@link ModelController.Basic#create} with modified access.
     * If the trailer already exists with a given name, update the visibility to true.
     *
     * @param path   The trailers' path.
     * @param entity The trailer.
     * @return Created or updated trailer.
     * @throws ApiException If the id does not exist.
    /**
     * Creates a new trailer.
     * <p>
     *     If there's already a trailer with the same name, no new trailer is created,
     *     and the existing one returned instead.
     *     In any case, the returned trailer will be made {@link Trailer#isVisible() visible}.
     * </p>
     *
     * @param path The trailers' path.
     * @param entity The new trailer.
     * @return A visible trailer matching {@code entity}.
     */
    @Override
    @RequireAgent
    public Trailer create(@ModelAttribute EmptyPath path, @RequestBody Trailer entity) {
        var trailer = service.findByName(entity.getName().toLowerCase()).orElse(null);
        if (trailer != null) {
            trailer.setVisible(true);
            return super.update(path, trailer.getId(), trailer);
        }
        return super.create(path, entity);
    }

    /**
     * Update an existing trailer of a given id by calling {@link ModelController.Basic#update}
     * with modified access.
     *
     * @param emptyPath The trailers' path.
     * @param id        The id of the trailer to be updated.
     * @param entity    The trailers new data.
     * @return Updated trailer.
     * @throws ApiException If the id does not exist or is not equal to the id of new data.
    /**
     * Updates an existing trailer.
     *
     * @param emptyPath The trailer's path.
     * @param id The trailer's id.
     * @param entity The updated trailer.
     * @return The updated trailer.
     */
    @Override
    @RequireAgent
    public Trailer update(
        @ModelAttribute EmptyPath emptyPath,
        @PathVariable Long id,
        @RequestBody Trailer entity
    ) {
        return super.update(emptyPath, id, entity);
    }

    /**
     * Find a trailer by a given id by calling {@link ModelController.Basic#find}
     * with modified access.
     *
     * @param emptyPath The trailers' path.
     * @param id        The id of the trailer.
     * @return Trailer with the given id.
     * @throws ApiException If the id does not exist.
     */
    @Override
    @RequireAgent
    public Trailer find(@ModelAttribute EmptyPath emptyPath, @PathVariable Long id) {
        return super.find(emptyPath, id);
    }

    /**
     * List all trailers by calling {@link ModelController.Basic#list} with modified access.
     *
     * @param emptyPath The trailers' path.
     * @return All trailers.
     */
    @Override
    @RequireAgent
    public List<Trailer> list(@ModelAttribute EmptyPath emptyPath) {
        return super.list(emptyPath);
    }
}
