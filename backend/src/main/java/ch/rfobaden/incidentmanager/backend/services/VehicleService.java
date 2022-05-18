package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Vehicle;
import ch.rfobaden.incidentmanager.backend.repos.VehicleRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * {@code VehicleService} extends {@link ModelRepositoryService.Basic}
 * offering more vehicle specific methods in addition to the extended CRUD.
 */
@Service
public class VehicleService
    extends ModelRepositoryService.Basic<Vehicle, VehicleRepository> {

    /**
     * Loads all visible vehicles.
     *
     * @return All vehicles whose visibility is true.
     */
    public List<Vehicle> listVisible() {
        return repository.findAllVisible();
    }

    /**
     * Attempts to load a vehicle with a specific name.
     *
     * @param name The name of the vehicle.
     * @return An {@link Optional} containing the vehicle,
     *     or {@link Optional#empty()}, if no matching vehicle exists.
     */
    public Optional<Vehicle> findByName(String name) {
        return repository.findByName(name);
    }
}
