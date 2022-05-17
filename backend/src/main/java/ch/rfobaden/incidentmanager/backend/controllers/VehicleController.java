package ch.rfobaden.incidentmanager.backend.controllers;


import ch.rfobaden.incidentmanager.backend.controllers.base.ModelController;
import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.RequireAgent;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Vehicle;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.services.VehicleService;
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
 * {@code VehicleController} extends {@link ModelController.Basic}.
 * It provides an additional method as well as changed access on existing methods.
 */
@RestController
@RequestMapping(path = "api/v1/vehicles")
public class VehicleController
    extends ModelController.Basic<Vehicle, VehicleService> {

    /**
     * Constructor to create a new vehicle controller.
     */
    public VehicleController() {
    }

    /**
     * Loads all visible vehicles over the defined get path.
     *
     * @return All vehicles whose visibility is true.
     */
    @GetMapping("visible")
    @ResponseStatus(HttpStatus.OK)
    @RequireAgent
    public List<Vehicle> listVisible() {
        return service.listVisible();
    }

    /**
     * Creates a new vehicle by calling {@link ModelController.Basic#create} with modified access.
     * If the vehicle already exists with a given name, update the visibility to true.
     *
     * @param path   The vehicles' path.
     * @param entity The vehicle.
     * @return Created or updated vehicle.
     * @throws ApiException If the id does not exist.
     */
    @Override
    @RequireAgent
    public Vehicle create(@ModelAttribute EmptyPath path, @RequestBody Vehicle entity) {
        var vehicle = service.findByName(entity.getName().toLowerCase()).orElse(null);
        if (vehicle != null) {
            vehicle.setVisible(true);
            return super.update(path, vehicle.getId(), vehicle);
        }
        return super.create(path, entity);
    }

    /**
     * Update an existing vehicle of a given id by calling {@link ModelController.Basic#update}
     * with modified access.
     *
     * @param emptyPath The vehicles' path.
     * @param id        The id of the vehicle to be updated.
     * @param entity    The vehicles new data.
     * @return Updated vehicle.
     * @throws ApiException If the id does not exist or is not equal to id of new data.
     */
    @Override
    @RequireAgent
    public Vehicle update(
        @ModelAttribute EmptyPath emptyPath,
        @PathVariable Long id,
        @RequestBody Vehicle entity
    ) {
        return super.update(emptyPath, id, entity);
    }


    /**
     * Find a vehicle by a given id by calling {@link ModelController.Basic#find}
     * with modified access.
     *
     * @param emptyPath The vehicles' path.
     * @param id        The id of the vehicle.
     * @return Vehicle with the given id.
     * @throws ApiException If the id does not exist.
     */
    @Override
    @RequireAgent
    public Vehicle find(@ModelAttribute EmptyPath emptyPath, @PathVariable Long id) {
        return super.find(emptyPath, id);
    }


    /**
     * List all vehicles by calling {@link ModelController.Basic#list} with modified access.
     *
     * @param emptyPath The vehicles' path.
     * @return All vehicles.
     */
    @Override
    @RequireAgent
    public List<Vehicle> list(@ModelAttribute EmptyPath emptyPath) {
        return super.list(emptyPath);
    }
}
